'use client';

import type { Editor } from '@tiptap/core';
import { Bold, Italic, Link, Heading1, Heading2, Heading3 } from 'lucide-react';
import { useCallback } from 'react';

export default function TextToolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return; // User cancelled
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run(); // Remove link
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-neutral-base-8 text-white p-1 rounded-md shadow-lg">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Bold className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Italic className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Heading1 className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Heading2 className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Heading3 className="h-4 w-4" />
      </button>
      <button onClick={setLink} className={`p-2 rounded ${editor.isActive('link') ? 'bg-neutral-base-6' : 'hover:bg-neutral-base-7'}`}>
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
}