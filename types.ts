export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  role: string;
  position: [number, number, number]; // x, y, z in 3D space
  tech: string[];
  imageUrl?: string; // For the uploaded image
  projectLink?: string; // For the external project link
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MousePosition {
  x: number;
  y: number;
}