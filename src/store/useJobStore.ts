import { create } from 'zustand';
import type { Job, JobStatus, UploadedFile } from '../types';
import { mockJobs } from '../utils/mockData';

interface JobStore {
  jobs: Job[];
  currentJob: Job | null;
  setCurrentJob: (job: Job | null) => void;
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  uploadFile: (jobId: string, field: keyof Job, file: UploadedFile) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  getJobById: (id: string) => Job | undefined;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: mockJobs,
  currentJob: null,

  setCurrentJob: (job) => set({ currentJob: job }),

  createJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ jobs: [...state.jobs, newJob] }));
  },

  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
      ),
      currentJob:
        state.currentJob?.id === id
          ? { ...state.currentJob, ...updates, updatedAt: new Date() }
          : state.currentJob,
    }));
  },

  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
      currentJob: state.currentJob?.id === id ? null : state.currentJob,
    }));
  },

  uploadFile: (jobId, field, file) => {
    get().updateJob(jobId, { [field]: file });
  },

  updateJobStatus: (id, status) => {
    get().updateJob(id, { status });
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id);
  },
}));
