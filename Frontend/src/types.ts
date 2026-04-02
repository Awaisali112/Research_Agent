export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: string[];
  isStreaming?: boolean;
}

export interface ToolPermissions {
  web_search: boolean;
  wikipedia: boolean;
  Arxiv: boolean;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
}
