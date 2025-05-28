"use client";

import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const editorRef = useRef<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      router.push('/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
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
        router.push('/login');
        return;
      }

      const title = formData.get('title')?.toString().trim();
      const content = editorRef.current?.getContent() || '';
      const image_url = formData.get('image_url')?.toString().trim();
      const author = formData.get('author')?.toString().trim() || 'مدیر سیستم';
      const status = formData.get('status')?.toString() || 'draft';
      const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) || [];
      
      // Validation
      if (!title) throw new Error('عنوان مقاله الزامی است');
      if (!content) throw new Error('محتوی مقاله الزامی است');
      if (!image_url) throw new Error('تصویر شاخص الزامی است');

      const slug = title.toLowerCase().replace(/\s+/g, '-');
      
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
          tags
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
    const slug = formData.get('title')?.toString().toLowerCase().replace(/\s+/g, '-') || '';
    const content = editorRef.current?.getContent() || '';
    
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
          tags
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
    height: 500,
    menubar: true,
    directionality: 'rtl',
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 
      'searchreplace', 'table', 'visualblocks', 'wordcount', 'checklist', 'mediaembed', 'casechange', 
      'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 
      'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 
      'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
      'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
      'link image media table mergetags | spellcheckdialog a11ycheck typography | ' +
      'align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
    images_upload_handler: async (blobInfo: any) => {
      const file = blobInfo.blob();
      const url = await handleImageUpload(file);
      return url || '';
    },
    font_family_formats: 'Vazirmatn= Vazirmatn, sans-serif; IRANSans= IRANSans, sans-serif; Tahoma= Tahoma, sans-serif; Arial= Arial, sans-serif;',
    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
    language: 'fa_IR',
    language_url: '/tinymce/langs/fa_IR.js',
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
    images_upload_credentials: true
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">افزودن مقاله جدید</h2>
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">محتوا</label>
                <Editor
                  apiKey="v8l89007akyh5ic8nt27hm1zsj5iheg8dzn0n41sinazolj3"
                  onInit={(evt: any, editor: any) => editorRef.current = editor}
                  initialValue=""
                  init={editorConfig}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">آدرس تصویر شاخص</label>
                <input
                  type="url"
                  name="image_url"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نویسنده</label>
                <input
                  type="text"
                  name="author"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">وضعیت</label>
                <select
                  name="status"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                  <option value="archived">بایگانی</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="مثال: آموزش, زبان انگلیسی, گرامر"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  افزودن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">ویرایش مقاله</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingPost.title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">محتوا</label>
                <Editor
                  apiKey="v8l89007akyh5ic8nt27hm1zsj5iheg8dzn0n41sinazolj3"
                  onInit={(evt: any, editor: any) => editorRef.current = editor}
                  initialValue={editingPost.content}
                  init={editorConfig}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">آدرس تصویر شاخص</label>
                <input
                  type="url"
                  name="image_url"
                  defaultValue={editingPost.image_url}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نویسنده</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingPost.author}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">وضعیت</label>
                <select
                  name="status"
                  defaultValue={editingPost.status}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                  <option value="archived">بایگانی</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingPost.tags?.join(', ')}
                  placeholder="مثال: آموزش, زبان انگلیسی, گرامر"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 