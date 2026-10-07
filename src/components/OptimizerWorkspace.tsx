import React, { useState, useEffect } from 'react';
import { MCMResult } from '../types.ts';
import { solveMCM } from '../lib/mcm.ts';
import { DimensionInput } from './DimensionInput.tsx';
import { MatrixChainVisualizer } from './MatrixChainVisualizer.tsx';
import { DPTable } from './DPTable.tsx';
import { SplitTable } from './SplitTable.tsx';
import { FormulaPanel } from './FormulaPanel.tsx';
import { StepByStepMultiplication } from './StepByStepMultiplication.tsx';
import { ComparisonView } from './ComparisonView.tsx';
import {
  Copy,
  Check,
  Layers,
  GitCompare,
  Table as TableIcon,
  TrendingDown,
} from 'lucide-react';

interface OptimizerWorkspaceProps {
  initialDimensions?: number[];
}

export const OptimizerWorkspace: React.FC<OptimizerWorkspaceProps> = ({
  initialDimensions = [10, 30, 5, 60],
}) => {
  const [dimensions, setDimensions] = useState<number[]>(initialDimensions);
  const [result, setResult] = useState<MCMResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Selected cell for inspecting exact DP formula calculation
  const [selectedCell, setSelectedCell] = useState<{ i: number; j: number } | null>(null);
  const [activeK, setActiveK] = useState<number | undefined>(undefined);

  // Simplified views: Only core problem-solving tabs
  const [activeTab, setActiveTab] = useState<'tables' | 'steps' | 'comparison'>('tables');
  const [copiedParens, setCopiedParens] = useState<boolean>(false);

  // Auto-solve on initial mount
  useEffect(() => {
    runOptimization();
  }, []);

  const runOptimization = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimensions }),
      });

      if (res.ok) {
        const data: MCMResult = await res.json();
        setResult(data);
        const lastStep = data.steps[data.steps.length - 1];
        if (lastStep) {
          setSelectedCell({ i: lastStep.i, j: lastStep.j });
          setActiveK(lastStep.bestK);
        }
      } else {
        const local = solveMCM(dimensions);
        setResult(local);
        const lastStep = local.steps[local.steps.length - 1];
        if (lastStep) {
          setSelectedCell({ i: lastStep.i, j: lastStep.j });
          setActiveK(lastStep.bestK);
        }
      }
    } catch (err) {
      const local = solveMCM(dimensions);
      setResult(local);
      const lastStep = local.steps[local.steps.length - 1];
      if (lastStep) {
        setSelectedCell({ i: lastStep.i, j: lastStep.j });
        setActiveK(lastStep.bestK);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cell click on DP table or Split table
  const handleSelectCell = (i: number, j: number) => {
    setSelectedCell({ i, j });
    if (!result) return;
    const matchingStep = result.steps.find((s) => s.i === i && s.j === j);
    if (matchingStep) {
      setActiveK(matchingStep.bestK);
    }
  };

  const handleCopyParens = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.parenthesization);
      setCopiedParens(true);
      setTimeout(() => setCopiedParens(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Currently inspected subproblem step
  const inspectedStep = React.useMemo(() => {
    if (!result || !selectedCell) return null;
    return result.steps.find((s) => s.i === selectedCell.i && s.j === selectedCell.j) || null;
  }, [result, selectedCell]);

  // Savings vs worst alternative grouping
  const savingsInfo = React.useMemo(() => {
    if (!result || !result.alternativeGroupings || result.alternativeGroupings.length === 0) return null;
    const maxCost = Math.max(...result.alternativeGroupings.map((g) => g.cost));
    const saved = maxCost - result.minimumCost;
    const pctSaved = maxCost > 0 ? Math.round((saved / maxCost) * 100) : 0;
    return { maxCost, saved, pctSaved };
  }, [result]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Dimension Input Component */}
      <DimensionInput
        dimensions={dimensions}
        onChangeDimensions={(newDims) => setDimensions(newDims)}
        onOptimize={runOptimization}
        isLoading={isLoading}
      />

      {/* 2. Visual Sequence Preview */}
      {result && <MatrixChainVisualizer matrices={result.matrices} />}

      {/* 3. Direct Solution Hero Card - Warm Cream & Eye-Catching Deep Wine */}
      {result && (
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#781628] p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#781628] text-white text-xs font-bold flex items-center gap-1 shadow-2xs">
                  <Check className="w-3 h-3 text-white" />
                  Optimal Parenthesization
                </span>
                <span className="text-xs text-[#6C635B]">
                  Chain of {result.matrixCount} Matrices • {dimensions.length} Dimensions
                </span>
              </div>

              {/* Optimal Expression */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#781628] tracking-tight bg-[#F8F4EC] px-4 py-2 rounded-xl border border-[#EADBCE]">
                  {result.parenthesization}
                </span>

                <button
                  id="copy-parenthesization-btn"
                  onClick={handleCopyParens}
                  title="Copy parenthesization brackets"
                  className="px-4 py-2 rounded-xl bg-[#781628] hover:bg-[#5E101E] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  {copiedParens ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span>Copy Order</span>
                    </>
                  )}
                </button>
              </div>

              {/* Savings vs Naive Order */}
              {savingsInfo && savingsInfo.saved > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#781628] bg-[#F8F4EC] px-3.5 py-1.5 rounded-xl border border-[#EADBCE] max-w-fit font-bold">
                  <TrendingDown className="w-4 h-4 text-[#781628] shrink-0" />
                  <span>
                    Saves <strong>{savingsInfo.saved.toLocaleString()} operations</strong> ({savingsInfo.pctSaved}% fewer calculations than worst order: {savingsInfo.maxCost.toLocaleString()} ops)
                  </span>
                </div>
              )}
            </div>

            {/* Minimum scalar multiplications badge */}
            <div className="bg-[#F8F4EC] border border-[#EADBCE] p-5 rounded-2xl text-left lg:text-right shrink-0">
              <span className="text-xs font-bold uppercase text-[#8C8278] block">
                Total Multiplications
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#781628] font-mono block mt-1">
                {result.minimumCost.toLocaleString()}
              </span>
              <span className="text-xs text-[#6C635B] block mt-0.5 font-medium">
                scalar operations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Streamlined Core Problem-Solving Tabs (Removed unnecessary features) */}
      {result && (
        <div className="space-y-5">
          {/* Clean 3-Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-[#EADBCE] pb-2 overflow-x-auto">
            <button
              id="tab-view-tables-btn"
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'tables'
                  ? 'bg-[#781628] text-white shadow-xs'
                  : 'bg-[#FFFDF9] text-[#6C635B] hover:text-[#781628] hover:bg-[#F8F4EC] border border-[#EADBCE]'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>DP Cost & Split Tables</span>
            </button>

            <button
              id="tab-view-steps-btn"
              onClick={() => setActiveTab('steps')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'steps'
                  ? 'bg-[#781628] text-white shadow-xs'
                  : 'bg-[#FFFDF9] text-[#6C635B] hover:text-[#781628] hover:bg-[#F8F4EC] border border-[#EADBCE]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Multiplication Steps</span>
            </button>

            <button
              id="tab-view-comparison-btn"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-[#781628] text-white shadow-xs'
                  : 'bg-[#FFFDF9] text-[#6C635B] hover:text-[#781628] hover:bg-[#F8F4EC] border border-[#EADBCE]'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Order Comparison</span>
            </button>
          </div>

          {/* TAB 1: DP Tables & Dynamic Formula Breakdown */}
          {activeTab === 'tables' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <DPTable
                  n={result.matrixCount}
                  costTable={result.costTable}
                  currentStep={inspectedStep}
                  selectedCell={selectedCell}
                  onSelectCell={handleSelectCell}
                  activeK={activeK}
                />

                <SplitTable
                  n={result.matrixCount}
                  splitTable={result.splitTable}
                  selectedCell={selectedCell}
                  onSelectCell={handleSelectCell}
                />
              </div>

              {/* Dynamic Formula Panel showing cell calculation */}
              <FormulaPanel
                step={inspectedStep}
                dimensions={dimensions}
                activeK={activeK}
                onSelectK={(k) => setActiveK(k)}
              />
            </div>
          )}

          {/* TAB 2: Sequential Step-by-Step Multiplication */}
          {activeTab === 'steps' && (
            <StepByStepMultiplication steps={result.executionSteps} />
          )}

          {/* TAB 3: Order Comparison */}
          {activeTab === 'comparison' && (
            <ComparisonView
              groupings={result.alternativeGroupings}
              minimumCost={result.minimumCost}
            />
          )}
        </div>
      )}
    </div>
  );
};
