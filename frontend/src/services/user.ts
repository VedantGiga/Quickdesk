import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put('/profile', data);
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async updateSettings(settings: any) {
    const response = await api.put('/settings', settings);
    return response.data;
  }
};