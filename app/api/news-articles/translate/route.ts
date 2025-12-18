import { NextRequest, NextResponse } from 'next/server';

/**
 * API برای ترجمه متن
 * در اینجا می‌توان از API های ترجمه مانند Google Translate استفاده کرد
 * برای نمونه، یک ترجمه ساده انجام می‌دهیم
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLang = 'en', targetLang = 'fa' } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // در اینجا می‌توان از API ترجمه واقعی استفاده کرد
    // برای نمونه، یک ترجمه ساده انجام می‌دهیم
    const translation = await translateText(text, sourceLang, targetLang);

    return NextResponse.json({
      success: true,
      data: {
        original: text,
        translation: translation,
        source_language: sourceLang,
        target_language: targetLang
      }
    });

  } catch (error) {
    console.error('Error in translate API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * تابع ترجمه (نمونه - در واقعیت باید از API واقعی استفاده شود)
 */
async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  // این یک نمونه ساده است
  // در واقعیت باید از Google Translate API یا سرویس مشابه استفاده شود
  
  // برای نمونه، چند ترجمه ساده
  const translations: Record<string, string> = {
    'Artificial intelligence continues to revolutionize various industries.': 
      'هوش مصنوعی همچنان در حال انقلاب در صنایع مختلف است.',
    'Machine learning algorithms are becoming more sophisticated.': 
      'الگوریتم‌های یادگیری ماشین در حال پیچیده‌تر شدن هستند.',
    'Regular exercise is essential for maintaining good health.': 
      'ورزش منظم برای حفظ سلامتی ضروری است.',
    'It helps improve cardiovascular health.': 
      'به بهبود سلامت قلب و عروق کمک می‌کند.'
  };

  // اگر ترجمه از قبل وجود دارد، برگردان
  if (translations[text]) {
    return translations[text];
  }

  // در غیر این صورت، یک ترجمه ساده انجام می‌دهیم
  // در واقعیت باید از API استفاده شود
  return `[ترجمه: ${text}]`;
}

