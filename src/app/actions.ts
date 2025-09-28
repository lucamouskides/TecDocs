'use server';

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createProposalFromTemplate(templateId: string) {
  // 1. Fetch the selected template's data
  const { data: template, error: templateError } = await supabase
    .from('templates')
    .select('name, sections, global_styles')
    .eq('id', templateId)
    .single();
    
  if (templateError || !template) {
    console.error("Could not find template:", templateError);
    return;
  }
  
  // 2. Create a new proposal record, copying the template's data
  const newProposalPayload = {
    name: `${template.name} Copy`,
    sections: template.sections,
    global_styles: template.global_styles,
    status: 'draft',
  };
  
  const { data: newProposal, error: proposalError } = await supabase
    .from('proposals')
    .insert(newProposalPayload)
    .select('id')
    .single();

  if (proposalError || !newProposal) {
    console.error("Could not create new proposal:", proposalError);
    return;
  }
  
  // 3. Redirect to the editor for the newly created proposal
  redirect(`/editor/${newProposal.id}`);
}