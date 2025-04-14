import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CheckinService } from './checkin.service';
import { UpdateCheckinDto } from './dto/update-checkin.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Check-ins')
@ApiBearerAuth()
@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LEADER', 'SUBLEADER')
  @Get('event/:eventId')
  @ApiOperation({ summary: 'Listar check-ins por ID do evento' })
  @ApiResponse({ status: 200, description: 'Lista de check-ins retornada com sucesso' })
  getByEvent(@Param('eventId') eventId: string) {
    return this.checkinService.getCheckinsByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um check-in' })
  @ApiResponse({ status: 200, description: 'Check-in atualizado com sucesso' })
  update(@Param('id') id: string, @Body() dto: UpdateCheckinDto) {
    return this.checkinService.updateCheckin(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId/confirmed')
  @ApiOperation({ summary: 'Listar check-ins confirmados de um evento' })
  @ApiResponse({ status: 200, description: 'Lista de check-ins confirmados retornada com sucesso' })
  getConfirmed(@Param('eventId') eventId: string) {
    return this.checkinService.getConfirmedByEvent(eventId);
  }
}
