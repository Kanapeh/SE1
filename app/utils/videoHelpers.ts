/**
 * Video call utility functions
 */

export interface MediaDeviceError {
  type: 'no-permission' | 'no-device' | 'not-supported' | 'https-required' | 'unknown';
  message: string;
  suggestions: string[];
}

export const getMediaDeviceError = (error: any): MediaDeviceError => {
  console.error('Media device error:', error);

  // Check for HTTPS requirement
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    return {
      type: 'https-required',
      message: 'تماس تصویری نیاز به اتصال امن (HTTPS) دارد',
      suggestions: [
        'از آدرس HTTPS استفاده کنید',
        'در localhost تست کنید',
        'گواهی SSL را نصب کنید'
      ]
    };
  }

  // Check browser support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      type: 'not-supported',
      message: 'مرورگر شما از تماس تصویری پشتیبانی نمی‌کند',
      suggestions: [
        'از Chrome، Firefox، Safari یا Edge استفاده کنید',
        'مرورگر خود را به‌روزرسانی کنید',
        'JavaScript را فعال کنید'
      ]
    };
  }

  // Handle specific getUserMedia errors
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return {
      type: 'no-permission',
      message: 'دسترسی به دوربین/میکروفن رد شده است',
      suggestions: [
        'روی آیکون قفل در نوار آدرس کلیک کنید',
        'دسترسی دوربین و میکروفن را فعال کنید',
        'صفحه را رفرش کنید',
        'تنظیمات مرورگر را بررسی کنید'
      ]
    };
  }

  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return {
      type: 'no-device',
      message: 'دوربین یا میکروفن پیدا نشد',
      suggestions: [
        'اتصال دوربین/میکروفن را بررسی کنید',
        'درایور دستگاه‌ها را به‌روزرسانی کنید',
        'سایر برنامه‌هایی که از دوربین استفاده می‌کنند را ببندید',
        'کامپیوتر را ری‌استارت کنید'
      ]
    };
  }

  if (error.name === 'NotSupportedError') {
    return {
      type: 'not-supported',
      message: 'getUserMedia در این مرورگر پشتیبانی نمی‌شود',
      suggestions: [
        'از مرورگر جدیدتری استفاده کنید',
        'تنظیمات امنیتی مرورگر را بررسی کنید'
      ]
    };
  }

  // Generic error
  return {
    type: 'unknown',
    message: 'خطای ناشناخته در دسترسی به دوربین/میکروفن',
    suggestions: [
      'صفحه را رفرش کنید',
      'مرورگر را ری‌استارت کنید',
      'تنظیمات دوربین سیستم را بررسی کنید'
    ]
  };
};

export const testMediaDevices = async (): Promise<{ success: boolean; error?: MediaDeviceError }> => {
  try {
    // First check if APIs are available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia not supported');
    }

    // Try to get media stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    // Clean up the stream
    stream.getTracks().forEach(track => track.stop());

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getMediaDeviceError(error)
    };
  }
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return { name: 'Chrome', supported: true };
  } else if (userAgent.includes('firefox')) {
    return { name: 'Firefox', supported: true };
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return { name: 'Safari', supported: true };
  } else if (userAgent.includes('edge')) {
    return { name: 'Edge', supported: true };
  } else {
    return { name: 'Unknown', supported: false };
  }
};

export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false;
  
  const location = window.location;
  return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}
