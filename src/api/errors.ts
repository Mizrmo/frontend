import axios from 'axios';
import type { ApiErrorBody } from './types';

function friendlyUploadMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('supabase') || lower.includes('fetch failed')) {
    return 'Document storage is temporarily unavailable. Try again in a moment, or use a smaller photo. If this keeps happening, contact support — the server file storage may need to be fixed.';
  }
  return message;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (error.response?.status === 413) {
      return 'Upload too large. Use smaller photos or retake them closer to the document.';
    }

    if (!error.response) {
      return 'Network error. Check your internet connection and try again.';
    }

    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return friendlyUploadMessage(message.join(', '));
    }
    if (typeof message === 'string' && message.length > 0) {
      return friendlyUploadMessage(message);
    }
  }

  if (error instanceof Error && error.message) {
    return friendlyUploadMessage(error.message);
  }

  return fallback;
}
