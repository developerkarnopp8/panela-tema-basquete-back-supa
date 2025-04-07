import { Module } from '@nestjs/common';
import { PlayerTeamService } from './player-team.service';
import { PlayerTeamController } from './player-team.controller';

@Module({
  providers: [PlayerTeamService],
  controllers: [PlayerTeamController]
})
export class PlayerTeamModule {}
