'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Upload, 
  Camera, 
  X, 
  Check, 
  AlertCircle,
  User,
  ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarUploaderProps {
  currentAvatar?: string | null;
  teacherId: string;
  teacherName?: string;
  onAvatarUpdate?: (newAvatar: string) => void;
  className?: string;
}

export default function AvatarUploader({ 
  currentAvatar, 
  teacherId, 
  teacherName = "معلم",
  onAvatarUpdate,
  className = "" 
}: AvatarUploaderProps) {
  const [avatar, setAvatar] = useState<string | null>(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('teacherId', teacherId);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'خطا در آپلود تصویر');
      }

      setAvatar(result.avatar);
      setSuccess(true);
      onAvatarUpdate?.(result.avatar);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setError(error.message || 'خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('avatar', new File([], ''));
      formData.append('teacherId', teacherId);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAvatar(null);
        onAvatarUpdate?.(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'خطا در حذف تصویر');
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      setError('خطا در حذف تصویر');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Avatar Display */}
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={avatar || undefined} alt={teacherName} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(teacherName)}
            </AvatarFallback>
          </Avatar>
          
          {avatar && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={removeAvatar}
              disabled={uploading}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            تصویر پروفایل
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            JPG، PNG یا WebP تا 5MB
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className={`transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}>
        <CardContent className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="space-y-4"
          >
            {/* Drag & Drop Area */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
                ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
              `}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={uploading}
              />

              <div className="space-y-4">
                {uploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      در حال آپلود...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-12 h-12 text-gray-400">
                      {dragActive ? (
                        <Upload className="w-full h-full" />
                      ) : (
                        <ImageIcon className="w-full h-full" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {dragActive ? 'فایل را اینجا رها کنید' : 'تصویر خود را انتخاب کنید'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        یا فایل را اینجا بکشید و رها کنید
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                onClick={openFileDialog}
                disabled={uploading}
                className="flex-1 flex items-center gap-2"
                variant="outline"
              >
                <Camera className="w-4 h-4" />
                انتخاب تصویر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </Badge>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Badge variant="default" className="flex items-center gap-1 bg-green-500">
              <Check className="w-3 h-3" />
              تصویر با موفقیت آپلود شد
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
