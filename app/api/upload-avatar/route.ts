import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    const teacherId = formData.get('teacherId') as string;

    if (!file) {
      return NextResponse.json({ error: 'فایلی انتخاب نشده است' }, { status: 400 });
    }

    if (!teacherId) {
      return NextResponse.json({ error: 'شناسه معلم ارسال نشده است' }, { status: 400 });
    }

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
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase environment variables for avatar upload');
      return NextResponse.json({ error: 'خطای پیکربندی سرور' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    // Update teacher's avatar in database
    const { data, error } = await supabase
      .from('teachers')
      .update({ 
        avatar: dataUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', teacherId)
      .select('avatar');

    if (error) {
      console.error('Error updating teacher avatar:', error);
      return NextResponse.json({ 
        error: 'خطا در به‌روزرسانی تصویر پروفایل' 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'معلم مورد نظر یافت نشد' 
      }, { status: 404 });
    }

    console.log('✅ Avatar uploaded successfully for teacher:', teacherId);

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
