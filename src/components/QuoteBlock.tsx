'use client';

import { useState } from 'react';

interface QuoteBlockProps {
  id: string;
  content: { text: string; author: string };
  onContentChange: (id: string, newContent: { text: string; author: string }) => void;
}

export default function QuoteBlock({ id, content, onContentChange }: QuoteBlockProps) {
  const [text, setText] = useState(content.text || '');
  const [author, setAuthor] = useState(content.author || '');

  const handleBlur = () => {
    onContentChange(id, { text, author });
  };

  return (
    <div className="my-4 p-6 bg-gray-50 border-l-4 border-blue-500">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder="Quote text..."
        className="w-full text-xl italic text-gray-700 bg-transparent focus:outline-none resize-none"
        rows={3}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        onBlur={handleBlur}
        placeholder="Author"
        className="w-full mt-4 text-right font-semibold text-gray-600 bg-transparent focus:outline-none"
      />
    </div>
  );
}