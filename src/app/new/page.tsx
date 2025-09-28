import { supabase } from "@/lib/supabase";
import TemplateGrid from "@/components/TemplateGrid";
import Link from "next/link";

export default async function NewProposalPage() {
  const { data: templates } = await supabase
    .from('templates')
    .select('id, name');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <Link href="/" className="text-sm font-semibold text-neutral-base-5 hover:text-neutral-base-8 flex items-center gap-1 mb-6">
            &larr; Back to Dashboard
        </Link>
        <h1 className="h3">Create a new proposal</h1>
        <p className="mt-2 text-sm text-neutral-base-5">
            Start from a blank slate or use one of your saved templates.
        </p>

        <TemplateGrid templates={templates || []} />
    </div>
  );
}