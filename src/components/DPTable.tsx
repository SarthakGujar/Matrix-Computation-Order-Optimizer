import React from 'react';
import { DPStep } from '../types.ts';

interface DPTableProps {
  n: number;
  costTable: (number | null)[][];
  currentStep: DPStep | null;
  selectedCell: { i: number; j: number } | null;
  onSelectCell: (i: number, j: number) => void;
  activeK?: number;
}

export const DPTable: React.FC<DPTableProps> = ({
  n,
  costTable,
  currentStep,
  selectedCell,
  onSelectCell,
  activeK,
}) => {
  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#781628] text-white font-mono text-xs font-bold shadow-2xs">
            m[i][j]
          </span>
          <h3 className="text-sm font-bold text-[#781628]">Minimum Multiplication Cost Table</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6C635B]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#781628]" />
          <span className="text-[#781628] font-bold">Selected</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9CDBF] ml-2" />
          <span>Dependencies (m[i,k], m[k+1,j])</span>
        </div>
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
                  className={`p-2 text-center font-bold border border-[#EADBCE] min-w-[56px] ${
                    selectedCell?.j === j ? 'bg-[#F2ECE0] text-[#781628]' : 'bg-[#F8F4EC] text-[#4A423D]'
                  }`}
                >
                  A{j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, rIdx) => rIdx + 1).map((i) => (
              <tr key={i}>
                <th
                  className={`p-2 text-center font-bold border border-[#EADBCE] ${
                    selectedCell?.i === i ? 'bg-[#F2ECE0] text-[#781628]' : 'bg-[#F8F4EC] text-[#4A423D]'
                  }`}
                >
                  A{i}
                </th>
                {Array.from({ length: n }, (_, cIdx) => cIdx + 1).map((j) => {
                  if (j < i) {
                    // Lower triangle unused
                    return (
                      <td
                        key={j}
                        className="p-2 text-center text-[#C8BEAC] bg-[#FAF7F0] border border-[#EADBCE]"
                      >
                        —
                      </td>
                    );
                  }

                  const isDiagonal = i === j;
                  const isSelected = selectedCell?.i === i && selectedCell?.j === j;

                  // Active dependency highlighting if k is known
                  const isLeftDep =
                    currentStep && activeK !== undefined && i === currentStep.i && j === activeK;
                  const isRightDep =
                    currentStep && activeK !== undefined && i === activeK + 1 && j === currentStep.j;

                  const cellValue = costTable[i]?.[j];

                  return (
                    <td
                      key={j}
                      id={`dp-cost-cell-${i}-${j}`}
                      onClick={() => onSelectCell(i, j)}
                      title={`m[${i}][${j}]: Minimum multiplications for A${i}..A${j}`}
                      className={`p-2 text-center border font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#781628] text-white font-black shadow-xs scale-105 z-10'
                          : isLeftDep || isRightDep
                          ? 'bg-[#F2ECE0] text-[#781628] font-bold border-[#781628]/40'
                          : isDiagonal
                          ? 'bg-[#F8F4EC] text-[#8C8278]'
                          : cellValue !== null
                          ? 'bg-[#FFFDF9] text-[#2A2421] font-bold hover:bg-[#F8F4EC]'
                          : 'bg-[#FFFDF9] text-[#C8BEAC]'
                      }`}
                    >
                      {cellValue !== null ? cellValue.toLocaleString() : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-[#EADBCE] flex items-center justify-between text-[11px] text-[#6C635B]">
        <span>Click any cell to see its split evaluation</span>
        <span className="font-bold text-[#781628]">Target: m[1][{n}]</span>
      </div>
    </div>
  );
};
