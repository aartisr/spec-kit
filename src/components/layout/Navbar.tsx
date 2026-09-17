import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Download,
  Moon,
  Sun,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers,
  FileJson,
  RotateCcw,
  FolderGit2
} from 'lucide-react';
import { SpecKitProject } from '../../types/speckit';
import { generateSpecKitZip, downloadBlob } from '../../lib/export';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { SpecKitVersionSelector } from '../common/SpecKitVersionSelector';

interface NavbarProps {
  projects: SpecKitProject[];
  activeProject: SpecKitProject;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onOpenImportStudio?: () => void;
  onOpenQuickSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetSampleData: () => void;
  onSelectVersion: (version: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onOpenImportStudio,
  onOpenQuickSearch,
  isDarkMode,
  onToggleTheme,
  onResetSampleData,
  onSelectVersion,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateSpecKitZip(activeProject);
      const filename = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec-kit.zip`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/10 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100">Spec-Kit Studio</span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">GitHub Spec-Kit Layer</p>
          </div>
        </div>

        {/* Spec-Kit Version Selector Component */}
        <SpecKitVersionSelector
          currentVersion={activeProject.version || '1.0.7'}
          onSelectVersion={onSelectVersion}
          variant="compact"
        />

        <div className="h-5 w-px bg-zinc-800 mx-0.5 hidden md:block" />

        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-xs text-zinc-200 transition-colors max-w-[220px]"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate font-medium">{activeProject.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-auto" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Workspaces ({projects.length})
              </div>
              <div className="max-h-60 overflow-y-auto my-1">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-800 transition-colors ${
                      proj.id === activeProject.id ? 'bg-indigo-500/10 text-indigo-300 font-semibold' : 'text-zinc-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{proj.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{proj.description}</div>
                    </div>
                    {proj.id === activeProject.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-1 px-2 space-y-1 mt-1">
                {onOpenImportStudio && (
                  <button
                    onClick={() => {
                      onOpenImportStudio();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Import Existing Repo / Project</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onCreateProject();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Blank Spec Workspace</span>
                </button>
                <button
                  onClick={() => {
                    onResetSampleData();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Template</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Trigger Bar */}
      <button
        onClick={onOpenQuickSearch}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-400 transition-all w-64 justify-between group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          <span>Quick search or AI command...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Offline Sync Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Offline Ready</span>
        </div>

        {/* Export Repo Button */}
        <button
          onClick={handleExportZip}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors disabled:opacity-50"
          title="Export complete GitHub Spec-Kit .zip repository"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{isExporting ? 'Packaging...' : 'Export .spec-kit'}</span>
        </button>

        {/* Centralized World-Class Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  );
};
