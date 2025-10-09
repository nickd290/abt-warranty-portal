export type JobStatus =
  | 'draft'
  | 'assets-uploaded'
  | 'proofing'
  | 'approved'
  | 'printing'
  | 'invoiced'
  | 'complete';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface Job {
  id: string;
  month: string;
  year: number;
  campaignName: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  mailedAt?: Date;

  // Uploaded assets
  buckslip1?: UploadedFile;
  buckslip2?: UploadedFile;
  buckslip3?: UploadedFile;
  letterReply?: UploadedFile;
  outerEnvelope?: UploadedFile;
  mailList?: UploadedFile;

  // Proofing
  sampleLetters?: string[];
  proofNotes?: string;

  // Invoicing
  mailCount?: number;
  ratePerPiece?: number;
  invoiceUrl?: string;
}

export interface ProofStep {
  step: number;
  title: string;
  description: string;
}
