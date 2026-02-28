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
            className={`w-full rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-left ${
              disabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Hint {index + 1}</span>
              <span className="text-xs text-amber-300">-10% XP</span>
            </div>
            {isOpen && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
          </button>
        );
      })}
    </div>
  );
}
