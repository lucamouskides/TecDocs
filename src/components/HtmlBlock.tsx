'use client';

import { useState } from 'react';

interface HtmlBlockProps {
  id: string;
  content: { html: string };
  onContentChange: (id: string, newContent: { html: string }) => void;
}

export default function HtmlBlock({ id, content, onContentChange }: HtmlBlockProps) {
  const [html, setHtml] = useState(content.html || '');

  const handleBlur = () => {
    onContentChange(id, { html });
  };

  return (
    <div className="my-4 p-4 bg-gray-800 text-white rounded-lg font-mono">
      <label className="text-sm text-gray-400">HTML / Embed Code</label>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        onBlur={handleBlur}
        placeholder='<iframe src="..."></iframe>'
        className="w-full mt-2 p-2 text-sm bg-gray-900 text-green-400 rounded focus:outline-none resize-y"
        rows={5}
      />
    </div>
  );
}