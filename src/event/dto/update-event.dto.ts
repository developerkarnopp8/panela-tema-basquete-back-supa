export class UpdateEventDto {
    name?: string;
    description?: string;
    startDateTime?: string;
    endDateTime?: string;
    isOpen?: boolean;
    images?: string[];
    type?: 'GAME' | 'CHAMPIONSHIP';
  }
  