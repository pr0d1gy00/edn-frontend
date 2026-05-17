'use client';

const LIMIT_OPTIONS = [6, 12, 15, 24, 30] as const;

interface LimitSelectorProps {
  value: number;
  onChange: (limit: number) => void;
}

export default function LimitSelector({ value, onChange }: LimitSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="episode-limit" className="font-archivo-black text-xs text-white/60 uppercase tracking-wider">
        Mostrar:
      </label>
      <select
        id="episode-limit"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          bg-white border-4 border-black rounded-sm font-archivo-black text-black
          uppercase px-4 py-2
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          transition-all duration-150 appearance-none cursor-pointer
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C%2Fsvg%3E')]
          bg-[length:12px_12px] bg-[right_8px_center] bg-no-repeat pr-10
        "
      >
        {LIMIT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt} por p&aacute;gina
          </option>
        ))}
      </select>
    </div>
  );
}
