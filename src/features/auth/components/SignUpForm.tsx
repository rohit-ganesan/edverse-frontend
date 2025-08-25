import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { RadixButton } from '../../../components/ui/RadixButton';
import { RadixTextField } from '../../../components/ui/RadixTextField';
import { RadixCard } from '../../../components/ui/RadixCard';
import { RadixRadioGroup } from '../../../components/ui/RadixRadioGroup';
import { Toast } from '../../../components/ui/Toast';
import { AlertTriangle } from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'Student',
    label: 'Student',
    description: 'Access courses, assignments, and learning materials',
  },
  {
    value: 'Instructor',
    label: 'Instructor',
    description: 'Create courses, manage students, and track progress',
  },
  {
    value: 'Administrator',
    label: 'Administrator',
    description: 'Full system access and user management',
  },
  {
    value: 'Parent',
    label: 'Parent',
    description: "Monitor your child's academic progress",
  },
];

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    address: '',
    role: 'Student' as 'Administrator' | 'Instructor' | 'Student' | 'Parent',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<
    'success' | 'error' | 'warning'
  >('success');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        role: formData.role,
      });

      console.log('Successfully signed up with Supabase');
      setToastMessage(
        'Account created successfully! Please check your email for verification.'
      );
      setToastVariant('success');
      setShowToast(true);

      // Navigate to login after successful signup
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/login');
        }
      }, 2000); // Give user time to read the success message
    } catch (err: any) {
      console.error('Sign up error:', err);
      const errorMessage = err.message || 'An error occurred during sign up';
      setToastMessage(errorMessage);

      // Use warning toast for existing email, error toast for other issues
      const isExistingEmailError = errorMessage.includes('already exists');
      setToastVariant(isExistingEmailError ? 'warning' : 'error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto">
        <RadixCard className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <RadixTextField
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange('first_name', e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full"
                />
                {errors.first_name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <RadixTextField
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange('last_name', e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full"
                />
                {errors.last_name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <RadixTextField
                placeholder="Email address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <RadixTextField
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <RadixTextField
                placeholder="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                required
                disabled={loading}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <RadixTextField
                placeholder="Address (optional)"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Role Selection */}
            <div>
              <RadixRadioGroup
                name="role"
                label="Select your role"
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
                options={ROLE_OPTIONS}
                required
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <RadixButton
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-700"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </RadixButton>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </RadixCard>
      </div>

      {showToast && (
        <Toast
          open={showToast}
          onOpenChange={setShowToast}
          title={
            toastVariant === 'success'
              ? 'Success'
              : toastVariant === 'warning'
                ? 'Account Already Exists'
                : 'Error'
          }
          description={toastMessage}
          variant={toastVariant}
        />
      )}
    </>
  );
}
