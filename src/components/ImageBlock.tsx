'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ImageBlockProps {
  id: string;
  content: { url: string | null };
  onContentChange: (id: string, newContent: { url: string }) => void;
}

export default function ImageBlock({ id, content, onContentChange }: ImageBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      setIsUploading(true);
      setError(null);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;

      // Upload the file to the 'proposals-images' bucket
      const { error: uploadError } = await supabase.storage
        .from('proposals-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('proposals-images')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Could not get public URL for the image.');
      }

      // Update the parent component with the new image URL
      onContentChange(id, { url: urlData.publicUrl });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="my-4">
      {content.url ? (
        // If an image URL exists, display the image
        <img
          src={content.url}
          alt="Uploaded content"
          className="w-full h-auto rounded-lg border"
        />
      ) : (
        // If no image URL, show the upload placeholder
        <div className="w-full p-8 border-2 border-dashed rounded-lg text-center bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Image Block</h3>
          <p className="text-sm text-gray-500 mt-1">Upload a JPG, PNG, or GIF</p>
          <input
            type="file"
            id={`upload-${id}`}
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label
            htmlFor={`upload-${id}`}
            className={`mt-4 inline-block px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer ${
              isUploading
                ? 'bg-gray-400 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}