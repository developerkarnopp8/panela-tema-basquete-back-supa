export class CreateLeaderWithEventDto {
  name: string;
  email: string;
  password: string;

  eventName: string;
  description: string;
  type: 'GAME' | 'CHAMPIONSHIP';
  startDateTime: string;
  endDateTime: string;
  images?: string[];
  isOpen?: boolean;
}
