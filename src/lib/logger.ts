// src/lib/logger.ts
// Centralized logging utility for development

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, data || '');
    }
  },

  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, error || '');
  },

  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
};
