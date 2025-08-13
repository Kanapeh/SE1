'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoCall from '@/app/components/VideoCall';
import { Video, User, GraduationCap } from 'lucide-react';

export default function TestVideoPage() {
  const [isTeacherCall, setIsTeacherCall] = useState(false);
  const [isStudentCall, setIsStudentCall] = useState(false);

  const startTeacherCall = () => {
    setIsTeacherCall(true);
    setIsStudentCall(false);
  };

  const startStudentCall = () => {
    setIsStudentCall(true);
    setIsTeacherCall(false);
  };

  const endCall = () => {
    setIsTeacherCall(false);
    setIsStudentCall(false);
  };

  if (isTeacherCall) {
    return (
      <VideoCall
        isTeacher={true}
        teacherId="test-teacher"
        studentId="test-student"
        classId="test-class"
        onCallEnd={endCall}
      />
    );
  }

  if (isStudentCall) {
    return (
      <VideoCall
        isTeacher={false}
        teacherId="test-teacher"
        studentId="test-student"
        classId="test-class"
        onCallEnd={endCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              تست سیستم تماس تصویری
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              برای تست عملکرد سیستم، یکی از گزینه‌های زیر را انتخاب کنید
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              onClick={startTeacherCall}
              className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <User className="w-6 h-6" />
              <span>تست به عنوان معلم</span>
            </Button>
            
            <Button 
              onClick={startStudentCall}
              className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <GraduationCap className="w-6 h-6" />
              <span>تست به عنوان دانش‌آموز</span>
            </Button>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                این صفحه فقط برای تست سیستم در نظر گرفته شده است
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
