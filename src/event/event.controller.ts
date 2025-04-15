import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventInstanceDto } from './dto/create-instance.dto';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateEventInstanceDto } from './dto/update-instance.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar eventos para o usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de eventos retornada com sucesso' })
  async listEvents(@Req() req: any) {
    const user = req.user;
    return this.eventsService.getEventsForUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso' })
  create(@Body() dto: CreateEventDto, @Req() req: Request) {
    const user = req.user as any;
    return this.eventsService.createEvent({
      ...dto,
      createdBy: user.userId,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um evento existente' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso' })
  update(
    @Param('id') eventId: string,
    @Body() data: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.updateEvent(eventId, data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um evento' })
  @ApiResponse({ status: 200, description: 'Evento deletado com sucesso' })
  delete(@Param('id') eventId: string, @Req() req: any) {
    const user = req.user;
    return this.eventsService.deleteEvent(eventId, user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @Post(':id/instances')
  @ApiOperation({ summary: 'Criar uma instância (execução) de um evento' })
  @ApiResponse({ status: 201, description: 'Instância criada com sucesso' })
  createInstance(
    @Param('id') eventId: string,
    @Body() dto: CreateEventInstanceDto,
    @Req() req: any,
  ) {
    return this.eventsService.createInstance(eventId, dto, req.user.userId);
  }

  @Patch('/instances/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @ApiOperation({ summary: 'Atualiza as Instancias' })
  @ApiResponse({ status: 201, description: 'Instância atualizada com sucesso' })
  updateInstance(
    @Param('id') id: string,
    @Body() dto: UpdateEventInstanceDto,
    @Req() req: any,
  ) {
    return this.eventsService.updateInstance(id, dto, req.user.userId);
  }

  @Delete('/instances/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @ApiOperation({ summary: 'Deleta a Instancia' })
  @ApiResponse({ status: 201, description: 'Instância deletada com sucesso' })
  deleteInstance(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.deleteInstance(id, req.user.userId);
  }

  @Patch('/instances/:id/open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER')
  @ApiOperation({ summary: 'Atualiza o Toogle' })
  @ApiResponse({ status: 201, description: 'Instância tooggle atualizado com sucesso' })
  toggleOpen(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.toggleInstanceOpen(id, req.user.userId);
  }

}
