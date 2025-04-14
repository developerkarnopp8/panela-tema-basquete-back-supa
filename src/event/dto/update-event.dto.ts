import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  startDateTime?: string;

  @ApiProperty()
  endDateTime?: string;

  @ApiProperty()
  isOpen?: boolean;

  @ApiProperty()
  images?: string[];

  @ApiProperty()
  type?: 'GAME' | 'CHAMPIONSHIP';
}
  