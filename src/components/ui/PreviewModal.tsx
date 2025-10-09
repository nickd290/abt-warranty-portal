import { X, Check, Download } from 'lucide-react';
import { useEffect } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApprove?: () => void;
}

export function PreviewModal({
  isOpen,
  onClose,
  title,
  children,
  onApprove,
}: PreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] rounded-3xl bg-black ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-black/0 to-black/20">
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/20">
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
            <Download className="h-4 w-4" />
            Download
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Close
            </button>
            {onApprove && (
              <button
                onClick={onApprove}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-6 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30 transition ring-1 ring-emerald-400/30"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
