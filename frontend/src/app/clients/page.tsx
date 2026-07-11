'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ClientForm } from '@/components/ClientForm';
import { clientsAPI } from '@/lib/api';
import { Client } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await clientsAPI.delete(id);
        fetchClients();
      } catch (error) {
        alert('Failed to delete client');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="mt-3 text-base text-gray-600">Manage client details and project relationships.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex h-11 items-center gap-2 justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
          >
            + New Client
          </button>
        )}
      </div>

      {showForm && (
  <div className="mb-10 mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
    <ClientForm
      onSuccess={() => {
        setShowForm(false);
        fetchClients();
      }}
      onCancel={() => setShowForm(false)}
    />
  </div>
)}

      {clients.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mb-3 text-2xl" aria-hidden="true">●</div>
          <p className="text-base font-medium text-gray-900">No clients yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first client to get started.</p>
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <div key={client.id} className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300">
              <div className="p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 text-base text-gray-600">
                  {client.email && <p className="truncate">{client.email}</p>}
                  {client.phone && <p className="truncate">{client.phone}</p>}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-gray-50/50 px-10 py-6">
                <div className="mb-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{client.projects?.length || 0} Project{(client.projects?.length || 0) !== 1 ? 's' : ''}</div>
                <div className="flex gap-4">
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
