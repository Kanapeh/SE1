"use client";

import { useEffect } from 'react';

export default function SchemaOrg() {
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "سِ وان - مرکز تخصصی آموزش زبان انگلیسی",
      "alternateName": "SE1A Academy",
      "url": "https://www.se1a.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.se1a.org/images/logo.png",
        "width": 1200,
        "height": 630,
        "alt": "سِ وان - مرکز تخصصی آموزش زبان انگلیسی"
      },
      "image": "https://www.se1a.org/images/logo.png",
      "description": "مرکز تخصصی آموزش زبان انگلیسی سِ وان با بیش از ۱۰ سال تجربه در زمینه آموزش زبان",
      "sameAs": [
        "https://www.instagram.com/se1a_academy",
        "https://www.youtube.com/@Se1-academy"
      ]
    });
    
    document.head.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
