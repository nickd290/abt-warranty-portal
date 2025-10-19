import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { useJobStore } from '../store/useJobStore';
import { FileUpload } from '../components/ui/FileUpload';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import type { UploadedFile } from '../types';

export function Upload() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isNew = jobId === 'new';

  const createJob = useJobStore((state) => state.createJob);
  const updateJob = useJobStore((state) => state.updateJob);
  const getJobById = useJobStore((state) => state.getJobById);
  const updateJobStatus = useJobStore((state) => state.updateJobStatus);

  const existingJob = jobId && jobId !== 'new' ? getJobById(jobId) : null;

  const [formData, setFormData] = useState({
    month: existingJob?.month || '',
    year: existingJob?.year || new Date().getFullYear(),
    campaignName: existingJob?.campaignName || '',
  });

  const [files, setFiles] = useState({
    buckslip1: existingJob?.buckslip1,
    buckslip2: existingJob?.buckslip2,
    buckslip3: existingJob?.buckslip3,
    letterReply: existingJob?.letterReply,
    outerEnvelope: existingJob?.outerEnvelope,
    mailList: existingJob?.mailList,
  });

  const handleFileUpload = (field: keyof typeof files, file: File) => {
    const uploadedFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    };

    setFiles((prev) => ({ ...prev, [field]: uploadedFile }));
  };

  const handleFileRemove = (field: keyof typeof files) => {
    setFiles((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = () => {
    if (isNew) {
      createJob({
        ...formData,
      });
    } else if (jobId) {
      updateJob(jobId, {
        ...formData,
      });
    }
    navigate('/');
  };

  const handleSubmitForProofing = () => {
    let currentJobId = jobId;

    if (isNew) {
      const newJobId = `job-${Date.now()}`;
      createJob({
        ...formData,
      });
      currentJobId = newJobId;
    } else if (jobId) {
      updateJob(jobId, {
        ...formData,
      });
      updateJobStatus(jobId, 'PROOFING');
    }

    navigate(`/proofs/${currentJobId || 'new'}`);
  };

  const allFilesUploaded = Object.values(files).every(
    (file) => file !== undefined
  );

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      {/* Hero */}
      <div className="pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              {isNew ? 'Create New Job' : 'Edit Job'}
            </h1>
            <p className="mt-2 text-white/60">
              Upload assets and mail list for your campaign
            </p>
          </div>
          {existingJob && (
            <Chip tone={existingJob.status === 'DRAFT' ? 'muted' : 'warn'}>
              {existingJob.status}
            </Chip>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="" className="bg-slate-900">
                  Select Month
                </option>
                {[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ].map((month) => (
                  <option key={month} value={month} className="bg-slate-900">
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) =>
                  setFormData({ ...formData, campaignName: e.target.value })
                }
                placeholder="e.g., Q4 Warranty Push"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
          </div>
        </Card>

        {/* Buckslips */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Monthly Buckslips (3 required)
          </h2>
          <div className="space-y-4">
            <FileUpload
              label="Buckslip 1"
              accept="application/pdf,image/*"
              onUpload={(file) => handleFileUpload('buckslip1', file)}
              uploadedFile={files.buckslip1}
              onRemove={() => handleFileRemove('buckslip1')}
            />
            <FileUpload
              label="Buckslip 2"
              accept="application/pdf,image/*"
              onUpload={(file) => handleFileUpload('buckslip2', file)}
              uploadedFile={files.buckslip2}
              onRemove={() => handleFileRemove('buckslip2')}
            />
            <FileUpload
              label="Buckslip 3"
              accept="application/pdf,image/*"
              onUpload={(file) => handleFileUpload('buckslip3', file)}
              uploadedFile={files.buckslip3}
              onRemove={() => handleFileRemove('buckslip3')}
            />
          </div>
        </Card>

        {/* Letter Reply */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Letter Reply
          </h2>
          <FileUpload
            label="Letter Reply Template (with merge fields)"
            accept="application/pdf,image/*"
            onUpload={(file) => handleFileUpload('letterReply', file)}
            uploadedFile={files.letterReply}
            onRemove={() => handleFileRemove('letterReply')}
          />
        </Card>

        {/* Outer Envelope */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Outer Envelope
          </h2>
          <FileUpload
            label="Outer Envelope Design"
            accept="application/pdf,image/*"
            onUpload={(file) => handleFileUpload('outerEnvelope', file)}
            uploadedFile={files.outerEnvelope}
            onRemove={() => handleFileRemove('outerEnvelope')}
          />
        </Card>

        {/* Mail List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Mail List</h2>
          <FileUpload
            label="Mail List (CSV/Excel)"
            accept=".csv,.xlsx,.xls"
            onUpload={(file) => handleFileUpload('mailList', file)}
            uploadedFile={files.mailList}
            onRemove={() => handleFileRemove('mailList')}
          />
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={handleSubmitForProofing}
            disabled={!allFilesUploaded || !formData.campaignName}
            className="flex items-center gap-2 rounded-2xl bg-sky-500/20 px-6 py-2.5 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-sky-400/30"
          >
            <Send className="h-4 w-4" />
            Submit for Proofing
          </button>
        </div>
      </div>
    </div>
  );
}
