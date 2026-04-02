import { FlaskConical, Cpu, Globe, Microscope } from 'lucide-react';

const starters = [
  {
    icon: <FlaskConical size={20} className="text-teal-600" />,
    title: 'Generative Architecture',
    desc: 'Analyze historical trends and the impact of AI on architecture.',
  },
  {
    icon: <Cpu size={20} className="text-teal-600" />,
    title: 'Quantum Computing',
    desc: 'Synthesize recent breakthroughs in error correction and qubits.',
  },
  {
    icon: <Globe size={20} className="text-teal-600" />,
    title: 'Climate Policy',
    desc: 'Research global climate agreements and their measurable outcomes.',
  },
  {
    icon: <Microscope size={20} className="text-teal-600" />,
    title: 'CRISPR Advances',
    desc: 'Explore the latest gene-editing research and ethical debates.',
  },

];

interface Props {
  onSelect: (topic: string) => void;
}

export function StarterCards({ onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl">
      <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-4">
        Research Starters
      </p>
      <div className="grid grid-cols-2 gap-3">
        {starters.map((s) => (
          <button
            key={s.title}
            onClick={() => onSelect(s.title)}
            className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-teal-400 hover:shadow-sm transition-all text-left"
          >
            <div className="mt-0.5 flex-shrink-0">{s.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
