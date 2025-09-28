'use client';

import type { Identifier, XYCoord } from 'dnd-core';
import type { FC } from 'react';
import { useRef, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { LayersIcon } from 'lucide-react';
import { type Block } from '@/types/blocks';

export const ItemTypes = { BLOCK: 'block' };

export interface DraggableBlockProps {
  id: string;
  index: number;
  styles?: { [key: string]: any };
  isSelected: boolean;
  onClick: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, blockId: string) => void;
  moveBlock: (draggedId: string, hoverIndex: number) => void; // Changed signature
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  children: React.ReactNode;
}
interface DragItem { index: number; id: string; type: string; }

export const DraggableBlock: FC<DraggableBlockProps> = ({ id, index, styles, isSelected, onClick, onContextMenu, moveBlock, removeBlock, duplicateBlock, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.BLOCK,
    hover(item: DragItem, monitor) {
      if (!ref.current || item.id === id) return;
      
      const hoverIndex = index;
      
      // Call moveBlock with the dragged item's ID
      moveBlock(item.id, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: () => ({ id, index }),
    collect: (monitor: any) => ({ isDragging: monitor.isDragging() }),
  });
  
  const opacity = isDragging ? 0.2 : 1;
  drag(dragHandleRef);
  drop(ref);

  const textAlignClass = styles?.textAlign ? `text-${styles.textAlign}` : '';

  return (
    <div
      ref={ref}
      style={{ ...styles, opacity }}
      data-handler-id={handlerId}
      className={`relative group border-2 transition-colors ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-200'} ${textAlignClass}`}
      onClick={() => onClick(id)}
      onContextMenu={(e) => onContextMenu(e, id)}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-50 transition-opacity">
        <div ref={dragHandleRef} className="cursor-move">{/* drag handle svg */}</div>
        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(id); }} title="Duplicate block" className="cursor-pointer text-gray-500 hover:text-blue-600">
            <LayersIcon size={18} />
        </button>
        {/* The Delete button is now removed from here */}
      </div>
      <div className="p-[1px]">{children}</div>
    </div>
  );
};