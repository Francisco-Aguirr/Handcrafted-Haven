// src/app/dashboard/components/RequestsList.tsx
"use client";

import { useState } from "react";

interface ArtisanRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

interface RequestsListProps {
  requests: ArtisanRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RequestsList({ requests, onApprove, onReject }: RequestsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-xl text-gray-600">No pending requests</p>
        <p className="text-gray-500 mt-2">All requests have been processed</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Showing <span className="font-bold">{requests.length}</span> pending requests
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Quick actions:</span>
          <button
            onClick={() => {
              if (confirm("Approve all pending requests?")) {
                requests.forEach(r => onApprove(r.id));
              }
            }}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
          >
            Approve all
          </button>
        </div>
      </div>

      {requests.map((r) => (
        <div
          key={r.id}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0 flex items-start space-x-4">
              {/* Avatar del usuario */}
              <div className="flex-shrink-0">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={`${r.first_name} ${r.last_name}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-800">
                      {r.first_name?.[0] || r.email?.[0] || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Información del usuario */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Solicitud #{r.id.substring(0, 8)}...
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    {formatDate(r.created_at)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-800">
                  {r.first_name} {r.last_name}
                </h3>
                
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {r.email}
                  </p>
                  {r.phone && (
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {r.phone}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">User ID:</span> {r.user_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => {
                  if (confirm(`¿Aprobar la solicitud de ${r.first_name} ${r.last_name}?`)) {
                    onApprove(r.id);
                  }
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aprobar
              </button>

              <button
                onClick={() => {
                  if (confirm(`¿Rechazar la solicitud de ${r.first_name} ${r.last_name}?`)) {
                    onReject(r.id);
                  }
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}