'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';

export default function SignatureBlock() {
  const sigPad = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigPad.current?.clear();
  };
  
  // Note: Saving the signature data would require updating the parent state,
  // which we can add later if needed. For now, it's a visual component.

  return (
    <div className="my-4 p-4 border-2 border-dashed rounded-lg">
        <h3 className="font-semibold">Please Sign Below:</h3>
        <div className="bg-gray-100 mt-2 rounded">
            <SignatureCanvas 
                ref={sigPad}
                penColor='black'
                canvasProps={{className: 'w-full h-48'}} 
            />
        </div>
        <button onClick={clear} className="text-sm text-gray-500 mt-2 hover:text-blue-600">
            Clear
        </button>
    </div>
  );
}