'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PKCEDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Check user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // Check auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          // Comment out console.log to reduce noise
          // console.log('🔐 Auth state change:', event, session?.user?.id);
          setDebugInfo((prev: any) => ({
            ...prev,
            lastAuthEvent: event,
            lastAuthEventTime: new Date().toISOString()
          }));
        });

        // Get localStorage info
        const localStorageData = typeof window !== 'undefined' ? {
          supabaseAuthToken: localStorage.getItem('supabase-auth-token'),
          supabaseAuthTokenLength: localStorage.getItem('supabase-auth-token')?.length || 0,
          sessionStorageToken: sessionStorage.getItem('supabase-auth-token'),
          sessionStorageTokenLength: sessionStorage.getItem('supabase-auth-token')?.length || 0
        } : {};

        setDebugInfo({
          session: session ? {
            id: session.access_token?.substring(0, 20) + '...',
            expiresAt: session.expires_at,
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              emailConfirmed: session.user.email_confirmed_at
            } : null
          } : null,
          user: user ? {
            id: user.id,
            email: user.email,
            emailConfirmed: user.email_confirmed_at
          } : null,
          sessionError: sessionError?.message,
          userError: userError?.message,
          localStorage: localStorageData,
          timestamp: new Date().toISOString()
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('PKCE Debugger error:', error);
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    };

    checkAuthState();
    
    // Check every 2 seconds
    const interval = setInterval(checkAuthState, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50"
        title="Show PKCE Debugger"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">PKCE Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
        <div className="font-semibold">Session:</div>
        <pre className="bg-gray-100 p-1 rounded text-xs">
          {JSON.stringify(debugInfo.session, null, 2)}
        </pre>
        
        <div className="font-semibold">User:</div>
        <pre className="bg-gray-100 p-1 rounded text-xs">
          {JSON.stringify(debugInfo.user, null, 2)}
        </pre>
        
        <div className="font-semibold">Local Storage:</div>
        <pre className="bg-gray-100 p-1 rounded text-xs">
          {JSON.stringify(debugInfo.localStorage, null, 2)}
        </pre>
        
        <div className="font-semibold">Errors:</div>
        <div className="text-red-600">
          {debugInfo.sessionError && <div>Session: {debugInfo.sessionError}</div>}
          {debugInfo.userError && <div>User: {debugInfo.userError}</div>}
          {debugInfo.error && <div>General: {debugInfo.error}</div>}
        </div>
        
        <div className="font-semibold">Last Auth Event:</div>
        <div className="text-blue-600">
          {debugInfo.lastAuthEvent} at {debugInfo.lastAuthEventTime}
        </div>
        
        <div className="font-semibold">Timestamp:</div>
        <div className="text-gray-600">{debugInfo.timestamp}</div>
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => {
            localStorage.removeItem('supabase-auth-token');
            sessionStorage.removeItem('supabase-auth-token');
            window.location.reload();
          }}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded"
        >
          Clear Storage
        </button>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs bg-gray-600 text-white px-2 py-1 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
