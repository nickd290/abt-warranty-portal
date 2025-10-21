import axios, { type AxiosInstance } from 'axios';
import { transformJob, transformJobs } from '../utils/transformJob';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async register(userData: { email: string; password: string; name: string }) {
    const { data } = await this.client.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async getMe() {
    const { data } = await this.client.get('/auth/me');
    return data.user;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Jobs
  async getJobs() {
    const { data } = await this.client.get('/jobs');
    return transformJobs(data.jobs);
  }

  async getJob(id: string) {
    const { data } = await this.client.get(`/jobs/${id}`);
    return transformJob(data.job);
  }

  async createJob(jobData: { month: string; year: number; campaignName: string }) {
    const { data } = await this.client.post('/jobs', jobData);
    return transformJob(data.job);
  }

  async updateJob(id: string, updates: any) {
    const { data } = await this.client.patch(`/jobs/${id}`, updates);
    return transformJob(data.job);
  }

  async deleteJob(id: string) {
    await this.client.delete(`/jobs/${id}`);
  }

  async addProofEvent(jobId: string, event: { action: string; notes?: string }) {
    const { data } = await this.client.post(`/jobs/${jobId}/proof-events`, event);
    return data.proofEvent;
  }

  // Files
  async uploadFile(jobId: string, fileType: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);
    formData.append('fileType', fileType);

    const { data } = await this.client.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.file;
  }

  async getJobFiles(jobId: string) {
    const { data } = await this.client.get(`/files/job/${jobId}`);
    return data.files;
  }

  async downloadFile(fileId: string) {
    const response = await this.client.get(`/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteFile(fileId: string) {
    await this.client.delete(`/files/${fileId}`);
  }

  // SFTP Credentials
  async getSftpCredentials() {
    const { data } = await this.client.get('/sftp/credentials');
    return data.credentials;
  }

  async createSftpCredential(credData: { username: string; password: string }) {
    const { data } = await this.client.post('/sftp/credentials', credData);
    return data.credential;
  }

  async updateSftpCredential(id: string, updates: { password?: string; active?: boolean }) {
    const { data } = await this.client.patch(`/sftp/credentials/${id}`, updates);
    return data.credential;
  }

  async deleteSftpCredential(id: string) {
    await this.client.delete(`/sftp/credentials/${id}`);
  }
}

export const api = new ApiService();
