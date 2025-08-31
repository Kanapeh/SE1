import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    // Check if request is JSON (from student profile)
    const contentType = request.headers.get('content-type');
    let file: File | null = null;
    let userId: string | null = null;
    let userType: string = 'teacher'; // default
    let base64Avatar: string | null = null;

    if (contentType?.includes('application/json')) {
      // Handle JSON request from student profile
      const body = await request.json();
      base64Avatar = body.avatar;
      userType = body.userType || 'student';
      userId = body.userId; // Get userId from request body
      
      if (!userId) {
        return NextResponse.json({ error: 'شناسه کاربر ارسال نشده است' }, { status: 400 });
      }
    } else {
      // Handle FormData request (original teacher flow)
      const formData = await request.formData();
      file = formData.get('avatar') as File;
      userId = formData.get('teacherId') as string;
      userType = 'teacher';
    }

    if (!userId) {
      return NextResponse.json({ error: 'شناسه کاربر ارسال نشده است' }, { status: 400 });
    }

    let dataUrl: string | null = null;

    // Handle avatar removal for FormData (empty file)
    if (file !== null && file.size === 0) {
      // Avatar removal logic will be handled below
      dataUrl = null;
    }
    // Handle base64 avatar (from JSON)
    else if (base64Avatar) {
      dataUrl = base64Avatar;
    }
    // Handle file upload (from FormData)
    else if (file && file.size > 0) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: 'حجم فایل نباید بیشتر از 5 مگابایت باشد' 
        }, { status: 400 });
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: 'فقط فایل‌های تصویری (JPG, PNG, WebP) مجاز هستند' 
        }, { status: 400 });
      }

      // Convert file to base64 for storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      dataUrl = `data:${file.type};base64,${base64}`;
    } else {
      return NextResponse.json({ error: 'فایل تصویر ارسال نشده است' }, { status: 400 });
    }

    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables for avatar upload');
      return NextResponse.json({ error: 'خطای پیکربندی سرور' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    // Determine table based on user type
    const tableName = userType === 'student' ? 'students' : 'teachers';

    // Update user's avatar in database
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .update({ 
        avatar: dataUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('avatar');

    if (error) {
      console.error(`Error updating ${userType} avatar:`, error);
      return NextResponse.json({ 
        error: 'خطا در به‌روزرسانی تصویر پروفایل' 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: `${userType === 'student' ? 'دانش‌آموز' : 'معلم'} مورد نظر یافت نشد` 
      }, { status: 404 });
    }

    console.log(`✅ Avatar uploaded successfully for ${userType}:`, userId);

    return NextResponse.json({ 
      success: true, 
      avatar: data[0].avatar,
      message: 'تصویر پروفایل با موفقیت به‌روزرسانی شد'
    });

  } catch (error: any) {
    console.error('Unexpected error in avatar upload:', error);
    return NextResponse.json({ 
      error: 'خطای غیرمنتظره در آپلود تصویر' 
    }, { status: 500 });
  }
}
