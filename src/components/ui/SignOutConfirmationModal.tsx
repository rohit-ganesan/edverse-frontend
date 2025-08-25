import React from 'react';
import { RadixDialog } from './RadixDialog';
import { RadixButton } from './RadixButton';

interface SignOutConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  userName?: string;
}

export const SignOutConfirmationModal: React.FC<
  SignOutConfirmationModalProps
> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  loading = false,
  userName = 'your account',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <RadixDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign Out"
      description={`Are you sure you want to sign out of ${userName}?`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end space-x-3">
          <RadixButton
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg"
          >
            Cancel
          </RadixButton>
          <RadixButton
            variant="solid"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg"
          >
            {loading ? 'Signing Out...' : 'Sign Out'}
          </RadixButton>
        </div>
      </div>
    </RadixDialog>
  );
};

export default SignOutConfirmationModal;
