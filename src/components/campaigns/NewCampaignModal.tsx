import { useState } from 'react';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';
import { api } from '../../services/api';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
  const createJob = useJobStore((state) => state.createJob);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  const [campaignName, setCampaignName] = useState('');
  const [month, setMonth] = useState(currentMonth);
  const [buckslip1, setBuckslip1] = useState<File | null>(null);
  const [buckslip2, setBuckslip2] = useState<File | null>(null);
  const [buckslip3, setBuckslip3] = useState<File | null>(null);
  const [letterReply, setLetterReply] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Create new campaign
      const year = currentDate.getFullYear();
      setUploadProgress('Creating campaign...');

      const newJob = await createJob({
        campaignName,
        month,
        year,
      });

      // Upload files
      const filesToUpload = [
        { file: buckslip1, type: 'BUCKSLIP_1', label: 'Buckslip 1' },
        { file: buckslip2, type: 'BUCKSLIP_2', label: 'Buckslip 2' },
        { file: buckslip3, type: 'BUCKSLIP_3', label: 'Buckslip 3' },
        { file: letterReply, type: 'LETTER_REPLY', label: 'Letter Reply' },
      ];

      for (const { file, type, label } of filesToUpload) {
        if (file) {
          setUploadProgress(`Uploading ${label}...`);
          await api.uploadFile(newJob.id, type, file);
        }
      }

      setUploadProgress('Upload complete!');

      // Refresh jobs list to show updated campaign with files
      await fetchJobs();

      // Reset form
      setCampaignName('');
      setMonth(currentMonth);
      setBuckslip1(null);
      setBuckslip2(null);
      setBuckslip3(null);
      setLetterReply(null);
      setUploadProgress('');
      setIsUploading(false);

      onClose();
    } catch (error) {
      console.error('Error creating campaign and uploading files:', error);
      setUploadProgress('Error uploading files. Please try again.');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-3xl max-w-2xl w-full ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">New Campaign</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label
              htmlFor="campaignName"
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Program Name
            </label>
            <input
              id="campaignName"
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
            />
          </div>

          {/* Month Selection */}
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-black">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Upload Files</h3>

            {/* Buckslip 1 */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Buckslip 1
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
                <Upload className="h-5 w-5 text-sky-400" />
                <span className="text-sm text-white/70">
                  {buckslip1 ? buckslip1.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setBuckslip1(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Buckslip 2 */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Buckslip 2
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
                <Upload className="h-5 w-5 text-sky-400" />
                <span className="text-sm text-white/70">
                  {buckslip2 ? buckslip2.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setBuckslip2(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Buckslip 3 */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Buckslip 3
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
                <Upload className="h-5 w-5 text-sky-400" />
                <span className="text-sm text-white/70">
                  {buckslip3 ? buckslip3.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setBuckslip3(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Letter Reply */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Letter Reply Content
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
                <FileText className="h-5 w-5 text-sky-400" />
                <span className="text-sm text-white/70">
                  {letterReply ? letterReply.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setLetterReply(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Static Envelope Info */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Outer Envelope
                  </p>
                  <p className="text-xs text-white/50">
                    Using standard envelope template (no upload needed)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-sky-400 animate-spin" />
                <span className="text-sm text-sky-300">{uploadProgress}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
