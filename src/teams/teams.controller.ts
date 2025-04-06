import { Controller, Post, Get, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    @Roles('LEADER')
    async create(@Body() dto: CreateTeamDto, @Request() req) {
        return this.teamsService.create(dto, req.user.userId);
    }

    @Get()
    @Roles('LEADER')
    async findMine(@Request() req) {
        return this.teamsService.findByLeader(req.user.userId);
    }

    @Delete(':id')
    @Roles('LEADER')
    async remove(@Param('id') id: string, @Request() req) {
        return this.teamsService.delete(id, req.user.userId);
    }
}
