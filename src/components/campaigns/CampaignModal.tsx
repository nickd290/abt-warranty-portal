import { useState, useMemo } from 'react';
import { X, FileText, Eye, Info, Check, Calendar, Package, Play, RotateCcw } from 'lucide-react';
import type { Job } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Card } from '../ui/Card';
import { PreviewModal } from '../ui/PreviewModal';
import { FullFilePreview } from '../ui/FilePreview';
import { Buckslip, LetterReply, Envelope, SequenceDot } from '../ui/ProofingVisuals';
import { FileViewerModal } from '../ui/FileViewerModal';

interface CampaignModalProps {
  campaign: Job;
  onClose: () => void;
}

// Mock sample letters with diverse names and addresses
const mockSamples = [
  { id: 1, name: 'Sample 1', recipient: 'Michael Anderson', address: '4215 Oak Street\nChicago, IL 60614' },
  { id: 2, name: 'Sample 2', recipient: 'Sarah Martinez', address: '892 Maple Avenue\nNaperville, IL 60540' },
  { id: 3, name: 'Sample 3', recipient: 'David Chen', address: '1563 Pine Road\nEvanston, IL 60201' },
  { id: 4, name: 'Sample 4', recipient: 'Jennifer Thompson', address: '7421 Elm Drive\nSchaumburg, IL 60173' },
  { id: 5, name: 'Sample 5', recipient: 'Robert Williams', address: '3089 Cedar Lane\nOak Park, IL 60302' },
  { id: 6, name: 'Sample 6', recipient: 'Lisa Patel', address: '5624 Birch Court\nSkokie, IL 60076' },
  { id: 7, name: 'Sample 7', recipient: 'James Rodriguez', address: '2147 Walnut Street\nArlington Heights, IL 60004' },
  { id: 8, name: 'Sample 8', recipient: 'Emily Johnson', address: '9836 Spruce Boulevard\nDes Plaines, IL 60016' },
  { id: 9, name: 'Sample 9', recipient: 'Christopher Lee', address: '6372 Willow Parkway\nPark Ridge, IL 60068' },
  { id: 10, name: 'Sample 10', recipient: 'Amanda Garcia', address: '1925 Hickory Trail\nWheeling, IL 60090' },
];

export function CampaignModal({ campaign, onClose }: CampaignModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'proofing'>('overview');
  const [step, setStep] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    type: string;
    idx?: number;
  }>({ isOpen: false, type: '' });
  const [fileViewer, setFileViewer] = useState<{
    isOpen: boolean;
    fileId: string;
    fileName: string;
  } | null>(null);

  const steps = useMemo(
    () => [
      { key: 'start', label: 'Start Position' },
      { key: 'buckslips', label: 'Add Buckslips' },
      { key: 'letter', label: 'Show Letter' },
      { key: 'fold', label: 'Fold & Insert' },
      { key: 'ready', label: 'Seal & Mail' },
    ],
    []
  );

  const playSequence = () => {
    setIsPlaying(true);
    setStep(0);

    const timeline = [
      { step: 0, delay: 0 },       // Start Position
      { step: 1, delay: 1500 },    // Add Buckslips (all 3)
      { step: 2, delay: 6500 },    // Show Letter (full size)
      { step: 3, delay: 9500 },    // Fold & Insert Letter
      { step: 4, delay: 12000 },   // Seal & Ready to Mail
    ];

    timeline.forEach(({ step: stepNum, delay }) => {
      setTimeout(() => {
        setStep(stepNum);
        if (stepNum === timeline.length - 1) {
          setTimeout(() => setIsPlaying(false), 1000);
        }
      }, delay);
    });
  };

  const resetSequence = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleViewFile = (fileId: string, fileName: string) => {
    setFileViewer({ isOpen: true, fileId, fileName });
  };

  const handleCloseFileViewer = () => {
    setFileViewer(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'specs', label: 'Specs', icon: FileText },
    { id: 'proofing', label: 'Proofing Center', icon: Eye },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <div
          className="bg-black rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {campaign.campaignName}
                  </h2>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="flex items-center gap-4 text-base text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {campaign.month} {campaign.year}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    ID: {campaign.id}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Campaign Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-base text-white/50 mb-2">Status</p>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div>
                      <p className="text-base text-white/50 mb-2">Period</p>
                      <p className="text-lg text-white">
                        {campaign.month} {campaign.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-white/50 mb-2">Created</p>
                      <p className="text-lg text-white">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-white/50 mb-2">Last Updated</p>
                      <p className="text-lg text-white">
                        {new Date(campaign.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Uploaded Assets
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Buckslip 1', file: campaign.buckslip1 },
                      { label: 'Buckslip 2', file: campaign.buckslip2 },
                      { label: 'Buckslip 3', file: campaign.buckslip3 },
                      { label: 'Letter Reply', file: campaign.letterReply },
                      { label: 'Outer Envelope', file: campaign.outerEnvelope },
                      { label: 'Mail List', file: campaign.mailList },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-xl border border-white/10 bg-white/5 p-4 ${
                          item.file ? 'hover:bg-white/10 cursor-pointer transition' : ''
                        }`}
                        onClick={() => item.file && handleViewFile(item.file.id, item.file.name)}
                      >
                        <p className="text-base text-white/50 mb-2">{item.label}</p>
                        {item.file ? (
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-lg text-white truncate">
                              {item.file.name}
                            </p>
                            <Eye className="h-5 w-5 text-sky-400 flex-shrink-0" />
                          </div>
                        ) : (
                          <p className="text-lg text-white/30 italic">Not uploaded</p>
                        )}
                        {item.file && (
                          <p className="text-sm text-white/40 mt-1">
                            {new Date(item.file.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Mail Piece Specifications
                  </h3>
                  <div className="space-y-6">
                    {/* Buckslips */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Buckslips</p>
                          <p className="text-xl text-white/70">8.5" × 3.5"</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-white">3</p>
                          <p className="text-base text-white/50">pieces</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-base font-semibold text-white/50 mb-2">Print Specifications</p>
                        <p className="text-lg text-white">100# Gloss Text, 4/4, AQ Coating Each Side</p>
                      </div>
                    </div>

                    {/* Letter Reply */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Letter Reply</p>
                          <p className="text-xl text-white/70">8.5" × 14"</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-white">1</p>
                          <p className="text-base text-white/50">piece</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-base font-semibold text-white/50 mb-2">Print Specifications</p>
                        <p className="text-lg text-white">70# Uncoated Opaque Text, 4/4</p>
                      </div>
                    </div>

                    {/* Outer Envelope */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Outer Envelope</p>
                          <p className="text-xl text-white/70">#10 Envelope</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-white">1</p>
                          <p className="text-base text-white/50">piece</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-base font-semibold text-white/50 mb-2">Print Specifications</p>
                        <p className="text-lg text-white">24# White Wove 4/0</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Production Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <p className="text-base font-semibold text-white/50 mb-2">Mail Count</p>
                      <p className="text-xl text-white">
                        {campaign.mailCount?.toLocaleString() || 'Not set'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <p className="text-base font-semibold text-white/50 mb-2">Rate Per Piece</p>
                      <p className="text-xl text-white">
                        {campaign.ratePerPiece
                          ? `$${campaign.ratePerPiece.toFixed(2)}`
                          : 'Not set'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Proofing Center Tab */}
            {activeTab === 'proofing' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sample Letters Sidebar */}
                <Card className="p-6 lg:col-span-1">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Sample Letter Replies
                  </h3>
                  <p className="text-base text-white/50 mb-4">
                    10 personalized samples from mail list
                  </p>

                  <div className="space-y-2">
                    {mockSamples.map((sample, idx) => (
                      <button
                        key={sample.id}
                        onClick={() => setSelectedSample(idx)}
                        className={`w-full text-left rounded-xl border p-4 transition-colors ${
                          selectedSample === idx
                            ? 'border-slate-500/50 bg-slate-600/20'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-white">
                            {sample.name}
                          </span>
                          {selectedSample === idx && (
                            <Check className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <p className="text-base text-white/50 mt-1">
                          {sample.recipient}
                        </p>
                        <p className="text-base text-white/40">{sample.address}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Main Proofing Area */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Interactive Sequence */}
                  <Card className="p-6 overflow-visible">
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

                    {/* Visual Sequence - Full-screen Envelope as Base */}
                    <div className="relative h-[500px] rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 ring-1 ring-gray-200 overflow-visible mb-6">

                      {/* Status Indicator - shows during insertion */}
                      {step >= 1 && step < 4 && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-500">
                          <div className="bg-slate-700/90 text-white text-base font-semibold px-6 py-2 rounded-full shadow-lg">
                            {step === 1 ? 'Inserting Buckslips...' : step === 2 ? 'Showing Letter...' : 'Folding & Inserting Letter...'}
                          </div>
                        </div>
                      )}

                      {/* Container - Envelope fills the entire area */}
                      <div className="h-full flex items-center justify-center p-8 relative">
                          <div className="relative w-full h-full">
                            <Envelope
                              open={step < 3}
                              hasInserts={step >= 1}
                              recipientName={mockSamples[selectedSample].recipient}
                              recipientAddress={mockSamples[selectedSample].address}
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
                                    transform: step >= 1 && step < 4 ? 'translateX(0) scale(2.0)' : 'translateX(-200px) scale(1.0)',
                                    opacity: step >= 4 ? 0 : 1,
                                    transition: 'all 1200ms ease-out',
                                    zIndex: 50
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
                                    transform: step >= 1 && step < 4 ? 'translateX(0) translateY(-10px) scale(2.0)' : 'translateX(-200px) translateY(-10px) scale(1.0)',
                                    opacity: step >= 4 ? 0 : 1,
                                    transition: 'all 1200ms ease-out',
                                    transitionDelay: step >= 1 ? '400ms' : '0ms',
                                    zIndex: 50
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
                                    transform: step >= 1 && step < 4 ? 'translateX(0) translateY(-20px) scale(2.0)' : 'translateX(-200px) translateY(-20px) scale(1.0)',
                                    opacity: step >= 4 ? 0 : 1,
                                    transition: 'all 1200ms ease-out',
                                    transitionDelay: step >= 1 ? '800ms' : '0ms',
                                    zIndex: 50
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

                                {/* Letter - Full size, then folds, then inserts */}
                                <div
                                  className="absolute"
                                  style={{
                                    // Position: start left, move to center, then into envelope
                                    transform: step === 2
                                      ? 'translateX(-50px) translateY(0px) scale(2.8)' // Show full size - much larger and centered
                                      : step >= 3 && step < 4
                                      ? 'translateX(0) translateY(-30px) scale(2.0, 0.66)' // Folded and inserted
                                      : 'translateX(-200px) translateY(-30px) scale(1.0)', // Hidden to left
                                    opacity: step >= 4 ? 0 : (step >= 1 ? 1 : 0),
                                    transition: 'all 1200ms ease-out',
                                    transformOrigin: 'center center',
                                    zIndex: 50
                                  } as React.CSSProperties}
                                >
                                  <LetterReply
                                    folded={step >= 3}
                                    onClick={() =>
                                      setPreviewModal({ isOpen: true, type: 'letter', idx: 0 })
                                    }
                                  />
                                </div>
                              </div>
                            </Envelope>

                            {/* SEALED indicator with mint green success state - overlays at bottom */}
                            {step >= 4 && (
                              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 text-base font-semibold px-8 py-3 rounded-full ring-2 ring-emerald-300 shadow-lg z-50">
                                SEALED
                              </div>
                            )}
                          </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                      {/* Play/Reset Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={playSequence}
                          disabled={isPlaying}
                          className="flex items-center gap-2 rounded-2xl bg-slate-600/30 px-8 py-3 text-base font-medium text-slate-200 hover:bg-slate-600/40 transition ring-1 ring-slate-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Play className="h-5 w-5" />
                          {isPlaying ? 'Playing...' : 'Play Sequence'}
                        </button>
                        <button
                          onClick={resetSequence}
                          disabled={isPlaying}
                          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw className="h-5 w-5" />
                          Reset
                        </button>
                      </div>

                      {/* Step Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {steps.map((s, i) => (
                          <button
                            key={s.key}
                            onClick={() => !isPlaying && setStep(i)}
                            disabled={isPlaying}
                            className={`rounded-full px-5 py-3 text-base transition ${
                              i === step
                                ? 'bg-slate-600/30 text-slate-200 ring-1 ring-slate-500/40'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {i + 1}. {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Progress Dots */}
                      <div className="flex items-center gap-2">
                        {steps.map((_, i) => (
                          <SequenceDot key={i} active={i <= step} />
                        ))}
                      </div>

                      <p className="text-base text-white/50">
                        Click steps to preview the inserting animation. Watch as pieces slide from the queue into the envelope, then seal when complete.
                      </p>
                    </div>
                  </Card>

                  {/* Static Proof Gallery */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">
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
                            <p className="text-sm text-white/40 truncate">
                              {sample.address.split('\n')[0]}
                            </p>
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
                </div>
              </div>
            )}
          </div>
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

      {/* File Viewer Modal */}
      {fileViewer && (
        <FileViewerModal
          isOpen={fileViewer.isOpen}
          onClose={handleCloseFileViewer}
          fileId={fileViewer.fileId}
          fileName={fileViewer.fileName}
        />
      )}
    </>
  );
}
