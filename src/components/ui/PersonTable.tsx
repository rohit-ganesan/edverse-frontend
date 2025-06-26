import { Box, Flex, Text, Heading, Table, Select } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';
import { RadixButton } from './RadixButton';
import { PersonAvatar } from './PersonAvatar';
import { StatusBadge } from './StatusBadge';
import { AttendanceIndicator } from './AttendanceIndicator';
import {
  Mail,
  Phone,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ReactNode, useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Base person interface that can be extended
export interface BasePerson {
  id: string | number;
  name: string;
  status?: string;
  [key: string]: any; // Allow additional properties
}

// Column configuration interface
export interface TableColumn<T = BasePerson> {
  key: string;
  label: string;
  width?: string;
  render?: (person: T) => ReactNode;
  sortable?: boolean;
}

// Action button interface
export interface TableAction<T = BasePerson> {
  label: string;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: '1' | '2' | '3';
  onClick: (person: T) => void;
  icon?: LucideIcon;
}

interface PersonTableProps<T extends BasePerson = BasePerson> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  headerActions?: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  avatarColorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'gray';
  className?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  selectedRowId?: string | number;
}

export function PersonTable<T extends BasePerson = BasePerson>({
  title,
  data,
  columns,
  actions = [],
  headerActions,
  loading = false,
  emptyMessage = 'No records found',
  avatarColorScheme = 'blue',
  className = '',
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  showPagination = true,
  selectedRowId,
}: PersonTableProps<T>): JSX.Element {
  // Safe data validation
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const safeColumns = Array.isArray(columns) ? columns : [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Calculate pagination
  const totalItems = safeData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get current page data
  const paginatedData = useMemo(() => {
    if (!showPagination) return safeData;
    return safeData.slice(startIndex, endIndex);
  }, [safeData, startIndex, endIndex, showPagination]);

  // Reset to first page when data changes
  useMemo(() => {
    setCurrentPage(1);
  }, [safeData]);

  // Handle page size change
  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Default column renderers
  const getDefaultRenderer = (key: string) => {
    return (person: T): ReactNode => {
      const value = person[key];

      // Handle special column types
      switch (key) {
        case 'name':
        case 'student':
          return (
            <Flex align="center" gap="3">
              <PersonAvatar
                name={person.name || 'Unknown'}
                colorScheme={avatarColorScheme}
              />
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 dark:text-gray-100"
                >
                  {person.name || 'Unknown'}
                </Text>
                {person.section && (
                  <Text size="1" className="text-gray-600 dark:text-gray-400">
                    {person.section}
                  </Text>
                )}
              </Box>
            </Flex>
          );

        case 'contact':
          return (
            <Box>
              {person.email && (
                <Flex align="center" gap="2" className="mb-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <Text size="1" className="text-gray-600 dark:text-gray-400">
                    {person.email}
                  </Text>
                </Flex>
              )}
              {person.phone && (
                <Flex align="center" gap="2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <Text size="1" className="text-gray-600 dark:text-gray-400">
                    {person.phone}
                  </Text>
                </Flex>
              )}
            </Box>
          );

        case 'status':
          return <StatusBadge status={value?.toString() || 'Unknown'} />;

        case 'grade':
          return (
            <StatusBadge status={value?.toString() || 'N/A'} variant="grade" />
          );

        case 'attendance':
          return <AttendanceIndicator percentage={value || '0%'} />;

        default:
          // Handle different value types safely
          if (value === null || value === undefined) {
            return (
              <Text size="2" className="text-gray-400 dark:text-gray-500">
                N/A
              </Text>
            );
          }

          if (typeof value === 'object') {
            return (
              <Text size="2" className="text-gray-700 dark:text-gray-300">
                {JSON.stringify(value)}
              </Text>
            );
          }

          return (
            <Text size="2" className="text-gray-700 dark:text-gray-300">
              {value.toString()}
            </Text>
          );
      }
    };
  };

  // Loading skeleton
  if (loading) {
    return (
      <RadixCard size="2" className={`p-6 ${className}`}>
        <Box className="mb-4">
          <Heading size="4" className="text-gray-900 dark:text-gray-100">
            {title}
          </Heading>
        </Box>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              {safeColumns.map((column) => (
                <Table.ColumnHeaderCell key={column.key}>
                  {column.label}
                </Table.ColumnHeaderCell>
              ))}
              {actions.length > 0 && (
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {[1, 2, 3].map((i) => (
              <Table.Row key={i}>
                {safeColumns.map((column) => (
                  <Table.Cell key={column.key}>
                    <Box className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </Table.Cell>
                ))}
                {actions.length > 0 && (
                  <Table.Cell>
                    <Box className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </RadixCard>
    );
  }

  return (
    <RadixCard
      className={`p-0 shadow-lg border-0 bg-white dark:bg-gray-800 overflow-hidden ${className}`}
    >
      <Box className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <Heading size="5" className="text-gray-900 dark:text-gray-100">
          {title}
        </Heading>
        {headerActions && <Box>{headerActions}</Box>}
      </Box>
      <Box className="overflow-x-auto">
        <Table.Root className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <Table.Header className="bg-gray-50 dark:bg-gray-900">
            <Table.Row>
              {safeColumns.map((col, idx) => (
                <Table.ColumnHeaderCell
                  key={col.key || idx}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </Table.ColumnHeaderCell>
              ))}
              {actions.length > 0 && <Table.ColumnHeaderCell />}
            </Table.Row>
          </Table.Header>
          <Table.Body className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={safeColumns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  {loading ? 'Loading...' : emptyMessage}
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((person, rowIdx) => (
                <Table.Row
                  key={person.id}
                  className={cn(
                    'transition-colors',
                    rowIdx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : '',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    selectedRowId === person.id && 'bg-blue-50 dark:bg-blue-900'
                  )}
                >
                  {safeColumns.map((col, colIdx) => (
                    <Table.Cell
                      key={col.key || colIdx}
                      className="px-4 py-3 text-gray-900 dark:text-gray-100"
                    >
                      {col.render
                        ? col.render(person)
                        : getDefaultRenderer(col.key)(person)}
                    </Table.Cell>
                  ))}
                  {actions.length > 0 && (
                    <Table.Cell className="px-4 py-3 text-right">
                      <Flex gap="2" justify="end">
                        {actions.map((action, actionIdx) => (
                          <RadixButton
                            key={action.label + actionIdx}
                            variant={action.variant || 'solid'}
                            size={action.size || '2'}
                            onClick={() => action.onClick(person)}
                          >
                            {action.icon && (
                              <action.icon className="w-4 h-4 mr-1" />
                            )}
                            {action.label}
                          </RadixButton>
                        ))}
                      </Flex>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      {/* Pagination and other controls remain unchanged */}
    </RadixCard>
  );
}
