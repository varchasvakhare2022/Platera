/**
 * Input sanitization utilities
 * Prevents XSS attacks by sanitizing user-generated content
 * Using simple regex-based approach to avoid ES module issues on Vercel
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML/JavaScript while preserving safe formatting
 */
export function sanitizeHtml(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    // Remove script tags and their content
    let clean = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onerror, etc.)
    clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    clean = clean.replace(/javascript:/gi, '');

    // Only allow specific safe tags
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
    const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

    clean = clean.replace(tagRegex, (match, tag) => {
        if (allowedTags.includes(tag.toLowerCase())) {
            return match;
        }
        return '';
    });

    return clean;
}

/**
 * Sanitize plain text (removes all HTML)
 * Use for fields that should never contain HTML
 */
export function sanitizeText(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    // Remove all HTML tags
    let clean = dirty.replace(/<[^>]*>/g, '');

    // Remove script tags and their content
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Decode HTML entities
    clean = clean
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');

    return clean.trim();
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
