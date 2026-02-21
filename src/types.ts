export interface BulletEntry {
  id: string;
  type: 'task' | 'event' | 'note';
  content: string;
  status: 'pending' | 'completed' | 'migrated' | 'cancelled';
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO dates
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: number;
}

export interface MoodEntry {
  date: string; // ISO date
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
}

export interface GratitudeEntry {
  id: string;
  content: string;
  date: number;
}

export interface Collection {
  id: string;
  name: string;
  items: string[];
}

export interface UserProfile {
  name: string;
  photoUrl: string;
}

export interface VisionItem {
  id: string;
  imageUrl: string;
  title: string;
}

export type Tab = 'Início' | 'Registro Diário' | 'Registro Semanal' | 'Registro Mensal' | 'Registro Futuro' | 'Coleções' | 'Hábitos' | 'Humor' | 'Finanças' | 'Gratidão' | 'Pomodoro' | 'Configurações';
