import { useMemo } from 'react';
import {
  FeeStructure,
  Payment,
  FeeReminder,
  FeeStats,
  FeeDashboardData,
  FeeAssignment,
  Student,
  FeeAlert,
  QuickAction,
  CollectionTrend,
} from '../types';

const mockFeeStructure: FeeStructure[] = [
  {
    id: '1',
    name: 'Tuition Fee - Fall 2024',
    category: 'tuition',
    amount: 15000,
    currency: 'USD',
    dueDate: '2024-01-30T23:59:59Z',
    description: 'Semester tuition fee for Fall 2024 academic year',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: [{ type: 'all' }],
    lateFeeAmount: 500,
    lateFeeAfterDays: 7,
    discounts: [
      {
        id: 'disc1',
        name: 'Merit Scholarship',
        type: 'percentage',
        value: 25,
        eligibilityCriteria: ['GPA > 3.8', 'Academic Excellence'],
        isActive: true,
        validFrom: '2024-01-01T00:00:00Z',
        validUntil: '2024-12-31T23:59:59Z',
      },
    ],
    isActive: true,
    createdDate: '2023-12-01T00:00:00Z',
    lastModified: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Hostel Accommodation Fee',
    category: 'hostel',
    amount: 3000,
    currency: 'USD',
    dueDate: '2024-01-15T23:59:59Z',
    description:
      'Accommodation charges for hostel residents including utilities',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: [{ type: 'hostel_residents' }],
    lateFeeAmount: 100,
    lateFeeAfterDays: 5,
    discounts: [],
    isActive: true,
    createdDate: '2023-12-01T00:00:00Z',
    lastModified: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Library and Digital Resources Fee',
    category: 'library',
    amount: 500,
    currency: 'USD',
    dueDate: '2024-01-20T23:59:59Z',
    description:
      'Annual library membership, digital resources, and database access',
    isRecurring: true,
    frequency: 'annual',
    applicableTo: [{ type: 'all' }],
    lateFeeAmount: 25,
    lateFeeAfterDays: 10,
    discounts: [],
    isActive: true,
    createdDate: '2023-12-01T00:00:00Z',
    lastModified: '2024-01-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Computer Lab and Software License Fee',
    category: 'laboratory',
    amount: 1200,
    currency: 'USD',
    dueDate: '2024-02-01T23:59:59Z',
    description: 'Computer lab usage, software licenses, and technical support',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: [
      { type: 'department', value: 'Computer Science' },
      { type: 'department', value: 'Information Technology' },
    ],
    lateFeeAmount: 75,
    lateFeeAfterDays: 7,
    discounts: [],
    isActive: true,
    createdDate: '2023-12-01T00:00:00Z',
    lastModified: '2024-01-12T16:20:00Z',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    receiptNumber: 'RCP2024001',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    feeAssignmentIds: ['fa1'],
    totalAmount: 15000,
    paidAmount: 15000,
    paymentDate: '2024-01-15T14:30:00Z',
    paymentMethod: 'online',
    transactionId: 'TXN123456789',
    status: 'completed',
    paymentGateway: 'Stripe',
    processedBy: 'system',
    verifiedBy: 'John Smith',
    verificationDate: '2024-01-15T15:00:00Z',
  },
  {
    id: '2',
    receiptNumber: 'RCP2024002',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    feeAssignmentIds: ['fa2'],
    totalAmount: 15000,
    paidAmount: 7500,
    paymentDate: '2024-01-10T11:20:00Z',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN123456790',
    bankReference: 'REF789012345',
    status: 'completed',
    processedBy: 'Jane Doe',
    verifiedBy: 'John Smith',
    verificationDate: '2024-01-10T16:45:00Z',
    notes: 'Partial payment - student requested installment plan',
  },
  {
    id: '3',
    receiptNumber: 'RCP2024003',
    studentId: 'STU003',
    studentName: 'Carol Davis',
    feeAssignmentIds: ['fa3'],
    totalAmount: 3000,
    paidAmount: 3000,
    paymentDate: '2024-01-12T09:15:00Z',
    paymentMethod: 'card',
    transactionId: 'TXN123456791',
    status: 'completed',
    processedBy: 'system',
    verifiedBy: 'Jane Doe',
    verificationDate: '2024-01-12T09:30:00Z',
  },
  {
    id: '4',
    receiptNumber: 'RCP2024004',
    studentId: 'STU004',
    studentName: 'David Wilson',
    feeAssignmentIds: ['fa4'],
    totalAmount: 500,
    paidAmount: 500,
    paymentDate: '2024-01-18T16:45:00Z',
    paymentMethod: 'cash',
    status: 'completed',
    processedBy: 'Mary Johnson',
    verifiedBy: 'John Smith',
    verificationDate: '2024-01-18T17:00:00Z',
  },
];

const mockFeeAssignments: FeeAssignment[] = [
  {
    id: 'fa1',
    studentId: 'STU001',
    feeStructureId: '1',
    academicYear: '2024-2025',
    semester: 'Fall',
    originalAmount: 15000,
    discountAmount: 0,
    finalAmount: 15000,
    dueDate: '2024-01-30T23:59:59Z',
    assignedDate: '2024-01-01T00:00:00Z',
    status: 'fully_paid',
  },
  {
    id: 'fa2',
    studentId: 'STU002',
    feeStructureId: '1',
    academicYear: '2024-2025',
    semester: 'Fall',
    originalAmount: 15000,
    discountAmount: 0,
    finalAmount: 15000,
    dueDate: '2024-01-30T23:59:59Z',
    assignedDate: '2024-01-01T00:00:00Z',
    status: 'partially_paid',
  },
  {
    id: 'fa3',
    studentId: 'STU003',
    feeStructureId: '2',
    academicYear: '2024-2025',
    semester: 'Fall',
    originalAmount: 3000,
    discountAmount: 0,
    finalAmount: 3000,
    dueDate: '2024-01-15T23:59:59Z',
    assignedDate: '2024-01-01T00:00:00Z',
    status: 'fully_paid',
  },
  {
    id: 'fa4',
    studentId: 'STU004',
    feeStructureId: '3',
    academicYear: '2024-2025',
    semester: 'Fall',
    originalAmount: 500,
    discountAmount: 0,
    finalAmount: 500,
    dueDate: '2024-01-20T23:59:59Z',
    assignedDate: '2024-01-01T00:00:00Z',
    status: 'fully_paid',
  },
  {
    id: 'fa5',
    studentId: 'STU005',
    feeStructureId: '1',
    academicYear: '2024-2025',
    semester: 'Fall',
    originalAmount: 15000,
    discountAmount: 0,
    finalAmount: 15000,
    dueDate: '2024-01-30T23:59:59Z',
    assignedDate: '2024-01-01T00:00:00Z',
    status: 'overdue',
  },
];

const mockReminders: FeeReminder[] = [
  {
    id: '1',
    studentIds: ['STU002', 'STU005'],
    feeType: 'Tuition Fee',
    reminderType: 'due_date',
    channel: 'email',
    scheduledDate: '2024-01-27T09:00:00Z',
    status: 'scheduled',
    subject: 'Tuition Fee Payment Reminder',
    message:
      'This is a friendly reminder that your tuition fee payment is due in 3 days. Please make the payment to avoid late fees.',
    priority: 'high',
    createdBy: 'John Smith',
    responseRequired: false,
  },
  {
    id: '2',
    studentIds: ['STU005'],
    feeType: 'Tuition Fee',
    reminderType: 'overdue',
    channel: 'sms',
    scheduledDate: '2024-01-14T10:00:00Z',
    sentDate: '2024-01-14T10:05:00Z',
    status: 'sent',
    subject: 'Overdue Fee Payment',
    message:
      'Your tuition fee payment is overdue. Please make the payment immediately to avoid additional penalties.',
    priority: 'urgent',
    createdBy: 'Jane Doe',
    responseRequired: true,
    responses: [
      {
        studentId: 'STU005',
        responseDate: '2024-01-14T14:30:00Z',
        responseType: 'extension_request',
        notes: 'Requesting 1 week extension due to family emergency',
      },
    ],
  },
];

const mockAlerts: FeeAlert[] = [
  {
    id: 'alert1',
    type: 'overdue_payment',
    severity: 'warning',
    title: 'Multiple Overdue Payments',
    description: '5 students have overdue tuition fee payments',
    actionRequired: true,
    createdDate: '2024-01-24T08:00:00Z',
    isRead: false,
    relatedEntityId: 'STU005',
  },
  {
    id: 'alert2',
    type: 'deadline_approaching',
    severity: 'info',
    title: 'Payment Deadline Approaching',
    description: 'Hostel fee payment deadline is in 2 days',
    actionRequired: false,
    createdDate: '2024-01-23T12:00:00Z',
    isRead: true,
  },
];

const mockQuickActions: QuickAction[] = [
  {
    id: 'qa1',
    title: 'Send Payment Reminders',
    description: 'Send automated reminders to students with pending payments',
    icon: 'Mail',
    action: 'send_reminders',
    count: 15,
    urgent: true,
  },
  {
    id: 'qa2',
    title: 'Generate Collection Report',
    description: 'Generate detailed collection report for this month',
    icon: 'FileText',
    action: 'generate_report',
    urgent: false,
  },
  {
    id: 'qa3',
    title: 'Process Pending Refunds',
    description: 'Review and process pending refund requests',
    icon: 'RefreshCw',
    action: 'process_refunds',
    count: 3,
    urgent: false,
  },
];

const mockCollectionTrends: CollectionTrend[] = [
  { period: 'Jan Week 1', collected: 45000, outstanding: 12000, target: 50000 },
  { period: 'Jan Week 2', collected: 52000, outstanding: 8000, target: 50000 },
  { period: 'Jan Week 3', collected: 48000, outstanding: 15000, target: 50000 },
  { period: 'Jan Week 4', collected: 55000, outstanding: 5000, target: 50000 },
];

export function useFeeData() {
  const stats = useMemo((): FeeStats => {
    const totalFeesAssigned = mockFeeAssignments.reduce(
      (sum, fa) => sum + fa.finalAmount,
      0
    );
    const totalFeesCollected = mockPayments.reduce(
      (sum, p) => sum + p.paidAmount,
      0
    );
    const totalOutstanding = totalFeesAssigned - totalFeesCollected;
    const collectionRate =
      totalFeesAssigned > 0
        ? Math.round((totalFeesCollected / totalFeesAssigned) * 100)
        : 0;
    const overdueAssignments = mockFeeAssignments.filter(
      (fa) => fa.status === 'overdue'
    );
    const overdueAmount = overdueAssignments.reduce(
      (sum, fa) => sum + fa.finalAmount,
      0
    );
    const overdueCount = overdueAssignments.length;
    const partialPaymentCount = mockFeeAssignments.filter(
      (fa) => fa.status === 'partially_paid'
    ).length;

    return {
      totalFeesAssigned,
      totalFeesCollected,
      totalOutstanding,
      collectionRate,
      overdueAmount,
      overdueCount,
      todaysCollection: 8500,
      thisMonthCollection: 165000,
      averagePaymentTime: 3.2,
      defaulterCount: 2,
      partialPaymentCount,
      refundsPending: 3,
      scholarshipAmount: 25000,
      waivedAmount: 5000,
    };
  }, []);

  const dashboardData = useMemo(
    (): FeeDashboardData => ({
      recentPayments: mockPayments.slice(0, 5),
      overduePayments: mockFeeAssignments.filter(
        (fa) => fa.status === 'overdue'
      ),
      upcomingDueDates: mockFeeAssignments.filter((fa) => {
        const dueDate = new Date(fa.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0 && fa.status === 'assigned';
      }),
      collectionTrends: mockCollectionTrends,
      alertsAndNotifications: mockAlerts,
      quickActions: mockQuickActions,
    }),
    []
  );

  return {
    feeStructure: mockFeeStructure,
    payments: mockPayments,
    feeAssignments: mockFeeAssignments,
    reminders: mockReminders,
    stats,
    dashboardData,
    isLoading: false,
    error: null,
  };
}
