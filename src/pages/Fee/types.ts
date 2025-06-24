export interface FeeStructure {
  id: string;
  name: string;
  category:
    | 'tuition'
    | 'hostel'
    | 'library'
    | 'laboratory'
    | 'examination'
    | 'registration'
    | 'development'
    | 'miscellaneous'
    | 'fine';
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'semester' | 'annual';
  applicableTo: ApplicabilityRule[];
  lateFeeAmount?: number;
  lateFeeAfterDays?: number;
  discounts: FeeDiscount[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export interface ApplicabilityRule {
  type:
    | 'all'
    | 'program'
    | 'year'
    | 'department'
    | 'hostel_residents'
    | 'scholarship_holders';
  value?: string; // program name, year, department name, etc.
  condition?: 'equals' | 'not_equals' | 'contains';
}

export interface FeeDiscount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  eligibilityCriteria: string[];
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  year: number;
  department: string;
  isHostelResident: boolean;
  hasScholarship: boolean;
  scholarshipPercentage?: number;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  isActive: boolean;
}

export interface FeeAssignment {
  id: string;
  studentId: string;
  feeStructureId: string;
  academicYear: string;
  semester: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  dueDate: string;
  assignedDate: string;
  status: 'assigned' | 'partially_paid' | 'fully_paid' | 'overdue' | 'waived';
}

export interface Payment {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  feeAssignmentIds: string[];
  totalAmount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod:
    | 'cash'
    | 'card'
    | 'bank_transfer'
    | 'online'
    | 'cheque'
    | 'demand_draft';
  transactionId?: string;
  bankReference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentGateway?: string;
  notes?: string;
  processedBy: string;
  verifiedBy?: string;
  verificationDate?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
}

export interface FeeReminder {
  id: string;
  studentIds: string[];
  feeType: string;
  reminderType: 'due_date' | 'overdue' | 'final_notice';
  channel: 'email' | 'sms' | 'push_notification' | 'phone_call';
  scheduledDate: string;
  sentDate?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  responseRequired: boolean;
  responses?: ReminderResponse[];
}

export interface ReminderResponse {
  studentId: string;
  responseDate: string;
  responseType:
    | 'acknowledged'
    | 'payment_planned'
    | 'dispute'
    | 'extension_request';
  notes?: string;
}

export interface FeeReport {
  id: string;
  title: string;
  type:
    | 'collection_summary'
    | 'outstanding_fees'
    | 'payment_analysis'
    | 'defaulter_list'
    | 'department_wise'
    | 'custom';
  generatedDate: string;
  generatedBy: string;
  filters: ReportFilter[];
  data: any;
  totalRecords: number;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl?: string;
}

export interface ReportFilter {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'between'
    | 'contains';
  value: any;
}

export interface FeeStats {
  totalFeesAssigned: number;
  totalFeesCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  overdueAmount: number;
  overdueCount: number;
  todaysCollection: number;
  thisMonthCollection: number;
  averagePaymentTime: number; // in days
  defaulterCount: number;
  partialPaymentCount: number;
  refundsPending: number;
  scholarshipAmount: number;
  waivedAmount: number;
}

export interface FeeDashboardData {
  recentPayments: Payment[];
  overduePayments: FeeAssignment[];
  upcomingDueDates: FeeAssignment[];
  collectionTrends: CollectionTrend[];
  alertsAndNotifications: FeeAlert[];
  quickActions: QuickAction[];
}

export interface CollectionTrend {
  period: string;
  collected: number;
  outstanding: number;
  target?: number;
}

export interface FeeAlert {
  id: string;
  type:
    | 'overdue_payment'
    | 'large_refund'
    | 'payment_failure'
    | 'deadline_approaching'
    | 'unusual_activity';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  actionRequired: boolean;
  createdDate: string;
  isRead: boolean;
  relatedEntityId?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action:
    | 'send_reminders'
    | 'generate_report'
    | 'process_refunds'
    | 'update_fees'
    | 'view_defaulters';
  count?: number;
  urgent?: boolean;
}
