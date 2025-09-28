'use client';

import { useState } from 'react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import SidebarItem from './SidebarItem';
import { type Block } from '@/types/blocks';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const blockTypes = [
  { type: 'richText', label: 'Text' }, { type: 'pricingTable', label: 'Pricing' }, { type: 'image', label: 'Image' },
  { type: 'video', label: 'Video' }, { type: 'button', label: 'Button' }, { type: 'quote', label: 'Quote' },
  { type: 'divider', label: 'Divider' }, { type: 'spacer', label: 'Spacer' }, { type: 'html', label: 'HTML' },
  { type: 'columns', label: 'Columns' }, { type: 'imageWithText', label: 'Image+Text' }, { type: 'testimonial', label: 'Testimonial' },
  { type: 'signature', label: 'Signature' }, { type: 'table', label: 'Table' },
];

interface LeftSidebarProps {
  clipboard: Block | null;
  pasteBlock: () => void;
}

export default function LeftSidebar({ clipboard, pasteBlock }: LeftSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white p-2 rounded-r-md shadow-lg border z-20"
      >
        <ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />
      </button>
    );
  }

  return (
    // The DndProvider has been removed from here
    <div className="w-64 bg-white p-4 border-r border-neutral-base-3 flex flex-col h-screen z-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-base-8">Components</h3>
        <button onClick={() => setIsOpen(false)}>
          <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      <div className="overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {blockTypes.map(block => (
            <SidebarItem key={block.type} blockType={block} />
          ))}
        </div>
        
        {clipboard && (
            <div className="mt-4 border-t pt-4">
                <button 
                    onClick={pasteBlock}
                    className="w-full flex items-center justify-center gap-2 p-2 text-sm text-center bg-build-1 text-white rounded-lg hover:bg-build-2 transition-colors"
                >
                    <ClipboardDocumentIcon className="h-4 w-4" /> Paste Block
                </button>
            </div>
        )}
      </div>
    </div>
  );
}