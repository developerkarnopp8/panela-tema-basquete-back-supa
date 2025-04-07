import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PlayerTeamService {
    constructor(private readonly prisma: PrismaService) {}

    //Lider e sublider adiciona jogador ao time
    async addPlayer(teamId: string, dto: {playerId: string, isSubleader?: boolean}, requesterId: string){
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
        });

        if(!team) {
            throw new ForbiddenException('Time não encontrado');
        }

        if(team.leaderId !== requesterId) {
            throw new ForbiddenException('Você não tem permissão para adicionar jogadores a este time, apenas o líder');
        }

        return this.prisma.playerTeam.create({
            data: {
                teamId,
                playerId: dto.playerId,
                isSubleader: dto.isSubleader || false,
            },
        });
    }

    //Jogador faz check-in
    async checkIn(playerId: string, teamId: string, isConfirmed: boolean) {
        return await this.prisma.playerTeam.update({
            where: {
              playerId_teamId: {
                playerId,
                teamId,
              },
            },
            data: {
              isConfirmed,
            },
          });
    }

    //Buscar Jogadores confirmados
    async getConfirmedPlayers(teamId: string) {
        return this.prisma.playerTeam.findMany({
            where:{
                teamId,
                isConfirmed: true,
            },
            include: {
                player: true
            }

        })
    }


}

