import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Heading, Select } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { FormField } from 'components/ui/FormField';
import { RadixTextField } from 'components/ui/RadixTextField';
import { ArrowLeft, Save, X } from 'lucide-react';
import { z } from 'zod';

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: 'Active' | 'Inactive';
  parentName: string;
  parentPhone: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
}

// Zod validation schema
const studentSchema = z.object({
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
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Please enter a valid email address',
    }),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),

  class: z.string().min(1, 'Class/Grade is required'),

  status: z.enum(['Active', 'Inactive'], {
    errorMap: () => ({ message: 'Status must be either Active or Inactive' }),
  }),

  parentName: z
    .string()
    .min(1, 'Parent/Guardian name is required')
    .min(2, 'Parent/Guardian name must be at least 2 characters')
    .max(100, 'Parent/Guardian name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Parent/Guardian name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  parentPhone: z
    .string()
    .min(1, 'Parent/Guardian phone is required')
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),

  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, {
      message: 'Address must be less than 200 characters',
    }),

  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    })
    .refine((val) => !val || new Date(val) < new Date(), {
      message: 'Date of birth must be in the past',
    }),

  admissionDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
});

export function AddStudentPage(): JSX.Element {
  const navigate = useNavigate();

  // Grade/Class options
  const gradeOptions = [
    'Pre-K',
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];

  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    class: '',
    status: 'Active',
    parentName: '',
    parentPhone: '',
    address: '',
    dateOfBirth: '',
    admissionDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
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
      const validatedData = studentSchema.parse(formData);

      // TODO: Implement API call to create student
      console.log('Creating student:', validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to students page
      navigate('/students');
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
        console.error('Error creating student:', error);
        // Handle other errors (e.g., API errors)
        setErrors({
          general:
            'An error occurred while creating the student. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
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
              Add New Student
            </Heading>
            <Text size="3" className="text-gray-600 dark:text-gray-400 mt-1">
              Create a new student profile
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
            {isSubmitting ? 'Adding...' : 'Add Student'}
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
          {/* Student Information Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Student Information
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
                label="Email Address"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />
              </FormField>

              <FormField
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                />
              </FormField>

              <FormField
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(value) => handleInputChange('dateOfBirth', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange('dateOfBirth', e.target.value)
                  }
                  error={errors.dateOfBirth}
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

          {/* Academic Information Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Academic Information
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-700 dark:text-gray-300 block mb-3"
                >
                  Class/Grade *
                </Text>
                <Select.Root
                  value={formData.class}
                  onValueChange={(value) => handleInputChange('class', value)}
                  required
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="Select class/grade"
                  />
                  <Select.Content>
                    {gradeOptions.map((grade) => (
                      <Select.Item key={grade} value={grade}>
                        {grade}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.class && (
                  <Text size="1" color="red" className="block mt-1">
                    {errors.class}
                  </Text>
                )}
              </Box>

              <FormField
                label="Admission Date"
                value={formData.admissionDate}
                onChange={(value) => handleInputChange('admissionDate', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) =>
                    handleInputChange('admissionDate', e.target.value)
                  }
                  error={errors.admissionDate}
                />
              </FormField>
            </div>
          </Box>

          {/* Parent/Guardian Information Section */}
          <Box className="mb-8">
            <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-4">
              Parent/Guardian Information
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Parent/Guardian Name *"
                value={formData.parentName}
                onChange={(value) => handleInputChange('parentName', value)}
                isEditing={true}
              >
                <RadixTextField
                  placeholder="Enter parent/guardian name"
                  value={formData.parentName}
                  onChange={(e) =>
                    handleInputChange('parentName', e.target.value)
                  }
                  required
                  error={errors.parentName}
                />
              </FormField>

              <FormField
                label="Parent/Guardian Phone *"
                value={formData.parentPhone}
                onChange={(value) => handleInputChange('parentPhone', value)}
                isEditing={true}
              >
                <RadixTextField
                  type="tel"
                  placeholder="Enter parent/guardian phone"
                  value={formData.parentPhone}
                  onChange={(e) =>
                    handleInputChange('parentPhone', e.target.value)
                  }
                  required
                  error={errors.parentPhone}
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
                      e.target.value as 'Active' | 'Inactive'
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
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={(e) =>
                    handleInputChange(
                      'status',
                      e.target.value as 'Active' | 'Inactive'
                    )
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <Text size="2" className="text-gray-700 dark:text-gray-300">
                  Inactive
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
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </RadixButton>
          </Flex>
        </form>
      </RadixCard>
    </DashboardLayout>
  );
}
