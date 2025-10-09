import { useNavigate, useParams } from 'react-router-dom';
import { Download, Printer, CheckCircle, Clock } from 'lucide-react';
import { useJobStore } from '../store/useJobStore';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';

export function Invoicing() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const getJobById = useJobStore((state) => state.getJobById);
  const jobs = useJobStore((state) => state.jobs);

  const job = jobId ? getJobById(jobId) : null;

  const displayJobs = jobId && job
    ? [job]
    : jobs.filter((j) =>
        ['approved', 'printing', 'invoiced', 'complete'].includes(j.status)
      );

  const calculateInvoice = (mailCount = 5000, ratePerPiece = 0.75) => {
    const subtotal = mailCount * ratePerPiece;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleDownloadInvoice = (jobId: string) => {
    alert(`Downloading invoice for job ${jobId}`);
  };

  if (jobId && !job) {
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
      <div className="pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          {jobId ? 'Invoice Details' : 'Invoices'}
        </h1>
        <p className="mt-2 text-white/60">
          {jobId && job
            ? `${job.campaignName} • ${job.month} ${job.year}`
            : 'View and manage job invoices'}
        </p>
      </div>

      <div className="space-y-6">
        {displayJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-white/70">No invoices available yet</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-sky-400 hover:text-sky-300"
            >
              Return to Dashboard
            </button>
          </Card>
        ) : (
          displayJobs.map((displayJob) => {
            const mailCount = displayJob.mailCount || 5000;
            const ratePerPiece = displayJob.ratePerPiece || 0.75;
            const invoice = calculateInvoice(mailCount, ratePerPiece);

            return (
              <Card key={displayJob.id} className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {displayJob.campaignName}
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      {displayJob.month} {displayJob.year}
                    </p>
                  </div>
                  <Chip
                    tone={
                      displayJob.status === 'complete'
                        ? 'good'
                        : displayJob.status === 'invoiced'
                        ? 'warn'
                        : 'muted'
                    }
                  >
                    {displayJob.status}
                  </Chip>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Print Status */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4">
                      Print Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-white/70">
                          Files approved for printing
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {displayJob.status === 'complete' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-400" />
                        )}
                        <span className="text-sm text-white/70">
                          {displayJob.status === 'complete'
                            ? 'Printing completed'
                            : 'Printing in progress'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {displayJob.status === 'complete' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-white/20" />
                        )}
                        <span className="text-sm text-white/70">
                          {displayJob.status === 'complete'
                            ? 'Mailed to recipients'
                            : 'Awaiting mail delivery'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4">
                      Invoice Breakdown
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Mail Count</span>
                        <span className="text-white font-medium">
                          {mailCount.toLocaleString()} pieces
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Rate per Piece</span>
                        <span className="text-white font-medium">
                          ${ratePerPiece.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                        <span className="text-white/60">Subtotal</span>
                        <span className="text-white font-medium">
                          ${invoice.subtotal.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Tax (8%)</span>
                        <span className="text-white font-medium">
                          ${invoice.tax.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                        <span className="text-white">Total</span>
                        <span className="text-sky-400">
                          ${invoice.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleDownloadInvoice(displayJob.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-sky-500/20 px-4 py-2.5 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30"
                  >
                    <Printer className="h-4 w-4" />
                    Print Invoice
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
