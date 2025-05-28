import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('coursesstudents')
      .select('*')
      .order('created_at', { ascending: false });

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

export async function POST(request: Request) {
  try {
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