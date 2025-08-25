import React, { useState } from 'react';
import { z } from 'zod';
import { RadixButton } from '../../../components/ui/RadixButton';
import { RadixTextField } from '../../../components/ui/RadixTextField';
import { RadixCard } from '../../../components/ui/RadixCard';
import { RadioGroup } from '@radix-ui/themes';
import { Toast } from '../../../components/ui/Toast';
import { Building2, Users, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../AuthContext';

// Zod schemas for validation
const step1Schema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const step2Schema = z.object({
  role: z.enum(['owner', 'admin', 'teacher', 'student', 'parent'], {
    required_error: 'Please select a role',
  }),
});

const step3Schema = z.object({
  school_name: z
    .string()
    .min(2, 'School name must be at least 2 characters')
    .optional(),
  subjects: z
    .array(z.string())
    .min(1, 'Please select at least one subject')
    .optional(),
  grade: z.string().min(1, 'Please select your grade').optional(),
  parent_email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
});

interface FormData {
  // Step 1: Basic Info
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  address: string;

  // Step 2: Role Selection
  role: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';

  // Step 3: Role-specific Info
  school_name?: string; // Only for owner/admin
  subjects?: string[]; // Only for teacher
  grade?: string; // Only for student
  parent_email?: string; // Only for student
}

const ROLE_OPTIONS = [
  {
    value: 'owner',
    label: 'School Owner',
    description: 'Full system access, billing, and user management',
    icon: Building2,
  },
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Manage users, courses, and school settings',
    icon: Users,
  },
  {
    value: 'teacher',
    label: 'Teacher',
    description: 'Create courses, manage students, and track progress',
    icon: GraduationCap,
  },
  {
    value: 'student',
    label: 'Student',
    description: 'Access courses, assignments, and learning materials',
    icon: User,
  },
  {
    value: 'parent',
    label: 'Parent',
    description: "Monitor your child's academic progress",
    icon: User,
  },
];

const GRADE_OPTIONS = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
];

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Economics',
  'Psychology',
  'Sociology',
  'Literature',
  'Foreign Languages',
  'Business',
  'Engineering',
  'Medicine',
];

export const StepByStepSignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    address: '',
    role: 'teacher',
  });

  const validateField = (field: keyof FormData) => {
    const newErrors = { ...formErrors };

    try {
      // Validate based on current step and field
      if (currentStep === 1) {
        const step1Data = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          address: formData.address,
        };

        step1Schema.parse(step1Data);
        // If validation passes, clear any existing errors for this field
        delete newErrors[field];
      } else if (currentStep === 2 && field === 'role') {
        step2Schema.parse({ role: formData.role });
        delete newErrors[field];
      } else if (currentStep === 3) {
        const step3Data: any = {};

        if (formData.role === 'owner' || formData.role === 'admin') {
          step3Data.school_name = formData.school_name;
        }
        if (formData.role === 'teacher') {
          step3Data.subjects = formData.subjects;
        }
        if (formData.role === 'student') {
          step3Data.grade = formData.grade;
          step3Data.parent_email = formData.parent_email;
        }

        step3Schema.parse(step3Data);
        delete newErrors[field];
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Find the error for the current field
        const fieldError = error.errors.find((err) => err.path[0] === field);
        if (fieldError) {
          newErrors[field] = fieldError.message;
        } else {
          // If no error for this field, clear it
          delete newErrors[field];
        }
      }
    }

    setFormErrors(newErrors);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: keyof FormData) => {
    validateField(field);
  };

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 1:
          step1Schema.parse({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            address: formData.address,
          });
          break;

        case 2:
          step2Schema.parse({
            role: formData.role,
          });
          break;

        case 3:
          const step3Data: any = {};

          if (formData.role === 'owner' || formData.role === 'admin') {
            step3Data.school_name = formData.school_name;
          }
          if (formData.role === 'teacher') {
            step3Data.subjects = formData.subjects;
          }
          if (formData.role === 'student') {
            step3Data.grade = formData.grade;
            step3Data.parent_email = formData.parent_email;
          }

          step3Schema.parse(step3Data);
          break;
      }

      // Clear all errors if validation passes
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setFormErrors({});

    try {
      await signUp(formData.email, formData.password, formData);
      setSuccess(
        'Account created successfully! Please check your email to verify your account.'
      );
    } catch (err: any) {
      setFormErrors({ submit: err.message || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <p className="text-gray-600 mb-6">
          Let's start with your basic details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RadixTextField
            label="First Name"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            onBlur={() => handleInputBlur('first_name')}
            required
          />
          {formErrors.first_name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>
          )}
        </div>
        <div>
          <RadixTextField
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            onBlur={() => handleInputBlur('last_name')}
            required
          />
          {formErrors.last_name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <RadixTextField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          onBlur={() => handleInputBlur('email')}
          required
        />
        {formErrors.email && (
          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
        )}
      </div>

      <RadixTextField
        label="Address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Enter your address (optional)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RadixTextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onBlur={() => handleInputBlur('password')}
            required
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>
        <div>
          <RadixTextField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            onBlur={() => handleInputBlur('confirmPassword')}
            required
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.confirmPassword}
            </p>
          )}
          {formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword && (
              <p className="text-green-500 text-sm mt-1">✓ Passwords match</p>
            )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Your Role</h3>
        <p className="text-gray-600 mb-6">
          Choose the role that best describes you
        </p>
      </div>

      <RadioGroup.Root
        value={formData.role}
        onValueChange={(value: string) => handleInputChange('role', value)}
        onBlur={() => handleInputBlur('role')}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {ROLE_OPTIONS.map((role) => {
          const IconComponent = role.icon;
          return (
            <RadioGroup.Item
              key={role.value}
              value={role.value}
              className={`p-8 border rounded-lg cursor-pointer transition-colors flex flex-col justify-start min-h-[180px] min-w-[280px] ${
                formData.role === role.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-4">
                <IconComponent className="w-8 h-8 mr-3 text-blue-600" />
                <span className="font-semibold text-xl">{role.label}</span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed flex-grow">
                {role.description}
              </p>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      {formErrors.role && (
        <p className="text-red-500 text-sm mt-2">{formErrors.role}</p>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <p className="text-gray-600 mb-6">Tell us a bit more about yourself</p>
      </div>

      {/* School Owner/Admin specific fields */}
      {(formData.role === 'owner' || formData.role === 'admin') && (
        <div>
          <RadixTextField
            label="School Name"
            value={formData.school_name || ''}
            onChange={(e) => handleInputChange('school_name', e.target.value)}
            onBlur={() => handleInputBlur('school_name')}
            required
            placeholder="Enter your school name"
          />
          {formErrors.school_name && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.school_name}
            </p>
          )}
        </div>
      )}

      {/* Teacher specific fields */}
      {formData.role === 'teacher' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects You Teach
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {SUBJECT_OPTIONS.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.subjects?.includes(subject) || false}
                    onChange={(e) => {
                      const currentSubjects = formData.subjects || [];
                      const newSubjects = e.target.checked
                        ? [...currentSubjects, subject]
                        : currentSubjects.filter((s) => s !== subject);
                      handleInputChange('subjects', newSubjects);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-base text-gray-700 font-medium">
                    {subject}
                  </span>
                </label>
              ))}
            </div>
            {formErrors.subjects && (
              <p className="text-red-500 text-sm mt-2">{formErrors.subjects}</p>
            )}
          </div>
        </div>
      )}

      {/* Student specific fields */}
      {formData.role === 'student' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              value={formData.grade || ''}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              onBlur={() => handleInputBlur('grade')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your grade</option>
              {GRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            {formErrors.grade && (
              <p className="text-red-500 text-sm mt-1">{formErrors.grade}</p>
            )}
          </div>

          <RadixTextField
            label="Parent's Email (Optional)"
            type="email"
            value={formData.parent_email || ''}
            onChange={(e) => handleInputChange('parent_email', e.target.value)}
            onBlur={() => handleInputBlur('parent_email')}
            placeholder="Enter parent's email address"
          />
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <RadixCard className="w-full max-w-7xl mx-auto p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 3
          </span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 && 'Basic Information'}
            {currentStep === 2 && 'Role Selection'}
            {currentStep === 3 && 'Additional Details'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      {renderCurrentStep()}

      {/* Success Message */}
      {success && (
        <Toast
          variant="success"
          description={success}
          open={!!success}
          onOpenChange={() => setSuccess(null)}
        />
      )}

      {/* Submit Error Message */}
      {formErrors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-800 text-sm">{formErrors.submit}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {currentStep === 1 ? (
          <RadixButton
            variant="outline"
            onClick={() => (window.location.href = '/login')}
          >
            Go back to Login
          </RadixButton>
        ) : (
          <RadixButton variant="outline" onClick={prevStep}>
            Previous
          </RadixButton>
        )}

        {currentStep < 3 ? (
          <RadixButton onClick={nextStep}>Next</RadixButton>
        ) : (
          <RadixButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </RadixButton>
        )}
      </div>
    </RadixCard>
  );
};
