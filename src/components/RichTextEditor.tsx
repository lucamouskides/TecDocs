'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useEditorContext } from '@/contexts/EditorContext';
import { useEffect } from 'react';

export default function RichTextEditor({ id, content, onContentChange }: { id: string; content: any; onContentChange: (id: string, newContent: any) => void }) {
  const { setEditor } = useEditorContext();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => { onContentChange(id, editor.getJSON()); },
    onFocus: ({ editor }) => { setEditor(editor); },
    editorProps: { 
      attributes: { 
        class: 'prose prose-lg focus:outline-none max-w-none p-4 border rounded-md' 
      } 
    },
  });
  
  useEffect(() => {
    return () => {
      setEditor(null);
    };
  }, [setEditor]);

  return <EditorContent editor={editor} />;
}