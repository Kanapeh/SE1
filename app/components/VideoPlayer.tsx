"use client";

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  width?: string;
  height?: string;
}

export default function VideoPlayer({ videoUrl, title, width = "100%", height = "400px" }: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>('');

  useEffect(() => {
    const getEmbedUrl = (url: string) => {
      // YouTube
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const videoId = url.includes('youtu.be/') 
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Vimeo
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      
      // Direct video file
      if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return url;
      }
      
      return url;
    };

    setEmbedUrl(getEmbedUrl(videoUrl));
  }, [videoUrl]);

  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">در حال بارگذاری ویدیو...</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <div className="relative w-full" style={{ height }}>
        <iframe
          src={embedUrl}
          title={title || "ویدیو"}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
} 