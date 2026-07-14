import axios from 'axios';
import type { ApiErrorBody } from './types';

function friendlyUploadMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('supabase') || lower.includes('fetch failed')) {
    return 'Document storage is temporarily unavailable. Try again in a moment, or use a smaller photo. If this keeps happening, contact support — the server file storage may need to be fixed.';
  }
  if (lower.includes('r2') || lower.includes('access denied') || lower.includes('s3')) {
    return 'We could not save your document photos — the server storage is not configured correctly (access denied). Please try again later or contact support. Your backend team needs to fix Cloudflare R2 upload permissions.';
  }
  return message;
}

function isGenericServerMessage(message: string): boolean {
  const lower = message.trim().toLowerCase();
  return (
    lower === 'internal server error' ||
    lower === 'internal server error.' ||
    lower === 'something went wrong'
  );
}

function pushMessage(messages: string[], value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    messages.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      pushMessage(messages, item);
    }
  }
}

function extractMessagesFromBody(data: unknown): string[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const body = data as Record<string, unknown>;
  const messages: string[] = [];

  pushMessage(messages, body.message);

  if (typeof body.detail === 'string') {
    pushMessage(messages, body.detail);
  }

  if (Array.isArray(body.details)) {
    for (const detail of body.details) {
      if (typeof detail === 'string') {
        pushMessage(messages, detail);
      } else if (detail && typeof detail === 'object') {
        const entry = detail as Record<string, unknown>;
        const field = typeof entry.field === 'string' ? entry.field : typeof entry.property === 'string' ? entry.property : null;
        pushMessage(messages, entry.message ?? entry.msg ?? entry.error);
        if (field && messages.length > 0) {
          const last = messages[messages.length - 1];
          if (!last.toLowerCase().includes(field.toLowerCase())) {
            messages[messages.length - 1] = `${field}: ${last}`;
          }
        }
      }
    }
  }

  const errors = body.errors;
  if (Array.isArray(errors)) {
    for (const entry of errors) {
      if (typeof entry === 'string') {
        pushMessage(messages, entry);
      } else if (entry && typeof entry === 'object') {
        const record = entry as Record<string, unknown>;
        pushMessage(messages, record.message ?? record.msg ?? record.error);
      }
    }
  } else if (errors && typeof errors === 'object') {
    for (const [field, value] of Object.entries(errors)) {
      if (typeof value === 'string') {
        messages.push(`${field}: ${value}`);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string') {
            messages.push(`${field}: ${item}`);
          }
        }
      }
    }
  }

  return messages;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (error.response?.status === 413) {
      return 'Upload too large. Use smaller photos or retake them closer to the document.';
    }

    if (!error.response) {
      return 'Network error. Check your internet connection and try again.';
    }

    const extracted = extractMessagesFromBody(error.response.data);
    const unique = [...new Set(extracted.filter(Boolean))];

    if (unique.length > 0) {
      const combined = unique.join('\n');
      if (!isGenericServerMessage(combined) || error.response.status < 500) {
        return friendlyUploadMessage(combined);
      }
    }

    const status = error.response.status;
    if (status === 400 || status === 422) {
      return 'Please check your details and try again.';
    }
    if (status === 401) {
      const requestUrl = error.config?.url ?? '';
      if (requestUrl.includes('/auth/login')) {
        return 'Invalid email or password. Please try again.';
      }
      return 'Your session has expired. Please sign in again.';
    }
    if (status === 403) {
      return 'You do not have permission to complete this action.';
    }
    if (status === 409) {
      return 'This record already exists. Sign in or use different details.';
    }
    if (status >= 500) {
      return 'The server had a problem processing your request. Please try again in a moment.';
    }
  }

  if (error instanceof Error && error.message) {
    return friendlyUploadMessage(error.message);
  }

  return fallback;
}

export function isDriverApplyRequiredError(error: unknown): boolean {
  const message = getApiErrorMessage(error).toLowerCase();
  return message.includes('apply first') || message.includes('driver profile not found');
}

export function isValidationError(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  return status === 400 || status === 422;
}
