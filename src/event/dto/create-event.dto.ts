export class CreateEventDto {
  eventName: string;
  description: string;
  type: 'GAME' | 'CHAMPIONSHIP';
  startDateTime: string; // formato ISO
  endDateTime: string;
  images?: string[];     // opcional
  isOpen?: boolean;      // opcional
}
