'use client';

import { useState } from 'react';

type HintAccordionProps = {
  hints: string[];
  onReveal?: (index: number) => void;
  disabled?: boolean;
};

export default function HintAccordion({ hints, onReveal, disabled }: HintAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>(() => hints.map(() => false));

  return (
    <div className="space-y-3">
      {hints.map((hint, index) => {
        const isOpen = openIndex === index;
        return (
          <button
            type="button"
            key={hint}
            onClick={() => {
              if (disabled) return;
              setOpenIndex(isOpen ? null : index);
              if (!revealed[index]) {
                const next = [...revealed];
                next[index] = true;
                setRevealed(next);
                onReveal?.(index);
              }
            }}
            className={`panel-inset w-full rounded-lg p-3 text-left transition hover:border-[#60e1ff]/35 ${
              disabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-soft">Hint {index + 1}</span>
              <span className="text-xs text-gold">-10% XP</span>
            </div>
            {isOpen && <p className="mt-2 text-xs text-dim">{hint}</p>}
          </button>
        );
      })}
    </div>
  );
}
