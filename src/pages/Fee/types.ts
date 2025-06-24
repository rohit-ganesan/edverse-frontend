export interface FeeStructure {
  id: string;
  name: string;
  category: 'tuition' | 'hostel' | 'library' | 'lab' | 'exam' | 'miscellaneous';
  amount: number;
  dueDate: string;
  description: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'semester' | 'annual';
  applicableTo: 'all' | 'undergraduate' | 'graduate' | 'specific';
  department?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentDate?: string;
  dueDate: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'cash' | 'check' | 'online';
  transactionId?: string;
  receiptNumber?: string;
  semester: string;
  year: string;
}

export interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'push' | 'call';
  recipients: string[];
  subject: string;
  message: string;
  scheduledDate: string;
  status: 'scheduled' | 'sent' | 'failed';
  feeCategory: string;
  priority: 'low' | 'medium' | 'high';
}

export interface FeeStats {
  totalFees: number;
  totalCollected: number;
  totalPending: number;
  overduePayments: number;
  collectionRate: number;
}
