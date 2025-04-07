import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  findById(userId: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string; eventId?: string }) {
    const event = await this.prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'PLAYER',
        eventId: data.eventId,
      },
    });

    // Cria check-in automático
    if (data.eventId) {
      await this.prisma.checkin.create({
        data: {
          userId: (await user).id,
          eventId: data.eventId,
        },
      });
    }

    return user;
  }

  async createLeader(data: {
    name: string;
    email: string;
    password: string;
    eventName: string;
    eventType: 'GAME' | 'CHAMPIONSHIP';
  }) {
    const totalUsers = await this.prisma.user.count();
  
    if (totalUsers > 0) {
      throw new Error('Apenas o primeiro usuário pode ser líder sem evento');
    }
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    return this.prisma.$transaction(async (tx) => {
      // 1. Cria o líder
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'LEADER',
        },
      });
  
      // 2. Cria o evento
      const event = await tx.event.create({
        data: {
          name: data.eventName,
          type: data.eventType,
          createdBy: user.id,
        },
      });
  
      // 3. Atualiza o líder com o eventId
      await tx.user.update({
        where: { id: user.id },
        data: {
          eventId: event.id,
        },
      });
  
      // 4. Cria check-in do líder
      await tx.checkin.create({
        data: {
          userId: user.id,
          eventId: event.id,
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
