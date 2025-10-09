import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onUpload: (file: File) => void;
  uploadedFile?: { name: string };
  onRemove?: () => void;
}

export function FileUpload({
  label,
  accept,
  onUpload,
  uploadedFile,
  onRemove,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/70">{label}</label>

      {uploadedFile ? (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-sky-400" />
            <span className="text-sm text-white">{uploadedFile.name}</span>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? 'border-sky-400/50 bg-sky-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/30'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-white/40" />
          <p className="mt-2 text-sm text-white/50">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
}
