import React, { useState } from 'react';
import { ExecutionStep } from '../types.ts';
import { Layers } from 'lucide-react';

interface StepByStepMultiplicationProps {
  steps: ExecutionStep[];
}

export const StepByStepMultiplication: React.FC<StepByStepMultiplicationProps> = ({ steps }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  if (!steps || steps.length === 0) return null;

  const activeStep = steps[activeStepIndex];

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#EADBCE] p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#781628]" />
          <h3 className="text-sm font-bold text-[#781628]">Sequential Multiplication Steps</h3>
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {steps.map((step, idx) => (
            <button
              key={idx}
              id={`exec-step-tab-${step.stepNumber}`}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                activeStepIndex === idx
                  ? 'bg-[#781628] text-white shadow-xs'
                  : 'bg-[#F8F4EC] text-[#6C635B] hover:text-[#781628] hover:bg-[#F2ECE0] border border-[#EADBCE]'
              }`}
            >
              Step {step.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Details */}
      <div className="bg-[#F8F4EC] rounded-xl p-4 sm:p-5 border border-[#EADBCE] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#781628] text-white text-xs font-bold flex items-center justify-center">
              {activeStep.stepNumber}
            </span>
            <span className="text-sm font-bold text-[#781628] font-mono">
              {activeStep.operation}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6C635B]">Operations in this step:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#781628] text-white font-bold font-mono">
              +{activeStep.cost.toLocaleString()} ops
            </span>
          </div>
        </div>

        {/* Visual Multiplication Equation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center py-2">
          {/* Left Operand */}
          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#EADBCE] text-center shadow-2xs">
            <span className="text-[10px] text-[#8C8278] font-bold uppercase block">Left Matrix</span>
            <span className="font-mono font-bold text-sm text-[#2A2421] block mt-0.5">
              {activeStep.leftOperand}
            </span>
            <span className="font-mono text-xs text-[#781628] bg-[#F8F4EC] px-2.5 py-0.5 rounded-full inline-block mt-1 font-bold border border-[#EADBCE]">
              {activeStep.leftRows} × {activeStep.leftCols}
            </span>
          </div>

          {/* Multiplication Operator */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="w-7 h-7 rounded-full bg-[#781628] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              ×
            </span>
            <span className="text-[10px] text-[#8C8278] mt-1 font-mono font-medium">
              inner match: {activeStep.leftCols}
            </span>
          </div>

          {/* Right Operand */}
          <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#EADBCE] text-center shadow-2xs">
            <span className="text-[10px] text-[#8C8278] font-bold uppercase block">Right Matrix</span>
            <span className="font-mono font-bold text-sm text-[#2A2421] block mt-0.5">
              {activeStep.rightOperand}
            </span>
            <span className="font-mono text-xs text-[#781628] bg-[#F8F4EC] px-2.5 py-0.5 rounded-full inline-block mt-1 font-bold border border-[#EADBCE]">
              {activeStep.rightRows} × {activeStep.rightCols}
            </span>
          </div>
        </div>

        {/* Result & Arithmetic */}
        <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#EADBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[#6C635B]">Creates intermediate matrix: </span>
            <strong className="text-[#781628] font-mono">{activeStep.resultMatrix}</strong>{' '}
            <span className="font-mono text-[#2A2421] font-bold">
              ({activeStep.resultRows} × {activeStep.resultCols})
            </span>
          </div>
          <div className="font-mono text-xs text-[#4A423D]">
            Calculation: {activeStep.leftRows} × {activeStep.leftCols} × {activeStep.rightCols} ={' '}
            <strong className="text-[#781628] font-black">{activeStep.cost.toLocaleString()} ops</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
