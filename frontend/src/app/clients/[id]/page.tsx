'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ClientForm } from '@/components/ClientForm';
import { ProjectForm } from '@/components/ProjectForm';
import { clientsAPI, projectsAPI } from '@/lib/api';
import { Client, Project } from '@/lib/types';

export default function ClientDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getOne(id);
      setClient(response.data);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Failed to fetch client');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleDeleteProject = async (projectId: number) => {
    if (confirm('Are you sure?')) {
      try {
        await projectsAPI.delete(projectId);
        fetchClient();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!client) return <div>Client not found</div>;

  return (
    <div>
      <Link href="/clients" className="text-blue-600 hover:text-blue-700 mb-4">
        ← Back to Clients
      </Link>

      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{client.name}</h1>
            {client.email && <p className="text-gray-600">{client.email}</p>}
            {client.phone && <p className="text-gray-600">{client.phone}</p>}
          </div>
          {!showEditForm && (
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>

        {showEditForm && (
          <div className="mt-6">
            <ClientForm
              initialData={client}
              onSuccess={() => {
                setShowEditForm(false);
                fetchClient();
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
        {!showProjectForm && (
          <button
            onClick={() => setShowProjectForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + New Project
          </button>
        )}
      </div>

      {showProjectForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <ProjectForm
            initialData={{ clientId: client.id }}
            onSuccess={() => {
              setShowProjectForm(false);
              fetchClient();
            }}
            onCancel={() => setShowProjectForm(false)}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">No projects for this client yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{project.description}</p>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-4">
                {project.status}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}