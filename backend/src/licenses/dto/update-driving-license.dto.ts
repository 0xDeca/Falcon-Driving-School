import { PartialType } from '@nestjs/mapped-types';
import { CreateDrivingLicenseDto } from './create-driving-license.dto';

export class UpdateDrivingLicenseDto extends PartialType(CreateDrivingLicenseDto) {}
