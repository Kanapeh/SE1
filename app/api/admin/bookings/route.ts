import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase environment variables for admin bookings');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    // Fetch all bookings with payment information
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin bookings:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch bookings' 
      }, { status: 500 });
    }

    console.log('✅ Admin bookings fetched successfully, count:', bookings?.length || 0);

    return NextResponse.json({ 
      success: true, 
      bookings: bookings || []
    });

  } catch (error: any) {
    console.error('Unexpected error in admin bookings:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
