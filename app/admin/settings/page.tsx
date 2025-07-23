"use client";

import { useState, useEffect } from 'react';
// حذف import supabase

interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  social_media: {
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    social_media: {
      instagram: '',
      telegram: '',
      whatsapp: '',
    },
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('خطا در دریافت تنظیمات');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('خطا در ذخیره تنظیمات. لطفا دوباره تلاش کنید.');
      alert('تنظیمات با موفقیت ذخیره شد.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('خطا در ذخیره تنظیمات. لطفا دوباره تلاش کنید.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">تنظیمات</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">تنظیمات عمومی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">نام سایت</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">توضیحات سایت</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ایمیل</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">شماره تماس</label>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">شبکه‌های اجتماعی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">اینستاگرام</label>
              <input
                type="text"
                value={settings.social_media.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: { ...settings.social_media, instagram: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">تلگرام</label>
              <input
                type="text"
                value={settings.social_media.telegram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: { ...settings.social_media, telegram: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">واتساپ</label>
              <input
                type="text"
                value={settings.social_media.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_media: { ...settings.social_media, whatsapp: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">تنظیمات SEO</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">عنوان</label>
              <input
                type="text"
                value={settings.seo.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, title: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea
                value={settings.seo.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, description: e.target.value },
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">کلمات کلیدی</label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, keywords: e.target.value },
                  })
                }
                placeholder="کلمات کلیدی را با کاما جدا کنید"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </form>
    </div>
  );
} 