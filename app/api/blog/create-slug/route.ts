import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create proper slug for Persian text
    const createSlug = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s\-|+]/g, '') // Keep Persian, Arabic, basic Latin chars, hyphens, pipes, and plus signs
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    const slug = createSlug(title);
    
    return NextResponse.json({ 
      title, 
      slug,
      message: 'Slug created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating slug:', error);
    return NextResponse.json({ error: 'Failed to create slug' }, { status: 500 });
  }
}
