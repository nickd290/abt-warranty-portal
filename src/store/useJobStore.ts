import { create } from 'zustand';
import type { Job, JobStatus } from '../types';
import { api } from '../services/api';

interface JobStore {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchJobs: () => Promise<void>;
  fetchJob: (id: string) => Promise<void>;
  setCurrentJob: (job: Job | null) => void;
  createJob: (job: { month: string; year: number; campaignName: string }) => Promise<Job>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<void>;
  addProofEvent: (jobId: string, action: string, notes?: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await api.getJobs();
      set({ jobs, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchJob: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const job = await api.getJob(id);
      set({ currentJob: job, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentJob: (job) => set({ currentJob: job }),

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      const newJob = await api.createJob(jobData);
      set((state) => ({
        jobs: [...state.jobs, newJob],
        isLoading: false
      }));
      return newJob;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateJob: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await api.updateJob(id, updates);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? updatedJob : job)),
        currentJob: state.currentJob?.id === id ? updatedJob : state.currentJob,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteJob(id);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        currentJob: state.currentJob?.id === id ? null : state.currentJob,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateJobStatus: async (id, status) => {
    await get().updateJob(id, { status });
  },

  addProofEvent: async (jobId, action, notes) => {
    set({ isLoading: true, error: null });
    try {
      await api.addProofEvent(jobId, { action, notes });
      // Refresh job data
      await get().fetchJob(jobId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id);
  },
}));
