'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Define a type for our proposals
type Proposal = {
  id: string;
  name: string;
  client_name: string | null;
  status: string | null;
  created_at: string;
};

// Helper to style status badges
const statusStyles: { [key: string]: string } = {
  draft: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .select('id, name, client_name, status, created_at')
        .order('created_at', { ascending: false });

      if (data) {
        setProposals(data);
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

  const filteredProposals = useMemo(() => {
    return proposals.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proposals, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="h3">Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-base-5">A list of all your proposals.</p>
        </div>
        <Link href="/new" className="mt-4 sm:mt-0 inline-flex items-center gap-x-2 rounded-md bg-build-2 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-build-3">
          <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Proposal
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-base-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-10 text-neutral-base-8 ring-1 ring-inset ring-neutral-base-3 placeholder:text-neutral-base-4 focus:ring-2 focus:ring-inset focus:ring-build-3"
          />
        </div>
      </div>

      {/* Proposals List */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-neutral-base-3">
                <thead className="bg-neutral-base-1">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-base-8 sm:pl-6">Proposal</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-base-8">Client</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-base-8">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-base-8">Created</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Edit</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-base-2 bg-white">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-base-8 sm:pl-6">{proposal.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-base-5">{proposal.client_name || 'N/A'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[proposal.status || 'draft'] || 'bg-gray-100 text-gray-800'}`}>
                          {proposal.status || 'draft'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-base-5">{new Date(proposal.created_at).toLocaleDateString()}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/editor/${proposal.id}`} className="text-build-2 hover:text-build-3">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p className="text-center p-4">Loading...</p>}
              {!loading && filteredProposals.length === 0 && <p className="text-center p-4">No proposals found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}