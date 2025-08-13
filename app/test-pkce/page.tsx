'use client';

import { useState, useEffect } from 'react';
import { supabase, clearSupabaseStorage, clearPKCEState } from '@/lib/supabase';

export default function TestPKCEPage() {
  const [pkceState, setPkceState] = useState<any>({});
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPKCEState();
    checkSession();
  }, []);

  const checkPKCEState = () => {
    if (typeof window === 'undefined') return;

    const state: any = {};
    
    // Check localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('pkce') || key.includes('supabase') || key.includes('sb-')) {
        try {
          state[key] = localStorage.getItem(key);
        } catch (e) {
          state[key] = 'Error reading';
        }
      }
    });

    // Check sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('pkce') || key.includes('supabase') || key.includes('sb-')) {
        try {
          state[key] = sessionStorage.getItem(key);
        } catch (e) {
          state[key] = 'Error reading';
        }
      }
    });

    setPkceState(state);
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  const startGoogleOAuth = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ OAuth error:', error);
        alert(`OAuth error: ${error.message}`);
        return;
      }

      console.log('✅ OAuth initiated:', data);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('💥 Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAllStorage = () => {
    clearSupabaseStorage();
    clearPKCEState();
    checkPKCEState();
    alert('Storage cleared');
  };

  const refreshState = () => {
    checkPKCEState();
    checkSession();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PKCE Flow Debug</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PKCE State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">PKCE Storage State</h2>
            <div className="space-y-2">
              {Object.keys(pkceState).length === 0 ? (
                <p className="text-gray-500">No PKCE-related storage found</p>
              ) : (
                Object.entries(pkceState).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-mono text-blue-600">{key}:</span>
                    <span className="ml-2 text-gray-700">
                      {typeof value === 'string' && value.length > 100 
                        ? `${value.substring(0, 100)}...` 
                        : String(value)
                      }
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Session</h2>
            {session ? (
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">User ID:</span> {session.user.id}</div>
                <div><span className="font-semibold">Email:</span> {session.user.email}</div>
                <div><span className="font-semibold">Created:</span> {new Date(session.user.created_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-gray-500">No active session</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startGoogleOAuth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Google OAuth'}
            </button>
            
            <button
              onClick={clearAllStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear All Storage
            </button>
            
            <button
              onClick={refreshState}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh State
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click "Start Google OAuth" to initiate the flow</li>
            <li>Complete the OAuth flow in the new window</li>
            <li>Return to this page and check the storage state</li>
            <li>Look for any PKCE-related errors in the browser console</li>
            <li>Use "Clear All Storage" if you need to reset the state</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
