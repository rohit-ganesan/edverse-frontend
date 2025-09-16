import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

export function EditStudentPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const initializeStudent = () => {
      try {
        setIsLoading(true);

        // Get student data from navigation state
        const studentData = location.state?.studentData;

        if (!studentData) {
          // If no data in state, redirect back to students list
          setErrors({
            general:
              'No student data found. Please select a student from the list.',
          });
          navigate('/students/overview');
          return;
        }

        // Set form data from the passed student data
        setFormData({
          name: studentData.name || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          class: studentData.class || '',
          status: studentData.status || 'Active',
          parentName: studentData.parentName || '',
          parentPhone: studentData.parentPhone || '',
          address: studentData.address || '',
          dateOfBirth: studentData.dateOfBirth || '',
          admissionDate: studentData.admissionDate || '',
        });
      } catch (err) {
        console.error('Error initializing student:', err);
        setErrors({
          general: 'Failed to load student details. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStudent();
  }, [location.state, navigate]);

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

      // TODO: Implement API call to update student
      console.log('Updating student:', validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to view page with updated data
      const studentData = location.state?.studentData;
      if (studentData) {
        // Update the student data with form data for the view page
        const updatedStudentData = {
          ...studentData,
          ...formData,
        };
        navigate('/students/view-student', {
          state: { studentData: updatedStudentData },
        });
      } else {
        // Fallback to list if no data available
        navigate('/students/overview');
      }
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
        console.error('Error updating student:', error);
        // Handle other errors (e.g., API errors)
        setErrors({
          general:
            'An error occurred while updating the student. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to view page with the same student data
    const studentData = location.state?.studentData;
    if (studentData) {
      navigate('/view-student', {
        state: { studentData },
      });
    } else {
      // Fallback to list if no data available
      navigate('/students/overview');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box className="p-6">
          <Text>Loading student details...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="p-6 space-y-6">
        {/* Header */}
        <Flex justify="between" align="center" className="mb-6">
          <Flex align="center" gap="3">
            <RadixButton
              variant="ghost"
              onClick={() => {
                const studentData = location.state?.studentData;
                if (studentData) {
                  navigate('/students/view-student', {
                    state: { studentData },
                  });
                } else {
                  navigate('/students/overview');
                }
              }}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </RadixButton>
            <Box>
              <Heading size="6" className="text-gray-900 dark:text-gray-100">
                Edit Student
              </Heading>
              <Text size="2" color="gray">
                Update student information
              </Text>
            </Box>
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
            <Box>
              <Heading
                size="4"
                className="mb-4 text-gray-900 dark:text-gray-100"
              >
                Student Information
              </Heading>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="md:col-span-2"
                >
                  <RadixTextField
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    error={errors.address}
                  />
                </FormField>
              </Box>
            </Box>

            {/* Academic Information Section */}
            <Box>
              <Heading
                size="4"
                className="mb-4 text-gray-900 dark:text-gray-100"
              >
                Academic Information
              </Heading>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Box>
                  <Text
                    as="label"
                    size="2"
                    weight="medium"
                    className="block mb-2"
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
                  onChange={(value) =>
                    handleInputChange('admissionDate', value)
                  }
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

                <Box>
                  <Text
                    as="label"
                    size="2"
                    weight="medium"
                    className="block mb-2"
                  >
                    Status *
                  </Text>
                  <Select.Root
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange(
                        'status',
                        value as 'Active' | 'Inactive'
                      )
                    }
                    required
                  >
                    <Select.Trigger className="w-full" />
                    <Select.Content>
                      <Select.Item value="Active">Active</Select.Item>
                      <Select.Item value="Inactive">Inactive</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Box>
            </Box>

            {/* Parent/Guardian Information Section */}
            <Box>
              <Heading
                size="4"
                className="mb-4 text-gray-900 dark:text-gray-100"
              >
                Parent/Guardian Information
              </Heading>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </Box>
            </Box>

            {/* Action Buttons */}
            <Flex justify="end" gap="3" className="pt-4 border-t">
              <RadixButton
                type="button"
                variant="soft"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </RadixButton>
              <RadixButton type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Updating...' : 'Update Student'}
              </RadixButton>
            </Flex>
          </form>
        </RadixCard>
      </Box>
    </DashboardLayout>
  );
}
