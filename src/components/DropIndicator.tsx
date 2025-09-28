'use client';

import { useDrop } from 'react-dnd';
import { useRef, useMemo } from 'react';
import { type Block } from '@/types/blocks';
import { ItemTypes as SidebarItemTypes } from './SidebarItem';
import { ItemTypes as BlockItemTypes } from './DraggableBlock';
import { type MenuContext } from './ContextMenu';

interface DropIndicatorProps {
  onDrop: (item: { type: Block['type'] }) => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

export default function DropIndicator({ onDrop, onContextMenu }: DropIndicatorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const spec = useMemo(() => ({
        accept: [SidebarItemTypes.SIDEBAR_ITEM, BlockItemTypes.BLOCK],
        drop: onDrop,
        collect: (monitor: any) => ({ isOver: !!monitor.isOver() }),
    }), [onDrop]);
    const [{ isOver }, drop] = useDrop(spec);
    
    drop(ref);

    return (
        <div
            ref={ref}
            onContextMenu={onContextMenu} // Add the right-click handler here
            className={`relative transition-all duration-200 ease-in-out my-0 h-10`}
        >
            <div className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-1 rounded-full transition-all ${isOver ? 'bg-build-2 opacity-100' : 'opacity-0 group-hover/section:opacity-100 bg-neutral-base-3'}`} />
        </div>
    );
};