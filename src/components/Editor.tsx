'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { produce } from 'immer';

import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Section from './Section';
import ContextMenu, { type MenuContext } from './ContextMenu';
import { type GlobalStyles } from './GlobalStylesPanel';
import { type Block, type SectionType } from '@/types/blocks';
import { EditorProvider } from '@/contexts/EditorContext';

const findBlockAndParentList = (draft: SectionType[], blockId: string): { block: Block, list: Block[], index: number } | null => {
    for (const section of draft) {
        for (const block of section.blocks) {
            if (block.id === blockId) return { block, list: section.blocks, index: section.blocks.findIndex(b => b.id === blockId) };
            if (block.type === 'columns') {
                for (const column of block.content.columns) {
                    const foundIndex = column.blocks.findIndex(b => b.id === blockId);
                    if (foundIndex !== -1) return { block: column.blocks[foundIndex], list: column.blocks, index: foundIndex };
                }
            }
        }
    }
    return null;
}
const findParentListByPath = (draft: SectionType[], path: string): Block[] | null => {
    const pathParts = path.split('.');
    const sectionId = pathParts[0];
    const section = draft.find(s => s.id === sectionId);
    if (!section) return null;
    let currentList: Block[] = section.blocks;
    for (let i = 1; i < pathParts.length; i++) {
        const partId = pathParts[i];
        const parentBlock = currentList.find(b => b.id === partId);
        if (parentBlock && parentBlock.type === 'columns') {
            const columnIndex = parseInt(pathParts[i + 1], 10);
            if(parentBlock.content.columns[columnIndex]) {
                currentList = parentBlock.content.columns[columnIndex].blocks;
                i++;
            } else { return null; }
        } else { return null; }
    }
    return currentList;
};

export default function Editor({ proposal }: { proposal: { id: string; name: string; client_name: string | null, sections: SectionType[], global_styles: GlobalStyles } }) {
  const router = useRouter();
  const [proposalName, setProposalName] = useState(proposal.name);
  const [clientName, setClientName] = useState(proposal.client_name || '');
  const [sections, setSections] = useState<SectionType[]>(proposal.sections);
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(proposal.global_styles);
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<Block | null>(null);
  const [menuState, setMenuState] = useState({ isOpen: false, position: { x: 0, y: 0 }, context: null as MenuContext | null });
  
  const allBlocks = sections.flatMap(s => s.blocks.flatMap(b => b.type === 'columns' ? b.content.columns.flatMap(c => c.blocks) : [b]));
  const selectedBlock = allBlocks.find(b => b.id === selectedBlockId);

  const handleOpenContextMenu = (event: React.MouseEvent, context: MenuContext) => { event.preventDefault(); setMenuState({ isOpen: true, position: { x: event.clientX, y: event.clientY }, context }); };
  const closeMenu = () => setMenuState({ ...menuState, isOpen: false });

    const addSection = useCallback((afterIndex: number) => {
        const newSection: SectionType = { id: uuidv4(), blocks: [{ id: uuidv4(), type: 'richText', content: { type: 'doc', content: [{ type: 'paragraph' }] } }] };
        setSections(produce(draft => {
            draft.splice(afterIndex + 1, 0, newSection);
        }));
    }, []);

    const removeSection = useCallback((sectionId: string) => {
        if (confirm('Are you sure you want to delete this section?')) {
            setSections(currentSections => currentSections.filter(s => s.id !== sectionId));
        }
    }, []);
    
    const addBlock = useCallback((path: string, type: Block['type'], index: number) => {
        let newBlock: Block;
        switch (type) {
        case 'richText': newBlock = { id: uuidv4(), type, content: { type: 'doc', content: [{ type: 'paragraph' }] } }; break;
        case 'pricingTable': newBlock = { id: uuidv4(), type, content: [] }; break;
        case 'image': newBlock = { id: uuidv4(), type, content: { url: null } }; break;
        case 'video': newBlock = { id: uuidv4(), type, content: { url: null } }; break;
        case 'button': newBlock = { id: uuidv4(), type, content: { text: 'Click Here', url: '' } }; break;
        case 'divider': newBlock = { id: uuidv4(), type, content: {} }; break;
        case 'quote': newBlock = { id: uuidv4(), type, content: { text: '', author: '' } }; break;
        case 'spacer': newBlock = { id: uuidv4(), type, content: { height: 48 } }; break;
        case 'html': newBlock = { id: uuidv4(), type, content: { html: '' } }; break;
        case 'columns': newBlock = { id: uuidv4(), type, content: { layout: [50, 50], columns: [{ id: uuidv4(), blocks: [] }, { id: uuidv4(), blocks: [] }] } }; break;
        case 'imageWithText': newBlock = { id: uuidv4(), type, content: { imageUrl: null, text: { type: 'doc', content: [{ type: 'paragraph' }] } } }; break;
        case 'testimonial': newBlock = { id: uuidv4(), type, content: { text: '', author: '', company: '' } }; break;
        case 'signature': newBlock = { id: uuidv4(), type, content: {} }; break;
        case 'table': newBlock = { id: uuidv4(), type, content: { headers: ['Header 1'], rows: [['Cell 1']] } }; break;
        default: return;
        }
        setSections(produce(draft => {
            const parentList = findParentListByPath(draft, path);
            if (parentList) { parentList.splice(index, 0, newBlock); }
        }));
    }, []);
    
    const updateBlock = useCallback((blockId: string, newContent: any, newStyles?: any) => {
        setSections(produce(draft => {
            const result = findBlockAndParentList(draft, blockId);
            if (result?.block) {
                result.block.content = newContent;
                if (newStyles !== undefined) { result.block.styles = newStyles; }
            }
        }));
    }, []);

    const removeBlock = useCallback((blockId: string) => {
        setSections(produce(draft => {
            const result = findBlockAndParentList(draft, blockId);
            if (result) {
                const index = result.list.findIndex(b => b.id === blockId);
                if (index > -1) { result.list.splice(index, 1); }
            }
        }));
    }, []);

    const moveBlock = useCallback((draggedBlockId: string, targetPath: string, targetIndex: number) => {
        setSections(produce(draft => {
            let draggedBlock: Block | undefined;
            // Find and remove the block from its original location
            const sourceResult = findBlockAndParentList(draft, draggedBlockId);
            if (!sourceResult) return;
            const [removedBlock] = sourceResult.list.splice(sourceResult.index, 1);
            draggedBlock = removedBlock;
            
            // Find the target list and insert the block
            if (draggedBlock) {
                const targetList = findParentListByPath(draft, targetPath);
                if (targetList) {
                    // Adjust index if moving within the same list
                    const adjustedIndex = sourceResult.list === targetList && sourceResult.index < targetIndex ? targetIndex - 1 : targetIndex;
                    targetList.splice(adjustedIndex, 0, draggedBlock);
                }
            }
        }));
      }, []);
  
      const copyBlock = useCallback(() => {
        const context = menuState.context;
        if (context?.type !== 'block') return;
        const result = findBlockAndParentList(sections, context.id);
        if (result?.block) {
          setClipboard(cloneDeep(result.block));
          toast.success('Block copied!');
        }
        closeMenu();
      }, [sections, menuState.context]);
    
      const pasteBlock = useCallback(() => {
        if (!clipboard || !menuState.context) return;
        const newBlock: Block = { ...cloneDeep(clipboard), id: uuidv4() };
        const context = menuState.context;
        if (context.type === 'block') {
          setSections(produce(draft => {
            const result = findBlockAndParentList(draft, context.id);
            if (result) { result.list.splice(result.index + 1, 0, newBlock); }
          }));
        } else if (context.type === 'dropzone') {
          setSections(produce(draft => {
            const parentList = findParentListByPath(draft, context.path);
            if (parentList) { parentList.splice(context.index, 0, newBlock); }
          }));
        }
        closeMenu();
      }, [clipboard, sections, menuState.context]);

    const duplicateBlock = useCallback((blockIdToDuplicate: string) => {
        setSections(produce(draft => {
            const result = findBlockAndParentList(draft, blockIdToDuplicate);
            if (result) {
                const newBlock: Block = { ...cloneDeep(result.block), id: uuidv4() };
                result.list.splice(result.index + 1, 0, newBlock);
            }
        }));
        closeMenu();
    }, []);
  
    const handleSave = async () => {
        const toastId = toast.loading('Saving...');
        const payloadToSave = { id: proposal.id, name: proposalName, client_name: clientName, sections: sections, global_styles: globalStyles, blocks: [], };
        const { data, error } = await supabase.from('proposals').upsert(payloadToSave).select().single();
        if (error) { toast.error('Error saving proposal.', { id: toastId }); console.error(error); } 
        else { toast.success('Proposal saved!', { id: toastId }); router.push(`/editor/${data.id}`); }
    };

    const handleSaveAsTemplate = async () => {
        const templateName = prompt("Please enter a name for this template:", proposalName);
        if (!templateName) return;
        const toastId = toast.loading('Saving template...');
        const templatePayload = { name: templateName, sections: sections, global_styles: globalStyles, };
        const { error } = await supabase.from('templates').insert(templatePayload);
        if (error) { toast.error('Error saving template.', { id: toastId }); console.error(error); } 
        else { toast.success(`Template "${templateName}" saved!`, { id: toastId }); }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Backspace' || event.key === 'Delete') {
            if (selectedBlockId) {
              const activeEl = document.activeElement;
              if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.hasAttribute('contenteditable')) { return; }
              event.preventDefault();
              removeBlock(selectedBlockId);
              setSelectedBlockId(null);
            }
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [selectedBlockId, removeBlock]);
    
  
    const handlers = { addBlock, updateBlock, removeBlock, moveBlock, duplicateBlock, handleSelectBlock: setSelectedBlockId, onContextMenu: handleOpenContextMenu, copyBlock: () => {} };

    return (
        <EditorProvider>
        <DndProvider backend={HTML5Backend}>
        <ContextMenu 
            isOpen={menuState.isOpen} 
            position={menuState.position} 
            onClose={closeMenu} 
            clipboard={clipboard}
            context={menuState.context}
            actions={{ 
                onCopy: copyBlock, 
                onPaste: pasteBlock, 
                onDuplicate: () => menuState.context?.type === 'block' && duplicateBlock(menuState.context.id),
                onDelete: () => menuState.context?.type === 'block' && removeBlock(menuState.context.id),
            }}
        />
        <div className="flex h-screen bg-neutral-base-2">
            <LeftSidebar clipboard={clipboard} pasteBlock={pasteBlock} />
            <div className="flex-1 overflow-y-auto">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-semibold text-neutral-base-5 hover:text-neutral-base-8 flex items-center gap-1">&larr; Dashboard</Link>
                    <div className="border-l border-neutral-base-3 pl-4">
                    <input value={proposalName} onChange={(e) => setProposalName(e.target.value)} placeholder="Proposal Name" className="text-xl font-bold p-1 border-none focus:ring-0 w-64" />
                    <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name" className="text-sm p-1 border-none focus:ring-0 w-64 text-neutral-base-5" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSaveAsTemplate} className="px-4 py-2 bg-neutral-base-2 text-neutral-base-7 font-semibold rounded-lg hover:bg-neutral-base-3 transition-colors whitespace-nowrap">Save as Template</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-build-2 text-white font-semibold rounded-lg hover:bg-build-3 transition-colors whitespace-nowrap">Save Proposal</button>
                </div>
                </div>
            </header>
            <div className="p-8">
                {sections.map((section, index) => (
                <Section
                    key={section.id} section={section} index={index}
                    addSection={addSection} removeSection={removeSection}
                    selectedBlockId={selectedBlockId}
                    handlers={handlers}
                />
                ))}
                <div className="text-center mt-4">
                <button onClick={() => addSection(sections.length - 1)} className="text-sm font-semibold text-neutral-base-5 hover:text-build-2 flex items-center gap-2 mx-auto">
                    <PlusCircleIcon className="h-6 w-6" /> Add Section
                </button>
                </div>
            </div>
            </div>
            <RightSidebar
            globalStyles={globalStyles}
            onGlobalStylesUpdate={setGlobalStyles}
            selectedBlock={selectedBlock}
            onBlockUpdate={updateBlock}
          />
        </div>
        </DndProvider>
        </EditorProvider>
    );
}