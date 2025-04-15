import { IsOptional, IsBoolean, IsISO8601 } from 'class-validator';

export class UpdateEventInstanceDto {
  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @IsOptional()
  @IsISO8601()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
