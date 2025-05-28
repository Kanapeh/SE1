"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function GetStartedPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const languages = ["انگلیسی", "اسپانیایی", "فرانسوی"];
  const levels = [
    "مبتدی (A1)",
    "ابتدایی (A2)",
    "متوسط (B1)",
    "متوسط به بالا (B2)",
    "پیشرفته (C1)",
    "تسلط کامل (C2)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName: (document.getElementById("firstName") as HTMLInputElement).value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      language: (document.getElementById("language") as HTMLSelectElement).value,
      level: (document.getElementById("level") as HTMLSelectElement).value,
      classType: (document.querySelector('input[name="classType"]:checked') as HTMLInputElement)?.value,
      preferredTime: (document.querySelector('input[name="preferredTime"]:checked') as HTMLInputElement)?.value,
    };

    // Validate form data
    if (!formData.classType || !formData.preferredTime) {
      alert("لطفا نوع کلاس و زمان ترجیحی را انتخاب کنید.");
      return;
    }

    console.log("Submitting form data:", formData);

    try {
      // Use absolute URL for API endpoint
      const apiUrl = `${window.location.origin}/api/requests`;
      console.log("Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        console.error("Server error:", data.error);
        alert(`خطا در ارسال درخواست: ${data.error || 'خطای ناشناخته'}`);
      }
    } catch (error) {
      console.error("Network error details:", error);
      alert("خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-blue-800">
            شروع یادگیری زبان
          </h1>
          <p className="text-lg text-gray-600">
            فرم زیر را پر کنید تا مسیر خود را با آکادمی زبان SE1A آغاز کنید.
          </p>
        </motion.div>

        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              درخواست شما با موفقیت ارسال شد!
            </h2>
            <p className="text-gray-700 mb-6">
              ما به زودی با شما تماس خواهیم گرفت.
            </p>
            <Button
              onClick={() => setFormSubmitted(false)}
              className="bg-blue-600 text-white"
            >
              ارسال درخواست جدید
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-8 shadow-lg">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    اطلاعات شخصی
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">نام</Label>
                      <Input id="firstName" placeholder="علی" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">نام خانوادگی</Label>
                      <Input id="lastName" placeholder="احمدی" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ali@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">شماره تماس</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+98 912 345 6789"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    ترجیحات دوره
                  </h2>
                  <div>
                    <Label htmlFor="language">زبان مورد نظر</Label>
                    <select
                      id="language"
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="level">سطح زبان</Label>
                    <select
                      id="level"
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>نوع کلاس</Label>
                    <RadioGroup
                      name="classType"
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">خصوصی</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="group" id="group" />
                        <Label htmlFor="group">گروهی</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>زمان ترجیحی</Label>
                    <RadioGroup
                      name="preferredTime"
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning">صبح</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon">بعد از ظهر</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening">عصر</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  ارسال درخواست
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
