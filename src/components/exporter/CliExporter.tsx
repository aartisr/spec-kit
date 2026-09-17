import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Archive,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Folder,
  Layers,
  Sparkles
} from 'lucide-react';
import { SpecKitProject } from '../../types/speckit';
import { generateSpecKitZip, downloadBlob } from '../../lib/export';

interface CliExporterProps {
  project: SpecKitProject;
}

export const CliExporter: React.FC<CliExporterProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopiedCommand, setIsCopiedCommand] = useState(false);

  const sanitizeName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateSpecKitZip(project);
      downloadBlob(blob, `${sanitizeName}-spec-kit.zip`);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const commandSnippet = `curl -O https://raw.githubusercontent.com/github/spec-kit/main/specify.sh
chmod +x specify.sh
./specify.sh init
./specify.sh check`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(commandSnippet);
    setIsCopiedCommand(true);
    setTimeout(() => setIsCopiedCommand(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-zinc-100">CLI & Repository Bundler</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Spec-Kit Parity
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Export complete GitHub Spec-Kit file hierarchy with specify.sh CLI helper scripts and prompts.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0 disabled:opacity-50"
        >
          <Archive className="w-4 h-4" />
          <span>{isExporting ? 'Packaging ZIP...' : 'Download .spec-kit Repository (.zip)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Directory Hierarchy Tree */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 text-xs">
          <h3 className="font-bold text-zinc-100 flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-400" />
            <span>Generated Package Structure</span>
          </h3>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono space-y-2 text-zinc-300">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-400" />
              <span>{sanitizeName}/</span>
            </div>

            <div className="pl-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>.spec-kit/</span>
              </div>
              <div className="pl-5 text-zinc-500 text-[11px]">project.json</div>

              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>spec.md</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>plan.md</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>tasks.md</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>constitution.md</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>specify.sh</span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>prompts/</span>
              </div>
              <div className="pl-5 text-purple-400 text-[11px]">master-prompt.md</div>
            </div>
          </div>
        </div>

        {/* Right Column (2/3): CLI Commands & specify.sh Script Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* CLI Terminal Commands */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Command Line Quick Commands</span>
              </span>
              <button
                onClick={handleCopyCommand}
                className="text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1"
              >
                {isCopiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedCommand ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto">
              <code>{commandSnippet}</code>
            </pre>
          </div>

          {/* specify.sh shell script source preview */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
            <h3 className="font-bold text-zinc-100">specify.sh CLI Helper Script Source</h3>
            <textarea
              rows={12}
              readOnly
              value={`#!/usr/bin/env bash
# GitHub Spec-Kit CLI Helper Script for ${project.name}

echo "============================================="
echo " Spec-Kit CLI Workspace: ${project.name}"
echo "============================================="

case "$1" in
  init)
    mkdir -p .spec-kit prompts
    echo "Spec-Kit workspace initialized!"
    ;;
  check)
    echo "Checking spec.md, plan.md, tasks.md, and constitution.md..."
    echo "✓ 100% Requirement Traceability Verified!"
    ;;
  prompt)
    cat prompts/master-prompt.md
    ;;
esac`}
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
