import {
  MatrixInfo,
  SplitEvaluation,
  DPStep,
  ParenthesizationTreeNode,
  ExecutionStep,
  AlternativeGrouping,
  MCMResult,
} from '../types.ts';

const MATRIX_COLORS = [
  '#18181b', // zinc-900
  '#27272a', // zinc-800
  '#3f3f46', // zinc-700
  '#52525b', // zinc-600
  '#71717a', // zinc-500
  '#18181b', // zinc-900
  '#27272a', // zinc-800
  '#3f3f46', // zinc-700
  '#52525b', // zinc-600
  '#09090b', // zinc-950
];

export function validateDimensions(dimensions: number[]): {
  isValid: boolean;
  error?: string;
} {
  if (!Array.isArray(dimensions)) {
    return { isValid: false, error: 'Dimensions must be an array.' };
  }
  if (dimensions.length < 3) {
    return {
      isValid: false,
      error: 'At least 2 matrices are required (minimum 3 dimension values p0, p1, p2).',
    };
  }
  if (dimensions.length > 51) {
    return {
      isValid: false,
      error: 'A maximum of 50 matrices (51 dimensions) is supported for optimal visualization.',
    };
  }
  for (let idx = 0; idx < dimensions.length; idx++) {
    const val = dimensions[idx];
    if (typeof val !== 'number' || isNaN(val)) {
      return { isValid: false, error: `Dimension at index ${idx} is not a valid number.` };
    }
    if (!Number.isInteger(val)) {
      return { isValid: false, error: `Dimension at index ${idx} (${val}) must be an integer.` };
    }
    if (val <= 0) {
      return {
        isValid: false,
        error: `Dimension at index ${idx} (${val}) must be strictly positive (> 0).`,
      };
    }
    if (val > 100000) {
      return {
        isValid: false,
        error: `Dimension at index ${idx} (${val}) exceeds 100,000. Keep dimensions reasonable to avoid numeric overflow.`,
      };
    }
  }
  return { isValid: true };
}

export function buildMatrices(dimensions: number[]): MatrixInfo[] {
  const n = dimensions.length - 1;
  const matrices: MatrixInfo[] = [];
  for (let i = 1; i <= n; i++) {
    matrices.push({
      index: i,
      name: `A${i}`,
      rows: dimensions[i - 1],
      cols: dimensions[i],
      color: MATRIX_COLORS[(i - 1) % MATRIX_COLORS.length],
    });
  }
  return matrices;
}

/**
 * Solve Matrix Chain Multiplication using Dynamic Programming
 * Computes:
 * - DP cost table m[i][j] (1-indexed)
 * - Split table s[i][j] (1-indexed)
 * - Reconstructs optimal parenthesization
 * - Step-by-step history for visualization
 */
export function solveMCM(dimensions: number[]): MCMResult {
  const n = dimensions.length - 1;
  const matrices = buildMatrices(dimensions);

  // m[i][j] stores minimum scalar multiplications for Ai...Aj
  // 1-indexed table: size (n + 1) x (n + 1)
  const m: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(null)
  );

  // s[i][j] stores index k that achieved minimum cost
  const s: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(null)
  );

  // Base case: cost of multiplying 1 matrix is 0
  for (let i = 1; i <= n; i++) {
    m[i][i] = 0;
  }

  const steps: DPStep[] = [];
  let stepIndex = 0;

  // L is chain length
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;

      const splits: SplitEvaluation[] = [];
      let bestK = i;
      let minCost = Infinity;

      // Try every possible split position k from i to j-1
      for (let k = i; k < j; k++) {
        const leftCost = m[i][k]!;
        const rightCost = m[k + 1][j]!;
        // Dimension p[i-1] * p[k] * p[j]
        const multCost = dimensions[i - 1] * dimensions[k] * dimensions[j];
        const totalCost = leftCost + rightCost + multCost;

        if (totalCost < minCost) {
          minCost = totalCost;
          bestK = k;
        }

        splits.push({
          k,
          leftCost,
          rightCost,
          multCost,
          totalCost,
          formula: `m[${i}][${k}] (${leftCost}) + m[${k + 1}][${j}] (${rightCost}) + (${dimensions[i - 1]} × ${dimensions[k]} × ${dimensions[j]} = ${multCost}) = ${totalCost}`,
          isBest: false,
        });
      }

      // Mark the chosen best split
      for (const sp of splits) {
        if (sp.k === bestK) {
          sp.isBest = true;
        }
      }

      m[i][j] = minCost;
      s[i][j] = bestK;

      stepIndex++;
      steps.push({
        stepIndex,
        length: L,
        i,
        j,
        splits,
        bestK,
        minCost,
        explanation: `Subchain A${i}..A${j} (length ${L}): Tested ${splits.length} split ${splits.length === 1 ? 'position' : 'positions'}. Best split at k = ${bestK} gives minimum cost of ${minCost.toLocaleString()} scalar multiplications.`,
        beginnerExplanation: `To multiply matrices from A${i} to A${j}, we split at matrix A${bestK}. This division requires ${minCost.toLocaleString()} total multiplications, which is cheaper than any other split position.`,
      });
    }
  }

  const optimalParens = reconstructParenthesization(s, 1, n);
  const tree = buildTree(s, dimensions, 1, n);
  const executionSteps = buildExecutionSteps(tree, dimensions);
  const alternativeGroupings = generateAlternativeGroupings(dimensions, m[1][n]!, optimalParens);

  return {
    matrixCount: n,
    dimensions,
    matrices,
    minimumCost: m[1][n]!,
    parenthesization: optimalParens,
    costTable: m,
    splitTable: s,
    steps,
    tree,
    executionSteps,
    alternativeGroupings,
    timeComplexity: 'O(n³)',
    spaceComplexity: 'O(n²)',
  };
}

/**
 * Reconstruct optimal parenthesization string recursively from split table s
 */
export function reconstructParenthesization(
  s: (number | null)[][],
  i: number,
  j: number
): string {
  if (i === j) {
    return `A${i}`;
  }
  const k = s[i][j];
  if (k === null) return `A${i}`;
  const left = reconstructParenthesization(s, i, k);
  const right = reconstructParenthesization(s, k + 1, j);
  return `(${left} × ${right})`;
}

/**
 * Build parenthesization tree for visual rendering
 */
function buildTree(
  s: (number | null)[][],
  dimensions: number[],
  i: number,
  j: number,
  id = 'root'
): ParenthesizationTreeNode {
  if (i === j) {
    return {
      id: `leaf-${i}`,
      label: `A${i}`,
      rows: dimensions[i - 1],
      cols: dimensions[i],
      cost: 0,
      isLeaf: true,
    };
  }

  const k = s[i][j]!;
  const left = buildTree(s, dimensions, i, k, `${id}-L`);
  const right = buildTree(s, dimensions, k + 1, j, `${id}-R`);
  const multCost = dimensions[i - 1] * dimensions[k] * dimensions[j];

  return {
    id,
    label: `A${i}..A${j}`,
    rows: dimensions[i - 1],
    cols: dimensions[j],
    cost: multCost,
    left,
    right,
    isLeaf: false,
  };
}

/**
 * Build post-order step-by-step matrix multiplication actions
 */
function buildExecutionSteps(
  tree: ParenthesizationTreeNode,
  dimensions: number[]
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let stepCount = 1;
  let cumulative = 0;

  function traverse(node: ParenthesizationTreeNode): string {
    if (node.isLeaf) {
      return node.label;
    }
    const leftStr = traverse(node.left!);
    const rightStr = traverse(node.right!);

    const p = node.left!.rows;
    const q = node.left!.cols;
    const r = node.right!.cols;
    const cost = p * q * r;
    cumulative += cost;

    const opStr = `(${leftStr} × ${rightStr})`;
    steps.push({
      stepNumber: stepCount++,
      operation: opStr,
      leftOperand: leftStr,
      rightOperand: rightStr,
      p,
      q,
      r,
      cost,
      resultDims: [p, r],
      cumulativeCost: cumulative,
    });

    return opStr;
  }

  traverse(tree);
  return steps;
}

/**
 * Generate standard alternative parenthesizations to demonstrate why order matters
 */
function generateAlternativeGroupings(
  dims: number[],
  optimalCost: number,
  optimalStr: string
): AlternativeGrouping[] {
  const n = dims.length - 1;
  const groupings: AlternativeGrouping[] = [];

  // 1. Optimal Grouping
  groupings.push({
    name: 'Dynamic Programming (Optimal)',
    parenthesization: optimalStr,
    cost: optimalCost,
    isOptimal: true,
    diffFromOptimal: 0,
    description: 'Calculated via dynamic programming bottom-up optimal substructure.',
  });

  // 2. Left-to-right associative: ((...((A1 x A2) x A3)...) x An)
  let leftCost = 0;
  let currRows = dims[0];
  let currCols = dims[1];
  let leftStr = 'A1';

  for (let i = 2; i <= n; i++) {
    const nextCols = dims[i];
    leftCost += currRows * currCols * nextCols;
    leftStr = `(${leftStr} × A${i})`;
    currCols = nextCols;
  }

  if (leftStr !== optimalStr) {
    groupings.push({
      name: 'Left-to-Right Greedy / Sequential',
      parenthesization: leftStr,
      cost: leftCost,
      isOptimal: leftCost === optimalCost,
      diffFromOptimal: leftCost - optimalCost,
      description: 'Standard left-associative order multiplying pairs as they appear.',
    });
  }

  // 3. Right-to-left associative: (A1 x (A2 x (...(An-1 x An))))
  let rightCost = 0;
  let rRows = dims[n - 1];
  let rCols = dims[n];
  let rightStr = `(A${n - 1} × A${n})`;
  rightCost += dims[n - 2] * rRows * rCols;
  rRows = dims[n - 2];

  for (let i = n - 2; i >= 1; i--) {
    if (i === n - 2) continue;
    const prevRows = dims[i - 1];
    rightCost += prevRows * dims[i] * dims[n];
    rightStr = `(A${i} × ${rightStr})`;
  }

  // Calculate full right-to-left accurately
  let rtlCost = 0;
  function evalRTL(start: number, end: number): { rows: number; cols: number; cost: number; str: string } {
    if (start === end) {
      return { rows: dims[start - 1], cols: dims[start], cost: 0, str: `A${start}` };
    }
    const right = evalRTL(start + 1, end);
    const cost = dims[start - 1] * dims[start] * right.cols + right.cost;
    return {
      rows: dims[start - 1],
      cols: right.cols,
      cost,
      str: `(A${start} × ${right.str})`,
    };
  }

  const rtl = evalRTL(1, n);
  if (rtl.str !== optimalStr && rtl.str !== leftStr) {
    groupings.push({
      name: 'Right-to-Left Associative',
      parenthesization: rtl.str,
      cost: rtl.cost,
      isOptimal: rtl.cost === optimalCost,
      diffFromOptimal: rtl.cost - optimalCost,
      description: 'Right-associative order evaluating from right to left.',
    });
  }

  // 4. Balanced / Divide and Conquer Split: divide at Math.floor((start + end) / 2)
  function evalBalanced(start: number, end: number): { rows: number; cols: number; cost: number; str: string } {
    if (start === end) {
      return { rows: dims[start - 1], cols: dims[start], cost: 0, str: `A${start}` };
    }
    const mid = Math.floor((start + end) / 2);
    const left = evalBalanced(start, mid);
    const right = evalBalanced(mid + 1, end);
    const cost = left.rows * left.cols * right.cols + left.cost + right.cost;
    return {
      rows: left.rows,
      cols: right.cols,
      cost,
      str: `(${left.str} × ${right.str})`,
    };
  }

  const balanced = evalBalanced(1, n);
  if (
    balanced.str !== optimalStr &&
    balanced.str !== leftStr &&
    balanced.str !== rtl.str
  ) {
    groupings.push({
      name: 'Balanced Binary Split',
      parenthesization: balanced.str,
      cost: balanced.cost,
      isOptimal: balanced.cost === optimalCost,
      diffFromOptimal: balanced.cost - optimalCost,
      description: 'Evenly bisects the chain at the midpoint.',
    });
  }

  // If n === 3 and we need at least 2 distinct groupings
  if (n === 3 && groupings.length < 2) {
    // Only two possible parenthesizations for 3 matrices:
    // 1: ((A1 x A2) x A3)
    // 2: (A1 x (A2 x A3))
    const p1Cost = dims[0] * dims[1] * dims[2] + dims[0] * dims[2] * dims[3];
    const p2Cost = dims[1] * dims[2] * dims[3] + dims[0] * dims[1] * dims[3];
    const p1Str = '((A1 × A2) × A3)';
    const p2Str = '(A1 × (A2 × A3))';

    if (optimalStr === p1Str) {
      groupings.push({
        name: 'Alternative Grouping',
        parenthesization: p2Str,
        cost: p2Cost,
        isOptimal: p2Cost === optimalCost,
        diffFromOptimal: p2Cost - optimalCost,
        description: 'Multiplies A2 × A3 first, then combines with A1.',
      });
    } else {
      groupings.push({
        name: 'Alternative Grouping',
        parenthesization: p1Str,
        cost: p1Cost,
        isOptimal: p1Cost === optimalCost,
        diffFromOptimal: p1Cost - optimalCost,
        description: 'Multiplies A1 × A2 first, then combines with A3.',
      });
    }
  }

  return groupings;
}
