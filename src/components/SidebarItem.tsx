'use client';

import { useDrag } from 'react-dnd';
import { useRef } from 'react';

export const ItemTypes = {
  SIDEBAR_ITEM: 'sidebarItem',
};

interface SidebarItemProps {
  blockType: { type: string; label: string };
}

export default function SidebarItem({ blockType }: SidebarItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SIDEBAR_ITEM,
    // The item being dragged already carries the block type
    item: { type: blockType.type },
    // The deprecated 'begin' property has been removed
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-2 text-sm text-center bg-neutral-base-2 rounded-lg hover:bg-neutral-base-3 transition-colors cursor-grab"
    >
      {blockType.label}
    </div>
  );
}