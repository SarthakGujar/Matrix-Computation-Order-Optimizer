/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar.tsx';
import { OptimizerWorkspace } from './components/OptimizerWorkspace.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F4EC] text-[#2A2421] selection:bg-[#781628] selection:text-white">
      {/* Top Header */}
      <Navbar />

      {/* Main Solver Workspace */}
      <main className="flex-1 py-6 sm:py-8">
        <OptimizerWorkspace initialDimensions={[10, 30, 5, 60]} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
