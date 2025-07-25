"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = "00989387279975";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          ارتباط از طریق WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      
      <Button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="ارتباط از طریق WhatsApp"
      >
        <img 
          src="/whatsapp-icon.svg" 
          alt="WhatsApp" 
          className="w-8 h-8"
        />
      </Button>
    </div>
  );
} 