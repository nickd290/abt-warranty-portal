import type { JobStatus } from '../../types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: JobStatus;
}

const statusConfig: Record<
  JobStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-600 text-gray-200' },
  ASSETS_UPLOADED: {
    label: 'Assets Uploaded',
    color: 'bg-blue-600 text-blue-100',
  },
  PROOFING: { label: 'Proofing', color: 'bg-yellow-600 text-yellow-100' },
  APPROVED: { label: 'Approved', color: 'bg-green-600 text-green-100' },
  PRINTING: { label: 'Printing', color: 'bg-purple-600 text-purple-100' },
  INVOICED: { label: 'Invoiced', color: 'bg-accent-cyan text-cyan-100' },
  COMPLETE: { label: 'Complete', color: 'bg-emerald-600 text-emerald-100' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        config.color
      )}
    >
      {config.label}
    </span>
  );
}
