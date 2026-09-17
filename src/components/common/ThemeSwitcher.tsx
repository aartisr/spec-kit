import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Moon, Sun, Feather, Sparkles } from 'lucide-react';
import { useTheme, THEME_PRESETS, ThemeId } from '../../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, currentThemeMeta } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'obsidian':
        return <Moon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'nordic-light':
        return <Sun className="w-3.5 h-3.5 text-sky-500" />;
      case 'warm-paper':
        return <Feather className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-700/60 dark:border-zinc-800 text-xs font-semibold text-zinc-200 dark:text-zinc-200 flex items-center gap-2 transition-all shadow-xs"
        title="Switch Theme"
      >
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline font-medium text-[11px]">{currentThemeMeta.name}</span>
        <div className="flex items-center gap-1 pl-1 border-l border-zinc-700/50">
          <div
            className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20"
            style={{ backgroundColor: currentThemeMeta.bgHex }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: currentThemeMeta.accentHex }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
            <span>Central Theme Palette</span>
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </div>

          <div className="space-y-1 pt-1">
            {THEME_PRESETS.map((preset) => {
              const isSelected = theme === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTheme(preset.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between gap-3 transition-all border ${
                    isSelected
                      ? 'bg-zinc-800/90 border-cyan-500/50 text-zinc-100 shadow-md'
                      : 'border-transparent hover:bg-zinc-800/40 text-zinc-300 hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                      {getThemeIcon(preset.id)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{preset.name}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          {preset.mode}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">{preset.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1 p-0.5 rounded bg-zinc-950 border border-zinc-800 mt-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.bgHex }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.cardHex }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accentHex }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
