import { ApiProperty } from '@nestjs/swagger';
export class UpdateCheckinDto {
  @ApiProperty()
  checkedIn: boolean;
}
  