"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  postId: string;
  onCommentSubmitted: () => void;
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          ...formData
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "موفقیت",
          description: result.message,
        });
        setFormData({ name: "", email: "", content: "" });
        onCommentSubmitted();
      } else {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ارسال نظر. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-muted p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">ثبت نظر</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">نام *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="نام خود را وارد کنید"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">ایمیل *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ایمیل خود را وارد کنید"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="content">نظر شما *</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="نظر خود را بنویسید..."
            className="mt-1 min-h-[120px]"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-4">
        * نظر شما پس از تایید ادمین نمایش داده خواهد شد
      </p>
    </div>
  );
} 