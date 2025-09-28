'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import { useEditorContext } from '@/contexts/EditorContext'; // Import the context hook

interface ButtonBlockProps {
  id: string;
  content: { text: any; url: string };
  styles?: { [key: string]: any };
  onContentChange: (id: string, newContent: any, newStyles?: any) => void;
}

export default function ButtonBlock({ id, content, styles, onContentChange }: ButtonBlockProps) {
  const { setEditor } = useEditorContext(); // Get the setter from the context

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Link,
    ],
    content: content.text || 'Click Here',
    onUpdate: ({ editor }) => {
      onContentChange(id, { ...content, text: editor.getJSON() }, styles);
    },
    // Set this editor as the active one on focus
    onFocus: ({ editor }) => { setEditor(editor); },
  });

  // Effect to update editor content if the prop changes
  useEffect(() => {
    if (editor && content.text && !editor.isFocused) {
      const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content.text);
      if (!isSame) {
        editor.commands.setContent(content.text, false);
      }
    }
  }, [content.text, editor]);

  return (
    <div className="my-4">
      <a
        href={content.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-semibold rounded-lg text-white no-underline"
        style={{
          backgroundColor: styles?.backgroundColor || 'var(--primary-color)',
          paddingTop: styles?.paddingTop || '12px',
          paddingBottom: styles?.paddingBottom || '12px',
          paddingLeft: styles?.paddingLeft || '20px',
          paddingRight: styles?.paddingRight || '20px',
          ...styles
        }}
        onClick={(e) => e.preventDefault()}
      >
        <EditorContent editor={editor} className="button-editor" />
      </a>
    </div>
  );
}