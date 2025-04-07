import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async updateCheckin(id: string, data: { checkedIn: boolean }) {
    return this.prisma.checkin.update({
      where: { id },
      data,
    });
  }

  async getCheckinsByEvent(eventId: string) {
    return this.prisma.checkin.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getCheckinByUser(userId: string, eventId: string) {
    return this.prisma.checkin.findFirst({
      where: {
        userId,
        eventId,
      },
    });
  }

  async getConfirmedByEvent(eventId: string) {
    return this.prisma.checkin.findMany({
      where: {
        eventId,
        checkedIn: true,
      },
      include: {
        user: true,
      },
    });
  }
  
}
