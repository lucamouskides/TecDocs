'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import SignatureCanvas from 'react-signature-canvas';

interface ProposalActionsProps {
  proposalId: string;
  initialStatus: string;
}

export default function ProposalActions({ proposalId, initialStatus }: ProposalActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const sigPad = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigPad.current?.clear();
  };

  const handleAcceptAndSign = async () => {
    if (sigPad.current?.isEmpty()) {
      alert('Please provide a signature before accepting.');
      return;
    }

    setLoading(true);
    // Get the signature as a transparent PNG image data URL
    const signatureDataUrl = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');

    const { error } = await supabase
      .from('proposals')
      .update({ status: 'accepted', signature: signatureDataUrl })
      .eq('id', proposalId);

    if (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);
    } else {
      setStatus('accepted');
      // We can optionally refresh the page to show the saved signature
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 border-t-2 border-dashed">
      <h3 className="text-lg font-semibold text-gray-800">Confirm and Accept</h3>
      <p className="text-sm text-gray-600 mt-1">
        By signing below, you agree to the terms outlined in this proposal.
      </p>

      <div className="mt-4 border bg-white rounded-md">
        <SignatureCanvas 
            ref={sigPad}
            penColor='black'
            canvasProps={{className: 'w-full h-40'}} 
        />
      </div>
      <div className="text-right">
        <button onClick={clearSignature} className="text-sm font-semibold text-neutral-base-5 hover:text-build-2 mt-1">
            Clear
        </button>
      </div>
      
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={() => alert('Decline functionality to be implemented.')} // Placeholder for decline
          disabled={loading}
          className="px-8 py-3 font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
        >
          Decline
        </button>
        <button
          onClick={handleAcceptAndSign}
          disabled={loading}
          className="px-8 py-3 font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Accepting...' : 'Accept & Sign'}
        </button>
      </div>
    </div>
  );
}