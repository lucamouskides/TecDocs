'use client';

import ImageBlock from './ImageBlock';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface ImageWithTextBlockProps {
  id: string;
  content: {
    imageUrl: string | null;
    text: any;
  };
  onContentChange: (id: string, newContent: any) => void;
}

function MiniTextEditor({ content, onChange }: { content: any; onChange: (newContent: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none max-w-none p-4',
      },
    },    
  });
  return <EditorContent editor={editor} />;
}


export default function ImageWithTextBlock({ id, content, onContentChange }: ImageWithTextBlockProps) {
  const handleImageChange = (_id: string, newImageContent: { url: string | null }) => {
    onContentChange(id, { ...content, imageUrl: newImageContent.url });
  };
  
  const handleTextChange = (newTextContent: any) => {
    onContentChange(id, { ...content, text: newTextContent });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 my-4 items-center border rounded-lg p-4">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <ImageBlock id={id} content={{ url: content.imageUrl }} onContentChange={handleImageChange} />
      </div>
      <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
        <MiniTextEditor content={content.text} onChange={handleTextChange} />
      </div>
    </div>
  );
}