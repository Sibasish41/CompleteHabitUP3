import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const BASE_URL = '/api';

class BaseApiService {
  constructor(resourcePath) {
    this.instance = axios.create({
      baseURL: `${BASE_URL}/${resourcePath}`,
      withCredentials: true,
    });

    // Add request interceptor for common headers
    this.instance.interceptors.request.use(
      (config) => {
        // Add any common headers here
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          // Clear auth state and redirect to login
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, options = {}) {
    try {
      return await this.instance.get(url, options);
    } catch (error) {
      throw handleApiError(error, options);
    }
  }

  async post(url, data, options = {}) {
    try {
      return await this.instance.post(url, data, options);
    } catch (error) {
      throw handleApiError(error, options);
    }
  }

  async put(url, data, options = {}) {
    try {
      return await this.instance.put(url, data, options);
    } catch (error) {
      throw handleApiError(error, options);
    }
  }

  async delete(url, options = {}) {
    try {
      return await this.instance.delete(url, options);
    } catch (error) {
      throw handleApiError(error, options);
    }
  }

  async upload(url, formData, options = {}) {
    try {
      return await this.instance.post(url, formData, {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...options.headers,
        },
      });
    } catch (error) {
      throw handleApiError(error, options);
    }
  }
}

export default BaseApiService;
