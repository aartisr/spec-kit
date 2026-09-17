import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Trash2,
  Sparkles,
  Code,
  Eye,
  Database,
  Globe,
  Layers,
  Save,
  FileCheck,
  Cpu
} from 'lucide-react';
import { ImplementationPlan, TechStackItem, ApiContract, DataSchema, ADR } from '../../types/speckit';
import { MermaidViewer } from '../common/MermaidViewer';

interface PlanEditorProps {
  plan: ImplementationPlan;
  onSavePlan: (updatedPlan: ImplementationPlan) => void;
  onTriggerAiGenerate: () => void;
  isDarkMode?: boolean;
}

export const PlanEditor: React.FC<PlanEditorProps> = ({
  plan,
  onSavePlan,
  onTriggerAiGenerate,
  isDarkMode = true,
}) => {
  const [activeView, setActiveView] = useState<'visual' | 'diagram' | 'markdown'>('visual');
  const [currentPlan, setCurrentPlan] = useState<ImplementationPlan>(plan);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // New Tech Stack state
  const [newTechCategory, setNewTechCategory] = useState('');
  const [newTechName, setNewTechName] = useState('');
  const [newTechJust, setNewTechJust] = useState('');

  // New API Contract state
  const [newApiMethod, setNewApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [newApiPath, setNewApiPath] = useState('');
  const [newApiDesc, setNewApiDesc] = useState('');

  // New ADR state
  const [newAdrTitle, setNewAdrTitle] = useState('');
  const [newAdrContext, setNewAdrContext] = useState('');
  const [newAdrDecision, setNewAdrDecision] = useState('');

  const handleUpdateField = (field: keyof ImplementationPlan, value: any) => {
    setCurrentPlan((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    }));
    setHasUnsaved(true);
  };

  const handleAddTechStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    const newItem: TechStackItem = {
      category: newTechCategory || 'General',
      technology: newTechName,
      justification: newTechJust || 'Selected for optimal performance',
    };

    handleUpdateField('techStack', [...currentPlan.techStack, newItem]);
    setNewTechName('');
    setNewTechJust('');
  };

  const handleRemoveTechStack = (idx: number) => {
    const updated = currentPlan.techStack.filter((_, i) => i !== idx);
    handleUpdateField('techStack', updated);
  };

  const handleAddApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiPath.trim()) return;

    const newApi: ApiContract = {
      id: `API-${currentPlan.apiContracts.length + 1}`,
      method: newApiMethod,
      path: newApiPath,
      description: newApiDesc || 'Endpoint contract',
    };

    handleUpdateField('apiContracts', [...currentPlan.apiContracts, newApi]);
    setNewApiPath('');
    setNewApiDesc('');
  };

  const handleAddAdr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdrTitle.trim()) return;

    const newAdr: ADR = {
      id: `ADR-${100 + currentPlan.adrs.length + 1}`,
      title: newAdrTitle,
      status: 'Accepted',
      context: newAdrContext || 'Architectural decision requirement',
      decision: newAdrDecision || 'Accepted implementation decision',
      consequences: 'Improves maintainability and clarity',
      date: new Date().toISOString().split('T')[0],
    };

    handleUpdateField('adrs', [...currentPlan.adrs, newAdr]);
    setNewAdrTitle('');
    setNewAdrContext('');
    setNewAdrDecision('');
  };

  const handleSave = () => {
    onSavePlan(currentPlan);
    setHasUnsaved(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-100">Architecture & Plan (plan.md)</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Technical Strategy
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tech stack selection, Mermaid.js architectural diagrams, API contracts, and ADR records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center text-xs">
            <button
              onClick={() => setActiveView('visual')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeView === 'visual' ? 'bg-zinc-800 text-cyan-300 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Design Studio</span>
            </button>
            <button
              onClick={() => setActiveView('diagram')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeView === 'diagram' ? 'bg-zinc-800 text-cyan-300 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Mermaid Diagram</span>
            </button>
            <button
              onClick={() => setActiveView('markdown')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeView === 'markdown' ? 'bg-zinc-800 text-cyan-300 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>plan.md Source</span>
            </button>
          </div>

          <button
            onClick={onTriggerAiGenerate}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generate Plan</span>
          </button>

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
            <span>{hasUnsaved ? 'Save Plan' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {activeView === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Plan Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tech Stack Matrix */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Tech Stack Selection</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPlan.techStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 relative group hover:border-cyan-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
                        {item.category}
                      </span>
                      <button
                        onClick={() => handleRemoveTechStack(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-bold text-zinc-100">{item.technology}</div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{item.justification}</p>
                  </div>
                ))}
              </div>

              {/* Add Tech Stack Item */}
              <form onSubmit={handleAddTechStack} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-semibold text-zinc-200">Add Tech Stack Component</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Category (e.g. State)"
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Technology (e.g. TanStack Query)"
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Justification"
                    value={newTechJust}
                    onChange={(e) => setNewTechJust(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tech Stack</span>
                </button>
              </form>
            </div>

            {/* API Contracts Table */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>API Contracts & Endpoints</span>
              </h3>

              <div className="space-y-2">
                {currentPlan.apiContracts.map((api) => (
                  <div
                    key={api.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          api.method === 'GET'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : api.method === 'POST'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {api.method}
                      </span>
                      <span className="font-bold text-zinc-100">{api.path}</span>
                    </div>
                    <p className="text-zinc-400">{api.description}</p>
                  </div>
                ))}
              </div>

              {/* Add API Form */}
              <form onSubmit={handleAddApi} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <select
                    value={newApiMethod}
                    onChange={(e) => setNewApiMethod(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    placeholder="/api/route"
                    value={newApiPath}
                    onChange={(e) => setNewApiPath(e.target.value)}
                    className="sm:col-span-3 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Endpoint contract description..."
                  value={newApiDesc}
                  onChange={(e) => setNewApiDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add API Endpoint</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (1/3): Architectural Decision Records (ADRs) & Diagram Preview */}
          <div className="space-y-6">
            {/* Quick Mermaid Preview */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  Architecture Flowchart
                </h3>
                <button
                  onClick={() => setActiveView('diagram')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Expand Diagram
                </button>
              </div>
              <MermaidViewer chart={currentPlan.mermaidDiagram} isDarkMode={isDarkMode} />
            </div>

            {/* ADR Records */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>Architectural Decisions (ADRs)</span>
              </h3>

              <div className="space-y-3">
                {currentPlan.adrs.map((adr) => (
                  <div key={adr.id} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-zinc-100">
                      <span>
                        <span className="text-purple-400 font-mono mr-1.5">{adr.id}</span>
                        {adr.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                        {adr.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      <strong>Context:</strong> {adr.context}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      <strong>Decision:</strong> {adr.decision}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add ADR Form */}
              <form onSubmit={handleAddAdr} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-semibold text-zinc-200">Record New ADR</div>
                <input
                  type="text"
                  placeholder="ADR Title (e.g. Express API Proxy)"
                  value={newAdrTitle}
                  onChange={(e) => setNewAdrTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Decision Context"
                  value={newAdrContext}
                  onChange={(e) => setNewAdrContext(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Decision Statement"
                  value={newAdrDecision}
                  onChange={(e) => setNewAdrDecision(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Decision</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : activeView === 'diagram' ? (
        /* Expanded Mermaid Diagram Editor */
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <h3 className="text-sm font-bold text-zinc-100">Live Mermaid.js Architecture Diagram</h3>
            <MermaidViewer chart={currentPlan.mermaidDiagram} isDarkMode={isDarkMode} />
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-zinc-400">Mermaid Definition Code</label>
            <textarea
              rows={10}
              value={currentPlan.mermaidDiagram}
              onChange={(e) => handleUpdateField('mermaidDiagram', e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      ) : (
        /* Markdown Raw Plan View */
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Raw plan.md Source Output</span>
            <span>GitHub Spec-Kit Architecture Standard</span>
          </div>
          <textarea
            rows={22}
            value={currentPlan.markdown}
            onChange={(e) => handleUpdateField('markdown', e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-300 font-mono text-xs focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
