export interface MatrixInfo {
  index: number; // 1-based index: 1 for A1
  name: string; // e.g. "A1"
  rows: number;
  cols: number;
  color: string;
}

export interface SplitEvaluation {
  k: number;
  leftCost: number;
  rightCost: number;
  multCost: number;
  totalCost: number;
  formula: string;
  isBest: boolean;
}

export interface DPStep {
  stepIndex: number;
  length: number;
  i: number;
  j: number;
  splits: SplitEvaluation[];
  bestK: number;
  minCost: number;
  explanation: string;
  beginnerExplanation: string;
}

export interface ParenthesizationTreeNode {
  id: string;
  label: string;
  rows: number;
  cols: number;
  cost: number;
  left?: ParenthesizationTreeNode;
  right?: ParenthesizationTreeNode;
  isLeaf: boolean;
  stepNumber?: number;
}

export interface ExecutionStep {
  stepNumber: number;
  operation: string;
  leftOperand: string;
  rightOperand: string;
  p: number;
  q: number;
  r: number;
  cost: number;
  resultDims: [number, number];
  cumulativeCost: number;
}

export interface AlternativeGrouping {
  name: string;
  parenthesization: string;
  cost: number;
  isOptimal: boolean;
  diffFromOptimal: number;
  description: string;
}

export interface MCMResult {
  matrixCount: number;
  dimensions: number[];
  matrices: MatrixInfo[];
  minimumCost: number;
  parenthesization: string;
  costTable: (number | null)[][]; // 1-indexed: size (n+1) x (n+1)
  splitTable: (number | null)[][]; // 1-indexed: size (n+1) x (n+1)
  steps: DPStep[];
  tree: ParenthesizationTreeNode;
  executionSteps: ExecutionStep[];
  alternativeGroupings: AlternativeGrouping[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface SavedRun {
  id: number;
  name: string;
  matrixCount: number;
  dimensions: number[];
  minimumCost: string;
  parenthesization: string;
  createdAt: string;
}
