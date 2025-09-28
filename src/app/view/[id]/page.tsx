import { supabase } from '@/lib/supabase';
import PricingTable, { type LineItem } from '@/components/PricingTable';
import ProposalActions from '@/components/ProposalActions';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import parse from 'html-react-parser';
import { type Block } from '@/types/blocks';
import { type GlobalStyles } from '@/components/GlobalStylesPanel';
import GlobalStylesInjector from '@/components/GlobalStylesInjector';

// --- Read-Only View Components for Blocks ---

function RichTextRenderer({ content }: { content: any }) {
  if (content && content.type === 'doc') {
    const html = generateHTML(content, [StarterKit]);
    return <div className="prose prose-lg max-w-none">{parse(html)}</div>;
  }
  return null;
}

function ButtonBlockView({ content }: { content: { text: string; url: string } }) {
  return (
    <div className="text-center my-6">
      <a href={content.url || '#'} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'var(--primary-color)' }} className="inline-block px-8 py-3 font-semibold rounded-lg text-white no-underline">
        {content.text || 'Click Here'}
      </a>
    </div>
  );
}

function QuoteBlockView({ content }: { content: { text: string; author: string } }) {
  return (
    <blockquote className="my-6 p-6 bg-gray-50 border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
      <p className="text-xl italic text-gray-700">"{content.text}"</p>
      {content.author && <footer className="mt-4 text-right font-semibold text-gray-600">— {content.author}</footer>}
    </blockquote>
  );
}

function ImageWithTextBlockView({ content }: { content: { imageUrl: string | null; text: any } }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 my-4 items-center">
      <div className="w-full md:w-1/2 flex-shrink-0">
        {content.imageUrl && <img src={content.imageUrl} alt="Proposal content" className="w-full h-auto rounded-lg"/>}
      </div>
      <div className="w-full md:w-1/2">
        <RichTextRenderer content={content.text} />
      </div>
    </div>
  );
}

function TestimonialBlockView({ content }: { content: { text: string; author: string; company: string } }) {
  return (
    <div className="my-6 p-6 text-center bg-slate-50 rounded-lg">
       <p className="text-lg font-medium text-gray-800">"{content.text}"</p>
       <p className="mt-4 text-gray-600">
        <span className="font-bold text-slate-700">{content.author}</span>, {content.company}
      </p>
    </div>
  );
}

function TableBlockView({ content }: { content: { headers: string[]; rows: string[][] } }) {
    return (
        <div className="my-4 border rounded-lg overflow-hidden">
            <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {content.headers?.map((header, index) => (
                            <th key={index} className="px-4 py-3 text-left font-semibold text-gray-700">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {content.rows?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-gray-800">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function ViewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch the 'signature' column
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('id, name, status, blocks, global_styles, signature')
    .eq('id', id)
    .single();

  if (error || !proposal) {
    return <div className="text-center p-12">Proposal not found.</div>;
  }

  const blocks: Block[] = (proposal.blocks as Block[]) || [];
  const styles: GlobalStyles = proposal.global_styles || {};
  const isAccepted = proposal.status === 'accepted';

  return (
    <>
      <GlobalStylesInjector styles={styles} />
      <div className="bg-gray-100 min-h-screen">
        <main className="max-w-4xl mx-auto bg-white shadow-lg">
          <header className="p-8 border-b">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--primary-color)' }}>{proposal.name}</h1>
          </header>
          <div className="p-8">
            {blocks.map((block) => {
              if (!block || !block.content) return null;

              const hasBackground = block.styles?.backgroundColor && block.styles.backgroundColor !== '#ffffff' && block.styles.backgroundColor;
              const wrapperClasses = hasBackground ? 'p-4 rounded-lg' : '';

              return (
                <div key={block.id} style={block.styles} className={wrapperClasses}>
                  {(() => {
                    switch (block.type) {
                      case 'richText': return <RichTextRenderer content={block.content} />;
                      case 'pricingTable': return <PricingTable id={block.id} initialItems={block.content} />;
                      case 'image': return block.content.url ? <img src={block.content.url} alt="Proposal content" className="w-full h-auto rounded-lg"/> : null;
                      case 'video': return block.content.url ? <div className="aspect-w-16 aspect-h-9 w-full"><iframe src={block.content.url} frameBorder="0" allowFullScreen className="w-full h-full rounded-lg"></iframe></div> : null;
                      case 'button': return <ButtonBlockView content={block.content} />;
                      case 'quote': return <QuoteBlockView content={block.content} />;
                      case 'divider': return <hr className="my-8"/>;
                      case 'spacer': return <div style={{ height: `${block.content.height || 48}px` }} />;
                      case 'html': return <div dangerouslySetInnerHTML={{ __html: block.content.html || '' }} />;
                      case 'columns': return <div className="flex gap-4 my-4"><div className="w-1/2 bg-gray-50 p-4 rounded min-h-[5rem]"></div><div className="w-1/2 bg-gray-50 p-4 rounded min-h-[5rem]"></div></div>;
                      case 'imageWithText': return <ImageWithTextBlockView content={block.content} />;
                      case 'testimonial': return <TestimonialBlockView content={block.content} />;
                      case 'signature': return null; // We render the signature in the actions box below
                      case 'table': return <TableBlockView content={block.content} />;
                      default: return null;
                    }
                  })()}
                </div>
              );
            })}
          </div>
          
          {/* --- UPDATED Acceptance Section --- */}
          {isAccepted && proposal.signature ? (
            // If accepted and signed, show the signature image
            <div className="p-6 bg-gray-50 border-t-2 border-dashed">
                <h3 className="text-lg font-semibold text-green-700">Proposal Accepted</h3>
                <div className="mt-4 p-4 border bg-white rounded-md">
                    <img src={proposal.signature} alt="Client Signature" className="mx-auto" />
                </div>
            </div>
          ) : (
            // Otherwise, show the interactive signature and accept component
            <ProposalActions proposalId={proposal.id} initialStatus={proposal.status || 'draft'} />
          )}
        </main>
      </div>
    </>
  );
}