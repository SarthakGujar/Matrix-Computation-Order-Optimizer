import React from 'react';
import { AlternativeGrouping } from '../types.ts';
import { GitCompare, Award } from 'lucide-react';

interface ComparisonViewProps {
  groupings: AlternativeGrouping[];
  minimumCost: number;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ groupings, minimumCost }) => {
  const maxCost = Math.max(...groupings.map((g) => g.cost));

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#781628]" />
          <h3 className="text-sm font-bold text-[#781628]">Parenthesization Order Comparison</h3>
        </div>
        <span className="text-xs text-[#6C635B]">
          Demonstrating why finding the optimal order matters
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {groupings.map((group, idx) => {
          const costDiff = group.cost - minimumCost;
          const pctWorse = minimumCost > 0 ? ((costDiff / minimumCost) * 100).toFixed(0) : '0';
          const barWidth = maxCost > 0 ? (group.cost / maxCost) * 100 : 100;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                group.isOptimal
                  ? 'bg-[#F8F4EC] border-[#781628] shadow-xs'
                  : 'bg-[#FFFDF9] border-[#EADBCE]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {group.isOptimal ? (
                    <Award className="w-4 h-4 text-[#781628] shrink-0" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C8BEAC] shrink-0" />
                  )}
                  <span className="font-bold text-sm text-[#2A2421]">{group.name}</span>
                  {group.isOptimal ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#781628] text-white font-bold text-[11px]">
                      Optimal Choice
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2ECE0] text-[#781628] font-bold text-[11px] border border-[#EADBCE]">
                      +{costDiff.toLocaleString()} ops ({pctWorse}% more operations)
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm font-extrabold text-right">
                  <span className={group.isOptimal ? 'text-[#781628]' : 'text-[#6C635B]'}>
                    {group.cost.toLocaleString()}
                  </span>
                  <span className="text-[#8C8278] text-xs font-normal"> scalar operations</span>
                </div>
              </div>

              {/* Expression */}
              <div className="font-mono text-xs text-[#2A2421] bg-[#FFFDF9] px-3 py-1.5 rounded-lg border border-[#EADBCE] break-all mb-2.5">
                {group.parenthesization}
              </div>

              {/* Relative Cost Bar */}
              <div className="w-full bg-[#EADBCE]/50 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    group.isOptimal ? 'bg-[#781628]' : 'bg-[#A89E90]'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
