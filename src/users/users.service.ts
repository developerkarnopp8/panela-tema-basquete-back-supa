import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { CreateLeaderWithEventDto } from './dto/create-leader-with-event.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findById(userId: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto & { eventId?: string }) {
    const invite = await this.prisma.invite.findUnique({
      where: { code: data.inviteCode },
      include: { event: true },
    });
  
    if (!invite) {
      throw new Error('Código de convite inválido');
    }
  
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      throw new Error('Convite expirado');
    }
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'PLAYER',
        eventId: invite.eventId,
      },
    });
  
    // Procura instância aberta no evento
    const eventInstance = await this.prisma.eventInstance.findFirst({
      where: {
        eventId: invite.eventId,
        isOpen: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  
    if (eventInstance) {
      await this.prisma.checkin.create({
        data: {
          userId: user.id,
          eventInstanceId: eventInstance.id,
          checkedIn: false, // ou true, se quiser já marcar como presente
        },
      });
    }
  
    return user;
  }
  

  async createLeader(data: CreateLeaderWithEventDto) {
  
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (userExists) {
      throw new Error('Já existe um usuário com esse e-mail');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'LEADER',
        },
      });
  
      const event = await tx.event.create({
        data: {
          name: data.eventName,
          description: data.description,
          type: data.type,
          // isOpen: data.isOpen ?? false,
          images: data.images ?? [],
          createdBy: user.id,
        },
      });
  
      await tx.user.update({
        where: { id: user.id },
        data: {
          eventId: event.id,
        },
      });

      const instance = await tx.eventInstance.create({
        data: {
          eventId: event.id,
          date: new Date(data.startDateTime),
          startTime: new Date(data.startDateTime),
          endTime: new Date(data.endDateTime),
          isOpen: data.isOpen ?? false,
        },
      });
  
      await tx.checkin.create({
        data: {
          userId: user.id,
          eventInstanceId: instance.id,
          checkedIn: true,
        },
      });
      
      return { user, event };
    });
  }
  
  async findUsersByEvent(eventId: string) {
    return this.prisma.user.findMany({
      where: { eventId },
      orderBy: { 
        createdAt: 'asc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }  

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUserByLeader(
    targetUserId: string,
    data: Partial<{ name: string; email: string; role: Role }>,
    leaderId: string
  ) {
    const leader = await this.prisma.user.findUnique({ where: { id: leaderId } });
    const targetUser = await this.prisma.user.findUnique({ where: { id: targetUserId } });
  
    if (!leader || !targetUser) {
      throw new Error('Usuário não encontrado');
    }
  
    if (leader.role !== 'LEADER') {
      throw new Error('Apenas o líder pode editar outros usuários');
    }
  
    if (leader.eventId !== targetUser.eventId) {
      throw new Error('Usuário não pertence ao mesmo evento');
    }
  
    return this.prisma.user.update({
      where: { id: targetUserId },
      data,
    });
  }
  
  async updateMyProfile(userId: string, data: Partial<{ name: string; email: string }>) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
  
}
