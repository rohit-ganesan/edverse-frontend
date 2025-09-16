import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  AlertDialog,
  Button,
  Tooltip,
} from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { FormField } from 'components/ui/FormField';
import { StatusBadge } from 'components/ui/StatusBadge';
import { PersonAvatar } from 'components/ui/PersonAvatar';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Lock,
} from 'lucide-react';
import { CapabilityGate } from 'components/guards/CapabilityGate';
import type { Plan } from 'types/access';
import { getMinPlanForFeature } from 'config/planFeatures';

interface InstructorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  status: 'Active' | 'On Leave';
  address: string;
  qualification: string;
  joiningDate: string;
  avatar?: string;
  employeeId?: string;
}

export function ViewInstructorPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [instructor, setInstructor] = useState<InstructorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const initializeInstructor = () => {
      try {
        setIsLoading(true);

        // Get instructor data from navigation state
        const instructorData = location.state?.instructorData;

        if (!instructorData) {
          // If no data in state, redirect back to instructors list
          setError(
            'No instructor data found. Please select an instructor from the list.'
          );
          navigate('/instructors/overview');
          return;
        }

        // Convert the instructor data to the expected format
        const fullInstructorData: InstructorData = {
          id: instructorData.id,
          name: instructorData.name,
          email: instructorData.email,
          phone: instructorData.phone,
          subject: instructorData.subject,
          experience: instructorData.experience,
          status: instructorData.status,
          address:
            instructorData.address || '456 Oak Avenue, Springfield, IL 62701',
          qualification: instructorData.qualification || 'Ph.D. in Mathematics',
          joiningDate: instructorData.joiningDate || '2020-08-15',
          employeeId: instructorData.employeeId || `EMP${instructorData.id}`,
        };

        setInstructor(fullInstructorData);
      } catch (err) {
        console.error('Error initializing instructor:', err);
        setError('Failed to load instructor details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeInstructor();
  }, [location.state, navigate]);

  const handleEdit = () => {
    if (instructor) {
      navigate('/instructors/edit-instructor', {
        state: { instructorData: instructor },
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // TODO: Implement API call to delete instructor
      console.log('Deleting instructor:', instructor?.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate('/instructors/overview');
    } catch (error) {
      console.error('Error deleting instructor:', error);
      setError('Failed to delete instructor. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
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

  if (error || !instructor) {
    return (
      <DashboardLayout>
        <Box className="p-6">
          <RadixCard size="3" className="p-6 text-center">
            <Text color="red" size="3" className="block mb-4">
              {error || 'Instructor not found'}
            </Text>
            <RadixButton
              variant="soft"
              onClick={() => navigate('/instructors/overview')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Instructors
            </RadixButton>
          </RadixCard>
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
              onClick={() => navigate('/instructors/overview')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </RadixButton>
            <Box>
              <Heading size="6" className="text-gray-900 dark:text-gray-100">
                Instructor Details
              </Heading>
              <Text size="2" color="gray">
                View and manage instructor information
              </Text>
            </Box>
          </Flex>

          <Flex gap="2">
            {(() => {
              const getRequiredPlanText = (opts?: {
                neededPlan?: string;
                feature?: string;
              }) => {
                const plan = (
                  opts?.neededPlan ||
                  getMinPlanForFeature(opts?.feature || '') ||
                  'starter'
                ).toUpperCase();
                return (
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-300">Requires {plan} plan</span>
                  </div>
                );
              };

              const SoftTooltip = ({
                content,
                children,
              }: {
                content: React.ReactNode;
                children: React.ReactNode;
              }) => (
                <Tooltip content={content}>
                  <div className="[&_[data-radix-tooltip-content]]:bg-gray-900/85">
                    {children}
                  </div>
                </Tooltip>
              );

              return (
                <>
                  {/* Edit button gate */}
                  <CapabilityGate
                    cap="staff.invite"
                    feature="staff.invite"
                    neededPlan={'starter' as Plan}
                    showUpgradeHint={false}
                    context="view-instructor:edit"
                    fallback={
                      <SoftTooltip
                        content={getRequiredPlanText({ neededPlan: 'starter' })}
                      >
                        <div>
                          <RadixButton
                            variant="outline"
                            disabled
                            className="opacity-60 cursor-not-allowed text-gray-400 dark:text-gray-300"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </RadixButton>
                        </div>
                      </SoftTooltip>
                    }
                  >
                    <RadixButton variant="outline" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </RadixButton>
                  </CapabilityGate>

                  {/* Delete button gate */}
                  <CapabilityGate
                    cap="staff.invite"
                    feature="staff.invite"
                    neededPlan={'starter' as Plan}
                    showUpgradeHint={false}
                    context="view-instructor:delete"
                    fallback={
                      <SoftTooltip
                        content={getRequiredPlanText({ neededPlan: 'starter' })}
                      >
                        <div>
                          <RadixButton
                            variant="outline"
                            color="red"
                            disabled
                            className="opacity-60 cursor-not-allowed text-gray-400 dark:text-gray-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </RadixButton>
                        </div>
                      </SoftTooltip>
                    }
                  >
                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <RadixButton variant="outline" color="red">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </RadixButton>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content style={{ maxWidth: 450 }}>
                        <AlertDialog.Title>Delete Instructor</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                          Are you sure you want to delete{' '}
                          <strong>{instructor?.name}</strong>? This action
                          cannot be undone and will permanently remove all
                          instructor data including course assignments and
                          teaching history.
                        </AlertDialog.Description>

                        <Flex gap="3" mt="4" justify="end">
                          <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                              Cancel
                            </Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button
                              variant="solid"
                              color="red"
                              onClick={handleDelete}
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete Instructor'}
                            </Button>
                          </AlertDialog.Action>
                        </Flex>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </CapabilityGate>
                </>
              );
            })()}
          </Flex>
        </Flex>

        {/* Instructor Profile Card */}
        <RadixCard size="3" className="p-6">
          <Flex gap="6" align="start">
            <PersonAvatar name={instructor.name} size="large" />
            <Box className="flex-1">
              <Flex justify="between" align="start" className="mb-4">
                <Box>
                  <Heading size="5" className="mb-2">
                    {instructor.name}
                  </Heading>
                  <Flex align="center" gap="2" className="mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <Text size="2" color="gray">
                      {instructor.subject}
                    </Text>
                  </Flex>
                  {instructor.employeeId && (
                    <Text size="2" color="gray">
                      Employee ID: {instructor.employeeId}
                    </Text>
                  )}
                </Box>
                <StatusBadge status={instructor.status} />
              </Flex>

              <Flex
                gap="4"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {instructor.email && (
                  <Flex align="center" gap="1">
                    <Mail className="w-4 h-4" />
                    <Text size="2">{instructor.email}</Text>
                  </Flex>
                )}
                {instructor.phone && (
                  <Flex align="center" gap="1">
                    <Phone className="w-4 h-4" />
                    <Text size="2">{instructor.phone}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>
        </RadixCard>

        {/* Details Card */}
        <RadixCard size="3" className="p-6">
          <Box className="space-y-6">
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
                  label="Full Name"
                  value={instructor.name}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Email Address"
                  value={instructor.email}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Phone Number"
                  value={instructor.phone}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Address"
                  value={instructor.address || 'Not provided'}
                  onChange={() => {}}
                  isEditing={false}
                  className="md:col-span-2"
                />
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
                  label="Subject/Department"
                  value={instructor.subject}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Years of Experience"
                  value={instructor.experience}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Qualification"
                  value={instructor.qualification || 'Not specified'}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Joining Date"
                  value={formatDate(instructor.joiningDate)}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Status"
                  value={instructor.status}
                  onChange={() => {}}
                  isEditing={false}
                />
              </Box>
            </Box>
          </Box>
        </RadixCard>
      </Box>
    </DashboardLayout>
  );
}
