import apiClient from '@/lib/api';

export interface ProgressReportComment {
  id: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  trainer: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

// Типы данных
export interface ProgressReport {
  id: number;
  date: Date;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  photoUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: number;
    username: string;
    email: string;
  };
  comments?: ProgressReportComment[];
}

export interface CreateProgressReportRequest {
  date: Date;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  photoUrls?: string[];
}

export interface UpdateProgressReportRequest {
  date?: Date;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  photoUrls?: string[];
}

export interface CreateProgressReportCommentRequest {
  comment: string;
}

// Сервис для работы с отчетами о прогрессе
export const progressReportService = {
  // Создание нового отчета о прогрессе
  createProgressReport: async (reportData: CreateProgressReportRequest): Promise<ProgressReport> => {
    try {
      const response = await apiClient.post('/progress-reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating progress report:', error);
      throw error;
    }
  },

  // Получение всех отчетов о прогрессе для текущего клиента
  getAllProgressReports: async (): Promise<ProgressReport[]> => {
    try {
      const response = await apiClient.get('/progress-reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress reports:', error);
      throw error;
    }
  },

  getTrainerClientProgressReports: async (clientId: number): Promise<ProgressReport[]> => {
    try {
      const response = await apiClient.get(`/progress-reports/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress reports for trainer client ${clientId}:`, error);
      throw error;
    }
  },

  // Получение конкретного отчета о прогрессе
  getProgressReportById: async (id: number): Promise<ProgressReport> => {
    try {
      const response = await apiClient.get(`/progress-reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress report:', error);
      throw error;
    }
  },

  getProgressReportComments: async (id: number): Promise<ProgressReportComment[]> => {
    try {
      const response = await apiClient.get(`/progress-reports/${id}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for report ${id}:`, error);
      throw error;
    }
  },

  addProgressReportComment: async (
    id: number,
    payload: CreateProgressReportCommentRequest,
  ): Promise<ProgressReportComment> => {
    try {
      const response = await apiClient.post(`/progress-reports/${id}/comments`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to report ${id}:`, error);
      throw error;
    }
  },

  // Обновление отчета о прогрессе
  updateProgressReport: async (id: number, reportData: UpdateProgressReportRequest): Promise<ProgressReport> => {
    try {
      const response = await apiClient.put(`/progress-reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error updating progress report:', error);
      throw error;
    }
  },

  // Удаление отчета о прогрессе
  deleteProgressReport: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/progress-reports/${id}`);
    } catch (error) {
      console.error('Error deleting progress report:', error);
      throw error;
    }
  },
};
