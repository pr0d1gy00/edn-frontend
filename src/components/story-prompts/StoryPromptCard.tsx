"use client";

import Link from "next/link";
import type { StoryPrompt } from "@/types/storyPrompt";

const STATUS_CONFIG: Record<
  string,
  { text: string; bg: string; textColor: string }
> = {
  open: {
    text: "ABIERTO",
    bg: "bg-green-500",
    textColor: "text-white",
  },
  closed: {
    text: "CERRADO",
    bg: "bg-gray-500",
    textColor: "text-white",
  },
  upcoming: {
    text: "PRÓXIMAMENTE",
    bg: "bg-edn-neon-yellow",
    textColor: "text-black",
  },
};

function getPromptStatus(prompt: StoryPrompt) {
  if (prompt.isOpen) return "open";
  // If not open and has a future date or is just not open, treat as upcoming vs closed
  // Since we don't have a scheduled date field, we default closed prompts as "CERRADO"
  return "closed";
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

interface StoryPromptCardProps {
  prompt: StoryPrompt;
  index: number;
  onClick?: () => void;
}

export default function StoryPromptCard({
  prompt,
  index,
  onClick,
}: StoryPromptCardProps) {
  const status = getPromptStatus(prompt);
  const statusInfo = STATUS_CONFIG[status];

  const content = (
    <article
      onClick={onClick}
      className={`
        relative bg-white border-4 border-black overflow-hidden
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        transition-all duration-150 cursor-pointer
      `}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Header area with yellow bg */}
      <div className="bg-edn-neon-yellow border-b-4 border-black p-5">
        {/* Status badge */}
        <div className="absolute top-0 right-0">
          <div
            className={`px-4 py-2 ${statusInfo.bg} border-b-4 border-l-4 border-black`}
          >
            <span
              className={`font-archivo-black text-xs ${statusInfo.textColor} uppercase tracking-wider`}
            >
              {statusInfo.text}
            </span>
          </div>
        </div>

        <h3 className="font-syne font-extrabold text-2xl text-black uppercase leading-tight tracking-tight pr-24">
          {prompt.title}
        </h3>
      </div>

      {/* Content area */}
      <div className="p-5 bg-white">
        <p className="font-plus-jakarta text-sm text-black/70 leading-relaxed">
          {truncateText(prompt.description, 120)}
        </p>

        {/* Bottom bar */}
        <div className="mt-4 pt-4 border-t-4 border-black flex items-center justify-between">
          <span className="font-archivo-black text-xs text-black/40 uppercase">
            {status === "open" ? "¡Votá ahora!" : "Próximamente"}
          </span>
          <div className="w-3 h-3 bg-black" />
        </div>
      </div>
    </article>
  );

  return (
    <Link href={`/stories/${prompt.id}`} className="block">
      {content}
    </Link>
  );
}
