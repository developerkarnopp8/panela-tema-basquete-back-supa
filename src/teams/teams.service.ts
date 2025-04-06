import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto'

@Injectable()
export class TeamsService {

    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateTeamDto, leaderId: string){
        return this.prisma.team.create({
            data: {
                ...dto,
                leaderId
            }
        })
    }

    async findByLeader(leaderId: string){
        return this.prisma.team.findMany({
            where: {
                leaderId
            }
        })
    }

    async delete(teamId: string, userId: string){
        const team =  await this.prisma.team.findUnique({
            where: {
                id: teamId
            }
        })

        if(!team || [team.leaderId !== userId]){
            throw new Error('Você não tem permissão para deletar esse time');
        }

        return this.prisma.team.delete({
            where: {
                id: teamId
            }
        });
    }
}
