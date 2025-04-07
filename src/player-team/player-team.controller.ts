import { Controller, Post, Body, Param, Request, UseGuards, Patch, Get } from '@nestjs/common';
import { PlayerTeamService } from './player-team.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('teams/:teamId/players')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayerTeamController {
  constructor(private readonly service: PlayerTeamService) {}

  @Post()
  @Roles('LEADER')
  addPlayer(
    @Param('teamId') teamId: string,
    @Body() body: { playerId: string; isSubleader?: boolean },
    @Request() req
  ) {
    return this.service.addPlayer(teamId, body, req.user.userId);
  }

  @Patch('checkin')
  @Roles('PLAYER', 'SUBLEADER', 'LEADER')
  checkIn(
    @Param('teamId') teamId: string,
    @Request() req,
    @Body() body: { isConfirmed: boolean },
  ) {
    return this.service.checkIn(teamId, req.user.userId, body.isConfirmed);
  }

  @Get('confirmed')
  @Roles('LEADER', 'SUBLEADER')
  getConfirmed(@Param('teamId') teamId: string) {
    return this.service.getConfirmedPlayers(teamId);
  }
}
