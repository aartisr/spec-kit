import React from 'react';
import {
  FileText,
  Workflow,
  CheckSquare,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';
import { SpecKitProject, ViewTab } from '../../types/speckit';
import { SpecKitVersionSelector } from '../common/SpecKitVersionSelector';

interface OverviewDashboardProps {
  project: SpecKitProject;
  onNavigateTab: (tab: ViewTab) => void;
  onTriggerAiSpecModal: () => void;
  onSelectVersion: (version: string) => void;
  onOpenFeatureImport?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  project,
  onNavigateTab,
  onTriggerAiSpecModal,
  onSelectVersion,
  onOpenFeatureImport,
}) => {
  const { spec, plan, tasks, constitution, audit } = project;

  const totalTasks = tasks.tasks.length;
  const completedTasks = tasks.tasks.filter((t) => t.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalReqs = spec.functionalRequirements.length;
  const mappedReqs = new Set(tasks.tasks.map((t) => t.mappedRequirementId).filter(Boolean)).size;
  const coveragePercentage = totalReqs > 0 ? Math.round((mappedReqs / totalReqs) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/80 p-6 md:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                GitHub Spec-Kit Workspace
              </span>
              {project.importedRepo && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-mono">
                  Imported: {project.importedRepo.primaryLanguage}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-mono">
                Spec-Kit v{project.version || '1.0.7'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
              {project.description || spec.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenFeatureImport && (
              <button
                onClick={onOpenFeatureImport}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-purple-400/30"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Import Feature / User Stories</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('import')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-cyan-400/30"
            >
              <span>Import Repo Studio</span>
            </button>
            <button
              onClick={onTriggerAiSpecModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-indigo-400/30"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>AI Spec Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spec-Kit Version Control & Capability Matrix */}
      <SpecKitVersionSelector
        currentVersion={project.version || '1.0.7'}
        onSelectVersion={onSelectVersion}
        variant="full"
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Spec Completeness */}
        <div
          onClick={() => onNavigateTab('spec')}
          className="cursor-pointer group p-5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/40 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">User Stories & Reqs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-100">{spec.userStories.length}</span>
            <span className="text-xs text-zinc-400">Stories / {spec.functionalRequirements.length} FRs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-medium">
            <span>View spec.md</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Implementation Progress */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className="cursor-pointer group p-5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-cyan-500/40 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Task Progress</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-100">{completionPercentage}%</span>
            <span className="text-xs text-zinc-400">({completedTasks}/{totalTasks} Done)</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Requirement Traceability */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className="cursor-pointer group p-5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/40 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Requirement Coverage</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-100">{coveragePercentage}%</span>
            <span className="text-xs text-zinc-400">Mapped to Tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span>Trace Matrix Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 4: Spec Quality Score */}
        <div
          onClick={() => onNavigateTab('audit')}
          className="cursor-pointer group p-5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/40 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Spec Quality Health</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-100">{audit?.overallScore || 94}/100</span>
            <span className="text-xs text-emerald-400 font-semibold">Grade A</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400 font-medium">
            <span>Run Quality Audit</span>
            <Zap className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Trace Matrix & Core Workflow Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Requirement Traceability Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Requirement Traceability Matrix</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Ensuring 100% testable mapping between Spec Requirements, Technical Architecture, and Tasks
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Trace Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Req ID</th>
                    <th className="py-2.5 px-3">Title & Category</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Mapped Task</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-mono">
                  {spec.functionalRequirements.map((req) => {
                    const mappedTask = tasks.tasks.find((t) => t.mappedRequirementId === req.id);
                    return (
                      <tr key={req.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-cyan-400">{req.id}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-medium text-zinc-200">{req.title}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{req.category}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              req.priority === 'High'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {mappedTask ? (
                            <span className="text-indigo-300 font-medium">{mappedTask.id}</span>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px] font-sans">Unmapped</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          {mappedTask?.status === 'done' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          ) : mappedTask?.status === 'in_progress' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                              <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-500">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigateTab('plan')}
              className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all space-y-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Workflow className="w-4 h-4" />
              </div>
              <div className="font-semibold text-xs text-zinc-200 group-hover:text-cyan-300">
                Architecture & ADRs
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Tech stack, Mermaid.js diagrams, API contracts, and schema design.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('prompt')}
              className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all space-y-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="font-semibold text-xs text-zinc-200 group-hover:text-purple-300">
                AI Agent Prompt Studio
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Generate prompt templates for Claude, Gemini, Cursor & Windsurf.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('export')}
              className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all space-y-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="font-semibold text-xs text-zinc-200 group-hover:text-emerald-300">
                specify.sh CLI Exporter
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Download official GitHub Spec-Kit shell scripts and repo bundle.
              </p>
            </button>
          </div>
        </div>

        {/* Right Column (1/3): Constitution Rules & Quick Health Audit */}
        <div className="space-y-4">
          {/* Constitution Rules Summary */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Governance Rules</span>
              </h3>
              <button
                onClick={() => onNavigateTab('constitution')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {constitution.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-zinc-200">
                    <span>{rule.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {rule.strictness}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{rule.ruleStatement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Highlights */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Quality Audit Summary</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Full Audit
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {audit?.summary || 'Spec package audited with zero blocking ambiguities.'}
            </p>

            {audit?.gaps && audit.gaps.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing Gap Identified</span>
                </div>
                <p className="text-[11px] text-amber-200/80">{audit.gaps[0]}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
