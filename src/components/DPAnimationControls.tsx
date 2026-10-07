import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Activity,
} from 'lucide-react';

interface DPAnimationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentLength?: number;
  totalLength?: number;
}

export const DPAnimationControls: React.FC<DPAnimationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  currentStepIndex,
  totalSteps,
  speed,
  onSpeedChange,
  currentLength,
  totalLength,
}) => {
  const speeds = [0.5, 1, 2, 4];
  const progressPercent = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
      {/* Top status line: Progress bar + Step counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-black" />
          <span className="text-xs font-bold text-black">Algorithm Walkthrough</span>
          {currentLength && totalLength && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold border border-neutral-300">
              Chain Length L = {currentLength} of {totalLength}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Subproblem:</span>
          <strong className="text-black font-mono">
            {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
          </strong>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-black h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset to beginning"
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0}
            title="Previous subproblem"
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 disabled:opacity-40 text-neutral-700 border border-neutral-300 transition cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause auto-play' : 'Play algorithm step-by-step'}
            className="px-4 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Next subproblem"
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 disabled:opacity-40 text-neutral-700 border border-neutral-300 transition cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
          <span className="text-[10px] text-neutral-500 px-1 font-medium">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                speed === s
                  ? 'bg-black text-white font-bold shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
