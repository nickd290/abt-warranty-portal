import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore';
import { StatPill } from '../components/ui/StatPill';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { PreviewModal } from '../components/ui/PreviewModal';
import {
  Buckslip,
  LetterReply,
  Envelope,
  SequenceDot,
} from '../components/ui/ProofingVisuals';

export function Dashboard() {
  const navigate = useNavigate();
  const jobs = useJobStore((state) => state.jobs);
  const [step, setStep] = useState(0);
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

  const stats = {
    total: jobs.length,
    inProgress: jobs.filter((j) =>
      ['draft', 'assets-uploaded', 'proofing'].includes(j.status)
    ).length,
    completed: jobs.filter((j) => j.status === 'complete').length,
  };

  const getChipTone = (status: string) => {
    if (status === 'complete') return 'good';
    if (status === 'proofing') return 'warn';
    return 'muted';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      'assets-uploaded': 'Assets Uploaded',
      proofing: 'Proofing',
      approved: 'Approved',
      printing: 'Printing',
      invoiced: 'Invoiced',
      complete: 'Complete',
    };
    return labels[status] || status;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      {/* Hero area */}
      <div className="pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Welcome to your Warranty Campaigns
        </h1>
        <p className="mt-2 text-white/60">
          Seamless Campaigns • Proof • Print • Deliver
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatPill label="Total Jobs" value={stats.total} />
        <StatPill
          label="In Progress"
          value={stats.inProgress}
          hint={`${stats.inProgress} awaiting approval`}
        />
        <StatPill
          label="Completed"
          value={stats.completed}
          hint="Last month finalized"
        />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proofing Room */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Proofing Room</h2>
              <p className="text-white/60 mt-1">Interactive inserting sequence</p>
            </div>
            <button
              onClick={() => navigate('/proofs')}
              className="rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/15 transition"
            >
              Learn more →
            </button>
          </div>

          {/* Sequence stage */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
            {/* Visual stack */}
            <div className="relative h-[280px] rounded-3xl bg-black/20 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(700px_200px_at_50%_110%,rgba(56,189,248,0.12),transparent_60%)]" />

              {/* Stacked items that slide toward envelope when step changes */}
              <div className="relative flex flex-col gap-3">
                {/* Buckslips */}
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

              {/* Envelope on the right */}
              <div className="absolute right-6">
                <Envelope
                  open={step < 4}
                  onClick={() =>
                    setPreviewModal({ isOpen: true, type: 'envelope', idx: 0 })
                  }
                />
              </div>
            </div>

            {/* Controls */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {steps.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setStep(i)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      i === step
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}. {s.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {steps.map((_, i) => (
                  <SequenceDot key={i} active={i <= step} />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/proofs')}
                  className="rounded-2xl bg-sky-500/20 text-sky-300 px-4 py-2 hover:bg-sky-500/30 transition text-sm"
                >
                  Approve Sequence
                </button>
                <button className="rounded-2xl bg-white/10 text-white px-4 py-2 hover:bg-white/15 transition text-sm">
                  Download Proofs
                </button>
                <button className="rounded-2xl bg-white/5 text-white/80 px-4 py-2 hover:bg-white/10 transition text-sm">
                  Comment
                </button>
              </div>

              <p className="mt-3 text-xs text-white/50">
                Tip: click steps to preview animation. Envelope closes when all
                inserts are staged.
              </p>
            </div>
          </div>
        </Card>

        {/* Campaigns */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Campaigns</h2>
          <div className="mt-4 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate(`/upload/${job.id}`)}
              >
                <div>
                  <div className="text-white font-medium">{job.campaignName}</div>
                  <div className="text-white/50 text-xs">
                    {job.month} {job.year}
                  </div>
                </div>
                <Chip tone={getChipTone(job.status)}>
                  {getStatusLabel(job.status)}
                </Chip>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => navigate('/upload/new')}
              className="rounded-xl bg-sky-500/20 text-sky-300 px-3 py-2 text-sm hover:bg-sky-500/30 transition"
            >
              New Job
            </button>
            <button className="rounded-xl bg-white/10 text-white px-3 py-2 text-sm hover:bg-white/15 transition">
              View All
            </button>
          </div>
        </Card>

        {/* Bottom widgets */}
        <Card className="p-6 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-sm text-white/60">Invoices</div>
              <div className="mt-2 text-2xl text-white font-semibold">
                Up to Date
              </div>
              <div className="mt-2 text-xs text-white/50">
                Last paid: #INV‑2041
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-sm text-white/60">Mail Counts</div>
              <div className="mt-2 text-2xl text-white font-semibold">
                {jobs.reduce((sum, j) => sum + (j.mailCount || 0), 0).toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-white/50">
                Total mail pieces
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-sm text-white/60">Assets</div>
              <div className="mt-2 text-2xl text-white font-semibold">
                Library
              </div>
              <div className="mt-2 text-xs text-white/50">
                All prior creatives
              </div>
            </div>
          </div>
        </Card>
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
