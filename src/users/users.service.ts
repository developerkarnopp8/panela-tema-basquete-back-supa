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

  async create(data: { name: string; email: string; password: string; eventId: string }) {
    const event = await this.prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'PLAYER',
        eventId: data.eventId,
      },
    });
  }

  async createLeader(data: { name: string; email: string; password: string }) {
    const totalUsers = await this.prisma.user.count();

    if (totalUsers > 0) {
      throw new Error('Apenas o primeiro usuário pode ser líder sem evento');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'LEADER',
      },
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

  async updateUser(targetUserId: string, data: Partial<{ name: string; email: string; role: Role }>, leaderId: string) {
    const leader = await this.prisma.user.findUnique({ where: { id: leaderId } });
    const userToUpdate = await this.prisma.user.findUnique({ where: { id: targetUserId } });
  
    if (!leader || !userToUpdate) {
      throw new Error('Usuário não encontrado');
    }
  
    if (leader.role !== 'LEADER') {
      throw new Error('Apenas o líder pode editar outros usuários');
    }
  
    if (leader.eventId !== userToUpdate.eventId) {
      throw new Error('Usuário não pertence ao mesmo evento');
    }
  
    return this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role, // pode ser PLAYER ou SUBLEADER
      },
    });
  }
  

}
