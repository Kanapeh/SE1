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

interface Request {
  id: string;
  student_id: string;
  course_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  student: {
    full_name: string;
    email: string;
  };
  course: {
    name: string;
  };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          student:students(full_name, email),
          course:courses(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched requests:', data);
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('خطا در دریافت درخواست‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;

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

  const filteredRequests = requests.filter((request) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.student.full_name.toLowerCase().includes(searchLower) ||
      request.student.email.toLowerCase().includes(searchLower) ||
      request.course.name.toLowerCase().includes(searchLower)
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
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">ایمیل</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">دوره</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">تاریخ درخواست</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">وضعیت</TableHead>
                      <TableHead className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.student.full_name}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.student.email}</TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{request.course.name}</TableCell>
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