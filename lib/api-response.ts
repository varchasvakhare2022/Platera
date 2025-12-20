/**
 * Standardized API response utilities
 * Provides consistent response format across all API endpoints
 */

import { NextResponse } from 'next/server';

/**
 * Standard success response
 */
export function apiSuccess<T>(data: T, status: number = 200) {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status }
    );
}

/**
 * Standard error response
 */
export function apiError(message: string, status: number = 400, code?: string) {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                code,
            },
        },
        { status }
    );
}

/**
 * Validation error response
 */
export function validationError(message: string, fields?: Record<string, string>) {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                code: 'VALIDATION_ERROR',
                fields,
            },
        },
        { status: 400 }
    );
}

/**
 * Unauthorized error
 */
export function unauthorized(message: string = 'Unauthorized') {
    return apiError(message, 401, 'UNAUTHORIZED');
}

/**
 * Not found error
 */
export function notFound(message: string = 'Resource not found') {
    return apiError(message, 404, 'NOT_FOUND');
}

/**
 * Internal server error
 */
export function serverError(message: string = 'Internal server error') {
    return apiError(message, 500, 'INTERNAL_ERROR');
}
