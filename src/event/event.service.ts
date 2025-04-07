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
}
