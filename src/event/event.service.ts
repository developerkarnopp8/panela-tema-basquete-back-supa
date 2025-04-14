import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventInstanceDto } from './dto/create-instance.dto';
import { UpdateEventInstanceDto } from './dto/update-instance.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: {
    eventName: string;
    description: string;
    type: 'GAME' | 'CHAMPIONSHIP';
    createdBy: string;
    images?: string[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          name: data.eventName,
          description: data.description,
          type: data.type,
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

      return event;
    });
  }

  async createInstance(eventId: string, dto: CreateEventInstanceDto, leaderId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });

    if (!event || event.createdBy !== leaderId) {
      throw new ForbiddenException('Apenas o líder do evento pode criar execuções');
    }

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    const duration = (end.getTime() - start.getTime()) / 60000;

    if (duration < 60) {
      throw new BadRequestException('A duração mínima do evento é de 60 minutos');
    }

    const overlapping = await this.prisma.eventInstance.findFirst({
      where: {
        eventId,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Já existe uma instância com horário conflitante.');
    }

    const instance = await this.prisma.eventInstance.create({
      data: {
        eventId,
        date: new Date(dto.date || dto.startTime),
        startTime: start,
        endTime: end,
        isOpen: dto.isOpen ?? false,
      },
    });

    // Adiciona o check-in automático do líder
    await this.prisma.checkin.create({
      data: {
        user: { connect: { id: leaderId } },
        instance: { connect: { id: instance.id } },
        checkedIn: true,
      },
    });

    return instance;
  }

  async updateInstance(instanceId: string, data: UpdateEventInstanceDto, leaderId: string) {
    const instance = await this.prisma.eventInstance.findUnique({
      where: { id: instanceId },
      include: { event: true },
    });
  
    if (!instance) throw new NotFoundException('Instância não encontrada');
    if (instance.event.createdBy !== leaderId) {
      throw new ForbiddenException('Apenas o líder do evento pode atualizar a instância');
    }
  
    return this.prisma.eventInstance.update({
      where: { id: instanceId },
      data: {
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        isOpen: data.isOpen,
      },
    });
  }

  async getEventsForUser(user: { userId: string; role: string }) {
    if (user.role === 'LEADER') {
      return this.prisma.event.findMany({
        where: { createdBy: user.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          instances: {
            orderBy: { startTime: 'asc' },
          },
        },
      });
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: { 
        event: {
          include: {
            instances: {
              orderBy: { startTime: 'asc' },
            },
          },
        },
       },
    });

    if (!currentUser?.event) return [];

    return [currentUser.event];
  }

  async updateEvent(eventId: string, data: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId) throw new ForbiddenException('Você não tem permissão para editar este evento');

    // Removemos as validações de horário porque isso agora é responsabilidade da instancia
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        images: data.images,
      },
    });
  }

  async deleteEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId) {
      throw new ForbiddenException('Apenas o líder criador do evento pode deletá-lo');
    }

    await this.prisma.eventInstance.deleteMany({
      where: { eventId },
    });

    await this.prisma.user.deleteMany({
      where: {
        eventId,
        NOT: { id: userId },
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        eventId: null,
      },
    });

    return this.prisma.event.delete({
      where: { id: eventId },
    });
  }
}
