import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTeamService } from './player-team.service';

describe('PlayerTeamService', () => {
  let service: PlayerTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerTeamService],
    }).compile();

    service = module.get<PlayerTeamService>(PlayerTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
