import { useMemo } from 'react';
import { FeeStructure, Payment, Reminder, FeeStats } from '../types';

const mockFeeStructure: FeeStructure[] = [
  {
    id: '1',
    name: 'Tuition Fee - Fall 2024',
    category: 'tuition',
    amount: 15000,
    dueDate: '2024-01-30',
    description: 'Semester tuition fee for Fall 2024',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'all',
  },
  {
    id: '2',
    name: 'Hostel Fee',
    category: 'hostel',
    amount: 3000,
    dueDate: '2024-01-15',
    description: 'Accommodation charges for hostel residents',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'specific',
  },
  {
    id: '3',
    name: 'Library Fee',
    category: 'library',
    amount: 500,
    dueDate: '2024-01-20',
    description: 'Annual library membership and access fee',
    isRecurring: true,
    frequency: 'annual',
    applicableTo: 'all',
  },
  {
    id: '4',
    name: 'Computer Lab Fee',
    category: 'lab',
    amount: 1200,
    dueDate: '2024-02-01',
    description: 'Computer lab usage and maintenance fee',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'specific',
    department: 'Computer Science',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    status: 'paid',
    paymentDate: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMethod: 'online',
    transactionId: 'TXN123456789',
    receiptNumber: 'RCP001',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 7500,
    remainingAmount: 7500,
    status: 'partial',
    paymentDate: '2024-01-10',
    dueDate: '2024-01-30',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN123456790',
    receiptNumber: 'RCP002',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Carol Davis',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 0,
    remainingAmount: 15000,
    status: 'overdue',
    dueDate: '2024-01-30',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'David Wilson',
    feeType: 'Hostel Fee',
    amount: 3000,
    paidAmount: 0,
    remainingAmount: 3000,
    status: 'pending',
    dueDate: '2024-02-15',
    semester: 'Fall',
    year: '2024',
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    type: 'email',
    recipients: ['alice.johnson@student.edu', 'bob.smith@student.edu'],
    subject: 'Tuition Fee Payment Reminder',
    message:
      'This is a friendly reminder that your tuition fee payment is due in 3 days.',
    scheduledDate: '2024-01-27',
    status: 'scheduled',
    feeCategory: 'tuition',
    priority: 'high',
  },
  {
    id: '2',
    type: 'sms',
    recipients: ['+1234567890', '+1234567891'],
    subject: 'Fee Payment Due',
    message:
      'Your hostel fee payment is due tomorrow. Please make the payment to avoid late fees.',
    scheduledDate: '2024-01-14',
    status: 'sent',
    feeCategory: 'hostel',
    priority: 'medium',
  },
];

export function useFeeData() {
  const stats = useMemo((): FeeStats => {
    const totalFees = mockPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCollected = mockPayments.reduce(
      (sum, p) => sum + p.paidAmount,
      0
    );
    const totalPending = mockPayments.reduce(
      (sum, p) => sum + p.remainingAmount,
      0
    );
    const overduePayments = mockPayments.filter(
      (p) => p.status === 'overdue'
    ).length;
    const collectionRate =
      totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0;

    return {
      totalFees,
      totalCollected,
      totalPending,
      overduePayments,
      collectionRate,
    };
  }, []);

  return {
    feeStructure: mockFeeStructure,
    payments: mockPayments,
    reminders: mockReminders,
    stats,
    isLoading: false,
    error: null,
  };
}
