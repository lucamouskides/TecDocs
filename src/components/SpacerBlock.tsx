'use client';

import { useState } from 'react';

interface SpacerBlockProps {
  id: string;
  content: { height: number };
  onContentChange: (id: string, newContent: { height: number }) => void;
}

export default function SpacerBlock({ id, content, onContentChange }: SpacerBlockProps) {
  const [height, setHeight] = useState(content.height || 48);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    setHeight(newHeight);
    onContentChange(id, { height: newHeight });
  };

  return (
    <div className="my-4 group relative">
      <div
        className="w-full bg-blue-100 bg-opacity-50 transition-all"
        style={{ height: `${height}px` }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="range"
          min="20"
          max="200"
          step="4"
          value={height}
          onChange={handleHeightChange}
          className="w-48 cursor-pointer"
        />
        <span className="ml-2 text-xs text-blue-800 bg-blue-100 p-1 rounded">{height}px</span>
      </div>
    </div>
  );
}