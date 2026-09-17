import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Workflow,
  CheckSquare,
  ShieldCheck,
  Bot,
  Activity,
  Terminal,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import { ViewTab } from '../../types/speckit';

interface SidebarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  auditScore?: number;
  unmappedTaskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  auditScore = 94,
  unmappedTaskCount = 0,
}) => {
  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Workspace Hub',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'import',
      label: 'Import Project / Repo',
      icon: <FolderGit2 className="w-4 h-4 text-cyan-400" />,
      badge: 'Import',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 font-bold',
    },
    {
      id: 'spec',
      label: 'Feature Spec',
      icon: <FileText className="w-4 h-4" />,
      badge: 'spec.md',
    },
    {
      id: 'plan',
      label: 'Architecture Plan',
      icon: <Workflow className="w-4 h-4" />,
      badge: 'plan.md',
    },
    {
      id: 'tasks',
      label: 'Phased Task Board',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: unmappedTaskCount > 0 ? `${unmappedTaskCount} unmapped` : 'tasks.md',
      badgeColor: unmappedTaskCount > 0 ? 'text-amber-400 bg-amber-500/10' : undefined,
    },
    {
      id: 'constitution',
      label: 'Constitution Rules',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'rules',
    },
    {
      id: 'prompt',
      label: 'AI Agent Prompts',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'audit',
      label: 'Spec Quality Audit',
      icon: <Activity className="w-4 h-4" />,
      badge: `${auditScore}%`,
      badgeColor: auditScore >= 90 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10',
    },
    {
      id: 'export',
      label: 'CLI & Repo Exporter',
      icon: <Terminal className="w-4 h-4" />,
      badge: 'specify.sh',
    },
  ];

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/70 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto select-none">
      <div className="flex md:flex-col gap-1 w-full min-w-max md:min-w-0">
        <div className="hidden md:block px-3 py-2 text-[10px] font-extrabold tracking-wider text-zinc-400 uppercase">
          Spec Workflow Modules
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 text-cyan-300 border border-indigo-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-zinc-300'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 ${
                    item.badgeColor || 'text-zinc-400 bg-zinc-900'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div className="hidden md:block pt-4 border-t border-zinc-900 mt-6 px-3">
        <div className="rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spec-Driven AI</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Specify logic before generating code. Eliminate hallucination with structured specs.
          </p>
        </div>
      </div>
    </aside>
  );
};
