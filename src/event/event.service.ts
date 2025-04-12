import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: {
    eventName: string;
    description: string;
    type: 'GAME' | 'CHAMPIONSHIP';
    startDateTime: string;
    endDateTime: string;
    createdBy: string;
    isOpen?: boolean;
    images?: string[];
  }) {
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);

    const minutes = (end.getTime() - start.getTime()) / 60000;

    if (minutes < 60) {
      throw new BadRequestException('A duração mínima do evento é de 60 minutos.');
    }

    const conflict = await this.prisma.event.findFirst({
      where: {
        createdBy: data.createdBy,
        AND: [
          {
            startDateTime: {
              lt: new Date(data.endDateTime), // evento que começa ANTES do fim do novo
            },
          },
          {
            endDateTime: {
              gt: new Date(data.startDateTime), // evento que termina DEPOIS do início do novo
            },
          },
        ],
      },
    });
    

    if (conflict) {
      throw new BadRequestException('Já existe um evento nesse intervalo de tempo.');
    }

    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          name: data.eventName,
          description: data.description,
          type: data.type,
          startDateTime: start,
          endDateTime: end,
          isOpen: data.isOpen ?? false,
          images: data.images ?? [],
          createdBy: data.createdBy,
        },
      });

      await tx.user.update({
        where: { id: data.createdBy },
        data: {
          eventId: event.id,
        },
      });

      await tx.checkin.create({
        data: {
          userId: data.createdBy,
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

  async updateEvent(eventId: string, data: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
  
    if (!event || event.createdBy !== userId) {
      throw new Error('Você não tem permissão para editar este evento');
    }
  
    // Verifica se houve alteração de horário
    if (data.startDateTime && data.endDateTime) {
      const start = new Date(data.startDateTime);
      const end = new Date(data.endDateTime);
      const minutes = (end.getTime() - start.getTime()) / 60000;
  
      if (minutes < 60) {
        throw new Error('A duração mínima do evento é de 60 minutos');
      }
  
      // Verifica conflito com outros eventos
      const conflict = await this.prisma.event.findFirst({
        where: {
          id: { not: eventId },
          createdBy: userId,
          AND: [
            { startDateTime: { lt: end } },
            { endDateTime: { gt: start } },
          ],
        },
      });
  
      if (conflict) {
        throw new Error('Já existe um evento nesse horário');
      }
    }
  
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        startDateTime: data.startDateTime ? new Date(data.startDateTime) : undefined,
        endDateTime: data.endDateTime ? new Date(data.endDateTime) : undefined,
      },
    });
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
