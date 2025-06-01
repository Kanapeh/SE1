import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createApiClient();

    const { data, error } = await supabase
      .from('coursesstudents')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت دوره‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createApiClient();
    const course = await request.json();

    const { data, error } = await supabase
      .from('coursesstudents')
      .insert(course)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد دوره' },
      { status: 500 }
    );
  }
}