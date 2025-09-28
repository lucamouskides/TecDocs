'use client';

import { useState, useEffect } from 'react';
import { type Block } from '@/types/blocks';
import { useEditorContext } from '@/contexts/EditorContext';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface BlockInspectorPanelProps {
  block: Block;
  onUpdate: (id: string, newContent: any, newStyles: any) => void;
}

const buttonPresets = {
    primary: { backgroundColor: '#E8083E', color: '#FFFFFF', border: '1px solid transparent' },
    secondary: { backgroundColor: '#2A61EE', color: '#FFFFFF', border: '1px solid transparent' },
    ghost: { backgroundColor: 'transparent', color: '#3B3A3A', border: '1px solid #CCCBCA' }
};

export default function BlockInspectorPanel({ block, onUpdate }: BlockInspectorPanelProps) {
  const { editor } = useEditorContext();
  const styles = block.styles || {};
  const [activeAppearanceTab, setActiveAppearanceTab] = useState<'color' | 'image'>(
    styles.backgroundImage ? 'image' : 'color'
  );
  
  const [fontSize, setFontSize] = useState('');

  useEffect(() => {
    if (editor) {
      const updateFontSize = () => {
        const currentSize = editor.getAttributes('textStyle').fontSize?.replace('px', '') || '';
        setFontSize(currentSize);
      };
      updateFontSize();
      editor.on('selectionUpdate', updateFontSize);
      return () => {
        editor.off('selectionUpdate', updateFontSize);
      };
    }
  }, [editor, block.id]);


  const handleStyleChange = (key: string, value: string | undefined) => {
    const newStyles = { ...styles };
    if (value === undefined || value === '' || value === 'none') { delete (newStyles as any)[key]; } 
    else { (newStyles as any)[key] = value; }

    if (key === 'borderWidth' && parseInt(value || '0') > 0) {
      if (!styles.borderStyle || styles.borderStyle === 'none') { newStyles.borderStyle = 'solid'; }
    }
    if (key === 'borderStyle' && value === 'none') {
        delete newStyles.borderWidth; delete newStyles.borderColor; delete newStyles.borderRadius;
    }
    onUpdate(block.id, block.content, newStyles);
  };

  const handleContentChange = (key: string, value: any) => {
    onUpdate(block.id, { ...block.content, [key]: value }, styles);
  };
  
  const applyTextStyle = (command: (chain: any) => any) => {
    if (!editor) return;
    let chain = editor.chain().focus();
    if (editor.state.selection.empty) {
        chain = chain.selectAll();
    }
    command(chain).run();
  };
  
  const applyPreset = (presetName: keyof typeof buttonPresets) => {
    const presetStyles = buttonPresets[presetName];
    const newStyles = { ...styles, ...presetStyles };
    onUpdate(block.id, block.content, newStyles);
  };

  const handleBgImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('proposals-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('proposals-images').getPublicUrl(filePath);
      const newStyles = { ...styles, backgroundImage: `url(${urlData.publicUrl})`, backgroundSize: styles.backgroundSize || 'cover', backgroundPosition: styles.backgroundPosition || 'center', backgroundRepeat: 'no-repeat' };
      onUpdate(block.id, block.content, newStyles);
    } catch (error) {
      alert('Error uploading image.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      
      {block.type === 'button' && (
        <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">Button Presets</h3>
            <div className="flex gap-2">
                <button onClick={() => applyPreset('primary')} className="flex-1 p-2 text-sm rounded-md border text-white" style={{ backgroundColor: buttonPresets.primary.backgroundColor }}>Primary</button>
                <button onClick={() => applyPreset('secondary')} className="flex-1 p-2 text-sm rounded-md border text-white" style={{ backgroundColor: buttonPresets.secondary.backgroundColor }}>Secondary</button>
                <button onClick={() => applyPreset('ghost')} className="flex-1 p-2 text-sm rounded-md border" style={{ color: buttonPresets.ghost.color, borderColor: buttonPresets.ghost.border }}>Ghost</button>
            </div>
        </div>
      )}

      {(block.type === 'richText' || block.type === 'button') && editor && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">Typography</h3>
          <div className="space-y-4">
            {block.type === 'richText' && (
              <select 
                value={ editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : 'p' }
                onChange={(e) => {
                    const level = parseInt(e.target.value.replace('h', ''), 10);
                    const command = (chain: any) => level ? chain.toggleHeading({ level: level as any }) : chain.setParagraph();
                    applyTextStyle(command);
                }}
                className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                  <option value="p">Body</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
              </select>
            )}
            <div className="flex items-center gap-1 rounded-md bg-gray-200 p-1">
                <button title="Bold" onClick={() => applyTextStyle(chain => chain.toggleBold())} className={`flex-1 p-2 rounded ${editor.isActive('bold') ? 'bg-white shadow' : 'hover:bg-gray-300'}`}><Bold size={16} className="mx-auto" /></button>
                <button title="Italic" onClick={() => applyTextStyle(chain => chain.toggleItalic())} className={`flex-1 p-2 rounded ${editor.isActive('italic') ? 'bg-white shadow' : 'hover:bg-gray-300'}`}><Italic size={16} className="mx-auto" /></button>
                <button title="Underline" onClick={() => applyTextStyle(chain => chain.toggleUnderline())} className={`flex-1 p-2 rounded ${editor.isActive('underline') ? 'bg-white shadow' : 'hover:bg-gray-300'}`}><Underline size={16} className="mx-auto" /></button>
                <button title="Strikethrough" onClick={() => applyTextStyle(chain => chain.toggleStrike())} className={`flex-1 p-2 rounded ${editor.isActive('strike') ? 'bg-white shadow' : 'hover:bg-gray-300'}`}><Strikethrough size={16} className="mx-auto" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-gray-500">Font Weight</label>
                    <select 
                      value={editor.getAttributes('textStyle').fontWeight || '400'} 
                      onChange={(e) => applyTextStyle(chain => chain.setMark('textStyle', { fontWeight: e.target.value }))} 
                      className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    >
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="700">Bold</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Size (px)</label>
                    <input 
                      type="number"
                      placeholder="--"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      onBlur={() => {
                        const value = fontSize;
                        const command = (chain: any) => value ? chain.setMark('textStyle', { fontSize: `${value}px` }) : chain.unsetMark('textStyle');
                        applyTextStyle(command);
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                </div>
            </div>
             <div>
              <label className="text-xs text-gray-500">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={editor.getAttributes('textStyle').color || '#3B3A3A'} onChange={(e) => applyTextStyle(chain => chain.setColor(e.target.value))} className="h-8 w-8 rounded border-gray-300"/>
                <button onClick={() => applyTextStyle(chain => chain.unsetColor())} className="text-xs text-gray-500 hover:text-black">Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {block.type === 'button' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">Button Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700">Link URL</label>
              <input type="url" id="buttonUrl" value={(block.content as any).url || ''} onChange={(e) => handleContentChange('url', e.target.value)} placeholder="https://example.com" className="mt-1 w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">Layout</h3>
        <div className="space-y-4">
          {block.type === 'columns' && ( <div>{/* Column Layout Controls */}</div> )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Padding (px)</label>
            <div className="mt-1"><div className="flex gap-2">{(['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => { const styleKey = `padding${side}`; return <input key={side} type="number" aria-label={`${side} padding`} value={parseInt(styles[styleKey] || '0')} onChange={(e) => handleStyleChange(styleKey, e.target.value ? `${e.target.value}px` : undefined)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-center" placeholder="0"/>; })}</div><div className="flex gap-2 mt-1 text-xs text-center text-gray-500"><span className="w-full">TOP</span><span className="w-full">RIGHT</span><span className="w-full">BOTTOM</span><span className="w-full">LEFT</span></div></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin (px)</label>
            <div className="mt-1"><div className="flex gap-2">{(['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => { const styleKey = `margin${side}`; return <input key={side} type="number" aria-label={`${side} margin`} value={parseInt(styles[styleKey] || '0')} onChange={(e) => handleStyleChange(styleKey, e.target.value ? `${e.target.value}px` : undefined)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-center" placeholder="0"/>; })}</div><div className="flex gap-2 mt-1 text-xs text-center text-gray-500"><span className="w-full">TOP</span><span className="w-full">RIGHT</span><span className="w-full">BOTTOM</span><span className="w-full">LEFT</span></div></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Text Align</label>
            <div className="mt-1 grid grid-cols-3 gap-1 rounded-md bg-gray-200 p-1">
                <button onClick={() => handleStyleChange('textAlign', 'left')} className={`px-3 py-1 text-sm rounded ${styles.textAlign === 'left' || !styles.textAlign ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>Left</button>
                <button onClick={() => handleStyleChange('textAlign', 'center')} className={`px-3 py-1 text-sm rounded ${styles.textAlign === 'center' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>Center</button>
                <button onClick={() => handleStyleChange('textAlign', 'right')} className={`px-3 py-1 text-sm rounded ${styles.textAlign === 'right' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>Right</button>
            </div>
          </div>
        </div>
      </div>
      
       <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">Appearance</h3>
        <div className="flex rounded-md bg-gray-200 p-1 mb-4">
          <button onClick={() => setActiveAppearanceTab('color')} className={`flex-1 px-3 py-1 text-sm rounded-md ${activeAppearanceTab === 'color' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>Color</button>
          <button onClick={() => setActiveAppearanceTab('image')} className={`flex-1 px-3 py-1 text-sm rounded-md ${activeAppearanceTab === 'image' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>Image</button>
        </div>
        <div className="space-y-4">
          {activeAppearanceTab === 'color' && ( <div><label className="block text-sm font-medium text-gray-700">Background Color</label><div className="mt-1 flex items-center gap-2"><input type="color" value={styles.backgroundColor || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="h-8 w-8 rounded border-gray-300"/><input type="text" value={styles.backgroundColor || ''} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Default"/></div></div> )}
          {activeAppearanceTab === 'image' && ( <div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700">Background Image</label><input type="file" id="bg-upload" accept="image/*" onChange={handleBgImageUpload} className="hidden" /><label htmlFor="bg-upload" className="mt-1 block w-full text-center cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">Choose Image</label>{styles.backgroundImage && <button onClick={() => handleStyleChange('backgroundImage', undefined)} className="text-xs text-red-600 mt-1">Remove Image</button>}</div><div><label className="block text-sm font-medium text-gray-700">Size</label><select value={styles.backgroundSize || 'cover'} onChange={(e) => handleStyleChange('backgroundSize', e.target.value)} className="w-full mt-1 rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="cover">Cover</option><option value="contain">Contain</option><option value="auto">Auto</option></select></div><div><label className="block text-sm font-medium text-gray-700">Position</label><select value={styles.backgroundPosition || 'center'} onChange={(e) => handleStyleChange('backgroundPosition', e.target.value)} className="w-full mt-1 rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></div></div> )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <div className="mt-1 flex items-center gap-2"><input type="color" value={styles.color || '#3B3A3A'} onChange={(e) => handleStyleChange('color', e.target.value)} className="h-8 w-8 rounded border-gray-300"/><input type="text" value={styles.color || ''} onChange={(e) => handleStyleChange('color', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Default"/></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Border</label>
            <div className="mt-1 grid grid-cols-2 gap-2"><div><input type="number" placeholder="Width (px)" value={parseInt(styles.borderWidth || '0')} onChange={(e) => handleStyleChange('borderWidth', e.target.value ? `${e.target.value}px` : undefined)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/></div><div><select value={styles.borderStyle || 'none'} onChange={(e) => handleStyleChange('borderStyle', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="none">None</option><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></div><div className="col-span-2"><div className="flex items-center gap-2"><input type="color" value={styles.borderColor || '#000000'} onChange={(e) => handleStyleChange('borderColor', e.target.value)} className="h-8 w-8 rounded border-gray-300"/><input type="text" placeholder="Color" value={styles.borderColor || ''} onChange={(e) => handleStyleChange('borderColor', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/></div></div><div className="col-span-2 flex items-center gap-2"><label htmlFor="borderRadius" className="text-sm text-gray-600 flex-shrink-0">Radius (px)</label><input id="borderRadius" type="number" placeholder="0" value={parseInt(styles.borderRadius || '0')} onChange={(e) => handleStyleChange('borderRadius', e.target.value ? `${e.target.value}px` : undefined)} className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}