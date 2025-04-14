/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLeaderWithEventDto } from './dto/create-leader-with-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('leader-with-event')
  @ApiOperation({ summary: 'Criar um líder e já vincular a um evento' })
  @ApiResponse({ status: 201, description: 'Líder e evento criados com sucesso' })
  createLeaderWithEvent(@Body() dto: CreateLeaderWithEventDto) {
    return this.usersService.createLeader(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create({ ...dto, eventId: dto.eventId || '' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  @ApiOperation({ summary: 'Listar usuários de um evento' })
  @ApiResponse({ status: 200, description: 'Usuários retornados com sucesso' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.usersService.findUsersByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @Patch(':id')
  @ApiOperation({ summary: 'Líder atualiza dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  updateUserByLeader(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.usersService.updateUserByLeader(id, data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Atualizar meus próprios dados (nome e email)' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  updateMyData(@Req() req: any, @Body() data: any) {
    const allowedFields = {
      name: data.name,
      email: data.email,
    };

    return this.usersService.updateMyProfile(req.user.userId, allowedFields);
  }
}
