import { useEffect, useState } from 'react';
import { checkHealth } from '../api';
import { ToolPermissions } from '../types';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface Props {
  permissions: ToolPermissions;
}

export function TopBar({ permissions }: Props) {
  const { user, logout } = useAuth();
  const [model, setModel] = useState('');
  const [online, setOnline] = useState(false);

  useEffect(() => {
    checkHealth()
      .then((d) => { setModel(d.model); setOnline(true); })
      .catch(() => setOnline(false));
  }, []);

  const activeTools = Object.entries(permissions)
    .filter(([, v]) => v)
    .map(([k]) => k.replace('_', ' ').toUpperCase());

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 text-sm">
      {/* Left: model + db + status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium text-gray-700">
          <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
          {model || 'Loading...'}
        </span>
        <span className="flex items-center gap-1.5 text-gray-500">
          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
          SQLite
        </span>
        <span className={`flex items-center gap-1.5 font-medium ${online ? 'text-green-600' : 'text-red-500'}`}>
          <span className={`w-2 h-2 rounded-full inline-block ${online ? 'bg-green-500' : 'bg-red-500'}`} />
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Right: tool badges + user */}
      <div className="flex items-center gap-2">
        {activeTools.map((t) => (
          <span
            key={t}
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0a4a5e] text-white tracking-wide"
          >
            {t}
          </span>
        ))}

        {/* User avatar + name */}
        <div className="ml-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0d8a8a] flex items-center justify-center text-white text-xs font-bold uppercase">
            {user?.name?.[0] ?? '?'}
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
          <button
            onClick={logout}
            title="Sign out"
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
