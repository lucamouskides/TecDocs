'use client';

import { useEffect, useRef } from 'react';
import { type Block } from '@/types/blocks';

export type MenuContext = 
  | { type: 'block'; id: string }
  | { type: 'dropzone'; path: string; index: number };

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  actions: {
    onCopy: () => void;
    onPaste: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
  };
  clipboard: Block | null;
  context: MenuContext | null;
}

export default function ContextMenu({ isOpen, position, onClose, actions, clipboard, context }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) { onClose(); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [onClose]);

  if (!isOpen) return null;

  const canPaste = !!clipboard;
  const canCopyDuplicateDelete = context?.type === 'block';

  return (
    <div ref={menuRef} style={{ top: position.y, left: position.x }} className="absolute z-50 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <button onClick={actions.onCopy} disabled={!canCopyDuplicateDelete} className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed">Copy</button>
      <button onClick={actions.onPaste} disabled={!canPaste} className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed">Paste</button>
      <button onClick={actions.onDuplicate} disabled={!canCopyDuplicateDelete} className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed">Duplicate</button>
      <div className="my-1 h-px bg-gray-100" />
      <button onClick={actions.onDelete} disabled={!canCopyDuplicateDelete} className="text-red-700 block w-full px-4 py-2 text-left text-sm hover:bg-red-50 disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed">Delete</button>
    </div>
  );
}