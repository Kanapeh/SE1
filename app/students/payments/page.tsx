'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Plus,
  Eye,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Wallet,
  Receipt,
  Banknote,
  Coins,
  Edit,
  CreditCard as CreditCardIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  Download as DownloadIcon,
  Plus as PlusIcon,
  Eye as EyeIcon,
  Filter as FilterIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Wallet as WalletIcon,
  Receipt as ReceiptIcon,
  Banknote as BanknoteIcon,
  Coins as CoinsIcon
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  teacherName: string;
  classTitle: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  name: string;
  number: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface PaymentStats {
  totalSpent: number;
  thisMonthSpent: number;
  lastMonthSpent: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  averageTransaction: number;
  monthlyGrowth: number;
}

export default function StudentPaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    // Mock transactions data
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        date: '2024-01-15',
        amount: 200000,
        teacherName: 'علی احمدی',
        classTitle: 'کلاس انگلیسی سطح متوسط',
        status: 'completed',
        paymentMethod: 'کارت بانکی',
        transactionId: 'TXN-001',
        description: 'پرداخت کلاس انگلیسی'
      },
      {
        id: '2',
        date: '2024-01-14',
        amount: 180000,
        teacherName: 'فاطمه کریمی',
        classTitle: 'کلاس فرانسه سطح مبتدی',
        status: 'completed',
        paymentMethod: 'کیف پول',
        transactionId: 'TXN-002',
        description: 'پرداخت کلاس فرانسه'
      },
      {
        id: '3',
        date: '2024-01-13',
        amount: 220000,
        teacherName: 'احمد رضایی',
        classTitle: 'کلاس آلمانی سطح پیشرفته',
        status: 'pending',
        paymentMethod: 'کارت بانکی',
        transactionId: 'TXN-003',
        description: 'پرداخت کلاس آلمانی'
      },
      {
        id: '4',
        date: '2024-01-12',
        amount: 160000,
        teacherName: 'سارا محمدی',
        classTitle: 'کلاس انگلیسی سطح مبتدی',
        status: 'completed',
        paymentMethod: 'کارت بانکی',
        transactionId: 'TXN-004',
        description: 'پرداخت کلاس انگلیسی'
      },
      {
        id: '5',
        date: '2024-01-11',
        amount: 200000,
        teacherName: 'علی احمدی',
        classTitle: 'کلاس انگلیسی سطح متوسط',
        status: 'failed',
        paymentMethod: 'کیف پول',
        transactionId: 'TXN-005',
        description: 'پرداخت کلاس انگلیسی'
      },
      {
        id: '6',
        date: '2024-01-10',
        amount: 180000,
        teacherName: 'فاطمه کریمی',
        classTitle: 'کلاس فرانسه سطح مبتدی',
        status: 'refunded',
        paymentMethod: 'کارت بانکی',
        transactionId: 'TXN-006',
        description: 'پرداخت کلاس فرانسه'
      }
    ];

    // Mock payment methods
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        name: 'کارت بانکی ملی',
        number: '**** **** **** 1234',
        isDefault: true,
        expiryDate: '12/25'
      },
      {
        id: '2',
        type: 'wallet',
        name: 'کیف پول دیجیتال',
        number: '**** **** **** 5678',
        isDefault: false
      },
      {
        id: '3',
        type: 'bank',
        name: 'حساب بانکی',
        number: '**** **** **** 9012',
        isDefault: false
      }
    ];

    // Mock stats
    const mockStats: PaymentStats = {
      totalSpent: 1140000,
      thisMonthSpent: 600000,
      lastMonthSpent: 540000,
      totalTransactions: 6,
      completedTransactions: 3,
      pendingTransactions: 1,
      averageTransaction: 190000,
      monthlyGrowth: 11.1
    };

    setTransactions(mockTransactions);
    setPaymentMethods(mockPaymentMethods);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">تکمیل شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">در انتظار</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">ناموفق</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">بازگشت وجه</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <ArrowLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-green-500" />;
      case 'bank':
        return <Banknote className="w-4 h-4 text-purple-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">اطلاعات پرداخت در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/student')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  مدیریت پرداخت‌ها
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  مشاهده و مدیریت تراکنش‌های مالی
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                دانلود گزارش
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                افزودن روش پرداخت
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">کل پرداختی</p>
                  <p className="text-2xl font-bold">{stats?.totalSpent.toLocaleString()}</p>
                  <p className="text-purple-100 text-sm">تومان</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">پرداخت این ماه</p>
                  <p className="text-2xl font-bold">{stats?.thisMonthSpent.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm text-green-100">+{stats?.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">تراکنش‌های موفق</p>
                  <p className="text-2xl font-bold">{stats?.completedTransactions}</p>
                  <p className="text-blue-100 text-sm">از {stats?.totalTransactions} تراکنش</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">میانگین تراکنش</p>
                  <p className="text-2xl font-bold">{stats?.averageTransaction.toLocaleString()}</p>
                  <p className="text-orange-100 text-sm">تومان</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              تراکنش‌ها
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              روش‌های پرداخت
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              تحلیل‌ها
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    تاریخچه تراکنش‌ها
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      فیلتر
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      دانلود
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            {getStatusIcon(transaction.status)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {transaction.classTitle}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span>{transaction.teacherName}</span>
                              <span>{transaction.date}</span>
                              <div className="flex items-center gap-1">
                                {getPaymentMethodIcon(transaction.paymentMethod === 'کارت بانکی' ? 'card' : 'wallet')}
                                <span>{transaction.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white text-lg">
                            {transaction.amount.toLocaleString()} تومان
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            شماره تراکنش: {transaction.transactionId}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            جزئیات
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods List */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    روش‌های پرداخت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                          method.isDefault
                            ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              {getPaymentMethodIcon(method.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {method.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {method.number}
                                {method.expiryDate && ` • انقضا: ${method.expiryDate}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                پیش‌فرض
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Method */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    افزودن روش جدید
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        روش پرداخت جدید
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        کارت بانکی، کیف پول یا حساب بانکی خود را اضافه کنید
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        افزودن روش پرداخت
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Chart */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    روند پرداخت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-800 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        نمودار روند پرداخت‌ها
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        نمایش روند پرداخت‌ها در طول زمان
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Stats */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    آمار پرداخت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.completedTransactions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">تراکنش موفق</div>
                    </div>
                                         <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                         {(stats?.totalTransactions || 0) - (stats?.completedTransactions || 0)}
                       </div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">تراکنش ناموفق</div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">میانگین تراکنش</span>
                      <span className="text-sm font-medium">{stats?.averageTransaction.toLocaleString()} تومان</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">بیشترین تراکنش</span>
                      <span className="text-sm font-medium">220,000 تومان</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">کمترین تراکنش</span>
                      <span className="text-sm font-medium">160,000 تومان</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">رشد ماهانه</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        +{stats?.monthlyGrowth}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 