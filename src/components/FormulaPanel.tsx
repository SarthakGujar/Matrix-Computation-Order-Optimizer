import React from 'react';
import { DPStep, SplitEvaluation } from '../types.ts';
import { Calculator, Check, Sparkles } from 'lucide-react';

interface FormulaPanelProps {
  step: DPStep | null;
  dimensions: number[];
  activeK?: number;
  onSelectK?: (k: number) => void;
}

export const FormulaPanel: React.FC<FormulaPanelProps> = ({
  step,
  dimensions,
  activeK,
  onSelectK,
}) => {
  if (!step) {
    return (
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-6 shadow-xs text-center text-[#6C635B]">
        <Calculator className="w-7 h-7 text-[#781628]/50 mx-auto mb-2" />
        <p className="text-sm font-bold text-[#781628]">Select any cell in the DP table</p>
        <p className="text-xs text-[#6C635B] mt-1">
          Click any cell above to see its exact formula calculation and evaluated split candidates.
        </p>
      </div>
    );
  }

  const { i, j, length, splits, bestK, minCost, explanation } = step;

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F8F4EC] text-[#781628]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#781628]">
                Computing Subchain <span className="font-mono text-[#781628]">A{i}..A{j}</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[#781628] font-mono text-xs font-bold border border-[#EADBCE]">
                m[{i}][{j}]
              </span>
            </div>
            <p className="text-xs text-[#6C635B]">
              Chain length L = {length} matrices • {splits.length} candidate split{splits.length === 1 ? '' : 's'} evaluated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6C635B]">Best Split:</span>
          <span className="px-2.5 py-1 rounded-md bg-[#781628] text-white font-mono font-bold shadow-2xs">
            k = {bestK}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#F8F4EC] text-[#781628] border border-[#EADBCE] font-mono font-bold">
            Cost = {minCost.toLocaleString()} ops
          </span>
        </div>
      </div>

      {/* Recurrence Equation Card */}
      <div className="p-3 bg-[#F8F4EC] rounded-xl border border-[#EADBCE] font-mono text-xs text-[#4A423D]">
        <span className="text-[#8C8278] block text-[11px] uppercase font-bold mb-1">
          Dynamic Programming Recurrence:
        </span>
        <div className="text-xs font-bold text-[#781628]">
          m[{i}][{j}] = min_{'{'}{i} ≤ k &lt; {j}{'}'} [ m[{i}][k] + m[k+1][{j}] + (p{i-1} × p_k × p{j}) ]
        </div>
        <div className="text-[11px] text-[#8C8278] mt-1">
          Dimensions: p{i-1} = {dimensions[i-1]}, p{j} = {dimensions[j]}
        </div>
      </div>

      {/* Candidate Splits Table */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#781628] block">
          Candidate Split Points (k from {i} to {j - 1}):
        </span>

        <div className="grid grid-cols-1 gap-2">
          {splits.map((s) => {
            const isWinner = s.k === bestK;
            const isSelected = activeK === s.k;

            return (
              <div
                key={s.k}
                onClick={() => onSelectK && onSelectK(s.k)}
                className={`p-3 rounded-xl border text-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isWinner
                    ? 'bg-[#F8F4EC] border-[#781628] shadow-2xs'
                    : isSelected
                    ? 'bg-[#F2ECE0] border-[#781628]/40'
                    : 'bg-[#FFFDF9] border-[#EADBCE] hover:bg-[#F8F4EC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${
                      isWinner
                        ? 'bg-[#781628] text-white'
                        : 'bg-[#EADBCE] text-[#4A423D]'
                    }`}
                  >
                    k={s.k}
                  </span>
                  <div>
                    <span className="font-bold text-[#2A2421]">
                      (A{i}..A{s.k}) × (A{s.k + 1}..A{j})
                    </span>
                    <p className="font-mono text-[11px] text-[#6C635B]">
                      {s.leftCost.toLocaleString()} + {s.rightCost.toLocaleString()} + ({dimensions[i-1]} × {dimensions[s.k]} × {dimensions[j]} = {s.multCost.toLocaleString()})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-[#781628]">
                    = {s.totalCost.toLocaleString()} ops
                  </span>
                  {isWinner && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#781628] bg-[#FFFDF9] px-2 py-0.5 rounded border border-[#EADBCE]">
                      <Check className="w-3 h-3 text-[#781628]" /> Minimum
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subproblem explanation */}
      <div className="p-3 rounded-xl bg-[#F8F4EC] border border-[#EADBCE] flex items-start gap-2.5 text-xs text-[#4A423D]">
        <Sparkles className="w-4 h-4 text-[#781628] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#781628]">Subproblem Insight: </span>
          {explanation}
        </div>
      </div>
    </div>
  );
};
