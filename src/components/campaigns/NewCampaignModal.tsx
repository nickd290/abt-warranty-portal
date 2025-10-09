import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';

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
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  const [campaignName, setCampaignName] = useState('');
  const [month, setMonth] = useState(currentMonth);
  const [buckslip1, setBuckslip1] = useState<File | null>(null);
  const [buckslip2, setBuckslip2] = useState<File | null>(null);
  const [buckslip3, setBuckslip3] = useState<File | null>(null);
  const [letterReply, setLetterReply] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new campaign
    const year = currentDate.getFullYear();

    createJob({
      campaignName,
      month,
      year,
      status: 'draft',
      buckslip1: buckslip1 ? {
        id: `file-${Date.now()}-1`,
        name: buckslip1.name,
        url: URL.createObjectURL(buckslip1),
        uploadedAt: new Date(),
      } : undefined,
      buckslip2: buckslip2 ? {
        id: `file-${Date.now()}-2`,
        name: buckslip2.name,
        url: URL.createObjectURL(buckslip2),
        uploadedAt: new Date(),
      } : undefined,
      buckslip3: buckslip3 ? {
        id: `file-${Date.now()}-3`,
        name: buckslip3.name,
        url: URL.createObjectURL(buckslip3),
        uploadedAt: new Date(),
      } : undefined,
      letterReply: letterReply ? {
        id: `file-${Date.now()}-4`,
        name: letterReply.name,
        url: URL.createObjectURL(letterReply),
        uploadedAt: new Date(),
      } : undefined,
    });

    // Reset form
    setCampaignName('');
    setMonth(currentMonth);
    setBuckslip1(null);
    setBuckslip2(null);
    setBuckslip3(null);
    setLetterReply(null);
    onClose();
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
