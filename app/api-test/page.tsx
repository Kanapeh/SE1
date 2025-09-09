'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      setCurrentUser(user);
      results.tests.currentUser = {
        success: true,
        userId: user?.id,
        email: user?.email
      };

      // Test 2: Test teacher profile API
      if (user?.id) {
        try {
          const teacherResponse = await fetch(`/api/teacher-profile?user_id=${user.id}`);
          const teacherData = await teacherResponse.json();
          
          results.tests.teacherProfile = {
            success: teacherResponse.ok,
            status: teacherResponse.status,
            data: teacherData
          };
        } catch (error: any) {
          results.tests.teacherProfile = {
            success: false,
            error: error.message
          };
        }

        // Test 3: Test student profile API
        try {
          const studentResponse = await fetch(`/api/student-profile?user_id=${user.id}`);
          const studentData = await studentResponse.json();
          
          results.tests.studentProfile = {
            success: studentResponse.ok,
            status: studentResponse.status,
            data: studentData
          };
        } catch (error: any) {
          results.tests.studentProfile = {
            success: false,
            error: error.message
          };
        }
      }

    } catch (error: any) {
      results.tests.currentUser = {
        success: false,
        error: error.message
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Running API tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">API Test Results</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Current User</h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm">{JSON.stringify(testResults.tests.currentUser, null, 2)}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Teacher Profile API</h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm">{JSON.stringify(testResults.tests.teacherProfile, null, 2)}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Student Profile API</h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm">{JSON.stringify(testResults.tests.studentProfile, null, 2)}</pre>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={runTests}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Run Tests Again
              </button>
              <button
                onClick={() => window.location.href = '/complete-profile?type=student'}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test Student Profile Creation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
