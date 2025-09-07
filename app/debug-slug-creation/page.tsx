"use client";

import { useState } from 'react';

export default function DebugSlugCreation() {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSlugCreation = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/blog/create-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to create slug' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 تست ایجاد Slug
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان مقاله:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: راهنمای کامل یادگیری زبان انگلیسی در سال ۲۰۲۵ | تکنیک‌ها + مثال‌های کاربردی"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={testSlugCreation}
              disabled={loading || !title.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال ایجاد...' : 'ایجاد Slug'}
            </button>
            
            {result && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-semibold mb-3">نتیجه:</h3>
                <div className="space-y-2">
                  <div>
                    <strong>عنوان اصلی:</strong>
                    <p className="text-gray-700">{result.title}</p>
                  </div>
                  <div>
                    <strong>Slug ایجاد شده:</strong>
                    <p className="text-gray-700 font-mono bg-white p-2 rounded border">
                      {result.slug}
                    </p>
                  </div>
                  {result.error && (
                    <div className="text-red-600">
                      <strong>خطا:</strong> {result.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
