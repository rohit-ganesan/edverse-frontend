import React from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Payment } from '../types';

interface PaymentCardProps {
  payment: Payment;
  onView?: (payment: Payment) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'failed':
      return <XCircle className="h-4 w-4" />;
    case 'refunded':
      return <RefreshCw className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'card':
      return <CreditCard className="h-4 w-4" />;
    case 'bank_transfer':
      return <DollarSign className="h-4 w-4" />;
    case 'online':
      return <DollarSign className="h-4 w-4" />;
    case 'cash':
      return <DollarSign className="h-4 w-4" />;
    case 'cheque':
      return <DollarSign className="h-4 w-4" />;
    case 'demand_draft':
      return <DollarSign className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const formatPaymentMethod = (method: string) => {
  return method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export function PaymentCard({
  payment,
  onView,
}: PaymentCardProps): JSX.Element {
  const isPartialPayment = payment.paidAmount < payment.totalAmount;
  const isCompleted = payment.status === 'completed';
  const isFailed = payment.status === 'failed';

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        isFailed ? 'border-red-200 bg-red-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">
            {payment.studentName}
          </h4>
          <p className="text-xs text-gray-500">
            Receipt: {payment.receiptNumber}
          </p>
        </div>
        <div
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}
        >
          {getStatusIcon(payment.status)}
          <span>{formatStatus(payment.status)}</span>
        </div>
      </div>

      {/* Amount Information */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Amount Paid:
          </span>
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(payment.paidAmount)}
          </span>
        </div>
        {isPartialPayment && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Total Amount:</span>
            <span className="text-xs text-gray-700">
              {formatCurrency(payment.totalAmount)}
            </span>
          </div>
        )}
        {isPartialPayment && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Payment Progress</span>
              <span className="text-gray-700">
                {Math.round((payment.paidAmount / payment.totalAmount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(payment.paidAmount / payment.totalAmount) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center space-x-1">
          {getPaymentMethodIcon(payment.paymentMethod)}
          <span className="text-gray-600">
            {formatPaymentMethod(payment.paymentMethod)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-gray-500">Date:</span>
          <span className="ml-1 text-gray-700">
            {new Date(payment.paymentDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Transaction Details */}
      {payment.transactionId && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-mono text-gray-700">
              {payment.transactionId}
            </span>
          </div>
          {payment.bankReference && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-500">Bank Ref:</span>
              <span className="font-mono text-gray-700">
                {payment.bankReference}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {payment.notes && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
          <span className="text-blue-800">{payment.notes}</span>
        </div>
      )}

      {/* Verification Info */}
      {payment.verifiedBy && payment.verificationDate && (
        <div className="mb-3 text-xs text-green-600">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified by {payment.verifiedBy}</span>
          </div>
          <div className="text-green-500 mt-1">
            {new Date(payment.verificationDate).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Refund Information */}
      {payment.refundAmount && payment.refundDate && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="text-yellow-800">Refunded:</span>
            <span className="font-medium text-yellow-900">
              {formatCurrency(payment.refundAmount)}
            </span>
          </div>
          <div className="text-yellow-700 mt-1">
            Date: {new Date(payment.refundDate).toLocaleDateString()}
          </div>
          {payment.refundReason && (
            <div className="text-yellow-700 mt-1">
              Reason: {payment.refundReason}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Processed by: {payment.processedBy}
        </div>
        <div className="flex items-center space-x-2">
          {onView && (
            <button
              onClick={() => onView(payment)}
              className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </button>
          )}
          <button className="inline-flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
            <Download className="h-3 w-3 mr-1" />
            Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
