import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CheckinService } from './checkin.service';
import { UpdateCheckinDto } from './dto/update-checkin.dto';

@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER', 'SUBLEADER')
  @Get('event/:eventId')
  getByEvent(@Param('eventId') eventId: string) {
    return this.checkinService.getCheckinsByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCheckinDto) {
    console.log('Update checkin', id, dto);
    return this.checkinService.updateCheckin(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId/confirmed')
  getConfirmed(@Param('eventId') eventId: string) {
    return this.checkinService.getConfirmedByEvent(eventId);
  }

}
