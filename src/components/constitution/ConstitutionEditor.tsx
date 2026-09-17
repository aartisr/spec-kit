import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Code,
  Eye,
  Save,
  CheckCircle2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ProjectConstitution, ConstitutionRule } from '../../types/speckit';

interface ConstitutionEditorProps {
  constitution: ProjectConstitution;
  onSaveConstitution: (updatedConstitution: ProjectConstitution) => void;
}

export const ConstitutionEditor: React.FC<ConstitutionEditorProps> = ({
  constitution,
  onSaveConstitution,
}) => {
  const [activeView, setActiveView] = useState<'visual' | 'markdown'>('visual');
  const [currentConst, setCurrentConst] = useState<ProjectConstitution>(constitution);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // New Rule Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ConstitutionRule['category']>('Coding Standard');
  const [newDesc, setNewDesc] = useState('');
  const [newStatement, setNewStatement] = useState('');
  const [newStrictness, setNewStrictness] = useState<ConstitutionRule['strictness']>('Mandatory');

  const handleUpdateField = (field: keyof ProjectConstitution, value: any) => {
    setCurrentConst((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    }));
    setHasUnsaved(true);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStatement.trim()) return;

    const newRule: ConstitutionRule = {
      id: `RULE-${10 + currentConst.rules.length + 1}`,
      title: newTitle,
      category: newCategory,
      description: newDesc || newTitle,
      ruleStatement: newStatement,
      strictness: newStrictness,
    };

    handleUpdateField('rules', [...currentConst.rules, newRule]);
    setNewTitle('');
    setNewDesc('');
    setNewStatement('');
  };

  const handleRemoveRule = (id: string) => {
    const updated = currentConst.rules.filter((r) => r.id !== id);
    handleUpdateField('rules', updated);
  };

  const handleApplyPreset = (presetName: string) => {
    let presetRules: ConstitutionRule[] = [];
    if (presetName === 'security') {
      presetRules = [
        {
          id: 'RULE-SEC-01',
          title: 'Zero Direct API Key Exposure',
          category: 'Security',
          description: 'All AI model and secret keys must be kept strictly on server side.',
          ruleStatement: 'Never send raw secrets or API keys to browser clients.',
          strictness: 'Mandatory',
        },
        {
          id: 'RULE-SEC-02',
          title: 'Input Validation & Sanitization',
          category: 'Security',
          description: 'All client payloads must be validated against schema before execution.',
          ruleStatement: 'Sanitize all raw strings to prevent XSS and injection.',
          strictness: 'Mandatory',
        },
      ];
    } else if (presetName === 'quality') {
      presetRules = [
        {
          id: 'RULE-QA-01',
          title: '100% Requirement Traceability',
          category: 'Testing & QA',
          description: 'Every functional requirement in spec.md must map to an actionable task.',
          ruleStatement: 'Unmapped requirements trigger audit flags.',
          strictness: 'Mandatory',
        },
        {
          id: 'RULE-QA-02',
          title: 'Strict TypeScript Typings',
          category: 'Coding Standard',
          description: 'No explicit any usage in application logic.',
          ruleStatement: 'Define explicit interfaces and type guards.',
          strictness: 'Mandatory',
        },
      ];
    }

    handleUpdateField('rules', [...currentConst.rules, ...presetRules]);
  };

  const handleSave = () => {
    onSaveConstitution(currentConst);
    setHasUnsaved(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-zinc-100">Project Constitution (constitution.md)</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Governance & Rules
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Governing rules, coding standards, quality thresholds, and security policies for AI agents and developers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center text-xs">
            <button
              onClick={() => setActiveView('visual')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeView === 'visual' ? 'bg-zinc-800 text-cyan-300 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Rules</span>
            </button>
            <button
              onClick={() => setActiveView('markdown')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeView === 'markdown' ? 'bg-zinc-800 text-cyan-300 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>constitution.md Source</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={!hasUnsaved}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasUnsaved
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsaved ? 'Save Rules' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {activeView === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Rules Column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-bold text-zinc-100">Governing Rules ({currentConst.rules.length})</h3>

              <div className="space-y-3">
                {currentConst.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2 relative group hover:border-emerald-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">{rule.id}</span>
                        <span className="font-semibold text-zinc-100">{rule.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {rule.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            rule.strictness === 'Mandatory'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {rule.strictness}
                        </span>
                        <button
                          onClick={() => handleRemoveRule(rule.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-zinc-300">{rule.description}</p>
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono text-[11px]">
                      <strong>Statement:</strong> {rule.ruleStatement}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Rule Form */}
              <form onSubmit={handleAddRule} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                <div className="font-semibold text-zinc-200">Add New Constitution Rule</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Rule Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  >
                    <option value="Coding Standard">Coding Standard</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Testing & QA">Testing & QA</option>
                    <option value="Security">Security</option>
                    <option value="Git & Release">Git & Release</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Rule description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="Strict rule statement for AI agents..."
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none font-mono"
                />

                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rule</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (1/3): Presets */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
              <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Quick Rule Presets</span>
              </h3>
              <p className="text-zinc-400">
                Inject standard GitHub Spec-Kit rule modules for security and code quality.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleApplyPreset('security')}
                  className="w-full p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-zinc-200 group-hover:text-cyan-300">
                      Security & Secret Protection
                    </div>
                    <div className="text-[10px] text-zinc-400">Zero API Key client exposure rule</div>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => handleApplyPreset('quality')}
                  className="w-full p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-zinc-200 group-hover:text-emerald-300">
                      Traceability & Typing
                    </div>
                    <div className="text-[10px] text-zinc-400">100% requirement task mapping</div>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Markdown Raw Constitution View */
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Raw constitution.md Source Output</span>
            <span>GitHub Spec-Kit Governance Standard</span>
          </div>
          <textarea
            rows={22}
            value={currentConst.markdown}
            onChange={(e) => handleUpdateField('markdown', e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-300 font-mono text-xs focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
