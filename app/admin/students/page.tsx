"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Search, Edit, Trash2, Percent } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birthdate: string | null;
  national_id: string | null;
  address: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  language: string;
  level: string;
  class_type: string;
  preferred_time: string | null;
  status: string | null;
  notes: string | null;
  discount: number | null;
  created_at: string;
  updated_at: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('خطا در دریافت لیست دانش‌آموزان');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editStudent) return;
    const { name, value } = e.target;
    setEditStudent({ ...editStudent, [name]: name === 'discount' ? Number(value) : value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    try {
      const { error } = await supabase
        .from('students')
        .update(editStudent)
        .eq('id', editStudent.id);
      if (error) throw error;
      toast.success('دانش‌آموز با موفقیت ویرایش شد');
      setShowEditModal(false);
      setEditStudent(null);
      fetchStudents();
    } catch (error) {
      toast.error('خطا در ویرایش دانش‌آموز');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteStudentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteStudentId) return;
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deleteStudentId);
      if (error) throw error;
      toast.success('دانش‌آموز با موفقیت حذف شد');
      setShowDeleteModal(false);
      setDeleteStudentId(null);
      fetchStudents();
    } catch (error) {
      toast.error('خطا در حذف دانش‌آموز');
    }
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(search.toLowerCase()) ||
    student.last_name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.phone?.includes(search) ||
    student.gender?.toLowerCase().includes(search.toLowerCase()) ||
    student.birthdate?.includes(search) ||
    student.national_id?.includes(search) ||
    student.address?.toLowerCase().includes(search.toLowerCase()) ||
    student.parent_name?.toLowerCase().includes(search.toLowerCase()) ||
    student.parent_phone?.includes(search) ||
    student.language.toLowerCase().includes(search.toLowerCase()) ||
    student.level.toLowerCase().includes(search.toLowerCase()) ||
    student.class_type.toLowerCase().includes(search.toLowerCase()) ||
    student.preferred_time?.toLowerCase().includes(search.toLowerCase()) ||
    student.status?.toLowerCase().includes(search.toLowerCase()) ||
    student.notes?.toLowerCase().includes(search.toLowerCase()) ||
    (student.discount !== null && student.discount.toString().includes(search))
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دانش‌آموزان</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead>جنسیت</TableHead>
              <TableHead>تاریخ تولد</TableHead>
              <TableHead>کد ملی</TableHead>
              <TableHead>آدرس</TableHead>
              <TableHead>نام پدر</TableHead>
              <TableHead>تلفن پدر</TableHead>
              <TableHead>زبان</TableHead>
              <TableHead>سطح</TableHead>
              <TableHead>نوع کلاس</TableHead>
              <TableHead>ساعت پسندیده</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>یادداشت‌ها</TableHead>
              <TableHead>تخفیف (%)</TableHead>
              <TableHead>تاریخ ثبت‌نام</TableHead>
              <TableHead>تاریخ بروزرسانی</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone || '-'}</TableCell>
                <TableCell>{student.gender || '-'}</TableCell>
                <TableCell>{student.birthdate || '-'}</TableCell>
                <TableCell>{student.national_id || '-'}</TableCell>
                <TableCell>{student.address || '-'}</TableCell>
                <TableCell>{student.parent_name || '-'}</TableCell>
                <TableCell>{student.parent_phone || '-'}</TableCell>
                <TableCell>{student.language}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>{student.class_type}</TableCell>
                <TableCell>{student.preferred_time || '-'}</TableCell>
                <TableCell>{student.status || '-'}</TableCell>
                <TableCell>{student.notes || '-'}</TableCell>
                <TableCell>{student.discount !== null ? student.discount + '%' : '-'}</TableCell>
                <TableCell>{new Date(student.created_at).toLocaleDateString('fa-IR')}</TableCell>
                <TableCell>{new Date(student.updated_at).toLocaleDateString('fa-IR')}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/students/${student.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editStudent && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 w-full max-w-2xl space-y-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">ویرایش دانش‌آموز</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="first_name" value={editStudent.first_name} onChange={handleEditChange} placeholder="نام" required />
              <Input name="last_name" value={editStudent.last_name} onChange={handleEditChange} placeholder="نام خانوادگی" required />
              <Input name="email" value={editStudent.email} onChange={handleEditChange} placeholder="ایمیل" required />
              <Input name="phone" value={editStudent.phone || ''} onChange={handleEditChange} placeholder="تلفن" />
              <Input name="gender" value={editStudent.gender || ''} onChange={handleEditChange} placeholder="جنسیت" />
              <Input name="birthdate" value={editStudent.birthdate || ''} onChange={handleEditChange} placeholder="تاریخ تولد (YYYY-MM-DD)" />
              <Input name="national_id" value={editStudent.national_id || ''} onChange={handleEditChange} placeholder="کد ملی" />
              <Input name="address" value={editStudent.address || ''} onChange={handleEditChange} placeholder="آدرس" />
              <Input name="parent_name" value={editStudent.parent_name || ''} onChange={handleEditChange} placeholder="نام پدر" />
              <Input name="parent_phone" value={editStudent.parent_phone || ''} onChange={handleEditChange} placeholder="تلفن پدر" />
              <Input name="language" value={editStudent.language} onChange={handleEditChange} placeholder="زبان" required />
              <Input name="level" value={editStudent.level} onChange={handleEditChange} placeholder="سطح" required />
              <Input name="class_type" value={editStudent.class_type} onChange={handleEditChange} placeholder="نوع کلاس" required />
              <Input name="preferred_time" value={editStudent.preferred_time || ''} onChange={handleEditChange} placeholder="ساعت پسندیده" />
              <Input name="status" value={editStudent.status || ''} onChange={handleEditChange} placeholder="وضعیت" />
              <Input name="notes" value={editStudent.notes || ''} onChange={handleEditChange} placeholder="یادداشت‌ها" />
              <Input name="discount" type="number" value={editStudent.discount !== null ? editStudent.discount : ''} onChange={handleEditChange} placeholder="تخفیف (%)" min={0} max={100} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>انصراف</Button>
              <Button type="submit">ذخیره تغییرات</Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">حذف دانش‌آموز</h2>
            <p className="mb-6">آیا مطمئن هستید که می‌خواهید این دانش‌آموز را حذف کنید؟ این عملیات غیرقابل بازگشت است.</p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>انصراف</Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>حذف</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 