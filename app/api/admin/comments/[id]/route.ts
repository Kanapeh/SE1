import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'وضعیت نامعتبر است' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'وضعیت نظر بروزرسانی شد',
      comment: data
    });

  } catch (error: any) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی نظر' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const resolvedParams = await params;
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({
      message: 'نظر حذف شد'
    });

  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'خطا در حذف نظر' },
      { status: 500 }
    );
  }
} 