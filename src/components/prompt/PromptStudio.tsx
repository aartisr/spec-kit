import React, { useState } from 'react';
import {
  Bot,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Send,
  Layers,
  Code,
  Zap,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { SpecKitProject } from '../../types/speckit';

interface PromptStudioProps {
  project: SpecKitProject;
  initialTaskId?: string;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({
  project,
  initialTaskId,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('Claude 3.7 Sonnet / Cursor');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || project.tasks.tasks[0]?.id || 'TASK-101');
  const [isCopied, setIsCopied] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  // AI Simulation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSimulationOutput, setAiSimulationOutput] = useState<string | null>(null);

  const selectedTask = project.tasks.tasks.find((t) => t.id === selectedTaskId) || project.tasks.tasks[0];

  const agentFrameworks = [
    { name: 'Claude 3.7 Sonnet / Cursor', desc: 'Optimized for Cursor & Anthropic Sonnet' },
    { name: 'Gemini 3.1 Pro / Flash', desc: 'Optimized for Google AI Studio & Gemini CLI' },
    { name: 'GitHub Copilot Workspace', desc: 'Optimized for Copilot spec task execution' },
    { name: 'Windsurf Cascade', desc: 'Optimized for Codeium Windsurf flow' },
    { name: 'Aider / Terminal CLI', desc: 'Optimized for git-integrated command line agents' },
  ];

  // Generated Master Prompt String
  const masterPrompt = `You are a Senior Principal AI Software Engineer assigned to implement task ${selectedTask?.id || 'TASK'} for project "${project.name}".

=== 1. GOVERNING CONSTITUTION & RULES ===
${project.constitution.rules.map((r) => `- [${r.strictness}] ${r.title}: ${r.ruleStatement}`).join('\n')}

=== 2. FEATURE SPECIFICATION CONTEXT ===
Project Summary: ${project.spec.summary}
Functional Requirements:
${project.spec.functionalRequirements.map((f) => `- ${f.id} (${f.category}): ${f.title} - ${f.description}`).join('\n')}

=== 3. ARCHITECTURE & TECH STACK ===
${project.plan.techStack.map((t) => `- ${t.category}: ${t.technology} (${t.justification})`).join('\n')}

=== 4. ACTIVE TARGET TASK TO IMPLEMENT ===
Task ID: ${selectedTask?.id || 'TASK-101'}
Task Title: ${selectedTask?.title || 'Implementation'}
Phase: ${selectedTask?.phase || 'Phase 1'}
Task Description: ${selectedTask?.description || 'Build task according to spec.'}
Mapped Spec Requirement: ${selectedTask?.mappedRequirementId || 'FR-101'}
${customNotes ? `\n=== ADDITIONAL INSTRUCTIONS ===\n${customNotes}\n` : ''}
=== EXECUTION DIRECTIVES ===
1. Write clean, modular, highly maintainable TypeScript code.
2. Adhere strictly to the project constitution rules.
3. Ensure zero hallucinated APIs and complete error handling.
4. Verify task completion against acceptance criteria before ending your session.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunAiSimulation = async () => {
    setIsGenerating(true);
    setAiSimulationOutput(null);

    try {
      const res = await fetch('/api/prompt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAgent: selectedAgent,
          taskId: selectedTask?.id,
          taskTitle: selectedTask?.title,
          specSummary: project.spec.summary,
          constitution: project.constitution.rules.map((r) => r.ruleStatement).join('; '),
          techStack: project.plan.techStack.map((t) => t.technology),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiSimulationOutput(data.promptText || 'AI Agent prompt simulated successfully.');
      } else {
        setAiSimulationOutput('Error: ' + (data.error || 'Failed to simulate AI prompt.'));
      }
    } catch (err: any) {
      setAiSimulationOutput('Error communicating with Gemini server proxy.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-zinc-100">AI Coding Agent Prompt Studio</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Agent Workflows
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Generate context-rich, hallucination-free master prompts for Claude, Gemini, Cursor, Copilot, or Windsurf.
          </p>
        </div>

        <button
          onClick={handleCopyPrompt}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{isCopied ? 'Copied Master Prompt!' : 'Copy Master Prompt'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Agent & Task Selectors */}
        <div className="space-y-6">
          {/* Target Agent Selector */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
            <h3 className="font-bold text-zinc-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Select AI Coding Agent</span>
            </h3>

            <div className="space-y-2">
              {agentFrameworks.map((agent) => (
                <button
                  key={agent.name}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedAgent === agent.name
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-200 font-semibold shadow-xs'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs">{agent.name}</div>
                  <div className="text-[10px] opacity-75 font-normal">{agent.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Task Selector */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
            <h3 className="font-bold text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Target Task to Prompt</span>
            </h3>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono focus:outline-none"
            >
              {project.tasks.tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.id}: {task.title} ({task.phase})
                </option>
              ))}
            </select>

            {selectedTask && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-xs">
                <div className="font-semibold text-zinc-200">{selectedTask.title}</div>
                <p className="text-[11px] text-zinc-400">{selectedTask.description}</p>
                {selectedTask.mappedRequirementId && (
                  <div className="text-[10px] text-indigo-400 font-mono pt-1">
                    Mapped Req: {selectedTask.mappedRequirementId}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Additional Prompt Focus (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Focus on offline IndexedDB sync boundary conditions..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Formatted Prompt Output & Gemini Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formatted Prompt Terminal */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-purple-400 font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>Master Prompt Output ({selectedAgent})</span>
              </span>

              <button
                onClick={handleRunAiSimulation}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isGenerating ? 'Simulating AI Response...' : 'Simulate Gemini Response'}</span>
              </button>
            </div>

            <textarea
              rows={18}
              readOnly
              value={masterPrompt}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 text-purple-300 font-mono text-xs focus:outline-none leading-relaxed"
            />
          </div>

          {/* AI Simulation Output Window */}
          {aiSimulationOutput && (
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-purple-500/30 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Gemini 3.8 Flash AI Simulation Execution Output</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {aiSimulationOutput}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
