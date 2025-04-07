import { Controller, Post, Body, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
  @Delete(':id')
  delete(@Param('id') eventId: string, @Req() req: any) {
    const user = req.user as any;
    return this.eventsService.deleteEvent(eventId, user.userId);
  }
}
