'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  History,
  RefreshCw
} from 'lucide-react';

interface WalletData {
  balance: number;
  total_earned?: number;
  total_deposited?: number;
  total_spent?: number;
  total_withdrawn?: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface WalletCardProps {
  userType: 'teacher' | 'student';
  userId: string;
  className?: string;
}

export default function WalletCard({ userType, userId, className = '' }: WalletCardProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/wallet?type=${userType}&user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWallet(data.wallet);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId, userType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'commission':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'withdrawal':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'payment':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'واریز';
      case 'commission':
        return 'کمیسیون';
      case 'withdrawal':
        return 'برداشت';
      case 'payment':
        return 'پرداخت';
      case 'refund':
        return 'بازگشت';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="mr-2">در حال بارگذاری...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {userType === 'teacher' ? 'کیف پول معلم' : 'کیف پول دانش‌آموز'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchWalletData}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Wallet className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">موجودی فعلی:</span>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              {formatCurrency(wallet?.balance || 0)}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {userType === 'teacher' ? (
              <>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">کل درآمد</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(wallet?.total_earned || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">کل برداشت</div>
                  <div className="text-sm font-medium text-red-600">
                    {formatCurrency(wallet?.total_withdrawn || 0)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">کل واریز</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(wallet?.total_deposited || 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">کل خرج</div>
                  <div className="text-sm font-medium text-red-600">
                    {formatCurrency(wallet?.total_spent || 0)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <History className="h-4 w-4" />
                <span className="text-sm font-medium">آخرین تراکنش‌ها</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between text-xs p-2 bg-muted rounded"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getTransactionIcon(transaction.transaction_type)}
                      <span>{getTransactionLabel(transaction.transaction_type)}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
