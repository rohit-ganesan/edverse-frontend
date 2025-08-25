import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle } from 'lucide-react';
import { RadixButton } from './RadixButton';
import {
  useStorage,
  STORAGE_BUCKETS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
} from '../../lib/supabase-storage';

interface FileUploadProps {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
  onUploadComplete: (url: string, path: string) => void;
  onUploadError: (error: string) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  path,
  onUploadComplete,
  onUploadError,
  accept,
  maxSize,
  multiple = false,
  className = '',
  disabled = false,
}) => {
  const { uploadFile, ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } = useStorage();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileSizeLimit = () => {
    if (maxSize) return maxSize;
    switch (bucket) {
      case 'PROFILE_AVATARS':
        return FILE_SIZE_LIMITS.AVATAR;
      case 'COURSE_MATERIALS':
        return FILE_SIZE_LIMITS.MATERIAL;
      default:
        return FILE_SIZE_LIMITS.DOCUMENT;
    }
  };

  const getAcceptedTypes = () => {
    if (accept) return accept;
    switch (bucket) {
      case 'PROFILE_AVATARS':
        return ALLOWED_FILE_TYPES.IMAGES.join(',');
      case 'COURSE_MATERIALS':
        return [
          ...ALLOWED_FILE_TYPES.IMAGES,
          ...ALLOWED_FILE_TYPES.DOCUMENTS,
          ...ALLOWED_FILE_TYPES.SPREADSHEETS,
          ...ALLOWED_FILE_TYPES.PRESENTATIONS,
        ].join(',');
      default:
        return [
          ...ALLOWED_FILE_TYPES.IMAGES,
          ...ALLOWED_FILE_TYPES.DOCUMENTS,
          ...ALLOWED_FILE_TYPES.SPREADSHEETS,
          ...ALLOWED_FILE_TYPES.PRESENTATIONS,
        ].join(',');
    }
  };

  const validateFile = (file: File): string | null => {
    const sizeLimit = getFileSizeLimit();
    if (file.size > sizeLimit) {
      return `File size exceeds limit of ${formatFileSize(sizeLimit)}`;
    }

    const acceptedTypes = getAcceptedTypes().split(',');
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf') || fileType.includes('document'))
      return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onUploadError(error);
        continue;
      }

      const uploadedFile: UploadedFile = {
        file,
        preview: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
        progress: 0,
        status: 'uploading',
      };

      setUploadedFiles((prev) => [...prev, uploadedFile]);

      try {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${path}/${fileName}`;

        const result = await uploadFile({
          bucket,
          path: filePath,
          file,
          metadata: {
            originalName: file.name,
            uploadedBy: 'user', // TODO: Get from auth context
          },
        });

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, progress: 100, status: 'completed' as const }
              : f
          )
        );

        onUploadComplete(result.url, result.path);
      } catch (error: any) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, status: 'error' as const, error: error.message }
              : f
          )
        );
        onUploadError(error.message);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleClick : undefined}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Max size: {formatFileSize(getFileSizeLimit())}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files
          </h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${
                  file.status === 'completed'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : file.status === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                    {getFileIcon(file.file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {file.status === 'uploading' && (
                  <div className="text-xs text-gray-500">{file.progress}%</div>
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <RadixButton
                  variant="ghost"
                  size="1"
                  onClick={() => removeFile(index)}
                  className="p-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </RadixButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
