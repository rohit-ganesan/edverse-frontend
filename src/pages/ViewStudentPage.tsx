import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  AlertDialog,
  Button,
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
  GraduationCap,
} from 'lucide-react';

interface StudentData {
  id: string;
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
  avatar?: string;
  rollNumber?: string;
}

export function ViewStudentPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const initializeStudent = () => {
      try {
        setIsLoading(true);

        // Get student data from navigation state
        const studentData = location.state?.studentData;

        if (!studentData) {
          // If no data in state, redirect back to students list
          setError(
            'No student data found. Please select a student from the list.'
          );
          navigate('/students');
          return;
        }

        // Convert the student data to the expected format
        const fullStudentData: StudentData = {
          id: studentData.id,
          name: studentData.name,
          email: studentData.email || 'john.smith@example.com',
          phone: studentData.phone || '+1-555-0123',
          class: studentData.class,
          status: studentData.status,
          parentName: studentData.parentName || 'Parent Name',
          parentPhone: studentData.parentPhone || '+1-555-0124',
          address:
            studentData.address || '123 Main Street, Springfield, IL 62701',
          dateOfBirth: studentData.dateOfBirth || '2008-05-15',
          admissionDate: studentData.admissionDate || '2023-08-15',
          rollNumber: studentData.rollNumber || `ST${studentData.id}`,
        };

        setStudent(fullStudentData);
      } catch (err) {
        console.error('Error initializing student:', err);
        setError('Failed to load student details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStudent();
  }, [location.state, navigate]);

  const handleEdit = () => {
    if (student) {
      navigate('/students/edit', {
        state: { studentData: student },
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // TODO: Implement API call to delete student
      console.log('Deleting student:', student?.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate('/students');
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again.');
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
          <Text>Loading student details...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout>
        <Box className="p-6">
          <RadixCard size="3" className="p-6 text-center">
            <Text color="red" size="3" className="block mb-4">
              {error || 'Student not found'}
            </Text>
            <RadixButton variant="soft" onClick={() => navigate('/students')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
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
              onClick={() => navigate('/students')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </RadixButton>
            <Box>
              <Heading size="6" className="text-gray-900 dark:text-gray-100">
                Student Details
              </Heading>
              <Text size="2" color="gray">
                View and manage student information
              </Text>
            </Box>
          </Flex>

          <Flex gap="2">
            <RadixButton variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </RadixButton>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <RadixButton variant="outline" color="red">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </RadixButton>
              </AlertDialog.Trigger>
              <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Delete Student</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  Are you sure you want to delete{' '}
                  <strong>{student?.name}</strong>? This action cannot be undone
                  and will permanently remove all student data including
                  academic records and attendance history.
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
                      {isDeleting ? 'Deleting...' : 'Delete Student'}
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Flex>

        {/* Student Profile Card */}
        <RadixCard size="3" className="p-6">
          <Flex gap="6" align="start">
            <PersonAvatar name={student.name} size="large" />
            <Box className="flex-1">
              <Flex justify="between" align="start" className="mb-4">
                <Box>
                  <Heading size="5" className="mb-2">
                    {student.name}
                  </Heading>
                  <Flex align="center" gap="2" className="mb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <Text size="2" color="gray">
                      {student.class}
                    </Text>
                  </Flex>
                  {student.rollNumber && (
                    <Text size="2" color="gray">
                      Roll Number: {student.rollNumber}
                    </Text>
                  )}
                </Box>
                <StatusBadge status={student.status} />
              </Flex>

              <Flex
                gap="4"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {student.email && (
                  <Flex align="center" gap="1">
                    <Mail className="w-4 h-4" />
                    <Text size="2">{student.email}</Text>
                  </Flex>
                )}
                {student.phone && (
                  <Flex align="center" gap="1">
                    <Phone className="w-4 h-4" />
                    <Text size="2">{student.phone}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>
        </RadixCard>

        {/* Details Card */}
        <RadixCard size="3" className="p-6">
          <Box className="space-y-6">
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
                  label="Full Name"
                  value={student.name}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Email Address"
                  value={student.email || 'Not provided'}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Phone Number"
                  value={student.phone || 'Not provided'}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Date of Birth"
                  value={formatDate(student.dateOfBirth)}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Address"
                  value={student.address || 'Not provided'}
                  onChange={() => {}}
                  isEditing={false}
                  className="md:col-span-2"
                />
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
                <FormField
                  label="Class/Grade"
                  value={student.class}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Admission Date"
                  value={formatDate(student.admissionDate)}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Status"
                  value={student.status}
                  onChange={() => {}}
                  isEditing={false}
                />
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
                  label="Parent/Guardian Name"
                  value={student.parentName}
                  onChange={() => {}}
                  isEditing={false}
                />

                <FormField
                  label="Parent/Guardian Phone"
                  value={student.parentPhone}
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
