import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

export function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-3 py-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-[#0a4a5e]' : 'bg-teal-100'
        }`}
      >
        {isUser
          ? <User size={15} className="text-white" />
          : <Bot size={15} className="text-teal-700" />}
      </div>

      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Tool call badges */}
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {[...new Set(msg.toolCalls)].map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700 border border-teal-200"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isUser
              ? 'bg-[#0a4a5e] text-white rounded-tr-sm'
              : 'bg-white text-gray-800 rounded-tl-sm border border-gray-200 shadow-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{msg.content || ' '}</ReactMarkdown>
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse ml-0.5 rounded-sm align-middle" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
