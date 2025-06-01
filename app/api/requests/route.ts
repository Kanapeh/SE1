import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase-api';

// Add dynamic configuration
export const dynamic = 'force-dynamic';

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  level: string;
  classType: string;
  preferredTime: string;
  [key: string]: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createApiClient();

    const { data, error } = await supabase
      .from('requests')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت درخواست‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createApiClient();
    const requestData = await request.json();

    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد درخواست' },
      { status: 500 }
    );
  }
}
