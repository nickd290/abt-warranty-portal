import { useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CampaignModal } from '../components/campaigns/CampaignModal';
import { NewCampaignModal } from '../components/campaigns/NewCampaignModal';
import { Plus, Package } from 'lucide-react';
import type { Job } from '../types';

export function Campaigns() {
  const jobs = useJobStore((state) => state.jobs);
  const [selectedCampaign, setSelectedCampaign] = useState<Job | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  const handleCreateCampaign = () => {
    setShowNewCampaignModal(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-lg text-white/60">
            Manage your warranty mailer campaigns
          </p>
        </div>
        <button
          onClick={handleCreateCampaign}
          className="flex items-center gap-2 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="col-span-3 text-sm font-semibold text-white/50 uppercase tracking-wider">
            Campaign
          </div>
          <div className="col-span-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
            Status
          </div>
          <div className="col-span-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
            Created
          </div>
          <div className="col-span-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
            Approved
          </div>
          <div className="col-span-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
            Mailed
          </div>
          <div className="col-span-1 text-sm font-semibold text-white/50 uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedCampaign(job)}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition cursor-pointer group"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-sky-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-medium text-white truncate">
                    {job.campaignName}
                  </p>
                  <p className="text-sm text-white/50">
                    {job.month} {job.year}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <StatusBadge status={job.status} />
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-base text-white/70">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-base text-white/70">
                  {job.approvedAt
                    ? new Date(job.approvedAt).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-base text-white/70">
                  {job.mailedAt ? new Date(job.mailedAt).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCampaign(job);
                  }}
                  className="text-sm text-sky-400 hover:text-sky-300 opacity-0 group-hover:opacity-100 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-lg text-white/50">No campaigns yet</p>
            <p className="text-base text-white/30 mt-1">
              Create your first campaign to get started
            </p>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {/* New Campaign Modal */}
      <NewCampaignModal
        isOpen={showNewCampaignModal}
        onClose={() => setShowNewCampaignModal(false)}
      />
    </div>
  );
}
