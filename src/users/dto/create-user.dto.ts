import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  inviteCode: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  eventId: string;
}


// export class CreateUserDto {
//   name: string;
//   email: string;
//   password: string;
//   inviteCode: string;
//   eventId?: string; // Added optional eventId property
// }