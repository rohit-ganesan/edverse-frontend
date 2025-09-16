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

export function EditInstructorPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const initializeInstructor = () => {
      try {
        setIsLoading(true);

        // Get instructor data from navigation state
        const instructorData = location.state?.instructorData;

        if (!instructorData) {
          // If no data in state, redirect back to instructors list
          setErrors({
            general:
              'No instructor data found. Please select an instructor from the list.',
          });
          navigate('/instructors/overview');
          return;
        }

        // Set form data from the passed instructor data
        setFormData({
          name: instructorData.name || '',
          email: instructorData.email || '',
          phone: instructorData.phone || '',
          subject: instructorData.subject || '',
          experience: instructorData.experience || '',
          status: instructorData.status || 'Active',
          address: instructorData.address || '',
          qualification: instructorData.qualification || '',
          joiningDate: instructorData.joiningDate || '',
        });
      } catch (err) {
        console.error('Error initializing instructor:', err);
        setErrors({
          general: 'Failed to load instructor details. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeInstructor();
  }, [location.state, navigate]);

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

      // TODO: Implement API call to update instructor
      console.log('Updating instructor:', validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to view page with updated data
      const instructorData = location.state?.instructorData;
      if (instructorData) {
        // Update the instructor data with form data for the view page
        const updatedInstructorData = {
          ...instructorData,
          ...formData,
        };
        navigate('/instructors/view-instructor', {
          state: { instructorData: updatedInstructorData },
        });
      } else {
        // Fallback to list if no data available
        navigate('/instructors/overview');
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
        console.error('Error updating instructor:', error);
        // Handle other errors (e.g., API errors)
        setErrors({
          general:
            'An error occurred while updating the instructor. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to view page with the same instructor data
    const instructorData = location.state?.instructorData;
    if (instructorData) {
      navigate('/view-instructor', {
        state: { instructorData },
      });
    } else {
      // Fallback to list if no data available
      navigate('/instructors/overview');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box className="p-6">
          <Text>Loading instructor details...</Text>
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
                const instructorData = location.state?.instructorData;
                if (instructorData) {
                  navigate('/instructors/view-instructor', {
                    state: { instructorData },
                  });
                } else {
                  navigate('/instructors/overview');
                }
              }}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </RadixButton>
            <Box>
              <Heading size="6" className="text-gray-900 dark:text-gray-100">
                Edit Instructor
              </Heading>
              <Text size="2" color="gray">
                Update instructor information
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
            {/* Personal Information Section */}
            <Box>
              <Heading
                size="4"
                className="mb-4 text-gray-900 dark:text-gray-100"
              >
                Personal Information
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

            {/* Professional Information Section */}
            <Box>
              <Heading
                size="4"
                className="mb-4 text-gray-900 dark:text-gray-100"
              >
                Professional Information
              </Heading>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Subject/Department *"
                  value={formData.subject}
                  onChange={(value) => handleInputChange('subject', value)}
                  isEditing={true}
                >
                  <RadixTextField
                    placeholder="Enter subject or department"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange('subject', e.target.value)
                    }
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
                  onChange={(value) =>
                    handleInputChange('qualification', value)
                  }
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
                        value as 'Active' | 'On Leave'
                      )
                    }
                    required
                  >
                    <Select.Trigger className="w-full" />
                    <Select.Content>
                      <Select.Item value="Active">Active</Select.Item>
                      <Select.Item value="On Leave">On Leave</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
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
                {isSubmitting ? 'Updating...' : 'Update Instructor'}
              </RadixButton>
            </Flex>
          </form>
        </RadixCard>
      </Box>
    </DashboardLayout>
  );
}
