import { useState, useMemo } from 'react';
import { X, FileText, Eye, Info, Check, Calendar, Package, Play, RotateCcw } from 'lucide-react';
import type { Job } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Card } from '../ui/Card';
import { PreviewModal } from '../ui/PreviewModal';
import { FilePreview, FullFilePreview } from '../ui/FilePreview';
import { SequenceDot } from '../ui/ProofingVisuals';

interface CampaignModalProps {
  campaign: Job;
  onClose: () => void;
}

// Mock sample letters
const mockSamples = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Sample ${i + 1}`,
  recipient: `John Doe ${i + 1}`,
  address: `${1234 + i} Main St, Chicago, IL 60601`,
}));

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

  const steps = useMemo(
    () => [
      { key: 'start', label: 'Start Position' },
      { key: 'bs1', label: 'Add Buckslip 1' },
      { key: 'bs2', label: 'Add Buckslip 2' },
      { key: 'bs3', label: 'Add Buckslip 3' },
      { key: 'letter', label: 'Add Letter Reply' },
      { key: 'zoom', label: 'Prepare Envelope' },
      { key: 'insert1', label: 'Insert Buckslip 1' },
      { key: 'insert2', label: 'Insert Buckslip 2' },
      { key: 'insert3', label: 'Insert Buckslip 3' },
      { key: 'insert4', label: 'Insert Letter Reply' },
      { key: 'flip', label: 'Flip & Open Envelope' },
      { key: 'extract1', label: 'Extract Letter Reply' },
      { key: 'extract2', label: 'Extract Buckslip 3' },
      { key: 'extract3', label: 'Extract Buckslip 2' },
      { key: 'extract4', label: 'Extract Buckslip 1' },
      { key: 'complete', label: 'Ready to Mail' },
    ],
    []
  );

  const playSequence = () => {
    setIsPlaying(true);
    setStep(0);

    const timeline = [
      { step: 0, delay: 0 },      // Start
      { step: 1, delay: 600 },    // Add Buckslip 1
      { step: 2, delay: 1200 },   // Add Buckslip 2
      { step: 3, delay: 1800 },   // Add Buckslip 3
      { step: 4, delay: 2400 },   // Add Letter
      { step: 5, delay: 3200 },   // Zoom envelope, prepare
      { step: 6, delay: 4200 },   // Insert Buckslip 1
      { step: 7, delay: 5200 },   // Insert Buckslip 2
      { step: 8, delay: 6200 },   // Insert Buckslip 3
      { step: 9, delay: 7200 },   // Insert Letter
      { step: 10, delay: 8400 },  // Flip & Open envelope
      { step: 11, delay: 9600 },  // Extract Letter (first out)
      { step: 12, delay: 10600 }, // Extract Buckslip 3
      { step: 13, delay: 11600 }, // Extract Buckslip 2
      { step: 14, delay: 12600 }, // Extract Buckslip 1
      { step: 15, delay: 14000 }, // Complete/Ready
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
                <div className="flex items-center gap-4 text-sm text-white/60">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
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
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Campaign Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50 mb-1">Status</p>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Period</p>
                      <p className="text-sm text-white">
                        {campaign.month} {campaign.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Created</p>
                      <p className="text-sm text-white">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Last Updated</p>
                      <p className="text-sm text-white">
                        {new Date(campaign.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
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
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <p className="text-xs text-white/50 mb-1">{item.label}</p>
                        {item.file ? (
                          <p className="text-sm text-white truncate">
                            {item.file.name}
                          </p>
                        ) : (
                          <p className="text-sm text-white/30 italic">Not uploaded</p>
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
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Mail Piece Specifications
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-white/50 mb-2">Buckslips</p>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-xs text-white/40 mt-1">8.5" � 3.5"</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-white/50 mb-2">Letter Reply</p>
                        <p className="text-2xl font-bold text-white">1</p>
                        <p className="text-xs text-white/40 mt-1">8.5" � 11"</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-white/50 mb-2">Outer Envelope</p>
                        <p className="text-2xl font-bold text-white">1</p>
                        <p className="text-xs text-white/40 mt-1">#10 Envelope</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Production Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/50 mb-1">Mail Count</p>
                      <p className="text-sm text-white">
                        {campaign.mailCount?.toLocaleString() || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Rate Per Piece</p>
                      <p className="text-sm text-white">
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
                        <p className="text-xs text-white/50 mt-1">
                          {sample.recipient}
                        </p>
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
                          Interactive Mail Assembly Sequence
                        </h2>
                        <p className="text-white/60 mt-1">
                          Step {step + 1} of {steps.length}: {steps[step].label}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          {step === 0 && 'Starting position - all items ready for assembly'}
                          {step === 1 && 'First buckslip added to stack'}
                          {step === 2 && 'Second buckslip added to stack'}
                          {step === 3 && 'Third buckslip added to stack'}
                          {step === 4 && 'Letter reply added - stack complete'}
                          {step === 5 && 'Envelope zooming to center, preparing for insertion'}
                          {step === 6 && 'Inserting first buckslip - visible through transparent envelope'}
                          {step === 7 && 'Inserting second buckslip - stacking behind first'}
                          {step === 8 && 'Inserting third buckslip - building the stack'}
                          {step === 9 && 'Inserting letter reply - completing the package'}
                          {step === 10 && 'Flipping envelope around and opening the flap'}
                          {step === 11 && 'Extracting letter reply - first item out'}
                          {step === 12 && 'Extracting buckslip 3 - second item out'}
                          {step === 13 && 'Extracting buckslip 2 - third item out'}
                          {step === 14 && 'Extracting buckslip 1 - last item verified'}
                          {step === 15 && 'All contents verified - ready to seal and mail'}
                        </p>
                      </div>
                    </div>

                    {/* Visual Sequence */}
                    <div className="relative h-[600px] rounded-3xl bg-black/20 ring-1 ring-white/10 overflow-visible mb-6">
                      <div className="absolute inset-0 bg-[radial-gradient(700px_200px_at_50%_110%,rgba(56,189,248,0.12),transparent_60%)]" />

                      {/* Cartoon Hand - appears during insertion steps */}
                      {step >= 6 && step <= 9 && (
                        <div className="absolute left-1/2 top-[50px] -translate-x-1/2 transition-all duration-500 ease-out" style={{ zIndex: 200 }}>
                          <div className="animate-bounce">
                            <div className="text-5xl filter drop-shadow-lg">👇</div>
                          </div>
                        </div>
                      )}

                      {/* Cartoon Hand - appears during extraction steps */}
                      {step >= 11 && step <= 14 && (
                        <div className="absolute left-1/2 top-[80px] -translate-x-1/2 transition-all duration-500" style={{ zIndex: 200 }}>
                          <div className="animate-bounce">
                            <div className="text-5xl filter drop-shadow-lg">👆</div>
                          </div>
                        </div>
                      )}

                      {/* Action words - cartoon style - top center */}
                      {step >= 1 && step <= 4 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 animate-in zoom-in duration-300">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg px-5 py-2 rounded-full shadow-2xl border-3 border-white">
                            STACKING 📚
                          </div>
                        </div>
                      )}

                      {step >= 6 && step <= 9 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 animate-in zoom-in duration-300">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-lg px-5 py-2 rounded-full shadow-2xl border-3 border-white animate-pulse">
                            INSERTING ✉️
                          </div>
                        </div>
                      )}

                      {step >= 11 && step <= 14 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 animate-in zoom-in duration-300">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg px-5 py-2 rounded-full shadow-2xl border-3 border-white animate-pulse">
                            VERIFYING 🔍
                          </div>
                        </div>
                      )}

                      {/* ENVELOPE - center stage with proper zoom */}
                      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out ${
                        step < 5 ? 'scale-[0.6] translate-x-[200px]' :
                        step >= 5 && step < 10 ? 'scale-[2.5]' :
                        step >= 10 && step < 15 ? 'scale-[2.5] rotate-y-180' :
                        'scale-[0.6] translate-x-[200px]'
                      }`} style={{ zIndex: step >= 5 && step < 15 ? 100 : 10, transformStyle: 'preserve-3d' }}>
                        <div className="relative w-[180px] h-[78px]" style={{ transformStyle: 'preserve-3d' }}>
                          {/* FRONT OF ENVELOPE */}
                          <div style={{ backfaceVisibility: 'hidden' }}>
                            <FilePreview
                              fileName="ABT-No10"
                              className={`w-[180px] h-[78px] rounded-xl shadow-2xl transition-all duration-1000 ring-2 ring-white/10 ${
                                step >= 6 && step <= 9 ? 'opacity-30' : 'opacity-100'
                              } ${
                                step >= 5 && step <= 9 ? 'ring-sky-400/60 shadow-sky-400/20' : ''
                              } ${
                                step >= 15 ? 'ring-emerald-400/60 shadow-emerald-400/20' : ''
                              }`}
                              onClick={() =>
                                setPreviewModal({
                                  isOpen: true,
                                  type: 'envelope',
                                  idx: 0,
                                })
                              }
                            />

                            {/* Items dropping into envelope */}
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                              <div className={`absolute transition-all duration-700 ease-out ${
                                step === 6 ? '-top-40 opacity-0 scale-150 rotate-12' :
                                step > 6 && step < 10 ? 'top-[15px] opacity-100 scale-100 rotate-0' :
                                '-top-40 opacity-0'
                              }`} style={{ zIndex: 54 }}>
                                <FilePreview fileName="ABT-8.5x3.5-1" className="w-[140px] h-[58px] rounded-sm shadow-2xl" />
                              </div>
                              <div className={`absolute transition-all duration-700 ease-out ${
                                step === 7 ? '-top-40 opacity-0 scale-150 rotate-12' :
                                step > 7 && step < 10 ? 'top-[16px] opacity-0 scale-100 rotate-0' :
                                '-top-40 opacity-0'
                              }`} style={{ zIndex: 53 }}>
                                <FilePreview fileName="ABT-8.5x3.5-2" className="w-[140px] h-[58px] rounded-sm shadow-2xl" />
                              </div>
                              <div className={`absolute transition-all duration-700 ease-out ${
                                step === 8 ? '-top-40 opacity-0 scale-150 rotate-12' :
                                step > 8 && step < 10 ? 'top-[17px] opacity-0 scale-100 rotate-0' :
                                '-top-40 opacity-0'
                              }`} style={{ zIndex: 52 }}>
                                <FilePreview fileName="ABT-8.5x3.5-3" className="w-[140px] h-[58px] rounded-sm shadow-2xl" />
                              </div>
                              <div className={`absolute transition-all duration-700 ease-out ${
                                step === 9 ? '-top-40 opacity-0 scale-150 rotate-12' :
                                step > 9 && step < 10 ? 'top-[18px] opacity-0 scale-100 rotate-0' :
                                '-top-40 opacity-0'
                              }`} style={{ zIndex: 51 }}>
                                <FilePreview fileName="ABT-8.5x14" className="w-[55px] h-[90px] rounded-sm shadow-2xl" />
                              </div>
                            </div>
                          </div>

                          {/* BACK OF ENVELOPE (visible when flipped) */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-2xl"
                            style={{
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)'
                            }}
                          >
                            {/* Animated flap opening */}
                            <div className={`absolute top-0 left-0 right-0 h-[35px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-xl transition-all duration-1000 origin-top ${
                              step >= 10 ? '-rotate-[25deg] translate-y-[-12px] shadow-lg' : ''
                            }`} style={{ borderBottom: '3px solid rgba(0,0,0,0.15)' }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[8px] text-slate-400 font-bold">FLAP</span>
                              </div>
                            </div>

                            {step >= 10 && step < 15 && (
                              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
                                <div className="bg-orange-500/90 rounded-lg px-3 py-1.5 animate-pulse" style={{ transform: 'scaleX(-1)' }}>
                                  <span className="text-xs font-bold text-white">OPENING ENVELOPE</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Ready indicator */}
                          {step >= 15 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 rounded-xl ring-4 ring-emerald-400/60 backdrop-blur-sm animate-in fade-in zoom-in duration-700">
                              <div className="flex flex-col items-center gap-1">
                                <Check className="h-8 w-8 text-emerald-400 animate-bounce" />
                                <span className="text-sm font-bold text-emerald-300">SEALED</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MAIL PIECES - bouncy stack on left */}
                      <div className="absolute left-16 top-[120px]">
                        {/* Buckslip 1 */}
                        <div
                          className={`absolute transition-all ${
                            step === 1 || step === 6 ? 'duration-500' : 'duration-700'
                          } ${
                            step === 1 || step === 6 ? 'ease-bounce' : 'ease-out'
                          } ${
                            step === 0 ? 'translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 1 ? 'translate-x-0 translate-y-0 opacity-100 scale-110 -rotate-2 drop-shadow-2xl' : ''
                          } ${
                            step > 1 && step < 5 ? 'translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 5 ? 'translate-x-[800px] -translate-y-[30px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 6 ? 'translate-x-[800px] -translate-y-[30px] opacity-100 scale-[1.15] rotate-[-5deg] ring-4 ring-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.6)]' : ''
                          } ${
                            step > 6 && step < 11 ? 'translate-x-[800px] -translate-y-[30px] opacity-20 scale-100' : ''
                          } ${
                            step >= 11 && step < 15 ? 'translate-x-0 translate-y-0 opacity-0' : ''
                          } ${
                            step === 15 ? 'translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0' : ''
                          }`}
                          style={{ zIndex: 20 }}
                        >
                          <FilePreview
                            fileName="ABT-8.5x3.5-1"
                            className="w-[180px] h-[74px] rounded-lg shadow-xl ring-2 ring-white/10"
                            onClick={() =>
                              setPreviewModal({
                                isOpen: true,
                                type: 'buckslip',
                                idx: 0,
                              })
                            }
                          />
                          {step === 6 && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-sky-500 rounded-full px-4 py-2 whitespace-nowrap animate-bounce shadow-xl">
                              <span className="text-sm font-bold text-white">⬇ INSERT 1</span>
                            </div>
                          )}
                        </div>

                        {/* Buckslip 2 */}
                        <div
                          className={`absolute transition-all ${
                            step === 2 || step === 7 ? 'duration-500 ease-bounce' : 'duration-700 ease-out'
                          } ${
                            step === 0 || step === 1 ? 'translate-x-0 translate-y-[100px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 2 ? 'translate-x-0 translate-y-[100px] opacity-100 scale-110 rotate-2 drop-shadow-2xl' : ''
                          } ${
                            step > 2 && step < 5 ? 'translate-x-0 translate-y-[100px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 5 ? 'translate-x-[800px] translate-y-[70px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 7 ? 'translate-x-[800px] translate-y-[70px] opacity-100 scale-[1.15] rotate-[5deg] ring-4 ring-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.6)]' : ''
                          } ${
                            step > 7 && step < 12 ? 'translate-x-[800px] translate-y-[70px] opacity-20 scale-100' : ''
                          } ${
                            step >= 12 && step < 15 ? 'translate-x-0 translate-y-[100px] opacity-0' : ''
                          } ${
                            step === 15 ? 'translate-x-0 translate-y-[100px] opacity-100 scale-100 rotate-0' : ''
                          }`}
                          style={{ zIndex: 21 }}
                        >
                          <FilePreview
                            fileName="ABT-8.5x3.5-2"
                            className="w-[180px] h-[74px] rounded-lg shadow-xl ring-2 ring-white/10"
                            onClick={() =>
                              setPreviewModal({
                                isOpen: true,
                                type: 'buckslip',
                                idx: 1,
                              })
                            }
                          />
                          {step === 7 && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-sky-500 rounded-full px-4 py-2 whitespace-nowrap animate-bounce shadow-xl">
                              <span className="text-sm font-bold text-white">⬇ INSERT 2</span>
                            </div>
                          )}
                        </div>

                        {/* Buckslip 3 */}
                        <div
                          className={`absolute transition-all ${
                            step === 3 || step === 8 ? 'duration-500 ease-bounce' : 'duration-700 ease-out'
                          } ${
                            step >= 0 && step < 3 ? 'translate-x-0 translate-y-[200px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 3 ? 'translate-x-0 translate-y-[200px] opacity-100 scale-110 -rotate-3 drop-shadow-2xl' : ''
                          } ${
                            step > 3 && step < 5 ? 'translate-x-0 translate-y-[200px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 5 ? 'translate-x-[800px] translate-y-[170px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 8 ? 'translate-x-[800px] translate-y-[170px] opacity-100 scale-[1.15] rotate-[-5deg] ring-4 ring-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.6)]' : ''
                          } ${
                            step > 8 && step < 13 ? 'translate-x-[800px] translate-y-[170px] opacity-20 scale-100' : ''
                          } ${
                            step >= 13 && step < 15 ? 'translate-x-0 translate-y-[200px] opacity-0' : ''
                          } ${
                            step === 15 ? 'translate-x-0 translate-y-[200px] opacity-100 scale-100 rotate-0' : ''
                          }`}
                          style={{ zIndex: 22 }}
                        >
                          <FilePreview
                            fileName="ABT-8.5x3.5-3"
                            className="w-[180px] h-[74px] rounded-lg shadow-xl ring-2 ring-white/10"
                            onClick={() =>
                              setPreviewModal({
                                isOpen: true,
                                type: 'buckslip',
                                idx: 2,
                              })
                            }
                          />
                          {step === 8 && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-sky-500 rounded-full px-4 py-2 whitespace-nowrap animate-bounce shadow-xl">
                              <span className="text-sm font-bold text-white">⬇ INSERT 3</span>
                            </div>
                          )}
                        </div>

                        {/* Letter Reply */}
                        <div
                          className={`absolute transition-all ${
                            step === 4 || step === 9 ? 'duration-500 ease-bounce' : 'duration-700 ease-out'
                          } ${
                            step >= 0 && step < 4 ? 'translate-x-0 translate-y-[310px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 4 ? 'translate-x-0 translate-y-[310px] opacity-100 scale-110 rotate-3 drop-shadow-2xl' : ''
                          } ${
                            step > 4 && step < 5 ? 'translate-x-0 translate-y-[310px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 5 ? 'translate-x-[800px] translate-y-[280px] opacity-100 scale-100 rotate-0' : ''
                          } ${
                            step === 9 ? 'translate-x-[800px] translate-y-[280px] opacity-100 scale-[1.15] rotate-[8deg] ring-4 ring-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.6)]' : ''
                          } ${
                            step > 9 && step < 14 ? 'translate-x-[800px] translate-y-[280px] opacity-20 scale-100' : ''
                          } ${
                            step >= 14 && step < 15 ? 'translate-x-0 translate-y-[310px] opacity-0' : ''
                          } ${
                            step === 15 ? 'translate-x-0 translate-y-[310px] opacity-100 scale-100 rotate-0' : ''
                          }`}
                          style={{ zIndex: 23 }}
                        >
                          <FilePreview
                            fileName="ABT-8.5x14"
                            className="w-[72px] h-[118px] rounded-lg shadow-xl ring-2 ring-white/10"
                            onClick={() =>
                              setPreviewModal({
                                isOpen: true,
                                type: 'letter',
                                idx: 0,
                              })
                            }
                          />
                          {step === 9 && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-sky-500 rounded-full px-4 py-2 whitespace-nowrap animate-bounce shadow-xl">
                              <span className="text-sm font-bold text-white">⬇ INSERT 4</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extraction view - items pop out one by one with cartoon bounce */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6" style={{ zIndex: 110 }}>
                        {/* Letter - first out (step 11) */}
                        <div className={`relative transition-all duration-500 ease-bounce ${
                          step >= 11 ? 'translate-y-0 scale-105 rotate-[-2deg] opacity-100' : 'translate-y-[100px] scale-50 rotate-12 opacity-0'
                        }`}>
                          <div className={step === 11 ? 'animate-bounce' : ''}>
                            <FilePreview fileName="ABT-8.5x14" className="w-[60px] h-[99px] rounded-lg shadow-2xl ring-2 ring-orange-400/60" />
                          </div>
                          {step === 11 && (
                            <>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">✨</div>
                              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1.5 animate-pulse shadow-xl border-2 border-white whitespace-nowrap">
                                <span className="text-xs font-black text-white">1st OUT</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Buckslip 3 - second out (step 12) */}
                        <div className={`relative transition-all duration-500 ease-bounce ${
                          step >= 12 ? 'translate-y-0 scale-105 rotate-[2deg] opacity-100' : 'translate-y-[100px] scale-50 rotate-12 opacity-0'
                        }`}>
                          <div className={step === 12 ? 'animate-bounce' : ''}>
                            <FilePreview fileName="ABT-8.5x3.5-3" className="w-[130px] h-[54px] rounded-lg shadow-2xl ring-2 ring-orange-400/60" />
                          </div>
                          {step === 12 && (
                            <>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">💫</div>
                              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1.5 animate-pulse shadow-xl border-2 border-white whitespace-nowrap">
                                <span className="text-xs font-black text-white">2nd OUT</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Buckslip 2 - third out (step 13) */}
                        <div className={`relative transition-all duration-500 ease-bounce ${
                          step >= 13 ? 'translate-y-0 scale-105 rotate-[-2deg] opacity-100' : 'translate-y-[100px] scale-50 rotate-12 opacity-0'
                        }`}>
                          <div className={step === 13 ? 'animate-bounce' : ''}>
                            <FilePreview fileName="ABT-8.5x3.5-2" className="w-[130px] h-[54px] rounded-lg shadow-2xl ring-2 ring-orange-400/60" />
                          </div>
                          {step === 13 && (
                            <>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">⭐</div>
                              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1.5 animate-pulse shadow-xl border-2 border-white whitespace-nowrap">
                                <span className="text-xs font-black text-white">3rd OUT</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Buckslip 1 - last out (step 14) */}
                        <div className={`relative transition-all duration-500 ease-bounce ${
                          step >= 14 ? 'translate-y-0 scale-105 rotate-[2deg] opacity-100' : 'translate-y-[100px] scale-50 rotate-12 opacity-0'
                        }`}>
                          <div className={step === 14 ? 'animate-bounce' : ''}>
                            <FilePreview fileName="ABT-8.5x3.5-1" className="w-[130px] h-[54px] rounded-lg shadow-2xl ring-2 ring-orange-400/60" />
                          </div>
                          {step === 14 && (
                            <>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">🎯</div>
                              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full px-3 py-1.5 animate-pulse shadow-xl border-2 border-white whitespace-nowrap">
                                <span className="text-xs font-black text-white">VERIFIED ✓</span>
                              </div>
                            </>
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
                          className="flex items-center gap-2 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Play className="h-4 w-4" />
                          {isPlaying ? 'Playing...' : 'Play Sequence'}
                        </button>
                        <button
                          onClick={resetSequence}
                          disabled={isPlaying}
                          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw className="h-4 w-4" />
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
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              i === step
                                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
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

                      <p className="text-xs text-white/50">
                        Click "Play Sequence" to watch the complete mail assembly process: items are added one by one, inserted into the envelope, then extracted to show the final contents before sealing.
                      </p>
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
            : 'Outer Envelope Preview'
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
    </>
  );
}
