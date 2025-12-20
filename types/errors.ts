/**
 * Error type definitions for better type safety
 */

// Clerk API error structure
export interface ClerkError {
    errors?: Array<{
        code?: string;
        message?: string;
        longMessage?: string;
        meta?: Record<string, unknown>;
    }>;
    clerkError?: boolean;
    status?: number;
}

// Generic API error
export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
    details?: unknown;
}

// Prisma error
export interface PrismaError extends Error {
    code?: string;
    meta?: {
        target?: string[];
        cause?: string;
    };
}

// Cloudinary error
export interface CloudinaryError extends Error {
    http_code?: number;
    error?: {
        message?: string;
    };
}

// Type guard for Clerk errors
export function isClerkError(error: unknown): error is ClerkError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as ClerkError).errors)
    );
}

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
    return (
        error instanceof Error &&
        'statusCode' in error
    );
}

// Extract error message safely
export function getErrorMessage(error: unknown): string {
    if (isClerkError(error)) {
        return error.errors?.[0]?.longMessage || error.errors?.[0]?.message || 'An error occurred';
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
}
