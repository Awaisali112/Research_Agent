import { ToolPermissions } from './types';

const BASE = '/api';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('research_auth');
    if (raw) return JSON.parse(raw).token ?? null;
  } catch { /* ignore */ }
  return null;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function* streamChat(
  message: string,
  threadId: string,
  toolPermissions: ToolPermissions
): AsyncGenerator<{ type: string; content?: string; tools?: string[] }> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message, thread_id: threadId, tool_permissions: toolPermissions }),
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try { yield JSON.parse(data); } catch { /* skip */ }
      }
    }
  }
}

export async function checkHealth(): Promise<{ status: string; model: string }> {
  const res = await fetch(`${BASE}/health`);
  if (!res.ok) throw new Error('offline');
  return res.json();
}
