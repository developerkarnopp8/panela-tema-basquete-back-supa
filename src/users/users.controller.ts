/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateLeaderWithEventDto } from './dto/create-leader-with-event.dto';

@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}


  @Post('leader-with-event')
  createLeaderWithEvent(@Body() dto: CreateLeaderWithEventDto) {
    return this.usersService.createLeader(dto);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
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
  updateUserByLeader(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.usersService.updateUserByLeader(id, data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyData(@Req() req: any, @Body() data: any) {
    const allowedFields = {
      name: data.name,
      email: data.email,
    };

    return this.usersService.updateMyProfile(req.user.userId, allowedFields);
  }

}
