import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { PreviewModal } from '../components/ui/PreviewModal';
import {
  Buckslip,
  LetterReply,
  Envelope,
  SequenceDot,
} from '../components/ui/ProofingVisuals';
import { Check, X } from 'lucide-react';

// Mock sample letters
const mockSamples = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Sample ${i + 1}`,
  recipient: `John Doe ${i + 1}`,
  address: `${1234 + i} Main St, Chicago, IL 60601`,
}));

export function Proofing() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const getJobById = useJobStore((state) => state.getJobById);
  const updateJobStatus = useJobStore((state) => state.updateJobStatus);

  const job = jobId ? getJobById(jobId) : null;

  const [step, setStep] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    type: string;
    idx?: number;
  }>({ isOpen: false, type: '' });

  const steps = useMemo(
    () => [
      { key: 'bs1', label: 'Buckslip 1' },
      { key: 'bs2', label: 'Buckslip 2' },
      { key: 'bs3', label: 'Buckslip 3' },
      { key: 'letter', label: 'Letter' },
      { key: 'envelope', label: 'Outer Envelope' },
    ],
    []
  );

  const handleApprove = () => {
    if (jobId) {
      updateJobStatus(jobId, 'approved');
      navigate(`/invoices/${jobId}`);
    }
  };

  const handleRequestChanges = () => {
    if (jobId) {
      updateJobStatus(jobId, 'assets-uploaded');
      navigate(`/upload/${jobId}`);
    }
  };

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Card className="p-12 text-center">
          <p className="text-white/70">Job not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sky-400 hover:text-sky-300"
          >
            Return to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      {/* Hero */}
      <div className="pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Proofing Room
            </h1>
            <p className="mt-2 text-white/60">
              {job.campaignName} • {job.month} {job.year}
            </p>
          </div>
          <Chip tone="warn">Proofing</Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sample Letters Sidebar */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white mb-2">
            Sample Letter Replies
          </h3>
          <p className="text-xs text-white/50 mb-4">
            10 personalized samples from mail list
          </p>

          <div className="space-y-2">
            {mockSamples.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => setSelectedSample(idx)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  selectedSample === idx
                    ? 'border-sky-400/50 bg-sky-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {sample.name}
                  </span>
                  {selectedSample === idx && (
                    <Check className="h-3 w-3 text-sky-400" />
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">{sample.recipient}</p>
                <p className="text-xs text-white/40">{sample.address}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Main Proofing Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Interactive Sequence */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Interactive Inserting Sequence
                </h2>
                <p className="text-white/60 mt-1">
                  Step {step + 1} of {steps.length}: {steps[step].label}
                </p>
              </div>
            </div>

            {/* Visual Sequence */}
            <div className="relative h-[350px] rounded-3xl bg-black/20 ring-1 ring-white/10 flex items-center justify-center overflow-hidden mb-6">
              <div className="absolute inset-0 bg-[radial-gradient(700px_200px_at_50%_110%,rgba(56,189,248,0.12),transparent_60%)]" />

              {/* Stacked items */}
              <div className="relative flex flex-col gap-4">
                <div
                  className={`transition-all duration-700 ${
                    step >= 0 ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                  } ${step >= 4 ? 'translate-x-32 scale-75 opacity-50' : ''}`}
                >
                  <Buckslip
                    idx={0}
                    title="Buckslip A (8.5×3.5)"
                    onClick={() =>
                      setPreviewModal({ isOpen: true, type: 'buckslip', idx: 0 })
                    }
                  />
                </div>
                <div
                  className={`transition-all duration-700 delay-75 ${
                    step >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                  } ${step >= 4 ? 'translate-x-32 scale-75 opacity-50' : ''}`}
                >
                  <Buckslip
                    idx={1}
                    title="Buckslip B (8.5×3.5)"
                    onClick={() =>
                      setPreviewModal({ isOpen: true, type: 'buckslip', idx: 1 })
                    }
                  />
                </div>
                <div
                  className={`transition-all duration-700 delay-150 ${
                    step >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                  } ${step >= 4 ? 'translate-x-32 scale-75 opacity-50' : ''}`}
                >
                  <Buckslip
                    idx={2}
                    title="Buckslip C (8.5×3.5)"
                    onClick={() =>
                      setPreviewModal({ isOpen: true, type: 'buckslip', idx: 2 })
                    }
                  />
                </div>
                <div
                  className={`transition-all duration-700 delay-200 ${
                    step >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                  } ${step >= 4 ? 'translate-x-32 scale-75 opacity-50' : ''}`}
                >
                  <LetterReply
                    onClick={() =>
                      setPreviewModal({ isOpen: true, type: 'letter', idx: 0 })
                    }
                  />
                </div>
              </div>

              {/* Envelope */}
              <div className="absolute right-12">
                <Envelope
                  open={step < 4}
                  onClick={() =>
                    setPreviewModal({ isOpen: true, type: 'envelope', idx: 0 })
                  }
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {steps.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setStep(i)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      i === step
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}. {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <SequenceDot key={i} active={i <= step} />
                ))}
              </div>

              <p className="text-xs text-white/50">
                Click steps to preview the inserting animation. The envelope
                closes when all inserts are staged.
              </p>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold">Ready to approve?</h3>
                <p className="text-white/60 text-sm mt-1">
                  Review all samples and the inserting sequence before approving
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRequestChanges}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  <X className="h-4 w-4" />
                  Request Changes
                </button>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-6 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30 transition ring-1 ring-emerald-400/30"
                >
                  <Check className="h-4 w-4" />
                  Approve for Printing
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, type: '' })}
        title={
          previewModal.type === 'buckslip'
            ? `Buckslip ${(previewModal.idx ?? 0) + 1} Preview`
            : previewModal.type === 'letter'
            ? 'Letter Reply Preview'
            : 'Outer Envelope Preview'
        }
        onApprove={() => {
          alert('Piece approved!');
          setPreviewModal({ isOpen: false, type: '' });
        }}
      >
        {previewModal.type === 'buckslip' && previewModal.idx !== undefined && (
          <div className="scale-[3]">
            <Buckslip idx={previewModal.idx} title={`Buckslip ${previewModal.idx + 1}`} />
          </div>
        )}
        {previewModal.type === 'letter' && (
          <div className="scale-[4]">
            <LetterReply />
          </div>
        )}
        {previewModal.type === 'envelope' && (
          <div className="scale-[3]">
            <Envelope open={false} />
          </div>
        )}
      </PreviewModal>
    </div>
  );
}
