export class CreateLeaderWithEventDto {
    name: string;
    email: string;
    password: string;
    eventName: string;
    eventType: 'GAME' | 'CHAMPIONSHIP';
  }
  