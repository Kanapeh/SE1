"use client";

import { useCallback, useEffect, useState } from "react";
import CommentForm from "@/app/components/CommentForm";

interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(Array.isArray(data) ? data : []);
      } else {
        console.error("Error fetching comments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-8 pt-8 border-t">
      <h2 className="text-xl font-semibold mb-6">نظرات کاربران</h2>

      <div className="mb-8">
        <CommentForm postId={postId} onCommentSubmitted={fetchComments} />
      </div>

      {isLoading ? (
        <div className="text-center py-8">در حال بارگذاری نظرات...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">نظرات ({comments.length})</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-foreground">{comment.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                </div>
              </div>
              <div className="text-foreground leading-relaxed">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

