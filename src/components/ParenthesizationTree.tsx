import React, { useState } from 'react';
import { ParenthesizationTreeNode } from '../types.ts';
import { GitFork } from 'lucide-react';

interface ParenthesizationTreeProps {
  tree: ParenthesizationTreeNode;
}

export const ParenthesizationTree: React.FC<ParenthesizationTreeProps> = ({ tree }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Recursive Tree Node Renderer
  const renderNode = (node: ParenthesizationTreeNode, depth: number = 0) => {
    const isHovered = hoveredNodeId === node.id;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Current Node Box */}
        <div
          id={`tree-node-${node.id}`}
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
          className={`p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer shadow-2xs select-none min-w-[110px] ${
            node.isLeaf
              ? 'bg-neutral-50 border-neutral-300 text-black'
              : isHovered
              ? 'bg-neutral-100 border-black text-black shadow-xs -translate-y-0.5'
              : 'bg-white border-neutral-200 text-black'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 font-bold font-mono text-xs">
            {node.isLeaf ? (
              <span className="px-1.5 py-0.2 rounded bg-black text-white text-[10px]">
                Leaf
              </span>
            ) : (
              <GitFork className="w-3.5 h-3.5 text-black" />
            )}
            <span>{node.label}</span>
          </div>

          {/* Matrix Dimensions */}
          <div className="text-[11px] font-mono text-neutral-500 mt-1">
            {node.rows} × {node.cols}
          </div>

          {/* Cost at this node */}
          {!node.isLeaf && (
            <div className="mt-1 pt-1 border-t border-neutral-200 text-[10px] font-mono text-neutral-800 font-semibold">
              +{node.cost.toLocaleString()} ops
            </div>
          )}
        </div>

        {/* Children Branches */}
        {!node.isLeaf && node.left && node.right && (
          <div className="flex flex-col items-center w-full">
            {/* Stem line */}
            <div className="w-[2px] h-4 bg-neutral-300" />

            {/* Horizontal connector line */}
            <div className="relative flex justify-center w-full pt-0.5">
              <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-neutral-300" />
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="flex flex-col items-center">
                  <div className="w-[2px] h-3 bg-neutral-300" />
                  {renderNode(node.left, depth + 1)}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[2px] h-3 bg-neutral-300" />
                  {renderNode(node.right, depth + 1)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-black" />
          <h3 className="text-sm font-bold text-black">Parenthesization Expression Tree</h3>
        </div>
        <span className="text-xs text-neutral-500">
          Leaves represent base matrices; branches show intermediate multiplication pairs
        </span>
      </div>

      <div className="overflow-x-auto py-4">
        <div className="min-w-max flex justify-center px-4">
          {renderNode(tree)}
        </div>
      </div>
    </div>
  );
};
