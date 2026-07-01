import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  StorageService,
  BucketName,
  EntityType,
  isValidEntityType,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
} from './storage.service';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private storage: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket: BucketName,
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Req() req: any,
  ) {
    this.storage.validateBucket(bucket);
    if (!isValidEntityType(entityType)) {
      return { error: `Invalid entityType. Must be one of: ${['users', 'students', 'instructors', 'vehicles'].join(', ')}` };
    }
    if (!entityId) {
      return { error: 'entityId is required' };
    }

    const allowed = this.getAllowedTypes(bucket);
    const maxSize = this.getMaxSize(bucket);

    const result = await this.storage.upload(
      file,
      bucket,
      this.storage.buildStoragePath(entityType, entityId),
      allowed,
      maxSize,
      req.user?.id,
    );

    return result;
  }

  @Post('replace')
  @UseInterceptors(FileInterceptor('file'))
  async replace(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket: BucketName,
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Req() req: any,
    @Body('oldStoragePath') oldStoragePath?: string,
  ) {
    this.storage.validateBucket(bucket);
    if (!isValidEntityType(entityType)) {
      return { error: `Invalid entityType. Must be one of: ${['users', 'students', 'instructors', 'vehicles'].join(', ')}` };
    }
    if (!entityId) {
      return { error: 'entityId is required' };
    }

    const allowed = this.getAllowedTypes(bucket);
    const maxSize = this.getMaxSize(bucket);

    const result = await this.storage.replace(
      file,
      oldStoragePath,
      bucket,
      this.storage.buildStoragePath(entityType, entityId),
      allowed,
      maxSize,
      req.user?.id,
    );

    return result;
  }

  @Delete('delete')
  async delete(
    @Body('bucket') bucket: BucketName,
    @Body('path') path: string,
    @Req() req: any,
  ) {
    this.storage.validateBucket(bucket);
    await this.storage.delete(path, bucket, req.user?.id);
    return { success: true };
  }

  @Get('signed-url')
  async signedUrl(
    @Query('bucket') bucket: BucketName,
    @Query('path') path: string,
  ) {
    this.storage.validateBucket(bucket);
    return this.storage.getSignedUrl(path, bucket);
  }

  private getAllowedTypes(bucket: string): readonly string[] {
    if (bucket === 'certificates' || bucket === 'documents') {
      return ALLOWED_DOCUMENT_TYPES;
    }
    return ALLOWED_IMAGE_TYPES;
  }

  private getMaxSize(bucket: string): number {
    if (bucket === 'certificates' || bucket === 'documents') {
      return MAX_DOCUMENT_SIZE;
    }
    return MAX_IMAGE_SIZE;
  }
}
