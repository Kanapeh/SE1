import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه دوره یافت نشد' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('coursesstudents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت دوره' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه دوره یافت نشد' },
        { status: 400 }
      );
    }

    const course = await request.json();

    const { data, error } = await supabase
      .from('coursesstudents')
      .update(course)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی دوره' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه دوره یافت نشد' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('coursesstudents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'دوره با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'خطا در حذف دوره' },
      { status: 500 }
    );
  }
} 