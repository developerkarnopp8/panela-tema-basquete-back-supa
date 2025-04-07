import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTeamController } from './player-team.controller';

describe('PlayerTeamController', () => {
  let controller: PlayerTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerTeamController],
    }).compile();

    controller = module.get<PlayerTeamController>(PlayerTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
