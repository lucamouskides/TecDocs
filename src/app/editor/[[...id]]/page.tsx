import Editor, { type Block, type SectionType } from '@/components/Editor';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { type GlobalStyles } from '@/components/GlobalStylesPanel';

type ProposalData = {
  id: string;
  name: string;
  client_name: string | null;
  sections: SectionType[];
  global_styles: GlobalStyles;
}

export default async function EditorPage({ params }: { params: { id: string[] } }) {
  const id = params.id ? params.id[0] : null;

  // Default structure for a brand new proposal
  const defaultProposalData: ProposalData = {
    id: uuidv4(),
    name: 'Untitled Proposal',
    client_name: '',
    sections: [{
      id: uuidv4(),
      blocks: [{
        id: uuidv4(),
        type: 'richText',
        content: { type: 'doc', content: [{ type: 'paragraph' }] }
      }]
    }],
    global_styles: { primaryColor: '#4A90E2', headingFont: 'system-ui, sans-serif' },
  };

  if (!id) {
    // If it's a new proposal, use the default data
    return <main><Editor proposal={defaultProposalData} /></main>;
  }
  
  // If an ID exists, fetch the proposal data
  const { data, error } = await supabase
    .from('proposals')
    .select('id, name, client_name, blocks, sections, global_styles')
    .eq('id', id)
    .single();

  if (error || !data) {
    // If not found, redirect or show an error, but for now, load a new one
    console.error("Error fetching proposal or proposal not found:", error);
    return <main><Editor proposal={defaultProposalData} /></main>;
  }
  
  // Backward compatibility: If 'sections' is null/empty but old 'blocks' data exists, migrate it.
  if ((!data.sections || data.sections.length === 0) && data.blocks && data.blocks.length > 0) {
    data.sections = [{ id: uuidv4(), blocks: data.blocks as Block[] }];
  }

  const proposalData: ProposalData = {
    id: data.id,
    name: data.name || 'Untitled Proposal',
    client_name: data.client_name || '',
    sections: (data.sections as SectionType[]) || defaultProposalData.sections,
    global_styles: data.global_styles || defaultProposalData.global_styles,
  };

  return (
    <main>
      <Editor proposal={proposalData} />
    </main>
  );
}