import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه درخواست یافت نشد' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه درخواست یافت نشد' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from('requests')
      .update({ status: body.status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      message: "Request status updated successfully",
      data 
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه درخواست یافت نشد' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت درخواست' },
      { status: 500 }
    );
  }
} 