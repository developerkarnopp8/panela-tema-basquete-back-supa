import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaderWithEventDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  eventName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: 'GAME' | 'CHAMPIONSHIP';

  @ApiProperty()
  startDateTime: string;

  @ApiProperty()
  endDateTime: string;

  @ApiProperty()
  images?: string[];

  @ApiProperty()
  isOpen?: boolean;
}
