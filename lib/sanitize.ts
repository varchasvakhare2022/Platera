/**
 * Input sanitization utilities
 * Prevents XSS attacks by sanitizing user-generated content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML/JavaScript while preserving safe formatting
 */
export function sanitizeHtml(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize plain text (removes all HTML)
 * Use for fields that should never contain HTML
 */
export function sanitizeText(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize recipe data
 */
export function sanitizeRecipeData(data: {
    title?: string;
    description?: string;
    ingredients?: Array<{ name: string; quantity: string; unit: string }>;
    steps?: string[];
}) {
    return {
        ...data,
        title: data.title ? sanitizeText(data.title) : '',
        description: data.description ? sanitizeHtml(data.description) : '',
        ingredients: data.ingredients?.map(ing => ({
            name: sanitizeText(ing.name),
            quantity: sanitizeText(ing.quantity),
            unit: sanitizeText(ing.unit),
        })),
        steps: data.steps?.map(step => sanitizeText(step)),
    };
}

/**
 * Sanitize review/comment data
 */
export function sanitizeReviewData(data: {
    comment?: string | null;
}) {
    return {
        ...data,
        comment: data.comment ? sanitizeHtml(data.comment) : null,
    };
}
