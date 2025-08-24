import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const teacher_id = searchParams.get('teacher_id');

    if (!user_id && !teacher_id) {
      return NextResponse.json({ 
        error: 'user_id or teacher_id is required' 
      }, { status: 400 });
    }

    let query = supabase.from('notifications').select('*');

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (teacher_id) {
      query = query.eq('teacher_id', teacher_id);
    }

    const { data: notifications, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching notifications:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      notifications: notifications || [],
      success: true 
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'notification id is required' 
      }, { status: 400 });
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ read: read !== undefined ? read : true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating notification:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      notification,
      success: true 
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
