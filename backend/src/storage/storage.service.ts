import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

// ─── Types ──────────────────────────────────────────────────────

export interface UploadResult {
  fileUrl: string | null;
  storagePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}

export interface SignedUrlResult {
  signedUrl: string;
  expiresIn: number;
}

export interface StorageLogEntry {
  action: 'upload' | 'delete' | 'replace';
  userId?: string;
  bucket: string;
  storagePath: string;
  fileSize?: number;
  timestamp: string;
}

// ─── Buckets ────────────────────────────────────────────────────

export const PUBLIC_BUCKETS = new Set(['profile-images', 'instructor-images', 'vehicle-images'] as const);

export const PRIVATE_BUCKETS = new Set(['licences', 'certificates', 'documents'] as const);

export const ALL_BUCKETS = new Set([...PUBLIC_BUCKETS, ...PRIVATE_BUCKETS] as const);

export type BucketName =
  | 'profile-images'
  | 'instructor-images'
  | 'vehicle-images'
  | 'licences'
  | 'certificates'
  | 'documents';

export function isPublicBucket(bucket: string): boolean {
  return PUBLIC_BUCKETS.has(bucket as any);
}

// ─── Entity types (replaces arbitrary folder names) ─────────────

export const KNOWN_ENTITY_TYPES = ['users', 'students', 'instructors', 'vehicles'] as const;

export type EntityType = (typeof KNOWN_ENTITY_TYPES)[number];

export function isValidEntityType(value: string): value is EntityType {
  return KNOWN_ENTITY_TYPES.includes(value as any);
}

// ─── Validation constants ───────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const;
export const ALLOWED_ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const SIGNED_URL_EXPIRY = 900; // 15 minutes

// ─── Service ────────────────────────────────────────────────────

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(StorageService.name);

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    }

    this.supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  // ─── Validation ───────────────────────────────────────────────

  validateFile(
    file: { mimetype: string; size: number },
    allowedTypes: readonly string[] = ALLOWED_ALL_TYPES,
    maxSize: number = MAX_IMAGE_SIZE,
  ): void {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${allowedTypes.join(', ')}`,
      );
    }
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
      );
    }
  }

  validateBucket(bucket: string): asserts bucket is BucketName {
    if (!ALL_BUCKETS.has(bucket as any)) {
      throw new BadRequestException(`Unknown bucket: ${bucket}`);
    }
  }

  validateStoragePath(path: string): void {
    if (!path || path.includes('..') || path.startsWith('/') || path.length > 512) {
      throw new BadRequestException('Invalid storage path');
    }
  }

  // ─── Path helpers ─────────────────────────────────────────────

  buildStoragePath(entityType: EntityType, entityId: string): string {
    return `${entityType}/${entityId}`;
  }

  private generateFileName(originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
    const sanitized = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50)
      .toLowerCase();
    return `${uuid()}-${sanitized}.${ext}`;
  }

  // ─── Logging ──────────────────────────────────────────────────

  private log(entry: StorageLogEntry): void {
    const message = `${entry.action} | bucket=${entry.bucket} path=${entry.storagePath} size=${entry.fileSize ?? '-'} userId=${entry.userId ?? '-'}`;
    if (entry.action === 'delete') {
      this.logger.log(message);
    } else {
      this.logger.log(message);
    }
  }

  // ─── Upload ───────────────────────────────────────────────────

  async upload(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    bucket: BucketName,
    storagePath: string,
    allowedTypes?: readonly string[],
    maxSize?: number,
    userId?: string,
  ): Promise<UploadResult> {
    this.validateFile(file, allowedTypes, maxSize);
    this.validateStoragePath(storagePath);

    const fileName = this.generateFileName(file.originalname);
    const fullPath = storagePath ? `${storagePath}/${fileName}` : fileName;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(fullPath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload failed: bucket=${bucket} path=${fullPath} error=${error.message}`);
      throw new InternalServerErrorException('Failed to upload file');
    }

    const fileUrl = isPublicBucket(bucket)
      ? this.getPublicUrl(fullPath, bucket)
      : null;

    this.log({
      action: 'upload',
      userId,
      bucket,
      storagePath: fullPath,
      fileSize: file.size,
      timestamp: new Date().toISOString(),
    });

    return {
      fileUrl,
      storagePath: fullPath,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  // ─── Delete ───────────────────────────────────────────────────

  async delete(storagePath: string, bucket: BucketName, userId?: string): Promise<void> {
    this.validateStoragePath(storagePath);

    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([storagePath]);

    if (error) {
      this.logger.error(`Delete failed: bucket=${bucket} path=${storagePath} error=${error.message}`);
      throw new InternalServerErrorException('Failed to delete file');
    }

    this.log({
      action: 'delete',
      userId,
      bucket,
      storagePath,
      timestamp: new Date().toISOString(),
    });
  }

  // ─── Replace ──────────────────────────────────────────────────

  async replace(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    oldStoragePath: string | null | undefined,
    bucket: BucketName,
    storagePath: string,
    allowedTypes?: readonly string[],
    maxSize?: number,
    userId?: string,
  ): Promise<UploadResult> {
    const result = await this.upload(file, bucket, storagePath, allowedTypes, maxSize, userId);

    if (oldStoragePath) {
      await this.delete(oldStoragePath, bucket, userId).catch((err) =>
        this.logger.warn(`Replace: failed to delete old file path=${oldStoragePath} error=${err.message}`),
      );
    }

    return result;
  }

  // ─── Signed URL (private buckets) ─────────────────────────────

  async getSignedUrl(storagePath: string, bucket: BucketName): Promise<SignedUrlResult> {
    this.validateStoragePath(storagePath);

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);

    if (error || !data) {
      this.logger.error(`Signed URL failed: bucket=${bucket} path=${storagePath} error=${error?.message ?? 'unknown'}`);
      throw new NotFoundException('File not found or inaccessible');
    }

    return {
      signedUrl: data.signedUrl,
      expiresIn: SIGNED_URL_EXPIRY,
    };
  }

  // ─── Public URL (public buckets only) ─────────────────────────

  getPublicUrl(storagePath: string, bucket: BucketName): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
    return data.publicUrl;
  }
}
