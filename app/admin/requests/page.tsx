"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, X } from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { Eye } from "lucide-react";

interface Request {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  language: string;
  level: string;
  class_type: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [studentsEmails, setStudentsEmails] = useState<string[]>([]);

  useEffect(() => {
    fetchRequests();
    fetchStudentsEmails();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('خطا در دریافت درخواست‌ها');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsEmails = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('email');
    if (!error && data) {
      setStudentsEmails(data.map((s: { email: string }) => s.email));
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      // 1. دریافت اطلاعات درخواست
      const { data: requestData, error: fetchError } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError || !requestData) {
        setError('خطا در دریافت اطلاعات درخواست');
        return;
      }

      // 2. افزودن به جدول students
      const { error: insertError } = await supabase
        .from('students')
        .insert([{
          first_name: requestData.first_name,
          last_name: requestData.last_name,
          email: requestData.email,
          phone: requestData.phone,
          gender: null,
          birthdate: null,
          national_id: null,
          address: null,
          parent_name: null,
          parent_phone: null,
          language: requestData.language,
          level: requestData.level,
          class_type: requestData.class_type,
          preferred_time: requestData.preferred_time,
          status: 'active',
          notes: null,
        }]);

      if (insertError) {
        setError('خطا در افزودن دانش‌آموز');
        return;
      }

      // 3. آپدیت وضعیت درخواست
      const { error: updateError } = await supabase
        .from('requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) {
        setError('خطا در بروزرسانی وضعیت درخواست');
        return;
      }

      await fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      setError('خطا در تایید درخواست');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError('خطا در رد درخواست');
    }
  };

  const filteredRequests = requests
    .filter((request) => request.status === 'pending')
    .filter((request) => !studentsEmails.includes(request.email))
    .filter((request) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        request.first_name.toLowerCase().includes(searchLower) ||
        request.last_name.toLowerCase().includes(searchLower) ||
        request.email.toLowerCase().includes(searchLower) ||
        request.phone.includes(searchLower) ||
        request.language.toLowerCase().includes(searchLower) ||
        request.level.toLowerCase().includes(searchLower) ||
        request.class_type.toLowerCase().includes(searchLower) ||
        request.preferred_time.toLowerCase().includes(searchLower)
      );
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#000000" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">مدیریت درخواست‌ها</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {searchQuery
            ? "هیچ درخواستی با این مشخصات یافت نشد"
            : "هیچ درخواستی ثبت نشده است"}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">نام</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">نام خانوادگی</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">ایمیل</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">تلفن</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">زبان</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">سطح</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">نوع کلاس</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">زمان ترجیحی</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">تاریخ درخواست</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">وضعیت</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.first_name}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.last_name}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.email}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.phone}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.language}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.level}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.class_type}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.preferred_time}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {format(new Date(request.created_at), "PPP", {
                            locale: faIR,
                          })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status === "approved"
                              ? "تایید شده"
                              : request.status === "rejected"
                              ? "رد شده"
                              : "در انتظار تایید"}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm">
                          {request.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 