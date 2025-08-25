import { supabase } from './supabase';

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILE_AVATARS: 'profile-avatars',
  COURSE_MATERIALS: 'course-materials',
  NOTICE_ATTACHMENTS: 'notice-attachments',
  STUDENT_DOCUMENTS: 'student-documents',
  INSTRUCTOR_DOCUMENTS: 'instructor-documents',
} as const;

// File type validation
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as string[],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ] as string[],
  SPREADSHEETS: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ] as string[],
  PRESENTATIONS: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ] as string[],
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  MATERIAL: 25 * 1024 * 1024, // 25MB
} as const;

export interface UploadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
  file: File;
  metadata?: Record<string, any>;
  cacheControl?: string;
}

export interface DownloadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
}

export interface StorageError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  options: UploadOptions
): Promise<{ url: string; path: string }> => {
  try {
    const { bucket, path, file, metadata, cacheControl } = options;
    const bucketName = STORAGE_BUCKETS[bucket];

    // Validate file size
    const sizeLimit = getFileSizeLimit(bucket);
    if (file.size > sizeLimit) {
      throw new Error(
        `File size exceeds limit of ${formatFileSize(sizeLimit)}`
      );
    }

    // Validate file type
    if (!isFileTypeAllowed(file.type, bucket)) {
      throw new Error(`File type ${file.type} is not allowed for this bucket`);
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: cacheControl || '3600',
        upsert: true,
        metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    throw new Error(error.message || 'Upload failed');
  }
};

/**
 * Download a file from Supabase Storage
 */
export const downloadFile = async (options: DownloadOptions): Promise<Blob> => {
  try {
    const { bucket, path } = options;
    const bucketName = STORAGE_BUCKETS[bucket];

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(path);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Storage download error:', error);
    throw new Error(error.message || 'Download failed');
  }
};

/**
 * Get public URL for a file
 */
export const getPublicUrl = (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): string => {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<void> => {
  try {
    const bucketName = STORAGE_BUCKETS[bucket];

    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Storage delete error:', error);
    throw new Error(error.message || 'Delete failed');
  }
};

/**
 * List files in a bucket
 */
export const listFiles = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path?: string,
  limit?: number
): Promise<
  Array<{
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: any;
  }>
> => {
  try {
    const bucketName = STORAGE_BUCKETS[bucket];

    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path || '', {
        limit: limit || 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error('Storage list error:', error);
    throw new Error(error.message || 'List failed');
  }
};

// Helper functions
const getFileSizeLimit = (bucket: keyof typeof STORAGE_BUCKETS): number => {
  switch (bucket) {
    case 'PROFILE_AVATARS':
      return FILE_SIZE_LIMITS.AVATAR;
    case 'COURSE_MATERIALS':
      return FILE_SIZE_LIMITS.MATERIAL;
    default:
      return FILE_SIZE_LIMITS.DOCUMENT;
  }
};

const isFileTypeAllowed = (
  fileType: string,
  bucket: keyof typeof STORAGE_BUCKETS
): boolean => {
  switch (bucket) {
    case 'PROFILE_AVATARS':
      return ALLOWED_FILE_TYPES.IMAGES.includes(fileType);
    case 'COURSE_MATERIALS':
      return [
        ...ALLOWED_FILE_TYPES.IMAGES,
        ...ALLOWED_FILE_TYPES.DOCUMENTS,
        ...ALLOWED_FILE_TYPES.SPREADSHEETS,
        ...ALLOWED_FILE_TYPES.PRESENTATIONS,
      ].includes(fileType);
    default:
      return [
        ...ALLOWED_FILE_TYPES.IMAGES,
        ...ALLOWED_FILE_TYPES.DOCUMENTS,
        ...ALLOWED_FILE_TYPES.SPREADSHEETS,
        ...ALLOWED_FILE_TYPES.PRESENTATIONS,
      ].includes(fileType);
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Storage hooks for React components
export const useStorage = () => {
  return {
    uploadFile,
    downloadFile,
    getPublicUrl,
    deleteFile,
    listFiles,
    STORAGE_BUCKETS,
    ALLOWED_FILE_TYPES,
    FILE_SIZE_LIMITS,
  };
};
