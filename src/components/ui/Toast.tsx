import { ComponentProps, forwardRef } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Flex, Text } from '@radix-ui/themes';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast Provider component - wrap your app with this
 */
export const ToastProvider = ToastPrimitive.Provider;

/**
 * Toast Viewport - where toasts are rendered
 */
export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentProps<typeof ToastPrimitive.Viewport>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={`
      fixed top-0 right-0 z-50 flex max-h-screen w-full
      flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto
      sm:flex-col md:max-w-[420px] ${className}
    `}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

/**
 * Toast Root component
 */
export const ToastRoot = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ComponentProps<typeof ToastPrimitive.Root> & {
    variant?: 'default' | 'success' | 'error' | 'warning';
  }
>(({ className = '', variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  };

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={`
        group pointer-events-auto relative flex w-full items-center
        justify-between space-x-4 overflow-hidden rounded-lg border p-4
        shadow-lg transition-all data-[swipe=cancel]:translate-x-0
        data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
        data-[swipe=move]:transition-none data-[state=open]:animate-in
        data-[state=closed]:animate-out data-[swipe=end]:animate-out
        data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full
        data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full
        ${variantStyles[variant]} ${className}
      `}
      {...props}
    />
  );
});
ToastRoot.displayName = ToastPrimitive.Root.displayName;

/**
 * Toast Title component
 */
export const ToastTitle = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  ComponentProps<typeof ToastPrimitive.Title>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={`text-sm font-semibold ${className}`}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

/**
 * Toast Description component
 */
export const ToastDescription = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  ComponentProps<typeof ToastPrimitive.Description>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={`text-sm opacity-90 ${className}`}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

/**
 * Toast Close button
 */
export const ToastClose = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  ComponentProps<typeof ToastPrimitive.Close>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={`
      absolute right-2 top-2 rounded-md p-1 text-gray-950/50
      opacity-0 transition-opacity hover:text-gray-950
      focus:opacity-100 focus:outline-none focus:ring-2
      group-hover:opacity-100 group-[.destructive]:text-red-300
      group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400
      group-[.destructive]:focus:ring-offset-red-600 ${className}
    `}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

/**
 * Convenience Toast component with icon
 */
interface ToastProps {
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Toast({
  title,
  description,
  variant = 'default',
  open,
  onOpenChange,
}: ToastProps): JSX.Element {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />;
      case 'warning':
        return (
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
        );
      default:
        return <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <ToastRoot variant={variant} open={open} onOpenChange={onOpenChange}>
      <Flex align="start" gap="3" className="w-full">
        {getIcon()}
        <div className="flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          <ToastDescription>
            <Text size="2">{description}</Text>
          </ToastDescription>
        </div>
      </Flex>
      <ToastClose />
    </ToastRoot>
  );
}
