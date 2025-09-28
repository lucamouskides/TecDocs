'use client';

import { createContext, useContext, useState } from 'react';
import type { Editor } from '@tiptap/core';

interface EditorContextType {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

const EditorContext = createContext<EditorContextType>({
  editor: null,
  setEditor: () => {},
});

export const useEditorContext = () => useContext(EditorContext);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
};