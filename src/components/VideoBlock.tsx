'use client';

import { useState } from 'react';

interface VideoBlockProps {
  id: string;
  content: { url: string | null };
  onContentChange: (id: string, newContent: { url: string | null }) => void;
}

export default function VideoBlock({ id, content, onContentChange }: VideoBlockProps) {
  const [inputValue, setInputValue] = useState(content.url || '');

  const getEmbedUrl = (url: string): string | null => {
    let embedUrl = null;

    // Updated YouTube Regex to include '/shorts/' format
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo URL parsing (unchanged)
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
    
    return embedUrl; // Return null if no match
  };

  const handleEmbed = () => {
    const embedUrl = getEmbedUrl(inputValue);
    if (embedUrl) {
      onContentChange(id, { url: embedUrl });
    } else {
      alert('Invalid video URL. Please use a valid YouTube or Vimeo link.');
    }
  };

  const handleReset = () => {
    onContentChange(id, { url: null });
    setInputValue('');
  }

  return (
    <div className="my-4">
      {content.url ? (
        // If a video URL exists, display the embed
        <div>
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              src={content.url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
          <button onClick={handleReset} className="text-sm text-gray-500 mt-2 hover:text-red-600">
            Change Video
          </button>
        </div>
      ) : (
        // If no URL, show the input form
        <div className="w-full p-8 border-2 border-dashed rounded-lg text-center bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Video Embed</h3>
          <p className="text-sm text-gray-500 mt-1">Paste a YouTube or Vimeo URL below</p>
          <div className="mt-4 flex rounded-md shadow-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              onClick={handleEmbed}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:bg-gray-100"
            >
              Embed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}