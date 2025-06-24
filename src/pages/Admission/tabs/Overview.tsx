import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { CheckCircle, Clock, Calendar, XCircle } from 'lucide-react';
import { useAdmissionData } from '../hooks/useAdmissionData';
import { ApplicationCard } from '../components/ApplicationCard';
import { Application } from '../types';

export function Overview(): JSX.Element {
  const { applications, programs, stats } = useAdmissionData();
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  return (
    <Grid columns="2" gap="8">
      {/* Recent Applications */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Recent Applications
          </Heading>
          <Text size="2" className="text-gray-600">
            Latest submitted applications
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {applications.slice(0, 5).map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onView={setSelectedApplication}
              />
            ))}
          </Flex>
        </Box>
      </RadixCard>

      {/* Application Status Distribution */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Application Status
          </Heading>
          <Text size="2" className="text-gray-600">
            Current status breakdown
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Accepted
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-green-600">
                  {stats.acceptedApplications}
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Under Review
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-yellow-600">
                  {stats.pendingReview}
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Interview Scheduled
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-blue-600">
                  {stats.interviewsScheduled}
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Rejected
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-red-600">
                  0
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </RadixCard>

      {/* Program Popularity */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Popular Programs
          </Heading>
          <Text size="2" className="text-gray-600">
            Most applied programs
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {programs.map((program, index) => (
              <Box
                key={program.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Flex justify="between" align="center">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 line-clamp-1"
                    >
                      {program.name}
                    </Text>
                    <Text size="1" className="text-gray-600">
                      {program.applicants} applicants • {program.accepted}{' '}
                      accepted
                    </Text>
                  </Box>
                  <Badge color={index === 0 ? 'gold' : 'gray'}>
                    #{index + 1}
                  </Badge>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </RadixCard>

      {/* Upcoming Deadlines */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Upcoming Deadlines
          </Heading>
          <Text size="2" className="text-gray-600">
            Application deadlines approaching
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {programs.map((program) => (
              <Box
                key={program.id}
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg"
              >
                <Flex justify="between" align="center">
                  <Box>
                    <Text size="2" weight="medium" className="text-orange-800">
                      {program.name}
                    </Text>
                    <Text size="1" className="text-orange-600">
                      Application Deadline
                    </Text>
                  </Box>
                  <Text size="2" weight="bold" className="text-orange-600">
                    {new Date(program.deadline).toLocaleDateString()}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </RadixCard>
    </Grid>
  );
}
