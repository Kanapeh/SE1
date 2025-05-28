"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }

      if (session?.user) {
        setIsLoggedIn(true);
        // دریافت اطلاعات کاربر
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        if (userData) {
          setUserName(`${userData.first_name} ${userData.last_name}`);
        }
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = () => {
    console.log("Start button clicked");
    window.location.href = "/register";
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              آکادمی زبان
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-primary">
                درباره ما
              </Link>
              <Link href="/courses" className="text-gray-600 hover:text-primary">
                دوره‌ها
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary">
                تماس با ما
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {isLoggedIn ? (
                  <div className="text-gray-600">
                    <span className="font-medium">{userName}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleStartClick}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition cursor-pointer"
                  >
                    شروع کنید
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 