/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    if (!dto.eventId) {
      return this.usersService.createLeader(dto);
    }

    return this.usersService.create({ ...dto, eventId: dto.eventId || '' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.usersService.findUsersByEvent(eventId);
  }
}
