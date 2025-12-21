"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "warning";
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "danger",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl border border-stone-800/50 shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative p-6 pb-4">
                                <button
                                    onClick={onCancel}
                                    className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${variant === "danger"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-orange-500/10 text-orange-500"
                                        }`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        {title}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6">
                                <p className="text-stone-300 leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 pt-0">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${variant === "danger"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-orange-500 hover:bg-orange-600 text-white"
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
