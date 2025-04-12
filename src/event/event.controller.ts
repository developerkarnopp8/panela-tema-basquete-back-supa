import { Controller, Post, Body, Req, UseGuards, Delete, Param, Get, Patch } from '@nestjs/common';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listEvents(@Req() req: any) {
    const user = req.user as any;
    return this.eventsService.getEventsForUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
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
  delete(@Param('id') eventId: string, @Req() req: any) {
    const user = req.user as any;
    return this.eventsService.deleteEvent(eventId, user.userId);
  }

}
