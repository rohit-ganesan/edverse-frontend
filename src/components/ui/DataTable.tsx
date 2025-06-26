import { useState, useMemo, ReactNode } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Table,
  TextField,
  Select,
} from '@radix-ui/themes';
import { RadixCard } from './RadixCard';
import { RadixButton } from './RadixButton';
import { Search, Filter, Download } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  render: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

export interface DataTableAction<T> {
  icon: ReactNode;
  label: string;
  onClick: (item: T) => void;
  variant?: 'ghost' | 'soft' | 'solid';
  color?: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface DataTableProps<T> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];

  // Header
  title: string;
  subtitle?: string;
  icon?: ReactNode;

  // Search & Filters
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filters?: DataTableFilter[];
  sortOptions?: { value: string; label: string }[];

  // Actions
  actions?: DataTableAction<T>[];
  headerActions?: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    variant?: 'ghost' | 'soft' | 'solid';
  }[];

  // Customization
  emptyStateIcon?: ReactNode;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  getRowKey?: (item: T, index: number) => string;
  onSort?: (sortBy: string, data: T[]) => T[];
  onFilter?: (filters: Record<string, string>, data: T[]) => T[];
  onSearch?: (searchTerm: string, data: T[]) => T[];

  // Loading & Error states
  isLoading?: boolean;
  error?: string | null;

  // Selected Row
  selectedRowKey?: string;
}

export function DataTable<T>({
  data,
  columns,
  title,
  subtitle,
  icon,
  searchPlaceholder = 'Search...',
  searchFields = [],
  filters = [],
  sortOptions = [],
  actions = [],
  headerActions = [],
  emptyStateIcon,
  emptyStateTitle = 'No records found',
  emptyStateSubtitle = 'Try adjusting your search terms or add a new record',
  getRowKey = (item: T, index: number) => `row-${index}`,
  onSort,
  onFilter,
  onSearch,
  isLoading = false,
  error,
  selectedRowKey,
}: DataTableProps<T>): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || '');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Process data with search, filter, and sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      if (onSearch) {
        result = onSearch(searchTerm, result);
      } else {
        result = result.filter((item) =>
          searchFields.some((field) => {
            const value = item[field];
            return String(value)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
        );
      }
    }

    // Apply filters
    if (Object.keys(filterValues).length > 0) {
      if (onFilter) {
        result = onFilter(filterValues, result);
      } else {
        result = result.filter((item) =>
          Object.entries(filterValues).every(([key, value]) => {
            if (!value || value === 'all') return true;
            const itemValue = (item as any)[key];
            return String(itemValue).toLowerCase() === value.toLowerCase();
          })
        );
      }
    }

    // Apply sorting
    if (sortBy) {
      if (onSort) {
        result = onSort(sortBy, result);
      }
    }

    return result;
  }, [
    data,
    searchTerm,
    searchFields,
    filterValues,
    sortBy,
    onSearch,
    onFilter,
    onSort,
  ]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleExport = () => {
    console.log('Export data:', processedData);
  };

  function defaultRenderer(key: string, value: any) {
    switch (key) {
      case 'name':
      case 'student':
      case 'class':
      case 'teacher':
        return (
          <Text className="text-gray-900 dark:text-gray-100">{value}</Text>
        );
      case 'section':
      case 'id':
        return (
          <Text className="text-gray-500 dark:text-gray-400">{value}</Text>
        );
      case 'email':
      case 'contact':
        return (
          <Text className="text-gray-700 dark:text-gray-100">{value}</Text>
        );
      case 'phone':
        return (
          <Text className="text-gray-500 dark:text-gray-400">{value}</Text>
        );
      default:
        return (
          <Text className="text-gray-900 dark:text-gray-100">{value}</Text>
        );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <Box className="space-y-8">
      <RadixCard className="p-0 shadow-xl border-0 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-b dark:border-gray-800">
          <Flex justify="between" align="center" className="mb-6">
            <Flex align="center" gap="3">
              {icon && (
                <Box className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {icon}
                </Box>
              )}
              <Box>
                <Heading
                  size="5"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  {title}
                </Heading>
                <Text size="3" className="text-gray-600 dark:text-gray-400">
                  {subtitle || `${processedData.length} records found`}
                </Text>
              </Box>
            </Flex>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Filter className="w-4 h-4 mr-1" />
                Advanced Filter
              </RadixButton>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
              {headerActions.map((action, index) => (
                <RadixButton
                  key={index}
                  variant={action.variant || 'solid'}
                  size="2"
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </RadixButton>
              ))}
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            {searchFields.length > 0 && (
              <Box className="flex-1 min-w-[250px]">
                <TextField.Root
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="2"
                  className="w-full"
                >
                  <TextField.Slot>
                    <Search className="w-4 h-4 text-gray-400" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            )}

            {/* Dynamic Filters */}
            {filters.map((filter) => (
              <Box key={filter.key} className="min-w-[150px]">
                <Select.Root
                  value={filterValues[filter.key] || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                  size="2"
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="all">All {filter.label}</Select.Item>
                    {filter.options.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            ))}

            {/* Sort Options */}
            {sortOptions.length > 0 && (
              <Box className="min-w-[150px]">
                <Select.Root value={sortBy} onValueChange={setSortBy} size="2">
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    {sortOptions.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Records Table */}
        <Box className="overflow-x-auto">
          {processedData.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50 dark:bg-gray-900/80">
                  {columns.map((column) => (
                    <Table.ColumnHeaderCell
                      key={column.key}
                      className="py-4 px-6 text-left text-gray-700 dark:text-gray-300"
                    >
                      <Flex align="center" gap="2">
                        {column.icon}
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {column.label}
                        </Text>
                      </Flex>
                    </Table.ColumnHeaderCell>
                  ))}
                  {actions.length > 0 && (
                    <Table.ColumnHeaderCell className="py-4 px-6 text-left text-gray-700 dark:text-gray-300">
                      <Text
                        size="2"
                        weight="medium"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Actions
                      </Text>
                    </Table.ColumnHeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {processedData.map((item, index) => (
                  <Table.Row
                    key={getRowKey(item, index) || `row-${index}`}
                    className={[
                      'hover:bg-gray-50/50 dark:hover:bg-gray-700 transition-colors animate-in slide-in-from-bottom-1 duration-300',
                      index % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50/30 dark:bg-gray-900/60',
                      selectedRowKey === getRowKey(item, index) &&
                        'bg-blue-50 dark:bg-blue-900',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {columns.map((column) => (
                      <Table.Cell key={column.key} className="py-4 px-6">
                        {column.render
                          ? column.render(item, index)
                          : defaultRenderer(
                              column.key,
                              (item as Record<string, any>)[column.key]
                            )}
                      </Table.Cell>
                    ))}
                    {actions.length > 0 && (
                      <Table.Cell className="py-4 px-6">
                        <Flex gap="1">
                          {actions.map((action, actionIndex) => (
                            <RadixButton
                              key={actionIndex}
                              variant={action.variant || 'ghost'}
                              size="2"
                              onClick={() => action.onClick(item)}
                              className="p-2"
                              title={action.label}
                            >
                              {action.icon}
                            </RadixButton>
                          ))}
                        </Flex>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Box className="text-center py-12">
              {emptyStateIcon && (
                <div className="w-12 h-12 text-gray-300 mx-auto mb-4 flex items-center justify-center">
                  {emptyStateIcon}
                </div>
              )}
              <Text size="3" className="text-gray-500 mb-2">
                {emptyStateTitle}
              </Text>
              <Text size="2" className="text-gray-400">
                {emptyStateSubtitle}
              </Text>
            </Box>
          )}
        </Box>
      </RadixCard>
    </Box>
  );
}
