'use client';

import { type Block } from '@/types/blocks';
import GlobalStylesPanel, { type GlobalStyles } from './GlobalStylesPanel';
import BlockInspectorPanel from './BlockInspectorPanel';
import { useState, useEffect } from 'react';

interface RightSidebarProps {
  globalStyles: GlobalStyles;
  onGlobalStylesUpdate: (newStyles: GlobalStyles) => void;
  selectedBlock: Block | undefined;
  onBlockUpdate: (id: string, newContent: any, newStyles: any) => void;
}

export default function RightSidebar({ globalStyles, onGlobalStylesUpdate, selectedBlock, onBlockUpdate }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'styles' | 'inspector'>('styles');

  useEffect(() => {
    if (selectedBlock) { setActiveTab('inspector'); } 
    else { setActiveTab('styles'); }
  }, [selectedBlock]);

  return (
    <div className="w-64 bg-white p-4 border-l border-neutral-base-3 h-screen overflow-y-auto">
      <div className="flex border-b mb-4">
        <button onClick={() => setActiveTab('styles')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'styles' ? 'border-b-2 border-build-2 text-build-2' : 'text-neutral-base-5'}`}>Global Styles</button>
        {selectedBlock && (
          <button onClick={() => setActiveTab('inspector')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'inspector' ? 'border-b-2 border-build-2 text-build-2' : 'text-neutral-base-5'}`}>Selected Block</button>
        )}
      </div>
      {activeTab === 'styles' && ( <GlobalStylesPanel styles={globalStyles} onUpdate={onGlobalStylesUpdate} /> )}
      {activeTab === 'inspector' && selectedBlock && ( <BlockInspectorPanel block={selectedBlock} onUpdate={onBlockUpdate} /> )}
    </div>
  );
}