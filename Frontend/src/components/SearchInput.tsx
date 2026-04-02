import { useState, KeyboardEvent, useRef } from 'react';
import { Search, Square } from 'lucide-react';

interface Props {
  onSend: (msg: string) => void;
  disabled: boolean;
  onStop: () => void;
  placeholder?: string;
}

export function SearchInput({ onSend, disabled, onStop, placeholder }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const submit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-2xl bg-white border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm focus-within:border-teal-400 focus-within:shadow-md transition-all">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder ?? 'Enter a research topic or question...'}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
      />
      {disabled ? (
        <button
          onClick={onStop}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-400 transition-colors text-white"
          aria-label="Stop"
        >
          <Square size={13} />
        </button>
      ) : (
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0a4a5e] hover:bg-[#0d6e7a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
          aria-label="Search"
        >
          <Search size={14} />
        </button>
      )}
    </div>
  );
}
