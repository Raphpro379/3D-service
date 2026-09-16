export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type ViewMode = 'split' | 'preview' | 'code';

export interface GeneratedApp {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation?: string;
  suggestedImprovements?: string[];
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  version: number;
  prompt: string;
}

export interface AppVersion {
  id: string;
  version: number;
  prompt: string;
  code: string;
  title: string;
  timestamp: number;
  explanation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  suggestedImprovements?: string[];
  codeSnapshot?: string;
}

export interface GenerationOptions {
  style: string;
  features: string[];
}

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface PublishedApp {
  id: string;
  slug: string;
  title: string;
  description?: string;
  code: string;
  url: string;
  publishedAt: number;
  updatedAt: number;
  views?: number;
}
