"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from '@/lib/supabase';
import Link from "next/link";
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url: string;
  author: string;
  published_at: string;
  status: string;
  tags: string[];
  video_url?: string;
  chart_data?: any;
  table_data?: any;
  has_chart?: boolean;
  has_video?: boolean;
  has_table?: boolean;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [fallbackContent, setFallbackContent] = useState("");
  const editorRef = useRef<any>(null);


  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  useEffect(() => {
    // Set a timeout to show fallback if editor doesn't load
    const timer = setTimeout(() => {
      if (!editorLoaded) {
        setEditorLoaded(false); // This will show the fallback
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, [editorLoaded]);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      router.push('/admin/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setUploadingImage(false);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
      return null;
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const title = formData.get('title')?.toString().trim();
      const content = editorRef.current?.getContent() || fallbackContent || '';
      const image_url = formData.get('image_url')?.toString().trim();
      const author = formData.get('author')?.toString().trim() || 'مدیر سیستم';
      const status = formData.get('status')?.toString() || 'draft';
      const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) || [];
      const video_url = formData.get('video_url')?.toString().trim() || '';
      const has_video = formData.get('has_video') === 'on';
      const has_chart = formData.get('has_chart') === 'on';
      const has_table = formData.get('has_table') === 'on';
      
      // Parse chart and table data
      let chart_data = null;
      let table_data = null;
      
      try {
        const chartDataStr = formData.get('chart_data')?.toString();
        if (chartDataStr && has_chart) {
          chart_data = JSON.parse(chartDataStr);
        }
        
        const tableDataStr = formData.get('table_data')?.toString();
        if (tableDataStr && has_table) {
          table_data = JSON.parse(tableDataStr);
        }
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
      
      // Validation
      if (!title) throw new Error('عنوان مقاله الزامی است');
      if (!content) throw new Error('محتوی مقاله الزامی است');
      if (!image_url) throw new Error('تصویر شاخص الزامی است');

      // Get English slug from form or create from title
      const englishSlug = formData.get('english_slug')?.toString().trim();
      
      // Create proper slug for English text (WordPress style)
      const createEnglishSlug = (text: string): string => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Keep only English letters, numbers, spaces, and hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      };
      
      const slug = englishSlug ? createEnglishSlug(englishSlug) : createEnglishSlug(title);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title,
          content,
          slug,
          image_url,
          author,
          published_at: new Date().toISOString(),
          status,
          tags,
          video_url: has_video ? video_url : null,
          chart_data: has_chart ? chart_data : null,
          table_data: has_table ? table_data : null,
          has_video,
          has_chart,
          has_table
        }])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
        throw new Error('خطا در ایجاد مقاله');
      }

      setPosts([...(data || []), ...posts]);
      setShowAddModal(false);
    } catch (error: any) {
      console.error("Error adding blog post:", error);
      alert(error.message || 'خطا در ایجاد مقاله');
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) || [];
    const englishSlug = formData.get('english_slug')?.toString().trim();
    
    // Create proper slug for English text (WordPress style)
    const createEnglishSlug = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Keep only English letters, numbers, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };
    
    const slug = englishSlug ? createEnglishSlug(englishSlug) : editingPost.slug;
    const content = editorRef.current?.getContent() || '';
    const video_url = formData.get('video_url')?.toString().trim() || '';
    const has_video = formData.get('has_video') === 'on';
    const has_chart = formData.get('has_chart') === 'on';
    const has_table = formData.get('has_table') === 'on';
    
    // Parse chart and table data
    let chart_data = null;
    let table_data = null;
    
    try {
      const chartDataStr = formData.get('chart_data')?.toString();
      if (chartDataStr && has_chart) {
        chart_data = JSON.parse(chartDataStr);
      }
      
      const tableDataStr = formData.get('table_data')?.toString();
      if (tableDataStr && has_table) {
        table_data = JSON.parse(tableDataStr);
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.get('title'),
          content,
          slug,
          image_url: formData.get('image_url'),
          author: formData.get('author'),
          status: formData.get('status'),
          tags,
          video_url: has_video ? video_url : null,
          chart_data: has_chart ? chart_data : null,
          table_data: has_table ? table_data : null,
          has_video,
          has_chart,
          has_table
        })
        .eq('id', editingPost.id)
        .select();

      if (error) throw error;
      
      setPosts(posts.map(post => 
        post.id === editingPost.id ? (data?.[0] || post) : post
      ));
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    post.author.toLowerCase().includes(search.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const editorConfig = {
    apiKey: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
    domain: process.env.NEXT_PUBLIC_TINYMCE_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'localhost:3000'),
    height: 500,
    menubar: true,
    directionality: 'rtl',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
      'template', 'codesample', 'pagebreak', 'nonbreaking',
      'imagetools', 'autosave', 'save', 'directionality'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic underline strikethrough | alignleft aligncenter ' +
      'alignright alignjustify | outdent indent |  numlist bullist | ' +
      'forecolor backcolor removeformat | pagebreak | charmap emoticons | ' +
      'fullscreen preview save print | insertfile image media template link anchor codesample | ' +
      'ltr rtl | code | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; direction: rtl; text-align: right; }',
    images_upload_handler: async (blobInfo: any) => {
      const file = blobInfo.blob();
      const url = await handleImageUpload(file);
      return url || '';
    },
    font_family_formats: 'Vazirmatn= Vazirmatn, sans-serif; IRANSans= IRANSans, sans-serif; Tahoma= Tahoma, sans-serif; Arial= Arial, sans-serif;',
    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
    branding: false,
    promotion: false,
    resize: true,
    statusbar: true,
    paste_data_images: true,
    image_advtab: true,
    image_title: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    images_reuse_filename: true,
    images_upload_base_path: '/blog-images',
    images_upload_credentials: true,
    // Enhanced features
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    quickbars_insert_toolbar: 'quickimage quicktable',
    contextmenu: 'link image imagetools table',
    templates: [
      { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
      { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
      { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
    ],
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
    image_caption: true,
    quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.getBody().style.direction = 'rtl';
        editor.getBody().style.textAlign = 'right';
        editor.getBody().style.fontFamily = 'Vazirmatn, IRANSans, Tahoma, Arial, sans-serif';
        setEditorLoaded(true);
      });
    },
    init_instance_callback: (editor: any) => {
      editor.getBody().style.direction = 'rtl';
      editor.getBody().style.textAlign = 'right';
      setEditorLoaded(true);
    },
    // Add error handling
    onError: (error: any) => {
      console.error('TinyMCE Error:', error);
      setEditorLoaded(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت وبلاگ</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن مقاله جدید
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نویسنده</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ انتشار</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">برچسب‌ها</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{post.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(post.published_at).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status === 'published' ? 'منتشر شده' :
                     post.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">افزودن مقاله جدید</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">مقاله جدید خود را با فرم زیبای زیر ایجاد کنید</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddPost} className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  اطلاعات پایه مقاله
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      عنوان مقاله <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="عنوان جذاب و کوتاه مقاله خود را وارد کنید..."
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      نویسنده <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      required
                      placeholder="نام نویسنده یا مدیر سیستم"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    آدرس انگلیسی مقاله (Slug) <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="english_slug"
                    required
                    placeholder="best-english-learning-methods-2025"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    آدرس انگلیسی مقاله که در URL نمایش داده می‌شود. فقط حروف انگلیسی، اعداد و خط تیره مجاز است.
                    <br />
                    مثال: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">best-english-learning-methods-2025</code>
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    برچسب‌ها
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="آموزش, زبان انگلیسی, گرامر, مکالمه (با کاما جدا کنید)"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">برچسب‌ها به خوانندگان کمک می‌کنند تا مقاله شما را راحت‌تر پیدا کنند</p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    وضعیت انتشار <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="draft">پیش‌نویس (ذخیره شده اما منتشر نشده)</option>
                    <option value="published">منتشر شده (قابل مشاهده برای عموم)</option>
                    <option value="archived">بایگانی شده</option>
                  </select>
                </div>
              </div>

              {/* Image Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  تصویر شاخص مقاله
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    آدرس تصویر شاخص <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">تصویر شاخص باید کیفیت بالا و اندازه مناسب (حداقل 800x600 پیکسل) داشته باشد</p>
                </div>
              </div>

              {/* Video Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  ویدیو (اختیاری)
                </h3>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="has_video"
                    id="has_video"
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="has_video" className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    این مقاله شامل ویدیو است
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    آدرس ویدیو
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    placeholder="https://www.youtube.com/watch?v=... یا https://vimeo.com/..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">از YouTube، Vimeo یا سایر سرویس‌های ویدیویی پشتیبانی می‌شود</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  محتوای مقاله
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    محتوای مقاله <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      onInit={(evt: any, editor: any) => editorRef.current = editor}
                      initialValue=""
                      init={editorConfig}
                    />
                    {!editorLoaded && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center mb-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            در حال بارگذاری ویرایشگر... اگر مشکل ادامه داشت، از فیلد زیر استفاده کنید:
                          </p>
                        </div>
                        <textarea
                          name="fallback_content"
                          value={fallbackContent}
                          onChange={(e) => setFallbackContent(e.target.value)}
                          placeholder="محتوای مقاله خود را اینجا بنویسید..."
                          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            این فیلد به عنوان جایگزین ویرایشگر اصلی عمل می‌کند
                          </p>
                          <button
                            type="button"
                            onClick={() => setEditorLoaded(true)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            تلاش مجدد برای بارگذاری ویرایشگر
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">از ابزارهای ویرایشگر برای ایجاد محتوای جذاب و ساختاریافته استفاده کنید</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-300 border-2 border-gray-200 dark:border-gray-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  انتشار مقاله
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ویرایش مقاله</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تغییرات خود را اعمال کنید و ذخیره کنید</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleUpdatePost} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    اطلاعات اصلی مقاله
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        عنوان مقاله <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingPost.title}
                        required
                        placeholder="عنوان جذاب و کوتاه مقاله..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        نویسنده <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        defaultValue={editingPost.author}
                        required
                        placeholder="نام نویسنده یا مدیر سیستم"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      آدرس انگلیسی مقاله (Slug) <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="english_slug"
                      defaultValue={editingPost.slug}
                      required
                      placeholder="best-english-learning-methods-2025"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      آدرس انگلیسی مقاله که در URL نمایش داده می‌شود. فقط حروف انگلیسی، اعداد و خط تیره مجاز است.
                      <br />
                      مثال: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">best-english-learning-methods-2025</code>
                    </p>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      برچسب‌ها
                    </label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingPost.tags?.join(', ')}
                      placeholder="آموزش, زبان انگلیسی, گرامر, مکالمه (با کاما جدا کنید)"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">برچسب‌ها به خوانندگان کمک می‌کنند تا مقاله شما را راحت‌تر پیدا کنند</p>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      وضعیت انتشار <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      defaultValue={editingPost.status}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="draft">پیش‌نویس (ذخیره شده اما منتشر نشده)</option>
                      <option value="published">منتشر شده (قابل مشاهده برای عموم)</option>
                      <option value="archived">بایگانی شده</option>
                    </select>
                  </div>
                </div>

                {/* Image Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    تصویر شاخص مقاله
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      آدرس تصویر شاخص <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      defaultValue={editingPost.image_url}
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">تصویر شاخص باید کیفیت بالا و اندازه مناسب (حداقل 800x600 پیکسل) داشته باشد</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    محتوای مقاله
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      محتوای مقاله <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        onInit={(evt: any, editor: any) => editorRef.current = editor}
                        initialValue={editingPost.content}
                        init={editorConfig}
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">از ابزارهای ویرایشگر برای ایجاد محتوای جذاب و ساختاریافته استفاده کنید</p>
                  </div>
                </div>
              
                {/* Video Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    ویدیو (اختیاری)
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="has_video"
                      id="edit_has_video"
                      defaultChecked={editingPost.has_video}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor="edit_has_video" className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      این مقاله شامل ویدیو است
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      آدرس ویدیو
                    </label>
                    <input
                      type="url"
                      name="video_url"
                      defaultValue={editingPost.video_url || ''}
                      placeholder="https://www.youtube.com/watch?v=... یا https://vimeo.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">از YouTube، Vimeo یا سایر سرویس‌های ویدیویی پشتیبانی می‌شود</p>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    نمودار (اختیاری)
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="has_chart"
                      id="edit_has_chart"
                      defaultChecked={editingPost.has_chart}
                      className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <label htmlFor="edit_has_chart" className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      این مقاله شامل نمودار است
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      داده‌های نمودار (JSON)
                    </label>
                    <textarea
                      name="chart_data"
                      rows={6}
                      defaultValue={editingPost.chart_data ? JSON.stringify(editingPost.chart_data, null, 2) : ''}
                      placeholder='{"type": "bar", "data": {"labels": ["A", "B", "C"], "datasets": [{"label": "مثال", "data": [1, 2, 3]}]}}'
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 dark:focus:ring-yellow-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">داده‌های نمودار را به فرمت JSON وارد کنید</p>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-teal-200 dark:border-teal-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    جدول (اختیاری)
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="has_table"
                      id="edit_has_table"
                      defaultChecked={editingPost.has_table}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="edit_has_table" className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      این مقاله شامل جدول است
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      داده‌های جدول (JSON)
                    </label>
                    <textarea
                      name="table_data"
                      rows={6}
                      defaultValue={editingPost.table_data ? JSON.stringify(editingPost.table_data, null, 2) : ''}
                      placeholder='{"headers": ["ستون 1", "ستون 2"], "rows": [["داده 1", "داده 2"], ["داده 3", "داده 4"]]}'
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">داده‌های جدول را به فرمت JSON وارد کنید</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-8 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-300 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ذخیره تغییرات
                  </button>
                </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 