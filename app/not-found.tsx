'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8"
            >
                {/* Icon */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
                    <div className="relative w-full h-full bg-stone-900 rounded-full flex items-center justify-center border border-stone-800 shadow-xl">
                        <FileQuestion className="w-10 h-10 text-amber-500" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-stone-400 text-lg leading-relaxed">
                        The page you are looking for doesn't exist or has been moved. Try checking the URL you entered.
                    </p>
                </div>

                {/* Action Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl transition-colors shadow-lg shadow-amber-900/20"
                    >
                        <Home className="w-4 h-4" />
                        Return to Homepage
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
