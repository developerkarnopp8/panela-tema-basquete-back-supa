import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: { name: string; type: 'GAME' | 'CHAMPIONSHIP'; createdBy: string }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Cria o evento com o líder como criador
      const event = await tx.event.create({
        data: {
          name: data.name,
          type: data.type,
          createdBy: data.createdBy,
        },
      });

      // 2. Atualiza o usuário (líder) para se vincular ao evento
      await tx.user.update({
        where: { id: data.createdBy },
        data: {
          eventId: event.id,
        },
      });

      return event;
    });
  }

  async getEventsForUser(user: { userId: string; role: string }) {
    if (user.role === 'LEADER') {
      // Líder vê eventos que ele criou
      return this.prisma.event.findMany({
        where: { createdBy: user.userId },
        orderBy: { createdAt: 'desc' },
      });
    }
  
    // PLAYER ou SUBLEADER vê apenas o evento que está vinculado
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: { event: true },
    });
  
    if (!currentUser?.event) return [];
  
    return [currentUser.event];
  }
  
  async deleteEvent(eventId: string, userId: string) {
    // Verifica se o evento é do usuário logado (LEADER)
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event || event?.createdBy !== userId) {
      throw new Error('Apenas o líder criador do evento pode deletá-lo');
    }
  
    // Deleta todos os usuários do evento, exceto o líder
    await this.prisma.user.deleteMany({
      where: {
        eventId,
        NOT: {
          id: userId,
        },
      },
    });
  
    // Remove a referência do líder ao evento
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        eventId: null,
      },
    });
  
    // Deleta o evento
    return this.prisma.event.delete({
      where: { id: eventId },
    });
  }
  
}
