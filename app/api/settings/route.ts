import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت تنظیمات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const settings = await request.json();

    const { data, error } = await supabase
      .from('settings')
      .upsert(settings)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'خطا در ذخیره تنظیمات' },
      { status: 500 }
    );
  }
} 