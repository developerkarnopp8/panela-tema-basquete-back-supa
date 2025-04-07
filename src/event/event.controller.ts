import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
