import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();
    const { id } = params;
    const body = await request.json();

    // Update comment status
    const { data, error } = await supabase
      .from('comments')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return NextResponse.json(
        { error: 'خطا در بروزرسانی نظر', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'وضعیت نظر با موفقیت بروزرسانی شد',
      data
    });
  } catch (error: any) {
    console.error('Error in PATCH comment:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی نظر', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();
    const { id } = params;

    // Delete comment
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json(
        { error: 'خطا در حذف نظر', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'نظر با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('Error in DELETE comment:', error);
    return NextResponse.json(
      { error: 'خطا در حذف نظر', details: error.message },
      { status: 500 }
      );
  }
} 