"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    description: "",
    duration: "",
    class_size: "",
    price: "",
    features: "",
    color: "#3B82F6", // رنگ پیش‌فرض آبی
    badge: "جدید",
    image_url: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `course-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('courses')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('courses')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("coursesstudents").insert([
        {
          title: formData.title,
          level: formData.level,
          description: formData.description,
          duration: formData.duration,
          class_size: formData.class_size,
          price: formData.price,
          features: formData.features.split("\n").filter(Boolean),
          color: formData.color,
          badge: formData.badge,
          image_url: imageUrl,
          status: "active",
        },
      ]);

      if (error) throw error;

      toast.success("دوره با موفقیت ایجاد شد");
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("خطا در ایجاد دوره");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ایجاد دوره جدید</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">تصویر دوره</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                >
                  <span>آپلود تصویر</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pr-1">یا فایل را اینجا رها کنید</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF تا 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">عنوان دوره</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="عنوان دوره را وارد کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">سطح دوره</label>
          <Input
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            placeholder="مثال: مقدماتی، متوسط، پیشرفته"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">توضیحات</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="توضیحات دوره را وارد کنید"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">مدت زمان</label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="مثال: 20 ساعت"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ظرفیت کلاس</label>
            <Input
              name="class_size"
              value={formData.class_size}
              onChange={handleChange}
              required
              placeholder="مثال: 10 نفر"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">قیمت (تومان)</label>
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="مثال: 1,000,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">رنگ دوره</label>
          <Input
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="h-10 w-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">نشان دوره</label>
          <Input
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            required
            placeholder="مثال: جدید، محبوب"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ویژگی‌ها</label>
          <Textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            required
            placeholder="هر ویژگی را در یک خط جدید وارد کنید"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "در حال ایجاد..." : "ایجاد دوره"}
          </Button>
        </div>
      </form>
    </div>
  );
} 