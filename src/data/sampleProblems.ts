export interface SampleProblem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  matricesCount: number;
  dimensions: number[];
  description: string;
  expectedMinCost: number;
  whyImportant: string;
}

export const SAMPLE_PROBLEMS: SampleProblem[] = [
  {
    id: 'classic-3',
    title: 'Textbook 3-Matrix Classic',
    difficulty: 'Beginner',
    matricesCount: 3,
    dimensions: [10, 30, 5, 60],
    description: 'A₁ (10×30), A₂ (30×5), A₃ (5×60). The quintessential introduction to matrix order optimization.',
    expectedMinCost: 4500,
    whyImportant: 'Demonstrates a massive 6× efficiency boost: ((A₁ × A₂) × A₃) costs 4,500 operations vs 27,000 operations for (A₁ × (A₂ × A₃)).',
  },
  {
    id: 'clrs-4',
    title: 'CLRS 4-Matrix Benchmark',
    difficulty: 'Intermediate',
    matricesCount: 4,
    dimensions: [40, 20, 30, 10, 30],
    description: 'A₁ (40×20), A₂ (20×30), A₃ (30×10), A₄ (10×30). Standard problem from Introduction to Algorithms (CLRS).',
    expectedMinCost: 26000,
    whyImportant: 'Demonstrates a non-trivial split where the inner subproblem (A₂ × A₃) must be resolved first before combining with A₁ and A₄.',
  },
  {
    id: 'clrs-6',
    title: 'Full 6-Matrix Deep Chain',
    difficulty: 'Advanced',
    matricesCount: 6,
    dimensions: [30, 35, 15, 5, 10, 20, 25],
    description: 'A₁ (30×35), A₂ (35×15), A₃ (15×5), A₄ (5×10), A₅ (10×20), A₆ (20×25).',
    expectedMinCost: 15125,
    whyImportant: 'Rich 6×6 DP table illustrating the recursive fill across lengths 2, 3, 4, 5, and 6.',
  },
  {
    id: 'graphics-pipeline',
    title: '3D Graphics Camera & Projection',
    difficulty: 'Intermediate',
    matricesCount: 4,
    dimensions: [1, 4, 4, 4, 4],
    description: 'Transforming a vertex (1×4) through Model, View, and Projection 4×4 transform matrices.',
    expectedMinCost: 48,
    whyImportant: 'Shows vector-matrix vs matrix-matrix cascading multiplication in real-time 3D graphics rendering pipelines.',
  },
  {
    id: 'tall-and-wide',
    title: 'Bottleneck Narrow Matrix Chain',
    difficulty: 'Advanced',
    matricesCount: 5,
    dimensions: [100, 5, 100, 2, 80, 10],
    description: 'Alternating between tall column matrices and flat row matrices.',
    expectedMinCost: 5100,
    whyImportant: 'Shows how intermediate reduction through small inner dimensions drastically cuts multiplication overhead.',
  },
];
