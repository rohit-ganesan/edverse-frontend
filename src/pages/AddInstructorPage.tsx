import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { FormField } from 'components/ui/FormField';
import { RadixTextField } from 'components/ui/RadixTextField';
import { ArrowLeft, Save, X } from 'lucide-react';
import { z } from 'zod';

interface InstructorFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  status: 'Active' | 'On Leave';
  address: string;
  qualification: string;
  joiningDate: string;
}

// Zod validation schema
const instructorSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),

  subject: z
    .string()
    .min(1, 'Subject/Department is required')
    .min(2, 'Subject must be at least 2 characters')
    .max(100, 'Subject must be less than 100 characters'),

  experience: z
    .string()
    .min(1, 'Years of experience is required')
    .regex(
      /^\d+(\.\d+)?\s*(years?|yrs?)?$/i,
      'Please enter a valid experience format (e.g., "5 years" or "2.5")'
    ),

  status: z.enum(['Active', 'On Leave'], {
    errorMap: () => ({ message: 'Status must be either Active or On Leave' }),
  }),

  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, {
      message: 'Address must be less than 200 characters',
    }),

  qualification: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 150, {
      message: 'Qualification must be less than 150 characters',
    }),

  joiningDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
});

export function AddInstructorPage(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InstructorFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
    status: 'Active',
    address: '',
    qualification: '',
    joiningDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof InstructorFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data with Zod
      const validatedData = instructorSchema.parse(formData);

      // TODO: Implement API call to create instructor
      console.log('Creating instructor:', validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to instructors page
      navigate('/instructors');
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        console.log('Validation errors:', fieldErrors);
      } else {
        console.error('Error creating instructor:', error);
        // Handle other errors (e.g., API errors)
        setErrors({
          general:
            'An error occurred while creating the instructor. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/instructors');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Flex justify="between" align="center" className="mb-6">
        <Flex align="center" gap="3">
          <RadixButton
            variant="ghost"
            size="2"
            onClick={handleCancel}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </RadixButton>
          <Box>
            <Heading size="6" className="text-gray-900 dark:text-gray-100">
              Add New Instructor
            </Heading>
            <Text size="3" className="text-gray-600 dark:text-gray-400 mt-1">
              Create a new instructor profile
            </Text>
          </Box>
        </Flex>

        <Flex gap="2">
          <RadixButton
            variant="outline"
            size="2"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </RadixButton>
          <RadixButton
            variant="solid"
            size="2"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Adding...' : 'Add Instructor'}
          </RadixButton>
        </Flex>
      </Flex>

      {/* Form Card */}
      <RadixCard size="3" className="p-6">
        {/* General Error Message */}
        {errors.general && (
          <Box className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <Text size="2" color="red" className="block">
              {errors.general}
            </Text>
          </Box>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Personal Information
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name *"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  error={errors.name}
                />
              </FormField>

              <FormField
                label="Email Address *"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  error={errors.email}
                />
              </FormField>

              <FormField
                label="Phone Number *"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  error={errors.phone}
                />
              </FormField>

              <FormField
                label="Address"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={errors.address}
                />
              </FormField>
            </div>
          </Box>

          {/* Professional Information Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Professional Information
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Subject/Department *"
                value={formData.subject}
                onChange={(value) => handleInputChange('subject', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="Enter subject or department"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  error={errors.subject}
                />
              </FormField>

              <FormField
                label="Years of Experience *"
                value={formData.experience}
                onChange={(value) => handleInputChange('experience', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="e.g., 5 years"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange('experience', e.target.value)
                  }
                  required
                  error={errors.experience}
                />
              </FormField>

              <FormField
                label="Qualification"
                value={formData.qualification}
                onChange={(value) => handleInputChange('qualification', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="Enter highest qualification"
                  value={formData.qualification}
                  onChange={(e) =>
                    handleInputChange('qualification', e.target.value)
                  }
                  error={errors.qualification}
                />
              </FormField>

              <FormField
                label="Joining Date"
                value={formData.joiningDate}
                onChange={(value) => handleInputChange('joiningDate', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    handleInputChange('joiningDate', e.target.value)
                  }
                  error={errors.joiningDate}
                />
              </FormField>
            </div>
          </Box>

          {/* Status Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Status
            </Heading>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={(e) =>
                    handleInputChange(
                      'status',
                      e.target.value as 'Active' | 'On Leave'
                    )
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <Text size="2" className="text-gray-700 dark:text-gray-300">
                  Active
                </Text>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="On Leave"
                  checked={formData.status === 'On Leave'}
                  onChange={(e) =>
                    handleInputChange(
                      'status',
                      e.target.value as 'Active' | 'On Leave'
                    )
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <Text size="2" className="text-gray-700 dark:text-gray-300">
                  On Leave
                </Text>
              </label>
            </div>
          </Box>

          {/* Form Actions */}
          <Flex
            justify="end"
            gap="3"
            className="pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <RadixButton
              type="button"
              variant="outline"
              size="2"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </RadixButton>
            <RadixButton
              type="submit"
              variant="solid"
              size="2"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Adding...' : 'Add Instructor'}
            </RadixButton>
          </Flex>
        </form>
      </RadixCard>
    </DashboardLayout>
  );
}
