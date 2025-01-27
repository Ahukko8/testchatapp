export interface ApiError extends Error {
    name: string;
    message: string;
    status?: number;
  }