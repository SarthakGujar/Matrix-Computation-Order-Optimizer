import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#EADBCE] bg-[#FFFDF9] text-[#6C635B] text-xs py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#4A423D]">
          <div className="w-5 h-5 rounded-md bg-[#781628] flex items-center justify-center text-[10px] font-bold text-white">
            M
          </div>
          <span className="font-bold text-[#781628]">Matrix Chain Solver</span>
          <span className="text-[#C8BEAC]">•</span>
          <span>Dynamic Programming Matrix Optimization</span>
        </div>

        <div className="text-[#4A423D] font-mono text-xs flex items-center gap-2">
          <span className="text-[#8C8278]">Recurrence:</span>
          <span className="px-2 py-0.5 rounded bg-[#F8F4EC] border border-[#EADBCE] text-[#781628] font-bold">
            m[i, j] = min(m[i, k] + m[k+1, j] + pᵢ₋₁ · pₖ · pⱼ)
          </span>
        </div>
      </div>
    </footer>
  );
};
