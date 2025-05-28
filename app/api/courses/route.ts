import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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