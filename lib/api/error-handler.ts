// lib/api/error-handler.ts
import { ApiError } from '@/types/api';

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ApiError).message;
  }

  return 'Ha ocurrido un error inesperado';
}

export function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (error && typeof error === 'object' && 'errors' in error) {
    return (error as ApiError).errors;
  }
  return undefined;
}

export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as ApiError).statusCode === 0;
  }
  return false;
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as ApiError).statusCode === 401;
  }
  return false;
}

export function isForbiddenError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as ApiError).statusCode === 403;
  }
  return false;
}

export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as ApiError).statusCode === 404;
  }
  return false;
}
