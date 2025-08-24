import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin access
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    console.log('🔍 API: Fetching teacher with ID:', id);
    
    // Fetch teacher by ID
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ API: Error fetching teacher:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    console.log('✅ API: Teacher fetched successfully:', data);
    console.log('📅 Available days:', data.available_days);
    console.log('⏰ Available hours:', data.available_hours);
    console.log('🏫 Class types:', data.class_types);
    
    return NextResponse.json({ 
      teacher: data,
      success: true 
    });

  } catch (error) {
    console.error('💥 API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
