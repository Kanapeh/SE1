'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AdminSidebar from '../AdminSidebar';
import { 
  Eye, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Receipt,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface Booking {
  id: string;
  teacher_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  selected_days: string[];
  selected_hours: string[];
  session_type: string;
  duration: number;
  total_price: number;
  number_of_sessions: number;
  notes: string;
  payment_status: 'pending' | 'approved' | 'rejected';
  payment_method: string;
  transaction_id: string;
  receipt_image: string;
  payment_notes: string;
  status: string;
  created_at: string;
  approved_at: string;
  admin_notes: string;
}

export default function PaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (bookingId: string, approved: boolean) => {
    try {
      setProcessing(bookingId);
      
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          approved,
          adminNotes
        })
      });

      if (response.ok) {
        // Refresh bookings
        await fetchBookings();
        setSelectedBooking(null);
        setAdminNotes('');
        alert(`پرداخت با موفقیت ${approved ? 'تایید' : 'رد'} شد!`);
      } else {
        const error = await response.json();
        alert(error.error || 'خطا در پردازش درخواست');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('خطا در پردازش درخواست');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">تایید شده</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">رد شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.payment_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1 lg:mr-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              مدیریت پرداخت‌ها
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              بررسی و تایید فیش‌های واریزی دانش‌آموزان
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">جستجو</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="نام، ایمیل یا شماره تراکنش..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter">فیلتر وضعیت</Label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">همه</option>
                <option value="pending">در انتظار</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchBookings} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">کل رزروها</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Receipt className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">در انتظار</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {bookings.filter(b => b.payment_status === 'pending').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تایید شده</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.payment_status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">رد شده</p>
                    <p className="text-2xl font-bold text-red-600">
                      {bookings.filter(b => b.payment_status === 'rejected').length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>فهرست رزروها</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p>در حال بارگذاری...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">هیچ رزروی یافت نشد</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2">دانش‌آموز</th>
                        <th className="text-right p-2">تاریخ</th>
                        <th className="text-right p-2">مبلغ</th>
                        <th className="text-right p-2">وضعیت</th>
                        <th className="text-right p-2">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{booking.student_name}</p>
                              <p className="text-sm text-gray-500">{booking.student_email}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <p className="text-sm">
                              {new Date(booking.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </td>
                          <td className="p-2">
                            <p className="font-medium">{formatPrice(booking.total_price)} تومان</p>
                          </td>
                          <td className="p-2">
                            {getStatusBadge(booking.payment_status)}
                          </td>
                          <td className="p-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Eye className="w-4 h-4 ml-1" />
                                  مشاهده
                                </Button>
                              </DialogTrigger>
                              
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>جزئیات رزرو و پرداخت</DialogTitle>
                                </DialogHeader>
                                
                                {selectedBooking && (
                                  <div className="space-y-6">
                                    {/* Student Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">اطلاعات دانش‌آموز</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span>{selectedBooking.student_name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span>{selectedBooking.student_email}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span>{selectedBooking.student_phone}</span>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">جزئیات کلاس</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <p><strong>روزها:</strong> {selectedBooking.selected_days.join(', ')}</p>
                                          <p><strong>ساعات:</strong> {selectedBooking.selected_hours.join(', ')}</p>
                                          <p><strong>نوع کلاس:</strong> {selectedBooking.session_type}</p>
                                          <p><strong>مدت:</strong> {selectedBooking.duration} دقیقه</p>
                                          <p><strong>تعداد جلسات:</strong> {selectedBooking.number_of_sessions}</p>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Payment Info */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-sm">اطلاعات پرداخت</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <p className="text-sm text-gray-600">مبلغ کل:</p>
                                            <p className="font-bold text-green-600">
                                              {formatPrice(selectedBooking.total_price)} تومان
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-600">شماره تراکنش:</p>
                                            <p className="font-mono">{selectedBooking.transaction_id}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-600">وضعیت:</p>
                                            {getStatusBadge(selectedBooking.payment_status)}
                                          </div>
                                        </div>

                                        {/* Receipt Image */}
                                        {selectedBooking.receipt_image && (
                                          <div>
                                            <p className="text-sm text-gray-600 mb-2">فیش واریزی:</p>
                                            <img 
                                              src={selectedBooking.receipt_image} 
                                              alt="فیش واریزی" 
                                              className="max-w-full h-64 object-contain border rounded-lg"
                                            />
                                          </div>
                                        )}

                                        {/* Payment Notes */}
                                        {selectedBooking.payment_notes && (
                                          <div>
                                            <p className="text-sm text-gray-600">توضیحات دانش‌آموز:</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded">
                                              {selectedBooking.payment_notes}
                                            </p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>

                                    {/* Admin Actions */}
                                    {selectedBooking.payment_status === 'pending' && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">عملیات ادمین</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <Label htmlFor="adminNotes">توضیحات ادمین (اختیاری)</Label>
                                            <Textarea
                                              id="adminNotes"
                                              placeholder="توضیحات در مورد تایید یا رد پرداخت..."
                                              value={adminNotes}
                                              onChange={(e) => setAdminNotes(e.target.value)}
                                              rows={3}
                                            />
                                          </div>

                                          <div className="flex gap-4">
                                            <Button
                                              onClick={() => handleApproval(selectedBooking.id, true)}
                                              disabled={processing === selectedBooking.id}
                                              className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                              {processing === selectedBooking.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-1"></div>
                                              ) : (
                                                <Check className="w-4 h-4 ml-1" />
                                              )}
                                              تایید پرداخت
                                            </Button>

                                            <Button
                                              onClick={() => handleApproval(selectedBooking.id, false)}
                                              disabled={processing === selectedBooking.id}
                                              variant="destructive"
                                            >
                                              {processing === selectedBooking.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-1"></div>
                                              ) : (
                                                <X className="w-4 h-4 ml-1" />
                                              )}
                                              رد پرداخت
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Admin Notes Display */}
                                    {selectedBooking.admin_notes && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">توضیحات ادمین</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm bg-blue-50 p-2 rounded">
                                            {selectedBooking.admin_notes}
                                          </p>
                                          {selectedBooking.approved_at && (
                                            <p className="text-xs text-gray-500 mt-2">
                                              تاریخ تایید: {new Date(selectedBooking.approved_at).toLocaleString('fa-IR')}
                                            </p>
                                          )}
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
