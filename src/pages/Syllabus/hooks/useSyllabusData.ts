import { useMemo, useState, useEffect } from 'react';

// Mock data for now - will be replaced with actual API calls
const mockSyllabi = [
  {
    id: '1',
    title: 'Mathematics Grade 10 Syllabus',
    subject: 'Mathematics',
    grade: '10',
    topics: 24,
    objectives: 18,
    completionRate: 75,
    lastUpdated: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    title: 'Physics Grade 11 Syllabus',
    subject: 'Physics',
    grade: '11',
    topics: 32,
    objectives: 25,
    completionRate: 82,
    lastUpdated: '2024-01-10',
    isActive: true,
  },
  {
    id: '3',
    title: 'Chemistry Grade 12 Syllabus',
    subject: 'Chemistry',
    grade: '12',
    topics: 28,
    objectives: 22,
    completionRate: 68,
    lastUpdated: '2024-01-12',
    isActive: true,
  },
  {
    id: '4',
    title: 'English Literature Grade 9 Syllabus',
    subject: 'English',
    grade: '9',
    topics: 20,
    objectives: 15,
    completionRate: 90,
    lastUpdated: '2024-01-18',
    isActive: true,
  },
];

export function useSyllabusData() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const activeSyllabi = mockSyllabi.filter((s) => s.isActive);
    const totalTopics = mockSyllabi.reduce((sum, s) => sum + s.topics, 0);
    const totalObjectives = mockSyllabi.reduce(
      (sum, s) => sum + s.objectives,
      0
    );
    const avgCompletion = Math.round(
      mockSyllabi.reduce((sum, s) => sum + s.completionRate, 0) /
        mockSyllabi.length
    );

    return {
      totalSyllabi: activeSyllabi.length,
      topicsCovered: totalTopics,
      learningObjectives: totalObjectives,
      completionRate: avgCompletion,
    };
  }, []);

  return {
    syllabi: mockSyllabi,
    stats,
    isLoading,
    error: null,
  };
}
