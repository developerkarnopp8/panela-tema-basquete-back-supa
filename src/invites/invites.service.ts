import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class InvitesService {
  
    constructor(private prisma: PrismaService) {}

    async createInvite(dto: CreateInviteDto, leaderId: string) {
        const event = await this.prisma.event.findUnique({
          where: { id: dto.eventId },
        });
      
        if (!event || event.createdBy !== leaderId) {
          throw new ForbiddenException('Você não tem permissão para criar convite para esse evento.');
        }
      
        const code = randomBytes(6).toString('hex'); // Ex: 'f1a9e0d3b2c1'
      
        return this.prisma.invite.create({
          data: {
            code,
            eventId: dto.eventId,
            createdBy: leaderId,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
          },
        });
      }

      async findInviteByCode(code: string) {
        const invite = await this.prisma.invite.findUnique({
          where: { code },
          include: { event: true },
        });
      
        if (!invite) throw new NotFoundException('Convite não encontrado');
        if (invite.expiresAt && new Date() > invite.expiresAt) {
          throw new BadRequestException('Convite expirado');
        }
      
        return invite;
      }
}
