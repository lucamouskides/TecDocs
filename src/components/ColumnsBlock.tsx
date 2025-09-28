'use client';

import { type Column } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';
import { CSSProperties } from 'react';

interface ColumnsBlockProps {
  id: string;
  content: { layout: number[], columns: Column[] };
  handlers: any;
  parentPath: string;
  selectedBlockId: string | null;
  styles?: { [key: string]: string };
}

const ColumnsBlock = ({ id, content, handlers, parentPath, selectedBlockId, styles }: ColumnsBlockProps) => {
  const flexStyles: CSSProperties = {
    display: 'flex',
    flexDirection: (styles?.flexDirection as any) || 'row',
    justifyContent: styles?.justifyContent,
    alignItems: styles?.alignItems,
    gap: '1rem',
  };
  
  return (
    <div className="my-4" style={flexStyles}>
      {content.columns.map((column, index) => (
        <div 
          key={column.id} 
          style={{ width: `${content.layout[index]}%` }} 
          className="bg-neutral-base-1 p-2 rounded-lg"
        >
           <BlockRenderer 
              blocks={column.blocks}
              path={`${parentPath}.${id}.${index}`}
              handlers={handlers}
              selectedBlockId={selectedBlockId}
           />
        </div>
      ))}
    </div>
  );
};

export default ColumnsBlock;