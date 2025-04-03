
export type MoodType = 'happy' | 'sad' | 'angry' | 'excited' | 'confused';

export interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  mood: MoodType;
  imageUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
