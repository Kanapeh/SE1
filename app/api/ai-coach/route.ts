import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, studentLevel, studentName, conversationHistory } = body;

    // For now, we'll use a more sophisticated mock AI response system
    // In production, this would integrate with OpenAI, Anthropic, or another AI service
    const aiResponse = generateAIResponse(message, studentLevel, studentName, conversationHistory);

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse.text,
        mood: aiResponse.mood,
        suggestions: aiResponse.suggestions,
        exercises: aiResponse.exercises,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in AI coach API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

function generateAIResponse(message: string, studentLevel: string, studentName: string, conversationHistory: any[]) {
  const lowerMessage = message.toLowerCase();
  
  // Determine response based on message content and context
  let response = '';
  let mood: 'happy' | 'excited' | 'thinking' | 'encouraging' = 'thinking';
  let suggestions: string[] = [];
  let exercises: any[] = [];

  // Greeting responses
  if (lowerMessage.includes('سلام') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    response = `سلام ${studentName} عزیز! خیلی خوشحالم که با من صحبت می‌کنید! 😊 امروز چه چیزی می‌خواهید یاد بگیرید؟`;
    mood = 'happy';
    suggestions = ['گرامر', 'مکالمه', 'واژگان', 'تست'];
  }
  
  // Grammar related
  else if (lowerMessage.includes('گرامر') || lowerMessage.includes('grammar') || lowerMessage.includes('قواعد')) {
    response = `عالی! گرامر یکی از مهم‌ترین بخش‌های یادگیری زبان است. 📚 بیایید با قواعد ساده شروع کنیم.`;
    mood = 'encouraging';
    suggestions = ['زمان حال ساده', 'زمان گذشته', 'زمان آینده', 'صفات'];
    exercises = [
      {
        type: 'grammar',
        title: 'تمرین زمان حال ساده',
        description: 'جملات زیر را به زمان حال ساده تبدیل کنید',
        difficulty: studentLevel === 'مبتدی' ? 'easy' : 'medium'
      }
    ];
  }
  
  // Speaking related
  else if (lowerMessage.includes('مکالمه') || lowerMessage.includes('speaking') || lowerMessage.includes('صحبت')) {
    response = `مکالمه بهترین راه یادگیری زبان است! 🗣️ بیایید با جملات روزمره شروع کنیم.`;
    mood = 'excited';
    suggestions = ['احوالپرسی', 'خرید کردن', 'رستوران', 'سفر'];
    exercises = [
      {
        type: 'speaking',
        title: 'مکالمه روزمره',
        description: 'در مورد کارهای روزانه خود صحبت کنید',
        difficulty: 'easy'
      }
    ];
  }
  
  // Vocabulary related
  else if (lowerMessage.includes('واژگان') || lowerMessage.includes('vocabulary') || lowerMessage.includes('کلمه')) {
    response = `واژگان کلید موفقیت در یادگیری زبان است! 🔑 بیایید کلمات جدید یاد بگیریم.`;
    mood = 'encouraging';
    suggestions = ['کلمات روزمره', 'کلمات تجاری', 'کلمات آکادمیک', 'اصطلاحات'];
    exercises = [
      {
        type: 'vocabulary',
        title: 'یادگیری کلمات جدید',
        description: 'کلمات زیر را با معنی فارسی جفت کنید',
        difficulty: 'easy'
      }
    ];
  }
  
  // Test related
  else if (lowerMessage.includes('تست') || lowerMessage.includes('test') || lowerMessage.includes('امتحان')) {
    response = `تست‌ها به ما کمک می‌کنند تا پیشرفت خود را ببینیم! 📊 بیایید یک تست کوتاه انجام دهیم.`;
    mood = 'encouraging';
    suggestions = ['تست گرامر', 'تست واژگان', 'تست درک مطلب', 'تست شنیداری'];
    exercises = [
      {
        type: 'test',
        title: 'تست تعیین سطح',
        description: 'سوالات کوتاه برای ارزیابی سطح شما',
        difficulty: 'medium'
      }
    ];
  }
  
  // Help related
  else if (lowerMessage.includes('کمک') || lowerMessage.includes('help') || lowerMessage.includes('راهنما')) {
    response = `من اینجا هستم تا کمکتان کنم! 🤝 چه سوالی دارید؟`;
    mood = 'happy';
    suggestions = ['شروع یادگیری', 'انتخاب موضوع', 'برنامه ریزی', 'مشکلات'];
  }
  
  // Motivation related
  else if (lowerMessage.includes('انگیزه') || lowerMessage.includes('motivation') || lowerMessage.includes('خسته')) {
    response = `یادگیری زبان یک سفر زیبا است! 🌟 هر قدم کوچک شما را به هدف نزدیک‌تر می‌کند. ادامه دهید!`;
    mood = 'encouraging';
    suggestions = ['اهداف کوتاه مدت', 'جشن موفقیت‌ها', 'یادگیری گروهی', 'تغییر روش'];
  }
  
  // Default response
  else {
    const responses = [
      `جالبه! بذارید این موضوع رو بیشتر بررسی کنیم 🤔`,
      `متشکرم که این رو مطرح کردید! این نکته مهمیه 💡`,
      `خیلی خوب! این دقیقاً چیزیه که باید روش کار کنیم 🎯`,
      `عالی! بیایید قدم به قدم پیش بریم 📝`,
      `سوال خوبی پرسیدید! من جواب کاملی براتون دارم ✨`
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
    mood = 'thinking';
    suggestions = ['بیشتر توضیح دهید', 'مثال بزنید', 'تمرین کنید', 'سوال بپرسید'];
  }

  // Add level-specific encouragement
  if (studentLevel === 'مبتدی') {
    response += `\n\nنگران نباشید! همه از همین جا شروع کرده‌اند. من کنارتان هستم! 💪`;
  } else if (studentLevel === 'متوسط') {
    response += `\n\nشما در مسیر درستی هستید! بیایید مهارت‌هایتان را تقویت کنیم! 🚀`;
  } else {
    response += `\n\nعالی! شما آماده چالش‌های جدید هستید! بیایید به سطح بالاتری برسیم! 🎓`;
  }

  return {
    text: response,
    mood,
    suggestions,
    exercises
  };
}
