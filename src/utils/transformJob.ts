import type { Job, UploadedFile } from '../types';

interface FileFromBackend {
  id: string;
  jobId: string;
  filename: string;
  originalName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedVia: string;
  uploadedAt: string;
}

interface JobFromBackend extends Omit<Job, 'buckslip1' | 'buckslip2' | 'buckslip3' | 'letterReply' | 'outerEnvelope' | 'mailList'> {
  files?: FileFromBackend[];
}

/**
 * Transforms a job from the backend format (with files array) to the frontend format
 * (with individual file properties like buckslip1, buckslip2, etc.)
 */
export function transformJob(backendJob: JobFromBackend): Job {
  const { files, ...jobData } = backendJob;

  // Initialize file properties
  let buckslip1: UploadedFile | undefined;
  let buckslip2: UploadedFile | undefined;
  let buckslip3: UploadedFile | undefined;
  let letterReply: UploadedFile | undefined;
  let outerEnvelope: UploadedFile | undefined;
  let mailList: UploadedFile | undefined;

  // Map files array to individual properties
  if (files && files.length > 0) {
    files.forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: file.id,
        name: file.originalName,
        url: `/api/files/${file.id}`,
        uploadedAt: new Date(file.uploadedAt),
      };

      switch (file.fileType) {
        case 'BUCKSLIP_1':
          buckslip1 = uploadedFile;
          break;
        case 'BUCKSLIP_2':
          buckslip2 = uploadedFile;
          break;
        case 'BUCKSLIP_3':
          buckslip3 = uploadedFile;
          break;
        case 'LETTER_REPLY':
          letterReply = uploadedFile;
          break;
        case 'OUTER_ENVELOPE':
          outerEnvelope = uploadedFile;
          break;
        case 'MAIL_LIST':
          mailList = uploadedFile;
          break;
      }
    });
  }

  return {
    ...jobData,
    buckslip1,
    buckslip2,
    buckslip3,
    letterReply,
    outerEnvelope,
    mailList,
  } as Job;
}

/**
 * Transforms an array of jobs from backend to frontend format
 */
export function transformJobs(backendJobs: JobFromBackend[]): Job[] {
  return backendJobs.map(transformJob);
}
