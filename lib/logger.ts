/**
 * Error logging utility
 * Provides consistent error logging across the application
 * In production, this can be extended to send errors to a service like Sentry
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
    userId?: string;
    action?: string;
    metadata?: Record<string, unknown>;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Log an error with context
     */
    error(message: string, error?: unknown, context?: LogContext) {
        const errorDetails = this.formatError(error);

        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, {
                error: errorDetails,
                ...context,
                timestamp: new Date().toISOString(),
            });
        } else {
            // In production, send to error tracking service
            // For now, just log to console
            console.error(`[ERROR] ${message}`, errorDetails);

            // TODO: Send to Sentry or similar service
            // Sentry.captureException(error, { contexts: { custom: context } });
        }
    }

    /**
     * Log a warning
     */
    warn(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, context);
        }
    }

    /**
     * Log info (development only)
     */
    info(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, context);
        }
    }

    /**
     * Log debug info (development only)
     */
    debug(message: string, data?: unknown) {
        if (this.isDevelopment) {
            console.log(`[DEBUG] ${message}`, data);
        }
    }

    /**
     * Format error for logging
     */
    private formatError(error: unknown): Record<string, unknown> {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }

        if (typeof error === 'object' && error !== null) {
            return error as Record<string, unknown>;
        }

        return { value: String(error) };
    }
}

// Export singleton instance
export const logger = new Logger();
