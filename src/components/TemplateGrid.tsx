'use client';

import { createProposalFromTemplate } from "@/app/actions";
import Link from "next/link";
import { DocumentPlusIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";

interface TemplateGridProps {
    templates: { id: string; name: string | null }[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
    let [isPending, startTransition] = useTransition();

    const handleCreateFromTemplate = (templateId: string) => {
        startTransition(() => {
            createProposalFromTemplate(templateId);
        });
    };

    return (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Blank Proposal Card */}
            <Link href="/editor" className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:border-gray-400">
                <DocumentPlusIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">Blank Proposal</span>
            </Link>

            {/* Template Cards */}
            {templates.map((template) => (
                <button
                    key={template.id}
                    onClick={() => handleCreateFromTemplate(template.id)}
                    disabled={isPending}
                    className="relative flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-6 text-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
                >
                    <DocumentIcon className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-semibold text-gray-900">{template.name}</span>
                    {isPending && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">Loading...</div>}
                </button>
            ))}
        </div>
    );
}