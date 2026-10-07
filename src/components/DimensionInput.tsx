import React, { useState, useEffect } from 'react';
import {
  Shuffle,
  Plus,
  Minus,
  AlertCircle,
  Play,
} from 'lucide-react';
import { validateDimensions } from '../lib/mcm.ts';

interface DimensionInputProps {
  dimensions: number[];
  onChangeDimensions: (newDims: number[]) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export const DimensionInput: React.FC<DimensionInputProps> = ({
  dimensions,
  onChangeDimensions,
  onOptimize,
  isLoading,
}) => {
  const [textInput, setTextInput] = useState<string>(dimensions.join(', '));
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setTextInput(dimensions.join(', '));
    setParseError(null);
  }, [dimensions]);

  const matrixCount = dimensions.length - 1;
  const validation = validateDimensions(dimensions);

  const handleTextChange = (value: string) => {
    setTextInput(value);
    const parsed = value
      .split(/[\s,]+/)
      .filter((s) => s.trim().length > 0)
      .map((s) => Number(s));

    if (parsed.some(isNaN)) {
      setParseError('Please enter positive numbers separated by commas or spaces.');
      return;
    }

    if (parsed.length < 3) {
      setParseError('At least 3 numbers are required (defines 2 or more matrices).');
      return;
    }

    setParseError(null);
    onChangeDimensions(parsed);
  };

  const handleAdjustCount = (delta: number) => {
    const newCount = Math.max(2, Math.min(20, matrixCount + delta));
    const currentDims = [...dimensions];

    if (newCount + 1 > currentDims.length) {
      const samplePool = [10, 20, 25, 30, 40, 50, 60];
      while (currentDims.length < newCount + 1) {
        currentDims.push(samplePool[Math.floor(Math.random() * samplePool.length)]);
      }
    } else if (newCount + 1 < currentDims.length) {
      currentDims.splice(newCount + 1);
    }

    onChangeDimensions(currentDims);
  };

  const handleLoadPreset = (dims: number[]) => {
    onChangeDimensions([...dims]);
  };

  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 matrices
    const pool = [10, 15, 20, 25, 30, 40, 50];
    const newDims: number[] = [];
    for (let i = 0; i <= count; i++) {
      newDims.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    onChangeDimensions(newDims);
  };

  const handleDimensionValueChange = (index: number, valStr: string) => {
    const parsed = parseInt(valStr, 10);
    const updated = [...dimensions];
    updated[index] = isNaN(parsed) ? 1 : Math.max(1, parsed);
    onChangeDimensions(updated);
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Eye-catching Heading & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EADBCE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#781628] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#781628] tracking-tight">
              Enter Matrix Dimensions
            </h2>
          </div>
          <p className="text-xs text-[#6C635B] mt-1">
            Specify dimensions <span className="font-mono text-[#781628] font-bold">[p₀, p₁, ..., pₙ]</span>.
            Matrix <strong>Aᵢ</strong> has dimension <strong>pᵢ₋₁ × pᵢ</strong>.
          </p>
        </div>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#8C8278] mr-1 hidden sm:inline">Try examples:</span>
          <button
            onClick={() => handleLoadPreset([10, 30, 5, 60])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F8F4EC] hover:bg-[#F2ECE0] text-[#781628] border border-[#EADBCE] transition"
          >
            3 Matrices (Classic)
          </button>
          <button
            onClick={() => handleLoadPreset([40, 20, 30, 10, 30])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F8F4EC] hover:bg-[#F2ECE0] text-[#781628] border border-[#EADBCE] transition"
          >
            4 Matrices (CLRS)
          </button>
          <button
            onClick={() => handleLoadPreset([30, 35, 15, 5, 10, 20, 25])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F8F4EC] hover:bg-[#F2ECE0] text-[#781628] border border-[#EADBCE] transition"
          >
            6 Matrices (Deep)
          </button>
          <button
            onClick={handleRandomize}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FFFDF9] hover:bg-[#F8F4EC] text-[#4A423D] border border-[#EADBCE] flex items-center gap-1 transition"
            title="Generate random chain"
          >
            <Shuffle className="w-3 h-3 text-[#781628]" />
            Random
          </button>
        </div>
      </div>

      {/* Main Dimension Input + Calculate CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Comma-separated array input */}
        <div className="lg:col-span-8 space-y-1.5">
          <label className="block text-xs font-bold text-[#4A423D]">
            Dimensions Sequence (comma-separated):
          </label>
          <div className="relative">
            <input
              type="text"
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g. 10, 30, 5, 60"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition focus:outline-none focus:ring-2 ${
                parseError || !validation.isValid
                  ? 'border-[#781628] bg-[#FDF2F4] text-[#781628] focus:ring-[#781628]/20'
                  : 'border-[#D9CDBF] bg-[#FFFDF9] text-[#2A2421] focus:border-[#781628] focus:ring-[#781628]/15'
              }`}
            />
          </div>
          {(parseError || validation.error) ? (
            <p className="text-xs text-[#781628] flex items-center gap-1 mt-1 font-bold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#781628]" />
              {parseError || validation.error}
            </p>
          ) : (
            <p className="text-[11px] text-[#8C8278]">
              Defines {matrixCount} matrices: A₁ is {dimensions[0]}×{dimensions[1]}, A₂ is {dimensions[1]}×{dimensions[2]}...
            </p>
          )}
        </div>

        {/* Matrix Count Stepper & Solid Deep Wine CTA */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
          <div className="flex items-center justify-between px-3 py-2 bg-[#F8F4EC] rounded-xl border border-[#EADBCE]">
            <span className="text-xs font-medium text-[#6C635B]">Matrix count:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustCount(-1)}
                disabled={matrixCount <= 2}
                className="w-7 h-7 rounded-md bg-[#FFFDF9] border border-[#D9CDBF] text-[#4A423D] hover:bg-[#F2ECE0] disabled:opacity-40 flex items-center justify-center font-bold text-sm transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-[#781628] font-mono w-6 text-center">
                {matrixCount}
              </span>
              <button
                type="button"
                onClick={() => handleAdjustCount(1)}
                disabled={matrixCount >= 20}
                className="w-7 h-7 rounded-md bg-[#FFFDF9] border border-[#D9CDBF] text-[#4A423D] hover:bg-[#F2ECE0] disabled:opacity-40 flex items-center justify-center font-bold text-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            id="solve-mcm-button"
            type="button"
            onClick={onOptimize}
            disabled={isLoading || !validation.isValid || Boolean(parseError)}
            className="w-full bg-[#781628] hover:bg-[#5E101E] active:bg-[#4E0D19] disabled:opacity-40 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Play className="w-4 h-4 fill-white text-white" />
            )}
            <span>Calculate Optimal Order</span>
          </button>
        </div>
      </div>

      {/* Individual dimension edit pills */}
      <div className="pt-3 border-t border-[#F2ECE0]">
        <div className="text-[11px] font-bold text-[#8C8278] mb-2 uppercase tracking-wider">
          Individual Matrix Dimensions:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dimensions.map((dim, idx) => (
            <div
              key={idx}
              className="flex items-center bg-[#F8F4EC] border border-[#EADBCE] rounded-lg px-2 py-1 gap-1.5 shadow-2xs"
            >
              <span className="text-[11px] font-mono text-[#8C8278]">p{idx} =</span>
              <input
                type="number"
                min="1"
                max="10000"
                value={dim}
                onChange={(e) => handleDimensionValueChange(idx, e.target.value)}
                className="w-14 text-center font-mono font-bold text-xs bg-[#FFFDF9] border border-[#D9CDBF] rounded px-1 py-0.5 text-[#781628] focus:outline-none focus:border-[#781628]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
