import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function GET() {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();

    // Get list of all tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');

    if (tablesError) {
      // Fallback: try to get tables manually
      const { data: manualTables, error: manualError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (manualError) {
        return NextResponse.json(
          { error: 'Failed to get tables info', details: manualError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Tables info retrieved manually',
        tables: manualTables?.map(t => t.table_name) || [],
        method: 'manual'
      });
    }

    return NextResponse.json({
      message: 'Tables info retrieved successfully',
      tables: tables || [],
      method: 'rpc'
    });

  } catch (error: any) {
    console.error('Error getting tables info:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات جداول', details: error.message },
      { status: 500 }
    );
  }
}
