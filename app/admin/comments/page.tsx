"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ip_address: string;
  post_title?: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments');
      const data = await response.json();
      
      if (response.ok) {
        setComments(data);
      } else {
        toast({
          title: "خطا",
          description: "خطا در بارگذاری نظرات",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در بارگذاری نظرات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommentStatus = async (commentId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "موفقیت",
          description: status === 'approved' ? 'نظر تایید شد' : 'نظر رد شد',
        });
        fetchComments(); // Refresh the list
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
        description: "خطا در بروزرسانی وضعیت نظر",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "موفقیت",
          description: "نظر حذف شد",
        });
        fetchComments(); // Refresh the list
      } else {
        const result = await response.json();
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف نظر",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">در انتظار تایید</Badge>;
      case 'approved':
        return <Badge variant="default">تایید شده</Badge>;
      case 'rejected':
        return <Badge variant="destructive">رد شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    return comment.status === filter;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت نظرات مقالات</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            همه ({comments.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            در انتظار ({comments.filter(c => c.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            تایید شده ({comments.filter(c => c.status === 'approved').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setFilter('rejected')}
          >
            رد شده ({comments.filter(c => c.status === 'rejected').length})
          </Button>
        </div>
      </div>

      {filteredComments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">هیچ نظری یافت نشد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{comment.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{comment.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(comment.status)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    مقاله: {comment.post_title || 'مقاله حذف شده'}
                  </p>
                  <p className="text-foreground leading-relaxed">{comment.content}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    IP: {comment.ip_address}
                  </div>
                  
                  <div className="flex gap-2">
                    {comment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateCommentStatus(comment.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          تایید
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateCommentStatus(comment.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          رد
                        </Button>
                      </>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4 mr-1" />
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف نظر</AlertDialogTitle>
                          <AlertDialogDescription>
                            آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟ این عمل قابل بازگشت نیست.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>انصراف</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteComment(comment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 