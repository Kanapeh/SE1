'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PaymentDebugPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDebugTests();
  }, []);

  const runDebugTests = async () => {
    const info: any = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      },
      urlParams: {
        booking: searchParams?.get('booking') ? 'Present' : 'Missing',
      },
      tests: {}
    };

    // Test 1: Supabase connection
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      info.tests.supabaseConnection = {
        success: !error,
        error: error?.message || null,
        user: user ? 'Authenticated' : 'Not authenticated'
      };
    } catch (error: any) {
      info.tests.supabaseConnection = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Booking data parsing
    try {
      const bookingParam = searchParams?.get('booking');
      if (bookingParam) {
        const data = JSON.parse(decodeURIComponent(bookingParam));
        info.tests.bookingDataParsing = {
          success: true,
          data: data
        };
      } else {
        info.tests.bookingDataParsing = {
          success: false,
          error: 'No booking parameter found'
        };
      }
    } catch (error: any) {
      info.tests.bookingDataParsing = {
        success: false,
        error: error.message
      };
    }

    // Test 3: API endpoint test
    try {
      const testPayload = {
        teacher_id: 'test-teacher-id',
        student_id: 'test-student-id',
        student_name: 'Test Student',
        student_email: 'test@example.com',
        student_phone: '09123456789',
        selected_days: ['saturday'],
        selected_hours: ['morning'],
        session_type: 'online',
        duration: 60,
        total_price: 100000,
        number_of_sessions: 1,
        notes: 'Test booking',
        transaction_id: 'TEST-123',
        receipt_image: 'data:image/png;base64,test',
        payment_notes: 'Test payment',
        payment_status: 'pending'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      const result = await response.json();
      info.tests.apiEndpoint = {
        success: response.ok,
        status: response.status,
        result: result
      };
    } catch (error: any) {
      info.tests.apiEndpoint = {
        success: false,
        error: error.message
      };
    }

    setDebugInfo(info);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Running debug tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Payment Page Debug Information</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm">{JSON.stringify(debugInfo.environment, null, 2)}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">URL Parameters</h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm">{JSON.stringify(debugInfo.urlParams, null, 2)}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Test Results</h2>
              <div className="space-y-4">
                {Object.entries(debugInfo.tests).map(([testName, result]: [string, any]) => (
                  <div key={testName} className="bg-gray-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">{testName}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <pre className="text-sm text-gray-600">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/payment')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go to Payment Page
              </button>
              <button
                onClick={runDebugTests}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Run Tests Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
