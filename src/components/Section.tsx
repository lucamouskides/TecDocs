'use client';

import React from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { type Block, type SectionType, type MenuContext } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';

interface SectionProps {
  section: SectionType;
  index: number;
  addSection: (afterIndex: number) => void;
  removeSection: (sectionId: string) => void;
  selectedBlockId: string | null;
  handlers: {
    addBlock: (path: string, type: Block['type'], index: number) => void;
    updateBlock: (blockId: string, newContent: any, newStyles?: any) => void;
    removeBlock: (blockId: string) => void;
    moveBlock: (draggedBlockId: string, targetPath: string, targetIndex: number) => void;
    duplicateBlock: (blockId: string) => void;
    handleSelectBlock: (blockId: string) => void;
    onContextMenu: (event: React.MouseEvent, context: MenuContext) => void;
  };
}

export default function Section({ section, addSection, removeSection, index, handlers, selectedBlockId }: SectionProps) {
  return (
    <div className="relative group/section">
      <button onClick={() => removeSection(section.id)} className="absolute -top-3 -right-3 z-10 p-1 bg-white rounded-full shadow border opacity-0 group-hover/section:opacity-100 transition-opacity text-gray-400 hover:text-red-600">
        <TrashIcon className="h-5 w-5" />
      </button>

      <div className="bg-white p-5 my-4 shadow-md rounded-lg transition-all">
        <BlockRenderer 
            blocks={section.blocks} 
            path={section.id} 
            handlers={handlers}
            selectedBlockId={selectedBlockId}
        />
      </div>
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-center opacity-0 group-hover/section:opacity-100 transition-opacity">
        <button onClick={() => addSection(index)} className="bg-white rounded-full shadow-lg border p-1">
          <PlusCircleIcon className="h-8 w-8 text-build-2 hover:text-build-3" />
        </button>
      </div>
    </div>
  );
}