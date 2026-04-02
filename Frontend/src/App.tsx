import { useRef, useState, useCallback } from 'react';
import { streamChat } from './api';
import { Message, Session, ToolPermissions } from './types';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatMessage } from './components/ChatMessage';
import { SearchInput } from './components/SearchInput';
import { StarterCards } from './components/StarterCards';
import { Sparkles } from 'lucide-react';

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messageMap, setMessageMap] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<ToolPermissions>({
    web_search: true,
    wikipedia: true,
    Arxiv: true,
  });
  const abortRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeMessages = activeId ? (messageMap[activeId] ?? []) : [];

  const newSession = () => {
    const id = genId();
    const session: Session = { id, title: 'New Session', createdAt: Date.now() };
    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    setMessageMap((prev) => ({ ...prev, [id]: [] }));
  };

  const sendMessage = useCallback(async (text: string) => {
    let threadId = activeId;

    // Auto-create session if none active
    if (!threadId) {
      threadId = genId();
      const session: Session = { id: threadId, title: text.slice(0, 40), createdAt: Date.now() };
      setSessions((prev) => [session, ...prev]);
      setActiveId(threadId);
      setMessageMap((prev) => ({ ...prev, [threadId!]: [] }));
    } else {
      // Update session title from first message
      setSessions((prev) =>
        prev.map((s) =>
          s.id === threadId && s.title === 'New Session'
            ? { ...s, title: text.slice(0, 40) }
            : s
        )
      );
    }

    const tid = threadId;
    const userMsg: Message = { id: genId(), role: 'user', content: text };
    const asstId = genId();
    const asstMsg: Message = { id: asstId, role: 'assistant', content: '', toolCalls: [], isStreaming: true };

    setMessageMap((prev) => ({
      ...prev,
      [tid]: [...(prev[tid] ?? []), userMsg, asstMsg],
    }));
    setLoading(true);
    abortRef.current = false;

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      for await (const chunk of streamChat(text, tid, permissions)) {
        if (abortRef.current) break;
        setMessageMap((prev) => {
          const msgs = prev[tid] ?? [];
          return {
            ...prev,
            [tid]: msgs.map((m) => {
              if (m.id !== asstId) return m;
              if (chunk.type === 'text' && chunk.content) return { ...m, content: chunk.content };
              if (chunk.type === 'tool_call' && chunk.tools)
                return { ...m, toolCalls: [...(m.toolCalls ?? []), ...chunk.tools] };
              if (chunk.type === 'error') return { ...m, content: `Error: ${chunk.content}` };
              return m;
            }),
          };
        });
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 10);
      }
    } catch (err: any) {
      setMessageMap((prev) => ({
        ...prev,
        [tid]: (prev[tid] ?? []).map((m) =>
          m.id === asstId ? { ...m, content: `Failed to reach backend: ${err.message}` } : m
        ),
      }));
    } finally {
      setMessageMap((prev) => ({
        ...prev,
        [tid]: (prev[tid] ?? []).map((m) =>
          m.id === asstId ? { ...m, isStreaming: false } : m
        ),
      }));
      setLoading(false);
    }
  }, [activeId, permissions]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f7f7]">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNewSession={newSession}
        onSelectSession={setActiveId}
        permissions={permissions}
        onPermissionChange={setPermissions}
        onSettingsClick={() => {}}
        onStatusClick={() => {}}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar permissions={permissions} />

        <main className="flex-1 overflow-y-auto">
          {activeMessages.length === 0 ? (
            /* Hero / landing state */
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-teal-600 text-sm font-medium mb-4">
                  <Sparkles size={15} />
                  NEW RESEARCH THREAD
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  What are we{' '}
                  <span className="text-[#0d8a8a]">researching</span> today?
                </h1>
                <p className="text-gray-500 text-base max-w-lg mx-auto">
                  Initialize a new session to synthesize academic papers, industry reports, and global trends with the Research agent.
                </p>
              </div>

              <SearchInput onSend={sendMessage} disabled={loading} onStop={() => { abortRef.current = true; }} />
              <StarterCards onSelect={sendMessage} />
            </div>
          ) : (
            /* Chat state */
            <div className="max-w-3xl mx-auto px-6 py-4">
              {activeMessages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        {/* Sticky input when chat is active */}
        {activeMessages.length > 0 && (
          <div className="px-6 py-4 bg-[#f0f7f7] border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              <SearchInput
                onSend={sendMessage}
                disabled={loading}
                onStop={() => { abortRef.current = true; }}
                placeholder="Ask a follow-up question..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
