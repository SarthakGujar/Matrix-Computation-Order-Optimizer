import React from 'react';
import { Layers, CheckCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADBCE] shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-lg bg-[#781628] flex items-center justify-center text-white font-black text-base shadow-xs">
            M×
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-[#781628]">
                Matrix Chain Solver
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F2ECE0] text-[#781628] border border-[#E0D4C3]">
                <CheckCircle className="w-3 h-3 text-[#781628]" />
                Dynamic Programming
              </span>
            </div>
            <p className="text-xs text-[#6C635B] hidden sm:block">
              Find the fastest parenthesization order to minimize scalar multiplications
            </p>
          </div>
        </div>

        {/* Algorithm Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F4EC] border border-[#EADBCE] text-[#4A423D] font-medium">
            <span className="text-[#8C8278]">Complexity:</span>
            <strong className="text-[#781628] font-mono">O(n³)</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#781628] text-white font-bold shadow-xs">
            <span>Optimal Order Guaranteed</span>
          </div>
        </div>
      </div>
    </header>
  );
};
