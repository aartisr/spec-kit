import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  Filter,
  Layers,
  ArrowRight,
  Code
} from 'lucide-react';
import { TaskBreakdown, TaskItem, TaskStatus, FeatureSpec } from '../../types/speckit';

interface TaskBoardProps {
  taskBreakdown: TaskBreakdown;
  spec: FeatureSpec;
  onSaveTasks: (updatedBreakdown: TaskBreakdown) => void;
  onTriggerAiGenerate: () => void;
  onSelectTaskForPrompt: (taskId: string, taskTitle: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  taskBreakdown,
  spec,
  onSaveTasks,
  onTriggerAiGenerate,
  onSelectTaskForPrompt,
}) => {
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');
  const [currentTasks, setCurrentTasks] = useState<TaskItem[]>(taskBreakdown.tasks);

  // New Task State
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState<TaskItem['phase']>('Phase 1: Setup');
  const [newDesc, setNewDesc] = useState('');
  const [newEst, setNewEst] = useState(2);
  const [newMappedReq, setNewMappedReq] = useState('');

  const phases = [
    'Phase 1: Setup',
    'Phase 2: Core Infrastructure',
    'Phase 3: Integration',
    'Phase 4: Polish & Testing',
  ] as const;

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = currentTasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
          }
        : t
    );
    setCurrentTasks(updated);
    onSaveTasks({ ...taskBreakdown, tasks: updated, lastUpdated: new Date().toISOString() });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `TASK-${100 + currentTasks.length + 1}`,
      title: newTitle,
      phase: newPhase,
      description: newDesc || 'Task implementation step.',
      status: 'todo',
      estimatedHours: newEst || 2,
      mappedRequirementId: newMappedReq || undefined,
      dependencies: [],
      targetAgentPromptSnippet: `Implement ${newTitle} adhering to ${newMappedReq || 'project specifications'}.`,
    };

    const updated = [...currentTasks, newTask];
    setCurrentTasks(updated);
    onSaveTasks({ ...taskBreakdown, tasks: updated, lastUpdated: new Date().toISOString() });

    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = currentTasks.filter((t) => t.id !== taskId);
    setCurrentTasks(updated);
    onSaveTasks({ ...taskBreakdown, tasks: updated, lastUpdated: new Date().toISOString() });
  };

  const filteredTasks = activePhaseFilter === 'all'
    ? currentTasks
    : currentTasks.filter((t) => t.phase === activePhaseFilter);

  const totalEstHours = filteredTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const doneCount = filteredTasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-zinc-100">Phased Task Board (tasks.md)</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Phased Execution
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Phased task breakdown mapped directly to Spec functional requirements and AI coding prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerAiGenerate}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Auto-Breakdown Tasks</span>
          </button>
        </div>
      </div>

      {/* Phase Filters & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActivePhaseFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activePhaseFilter === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            All Phases ({currentTasks.length})
          </button>
          {phases.map((phase) => {
            const count = currentTasks.filter((t) => t.phase === phase).length;
            return (
              <button
                key={phase}
                onClick={() => setActivePhaseFilter(phase)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activePhaseFilter === phase
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {phase} ({count})
              </button>
            );
          })}
        </div>

        {/* Phase Progress Badge */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
          <span>
            Done: <strong className="text-emerald-400">{doneCount}/{filteredTasks.length}</strong>
          </span>
          <span>•</span>
          <span>
            Total Estimate: <strong className="text-cyan-400">{totalEstHours} hrs</strong>
          </span>
        </div>
      </div>

      {/* Tasks Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Todo */}
        <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 min-h-[300px]">
          <div className="flex items-center justify-between font-bold text-xs text-zinc-300 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>To Do</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
              {filteredTasks.filter((t) => t.status === 'todo').length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks
              .filter((t) => t.status === 'todo')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                  onSelectForPrompt={onSelectTaskForPrompt}
                />
              ))}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 min-h-[300px]">
          <div className="flex items-center justify-between font-bold text-xs text-amber-300 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>In Progress</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {filteredTasks.filter((t) => t.status === 'in_progress' || t.status === 'blocked').length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks
              .filter((t) => t.status === 'in_progress' || t.status === 'blocked')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                  onSelectForPrompt={onSelectTaskForPrompt}
                />
              ))}
          </div>
        </div>

        {/* Column 3: Done */}
        <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 min-h-[300px]">
          <div className="flex items-center justify-between font-bold text-xs text-emerald-300 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {filteredTasks.filter((t) => t.status === 'done').length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks
              .filter((t) => t.status === 'done')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                  onSelectForPrompt={onSelectTaskForPrompt}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
        <h3 className="font-bold text-zinc-100 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Add Task to Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Task Title (e.g. Build Responsive Layout)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
          />
          <select
            value={newPhase}
            onChange={(e) => setNewPhase(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Task description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
          />
          <select
            value={newMappedReq}
            onChange={(e) => setNewMappedReq(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
          >
            <option value="">Map to Spec Req (Optional)</option>
            {spec.functionalRequirements.map((fr) => (
              <option key={fr.id} value={fr.id}>
                {fr.id}: {fr.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>
    </div>
  );
};

// Task Card Helper Component
interface TaskCardProps {
  task: TaskItem;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onSelectForPrompt: (taskId: string, title: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, onDelete, onSelectForPrompt }) => {
  return (
    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2.5 relative group hover:border-cyan-500/40 transition-all text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-cyan-400 text-[11px]">{task.id}</span>
        <div className="flex items-center gap-1">
          {task.mappedRequirementId && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              {task.mappedRequirementId}
            </span>
          )}
          <button onClick={() => onDelete(task.id)} className="text-zinc-600 hover:text-red-400 p-1">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="font-semibold text-zinc-200 leading-snug">{task.title}</div>
      <p className="text-[11px] text-zinc-400 line-clamp-2">{task.description}</p>

      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>{task.estimatedHours}h</span>
        </span>

        {/* Status Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectForPrompt(task.id, task.title)}
            className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium flex items-center gap-1"
            title="Generate AI Prompt for this Task"
          >
            <Bot className="w-3 h-3 text-purple-400" />
            <span>Prompt</span>
          </button>

          {task.status !== 'todo' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'todo')}
              className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
            >
              To Do
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
              className="px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium"
            >
              In Progress
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'done')}
              className="px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
