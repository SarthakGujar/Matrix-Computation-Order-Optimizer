import React, { useState } from 'react';
import { MatrixInfo } from '../types.ts';
import { Link2, Info } from 'lucide-react';

interface MatrixChainVisualizerProps {
  matrices: MatrixInfo[];
}

export const MatrixChainVisualizer: React.FC<MatrixChainVisualizerProps> = ({ matrices }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#781628]" />
          <h3 className="text-sm font-bold text-[#781628]">Matrix Chain Sequence</h3>
        </div>
        <span className="text-xs text-[#6C635B] hidden sm:flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#781628]" />
          Adjacent matrices have matching inner dimensions
        </span>
      </div>

      {/* Horizontal scrollable chain */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center gap-2.5 min-w-max px-1">
          {matrices.map((mat, idx) => {
            const isHovered = hoveredIndex === mat.index;

            return (
              <React.Fragment key={mat.name}>
                {/* Matrix Card */}
                <div
                  id={`matrix-card-${mat.name}`}
                  onMouseEnter={() => setHoveredIndex(mat.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer w-38 sm:w-42 select-none ${
                    isHovered
                      ? 'bg-[#F8F4EC] border-[#781628] shadow-md -translate-y-0.5'
                      : 'bg-[#FFFDF9] border-[#EADBCE] hover:border-[#781628]'
                  }`}
                >
                  {/* Top wine stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl bg-[#781628]" />

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#781628] text-white">
                      {mat.name}
                    </span>
                    <span className="text-[10px] text-[#8C8278] font-bold">
                      Matrix #{mat.index}
                    </span>
                  </div>

                  {/* Dimensions display */}
                  <div className="text-center py-2 bg-[#F8F4EC] rounded-lg border border-[#EADBCE] shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-[#8C8278]">Dimensions</p>
                    <p className="text-sm font-black text-[#781628] font-mono mt-0.5">
                      {mat.rows} <span className="text-[#C8BEAC] font-normal">×</span> {mat.cols}
                    </p>
                  </div>

                  {/* Dimension indices */}
                  <div className="mt-2 text-[10px] font-mono text-[#6C635B] flex justify-between">
                    <span>Rows: <strong className="text-[#2A2421]">p{mat.index - 1}</strong></span>
                    <span>Cols: <strong className="text-[#2A2421]">p{mat.index}</strong></span>
                  </div>
                </div>

                {/* Multiplication Operator */}
                {idx < matrices.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#781628] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                      ×
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
