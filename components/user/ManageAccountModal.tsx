"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ManageAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ManageAccountModal({ isOpen, onClose }: ManageAccountModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col custom-user-profile">

                            {/* Custom Header for Close Button */}
                            <div className="absolute top-4 right-4 z-50">
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-800/50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Clerk User Profile */}
                            <div className="flex-1 overflow-hidden h-full">
                                <UserProfile
                                    routing="hash"
                                    appearance={{
                                        baseTheme: dark,
                                        elements: {
                                            card: "!bg-transparent !shadow-none !border-0 !w-full !max-w-none",
                                            rootBox: "!w-full !h-full",
                                            scrollBox: "!bg-stone-950 !rounded-r-3xl",
                                            navbar: "!bg-stone-925/50 !backdrop-blur-md !border-r !border-stone-800/40 remove-branding !py-6 !px-3",
                                            navbarButton: "!text-stone-400 hover:!text-stone-200 hover:!bg-white/5 !rounded-lg !px-4 !py-3 !mb-1 !font-medium transition-all duration-200",
                                            activeNavbarButton: "!bg-gradient-to-r !from-amber-500/10 !to-transparent !text-amber-500 !border-l-2 !border-amber-500 !rounded-r-lg !rounded-l-sm",
                                            navbarMobileMenuButton: "!hidden",
                                            headerTitle: "!text-3xl !font-display !font-bold !text-white",
                                            headerSubtitle: "!text-stone-400",
                                            sectionHeaderTitle: "!font-display !text-xl !font-semibold !text-stone-200 !mb-4",
                                            profileSectionTitle: "!border-b !border-stone-800 !pb-2 !mb-6",
                                            formFieldLabel: "!text-stone-500 !text-xs !uppercase !tracking-wider !font-semibold !mb-2",
                                            formFieldInput: "!bg-stone-900/50 !border !border-stone-800 !rounded-xl !text-stone-200 focus:!border-amber-500/50 focus:!ring-1 focus:!ring-amber-500/50 transition-all !py-3",
                                            formButtonPrimary: "!bg-gradient-to-br !from-amber-600 !to-amber-700 !text-white !font-medium !rounded-xl !shadow-lg !shadow-amber-900/20 hover:!shadow-amber-900/40 hover:!from-amber-500 hover:!to-amber-600 transition-all !py-3",
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
