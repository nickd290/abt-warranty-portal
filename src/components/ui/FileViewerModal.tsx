import { X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

export function FileViewerModal({ isOpen, onClose, fileId, fileName }: FileViewerModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && fileId) {
      loadFile();
    }
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, fileId]);

  const loadFile = async () => {
    try {
      setIsLoading(true);
      const blob = await api.downloadFile(fileId);
      const url = URL.createObjectURL(blob);
      setFileUrl(url);
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white truncate">
              {fileName}
            </h2>
            <p className="text-sm text-white/50 mt-1">File Preview</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-white/5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-white/50 text-lg">Loading preview...</div>
            </div>
          ) : fileUrl ? (
            <>
              {isPDF && (
                <iframe
                  src={fileUrl}
                  className="w-full h-full min-h-[600px] rounded-xl"
                  title={fileName}
                />
              )}
              {isImage && (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>
              )}
              {!isPDF && !isImage && (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <p className="text-lg mb-4">Preview not available for this file type</p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-white/50 text-lg">Failed to load file</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
