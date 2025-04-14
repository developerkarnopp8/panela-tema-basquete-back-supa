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

  async getCheckinsByEvent(eventInstanceId: string) {
    return this.prisma.checkin.findMany({
      where: { eventInstanceId },
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

  async getCheckinByUser(userId: string, eventInstanceId: string) {
    return this.prisma.checkin.findFirst({
      where: {
        userId,
        eventInstanceId,
      },
    });
  }

  async getConfirmedByEvent(eventInstanceId: string) {
    return this.prisma.checkin.findMany({
      where: {
        eventInstanceId,
        checkedIn: true,
      },
      include: {
        user: true,
      },
    });
  }
  
}
