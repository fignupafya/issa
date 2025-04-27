'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [farmAreas, setFarmAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchFarmAreas = async () => {
      try {
        const response = await fetch('/api/farm-areas');
        const data = await response.json();
        setFarmAreas(data);
      } catch (error) {
        console.error('Error fetching farm areas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchFarmAreas();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Farm Areas</h1>
            <Link
              href="/farm-areas/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add New Farm Area
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {farmAreas.map((farmArea) => (
              <div
                key={farmArea._id}
                className="bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {farmArea.name}
                </h2>
                <p className="text-gray-400 mb-4">
                  API Key: {farmArea.apiKey}
                </p>
                <Link
                  href={`/farm-areas/${farmArea._id}`}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  View Dashboard →
                </Link>
              </div>
            ))}
          </div>

          {farmAreas.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No farm areas found. Create your first farm area to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 