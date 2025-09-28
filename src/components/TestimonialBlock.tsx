'use client';

import { useState } from 'react';

interface TestimonialBlockProps {
  id: string;
  content: { text: string; author: string; company: string };
  onContentChange: (id: string, newContent: { text: string; author: string; company: string }) => void;
}

export default function TestimonialBlock({ id, content, onContentChange }: TestimonialBlockProps) {
  const [text, setText] = useState(content.text || '');
  const [author, setAuthor] = useState(content.author || '');
  const [company, setCompany] = useState(content.company || '');

  const handleBlur = () => {
    onContentChange(id, { text, author, company });
  };

  return (
    <div className="my-4 p-6 text-center bg-slate-100 rounded-lg">
       <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder="Testimonial text..."
        className="w-full text-lg font-medium text-gray-800 bg-transparent focus:outline-none resize-none text-center"
        rows={4}
      />
      <p className="mt-4 text-gray-500">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onBlur={handleBlur}
          placeholder="Author Name"
          className="font-bold text-slate-700 bg-transparent focus:outline-none text-center"
        />
        , 
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onBlur={handleBlur}
          placeholder="Company Inc."
          className="bg-transparent focus:outline-none text-center"
        />
      </p>
    </div>
  );
}