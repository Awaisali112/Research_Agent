import { FlaskConical, Plus, History, Settings, Radio, ToggleLeft, ToggleRight } from 'lucide-react';
import { Session, ToolPermissions } from '../types';

interface Props {
  sessions: Session[];
  activeId: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  permissions: ToolPermissions;
  onPermissionChange: (p: ToolPermissions) => void;
  onSettingsClick: () => void;
  onStatusClick: () => void;
}

const toolKeys: (keyof ToolPermissions)[] = ['web_search', 'wikipedia', 'Arxiv'];

export function Sidebar({
  sessions, activeId, onNewSession, onSelectSession,
  permissions, onPermissionChange, onSettingsClick, onStatusClick,
}: Props) {
  return (
    <aside className="flex flex-col w-56 min-w-[14rem] h-screen bg-[#0a4a5e] text-white">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#0d8a8a] flex items-center justify-center">
            <FlaskConical size={16} />
          </div>
          <span className="font-bold text-base leading-tight">Research agent</span>
        </div>
        <p className="text-xs text-teal-300 uppercase tracking-widest pl-10">Expert Research Agent</p>
      </div>

      {/* New Session */}
      <div className="px-4 mb-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0d6e7a] hover:bg-[#0d8a8a] transition-colors text-sm font-medium"
        >
          <Plus size={15} />
          New Session
        </button>
      </div>

      {/* History */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 text-teal-300 text-xs uppercase tracking-widest mb-2">
          <History size={13} />
          History
        </div>
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="text-xs text-teal-400/60 pl-1">No sessions yet</p>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`text-left text-xs px-3 py-1.5 rounded-md truncate transition-colors ${
                s.id === activeId
                  ? 'bg-[#0d8a8a] text-white'
                  : 'text-teal-200 hover:bg-[#0d6e7a]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 border-t border-teal-700/50 my-3" />

      {/* Capabilities */}
      <div className="px-4 flex-1">
        <p className="text-xs uppercase tracking-widest text-teal-300 mb-3">Capabilities</p>
        <div className="flex flex-col gap-3">
          {toolKeys.map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-teal-100">{key}</span>
              <button
                onClick={() => onPermissionChange({ ...permissions, [key]: !permissions[key] })}
                className="text-teal-300 hover:text-white transition-colors"
                aria-label={`Toggle ${key}`}
              >
                {permissions[key]
                  ? <ToggleRight size={24} className="text-[#0d8a8a]" />
                  : <ToggleLeft size={24} className="text-teal-600" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-5 pt-3 border-t border-teal-700/50 flex gap-4">
        <button
          onClick={onSettingsClick}
          className="flex flex-col items-center gap-1 text-teal-300 hover:text-white transition-colors text-xs"
        >
          <Settings size={18} />
          Settings
        </button>
        <button
          onClick={onStatusClick}
          className="flex flex-col items-center gap-1 text-teal-300 hover:text-white transition-colors text-xs"
        >
          <Radio size={18} />
          Status
        </button>
      </div>
    </aside>
  );
}
