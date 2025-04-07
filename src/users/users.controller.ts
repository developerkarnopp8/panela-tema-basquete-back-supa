/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.usersService.updateUser(id, data, req.user.userId);
  }

}
