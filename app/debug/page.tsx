"use client";

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [userAgent, setUserAgent] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    });
    
    setUserAgent(navigator.userAgent);
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl font-bold mb-8 text-red-600">Debug Page - Vercel Issues</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Environment Variables</h2>
          <pre className="bg-white p-4 rounded border overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Browser Info</h2>
          <p><strong>User Agent:</strong> {userAgent}</p>
          <p><strong>Timestamp:</strong> {timestamp}</p>
          <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">CSS Test</h2>
          <p className="text-black bg-white p-4 border-2 border-black">
            This text should be BLACK on WHITE background
          </p>
          <p className="text-white bg-black p-4 border-2 border-white mt-4">
            This text should be WHITE on BLACK background
          </p>
          <p className="text-red-600 bg-yellow-200 p-4 border-2 border-red-600 mt-4">
            This text should be RED on YELLOW background
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">Component Test</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Test Button
          </button>
          <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
            <p className="text-green-800">Green box with text</p>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Font Test</h2>
          <p className="text-2xl font-bold">Bold Text - 2XL</p>
          <p className="text-xl">Large Text - XL</p>
          <p className="text-lg">Medium Text - LG</p>
          <p className="text-base">Normal Text - Base</p>
          <p className="text-sm">Small Text - SM</p>
        </div>
      </div>
    </div>
  );
}
