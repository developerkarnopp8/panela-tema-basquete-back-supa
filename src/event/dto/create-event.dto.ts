import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
  @ApiProperty()
  eventName: string;
  
  @ApiProperty()
  description: string;

  @ApiProperty()
  type: 'GAME' | 'CHAMPIONSHIP';

  @ApiProperty()
  startDateTime: string; // formato ISO

  @ApiProperty()
  endDateTime: string;

  @ApiProperty()
  images?: string[];     // opcional
  
  // @ApiProperty()
  // isOpen?: boolean;      // opcional
}
