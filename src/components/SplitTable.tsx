import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SplitTableProps {
  n: number;
  splitTable: (number | null)[][];
  selectedCell: { i: number; j: number } | null;
  onSelectCell: (i: number, j: number) => void;
}

export const SplitTable: React.FC<SplitTableProps> = ({
  n,
  splitTable,
  selectedCell,
  onSelectCell,
}) => {
  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#781628] text-white font-mono text-xs font-bold shadow-2xs">
            s[i][j]
          </span>
          <h3 className="text-sm font-bold text-[#781628]">Optimal Split Index Table</h3>
        </div>
        <span className="text-xs text-[#6C635B]">
          Optimal split index <strong className="text-[#781628] font-mono">k</strong> for Aᵢ..Aⱼ
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs select-none">
          <thead>
            <tr>
              <th className="p-2 text-center text-[#8C8278] bg-[#F8F4EC] border border-[#EADBCE] font-bold">
                i \ j
              </th>
              {Array.from({ length: n }, (_, idx) => idx + 1).map((j) => (
                <th
                  key={j}
                  className="p-2 text-center font-bold bg-[#F8F4EC] text-[#4A423D] border border-[#EADBCE] min-w-[50px]"
                >
                  A{j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, rIdx) => rIdx + 1).map((i) => (
              <tr key={i}>
                <th className="p-2 text-center font-bold bg-[#F8F4EC] text-[#4A423D] border border-[#EADBCE]">
                  A{i}
                </th>
                {Array.from({ length: n }, (_, cIdx) => cIdx + 1).map((j) => {
                  if (j <= i) {
                    return (
                      <td
                        key={j}
                        className="p-2 text-center text-[#C8BEAC] bg-[#FAF7F0] border border-[#EADBCE]"
                      >
                        —
                      </td>
                    );
                  }

                  const isSelected = selectedCell?.i === i && selectedCell?.j === j;
                  const splitVal = splitTable[i]?.[j];

                  return (
                    <td
                      key={j}
                      id={`dp-split-cell-${i}-${j}`}
                      onClick={() => onSelectCell(i, j)}
                      title={`s[${i}][${j}] = ${splitVal}: Split subchain between A${splitVal} and A${
                        splitVal ? splitVal + 1 : ''
                      }`}
                      className={`p-2 text-center border font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#781628] text-white border-[#781628] scale-105 z-10 shadow-xs'
                          : splitVal !== null
                          ? 'bg-[#FFFDF9] text-[#781628] border-[#EADBCE] hover:bg-[#F8F4EC]'
                          : 'bg-[#FFFDF9] text-[#C8BEAC] border-[#EADBCE]'
                      }`}
                    >
                      {splitVal !== null ? `k=${splitVal}` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-[#EADBCE] flex items-center justify-between text-[11px] text-[#6C635B]">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#781628]" />
          Used to reconstruct the optimal parentheses brackets
        </span>
        <span className="font-bold text-[#781628]">
          Root split: s[1][{n}] = {splitTable[1]?.[n] ?? '—'}
        </span>
      </div>
    </div>
  );
};
