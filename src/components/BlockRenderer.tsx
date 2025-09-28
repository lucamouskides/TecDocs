'use client';

import React from 'react';
import { type Block, type MenuContext } from '@/types/blocks';
import { DraggableBlock } from './DraggableBlock';
import DropIndicator from './DropIndicator';
import { useDrop } from 'react-dnd';

// Import all block components
import RichTextEditor from './RichTextEditor';
import PricingTable from './PricingTable';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import ButtonBlock from './ButtonBlock';
import DividerBlock from './DividerBlock';
import QuoteBlock from './QuoteBlock';
import SpacerBlock from './SpacerBlock';
import HtmlBlock from './HtmlBlock';
import ColumnsBlock from './ColumnsBlock';
import ImageWithTextBlock from './ImageWithTextBlock';
import TestimonialBlock from './TestimonialBlock';
import SignatureBlock from './SignatureBlock';
import TableBlock from './TableBlock';

interface BlockRendererProps {
  blocks: Block[];
  path: string;
  selectedBlockId: string | null;
  handlers: {
    addBlock: (path: string, type: Block['type'], index: number) => void;
    updateBlock: (blockId: string, newContent: any, newStyles?: any) => void;
    removeBlock: (blockId: string) => void;
    moveBlock: (draggedBlockId: string, targetPath: string, targetIndex: number) => void;
    duplicateBlock: (blockId: string) => void;
    handleSelectBlock: (blockId: string) => void;
    onContextMenu: (event: React.MouseEvent, context: MenuContext) => void;
  }
}

export default function BlockRenderer({ blocks, path, selectedBlockId, handlers }: BlockRendererProps) {
  return (
    <div className="space-y-0">
      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          <DropIndicator onDrop={(item) => handlers.addBlock(path, item.type, index)} onContextMenu={(e) => handlers.onContextMenu(e, { type: 'dropzone', path, index: index })}/>
          <DraggableBlock
            id={block.id} index={index}
            styles={block.styles} isSelected={block.id === selectedBlockId}
            onClick={handlers.handleSelectBlock}
            onContextMenu={(event, blockId) => handlers.onContextMenu(event, { type: 'block', id: blockId })}
            moveBlock={(draggedId, hoverIndex) => handlers.moveBlock(draggedId, path, hoverIndex)}
            removeBlock={() => handlers.removeBlock(block.id)}
            duplicateBlock={() => handlers.duplicateBlock(block.id)}
          >
            {(() => {
              const props = {
                id: block.id,
                content: block.content,
                styles: block.styles,
                onContentChange: handlers.updateBlock,
                onUpdate: (id: string, content: any) => handlers.updateBlock(id, content, block.styles),
                handlers: handlers,
                parentPath: path,
                selectedBlockId: selectedBlockId,
              };

              switch (block.type) {
                case 'richText': return <RichTextEditor {...props} />;
                case 'pricingTable': return <PricingTable {...props} initialItems={block.content} />;
                case 'image': return <ImageBlock {...props} />;
                case 'video': return <VideoBlock {...props} />;
                case 'button': return <ButtonBlock {...props} />;
                case 'divider': return <DividerBlock />;
                case 'quote': return <QuoteBlock {...props} />;
                case 'spacer': return <SpacerBlock {...props} />;
                case 'html': return <HtmlBlock {...props} />;
                case 'columns': return <ColumnsBlock {...props} />;
                case 'imageWithText': return <ImageWithTextBlock {...props} />;
                case 'testimonial': return <TestimonialBlock {...props} />;
                case 'signature': return <SignatureBlock />;
                case 'table': return <TableBlock {...props} />;
                default: return null;
              }
            })()}
          </DraggableBlock>
        </React.Fragment>
      ))}
      <DropIndicator onDrop={(item) => handlers.addBlock(path, item.type, blocks.length)} onContextMenu={(e) => handlers.onContextMenu(e, { type: 'dropzone', path, index: blocks.length })}/>
      {blocks.length === 0 && ( <EmptyDropZone path={path} handlers={handlers} /> )}
    </div>
  );
}

const EmptyDropZone = ({ path, handlers }: { path: string, handlers: BlockRendererProps['handlers'] }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'sidebarItem',
        drop: (item: { type: Block['type'] }) => handlers.addBlock(path, item.type, 0),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));
    drop(ref);

    return (
        <div ref={ref} onContextMenu={(e) => handlers.onContextMenu(e, { type: 'dropzone', path, index: 0 })} className={`text-center py-12 text-neutral-base-5 transition-colors rounded-lg border-2 border-dashed ${isOver ? 'border-build-3 bg-build-4' : 'border-neutral-base-3'}`}>
            <p>Drag a component here to get started.</p>
        </div>
    );
}