import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { PreviewModal } from '../components/ui/PreviewModal';
import { FullFilePreview } from '../components/ui/FilePreview';
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
      { key: 'start', label: 'Start Position' },
      { key: 'buckslips', label: 'Insert Buckslips' },
      { key: 'letter', label: 'Insert Letter' },
      { key: 'seal', label: 'Seal Envelope' },
      { key: 'ready', label: 'Ready to Mail' },
    ],
    []
  );

  const handleApprove = () => {
    if (jobId) {
      updateJobStatus(jobId, 'APPROVED');
      navigate(`/invoices/${jobId}`);
    }
  };

  const handleRequestChanges = () => {
    if (jobId) {
      updateJobStatus(jobId, 'ASSETS_UPLOADED');
      navigate(`/upload/${jobId}`);
    }
  };

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Card className="p-12 text-center">
          <p className="text-lg text-white/70">Job not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-base text-sky-400 hover:text-sky-300"
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
            <p className="mt-2 text-lg text-white/60">
              {job.campaignName} • {job.month} {job.year}
            </p>
          </div>
          <Chip tone="warn">Proofing</Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sample Letters Sidebar */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-base font-semibold text-white mb-2">
            Sample Letter Replies
          </h3>
          <p className="text-sm text-white/50 mb-4">
            10 personalized samples from mail list
          </p>

          <div className="space-y-2">
            {mockSamples.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => setSelectedSample(idx)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  selectedSample === idx
                    ? 'border-slate-500/50 bg-slate-600/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-white">
                    {sample.name}
                  </span>
                  {selectedSample === idx && (
                    <Check className="h-4 w-4 text-slate-300" />
                  )}
                </div>
                <p className="text-sm text-white/50 mt-1">{sample.recipient}</p>
                <p className="text-sm text-white/40">{sample.address}</p>
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
                <p className="text-lg text-white/60 mt-1">
                  Step {step + 1} of {steps.length}: {steps[step].label}
                </p>
              </div>
            </div>

            {/* Visual Sequence - Centered Envelope with Queue on Left */}
            <div className="relative h-[400px] rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 ring-1 ring-gray-200 overflow-hidden mb-6">

              {/* Status Indicator - shows during insertion */}
              {step >= 1 && step < 4 && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-top duration-500">
                  <div className="bg-slate-700/90 text-white text-base font-semibold px-6 py-2 rounded-full shadow-lg">
                    {step === 1 ? 'Inserting Buckslips...' : step === 2 ? 'Inserting Letter...' : 'Sealing Envelope...'}
                  </div>
                </div>
              )}

              {/* Container */}
              <div className="h-full flex items-center justify-center px-12 relative">

                {/* LEFT SIDE - Queue of inserts waiting (fades out when sequence starts) */}
                <div
                  className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 transition-opacity duration-500"
                  style={{ opacity: step >= 1 ? 0 : 1 }}
                >
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Queue</h3>

                  <div className="flex flex-col gap-3">
                    {/* Buckslip 1 */}
                    <div
                      className="transition-all duration-600 ease-out"
                      style={{
                        opacity: step >= 1 ? 0 : 1,
                        transform: step >= 1 ? 'translateX(500px)' : 'translateX(0)',
                        pointerEvents: step >= 1 ? 'none' : 'auto'
                      }}
                    >
                      <Buckslip
                        idx={0}
                        title="Buckslip A (8.5×3.5)"
                        onClick={() =>
                          setPreviewModal({ isOpen: true, type: 'buckslip', idx: 0 })
                        }
                      />
                    </div>

                    {/* Buckslip 2 */}
                    <div
                      className="transition-all duration-600 ease-out"
                      style={{
                        opacity: step >= 1 ? 0 : 1,
                        transform: step >= 1 ? 'translateX(500px)' : 'translateX(0)',
                        transitionDelay: step >= 1 ? '100ms' : '0ms',
                        pointerEvents: step >= 1 ? 'none' : 'auto'
                      }}
                    >
                      <Buckslip
                        idx={1}
                        title="Buckslip B (8.5×3.5)"
                        onClick={() =>
                          setPreviewModal({ isOpen: true, type: 'buckslip', idx: 1 })
                        }
                      />
                    </div>

                    {/* Buckslip 3 */}
                    <div
                      className="transition-all duration-600 ease-out"
                      style={{
                        opacity: step >= 1 ? 0 : 1,
                        transform: step >= 1 ? 'translateX(500px)' : 'translateX(0)',
                        transitionDelay: step >= 1 ? '200ms' : '0ms',
                        pointerEvents: step >= 1 ? 'none' : 'auto'
                      }}
                    >
                      <Buckslip
                        idx={2}
                        title="Buckslip C (8.5×3.5)"
                        onClick={() =>
                          setPreviewModal({ isOpen: true, type: 'buckslip', idx: 2 })
                        }
                      />
                    </div>

                    {/* Letter */}
                    <div
                      className="transition-all duration-600 ease-out"
                      style={{
                        opacity: step >= 2 ? 0 : 1,
                        transform: step >= 2 ? 'translateX(500px)' : 'translateX(0)',
                        pointerEvents: step >= 2 ? 'none' : 'auto'
                      }}
                    >
                      <LetterReply
                        onClick={() =>
                          setPreviewModal({ isOpen: true, type: 'letter', idx: 0 })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CENTER - Envelope (zooms in when sequence starts) */}
                <div className="flex flex-col items-center gap-4">
                  <h3
                    className="text-sm font-semibold text-gray-600 mb-2 transition-opacity duration-500"
                    style={{ opacity: step >= 1 ? 0 : 1 }}
                  >
                    {step >= 4 ? 'SEALED - Ready to Mail' : step >= 3 ? 'Sealing...' : '#10 Envelope'}
                  </h3>

                  <div className="relative">
                    <Envelope
                      open={step < 3}
                      hasInserts={step >= 1}
                      onClick={() =>
                        setPreviewModal({ isOpen: true, type: 'envelope', idx: 0 })
                      }
                    >
                      {/* Inserts stacked inside envelope */}
                      <div className="relative w-full h-full flex items-center justify-center">

                        {/* Buckslip 1 */}
                        <div
                          className="absolute"
                          style={{
                            transform: step >= 1 && step < 4 ? 'translateX(0) scale(2.0)' : 'translateX(-500px) scale(2.0)',
                            opacity: step >= 1 && step < 4 ? 1 : 0,
                            transition: 'all 1200ms ease-out'
                          }}
                        >
                          <Buckslip
                            idx={0}
                            title="Buckslip A"
                            onClick={() =>
                              setPreviewModal({ isOpen: true, type: 'buckslip', idx: 0 })
                            }
                          />
                        </div>

                        {/* Buckslip 2 */}
                        <div
                          className="absolute"
                          style={{
                            transform: step >= 1 && step < 4 ? 'translateX(0) translateY(-10px) scale(2.0)' : 'translateX(-500px) scale(2.0)',
                            opacity: step >= 1 && step < 4 ? 1 : 0,
                            transition: 'all 1200ms ease-out',
                            transitionDelay: step >= 1 ? '800ms' : '0ms'
                          }}
                        >
                          <Buckslip
                            idx={1}
                            title="Buckslip B"
                            onClick={() =>
                              setPreviewModal({ isOpen: true, type: 'buckslip', idx: 1 })
                            }
                          />
                        </div>

                        {/* Buckslip 3 */}
                        <div
                          className="absolute"
                          style={{
                            transform: step >= 1 && step < 4 ? 'translateX(0) translateY(-20px) scale(2.0)' : 'translateX(-500px) scale(2.0)',
                            opacity: step >= 1 && step < 4 ? 1 : 0,
                            transition: 'all 1200ms ease-out',
                            transitionDelay: step >= 1 ? '1600ms' : '0ms'
                          }}
                        >
                          <Buckslip
                            idx={2}
                            title="Buckslip C"
                            onClick={() =>
                              setPreviewModal({ isOpen: true, type: 'buckslip', idx: 2 })
                            }
                          />
                        </div>

                        {/* Tri-Folded Letter */}
                        <div
                          className="absolute"
                          style={{
                            transform: step >= 2 && step < 4 ? 'translateX(0) translateY(-30px) scale(2.0)' : 'translateX(-500px) scale(2.0)',
                            opacity: step >= 2 && step < 4 ? 1 : 0,
                            transition: 'all 1500ms ease-out'
                          }}
                        >
                          <LetterReply
                            folded={true}
                            onClick={() =>
                              setPreviewModal({ isOpen: true, type: 'letter', idx: 0 })
                            }
                          />
                        </div>
                      </div>
                    </Envelope>

                    {/* SEALED indicator with mint green success state - overlays at bottom */}
                    {step >= 4 && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 text-base font-semibold px-6 py-2 rounded-full ring-2 ring-emerald-300 shadow-lg z-40">
                        SEALED
                      </div>
                    )}
                  </div>
                </div>
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
                        ? 'bg-slate-600/30 text-slate-200 ring-1 ring-slate-500/40'
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

              <p className="text-sm text-white/50">
                Click steps to preview the inserting animation. Watch as pieces slide from the queue into the envelope, then seal when complete.
              </p>
            </div>
          </Card>

          {/* Static Proof Gallery */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Proof Gallery
            </h2>

            {/* Buckslips Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Buckslips (Front & Back)
              </h3>
              <p className="text-base text-white/50 mb-4">
                8.5" × 3.5" - 100# Gloss Text, 4/4, AQ Coating Each Side
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="space-y-2">
                    {/* Front */}
                    <div
                      onClick={() =>
                        setPreviewModal({ isOpen: true, type: 'buckslip', idx })
                      }
                      className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                    >
                      <p className="text-base font-medium text-white mb-2">
                        Buckslip {idx + 1} - Front
                      </p>
                      <div className="aspect-[2.43/1] bg-white rounded overflow-hidden">
                        <img
                          src={`/ABT-8.5x3.5-${idx + 1}.png`}
                          alt={`Buckslip ${idx + 1} Front`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Back */}
                    <div
                      onClick={() =>
                        setPreviewModal({ isOpen: true, type: 'buckslip', idx })
                      }
                      className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                    >
                      <p className="text-base font-medium text-white mb-2">
                        Buckslip {idx + 1} - Back
                      </p>
                      <div className="aspect-[2.43/1] bg-white rounded overflow-hidden">
                        <img
                          src={`/ABT-8.5x3.5-${idx + 1}.png`}
                          alt={`Buckslip ${idx + 1} Back`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Letter Samples Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Letter Reply Samples
              </h3>
              <p className="text-base text-white/50 mb-4">
                8.5" × 14" - 70# Uncoated Opaque Text, 4/4 (10 personalized samples)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mockSamples.map((sample, idx) => (
                  <div
                    key={sample.id}
                    onClick={() => {
                      setSelectedSample(idx);
                      setPreviewModal({ isOpen: true, type: 'letter', idx: 0 });
                    }}
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <p className="text-base font-medium text-white mb-2">
                      {sample.name}
                    </p>
                    <div className="aspect-[8.5/14] bg-white rounded overflow-hidden mb-2">
                      <img
                        src="/ABT-8.5x14.png"
                        alt={`Letter Sample ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-white/60">{sample.recipient}</p>
                    <p className="text-sm text-white/40 truncate">{sample.address.split('\n')[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Envelope Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Outer Envelope
              </h3>
              <p className="text-base text-white/50 mb-4">
                #10 Envelope - 24# White Wove 4/0 (single-sided)
              </p>
              <div className="max-w-2xl">
                <div
                  onClick={() =>
                    setPreviewModal({ isOpen: true, type: 'envelope', idx: 0 })
                  }
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <p className="text-base font-medium text-white mb-2">
                    Envelope - Front
                  </p>
                  <div className="aspect-[2.3/1] bg-white rounded overflow-hidden">
                    <img
                      src="/ABT-No10.png"
                      alt="Envelope"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg text-white font-semibold">Ready to approve?</h3>
                <p className="text-base text-white/60 mt-1">
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
            : '#10 Envelope Preview'
        }
        onApprove={() => {
          alert('Piece approved!');
          setPreviewModal({ isOpen: false, type: '' });
        }}
      >
        {previewModal.type === 'buckslip' && previewModal.idx !== undefined && (
          <FullFilePreview
            fileName={`ABT-8.5x3.5-${previewModal.idx + 1}`}
            className="h-full"
          />
        )}
        {previewModal.type === 'letter' && (
          <FullFilePreview
            fileName="ABT-8.5x14"
            className="h-full"
          />
        )}
        {previewModal.type === 'envelope' && (
          <FullFilePreview
            fileName="ABT-No10"
            className="h-full"
          />
        )}
      </PreviewModal>
    </div>
  );
}
