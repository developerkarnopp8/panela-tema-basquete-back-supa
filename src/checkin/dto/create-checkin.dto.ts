import { ApiProperty } from '@nestjs/swagger';
export class CreateCheckinDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventId: string;
}
  