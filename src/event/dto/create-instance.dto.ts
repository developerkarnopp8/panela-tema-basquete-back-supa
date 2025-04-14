import { ApiProperty } from '@nestjs/swagger';

export class CreateEventInstanceDto {
  @ApiProperty()
  date: string;         // só a data do jogo (opcional, pode usar startTime)

  @ApiProperty()
  startTime: string;    // ex: "2025-04-20T20:00:00Z"

  @ApiProperty()
  endTime: string;      // ex: "2025-04-20T21:30:00Z"

  @ApiProperty()
  isOpen?: boolean;
}
  