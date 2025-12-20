"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function ContinueSignUpPage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/sign-in");
        }
    }, [isLoaded, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            // Update username in Clerk
            await user.update({
                username: username.trim(),
            });

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            const errorMessage =
                err.errors?.[0]?.longMessage || "Failed to set username. Please try again.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    if (!isLoaded || !user) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[380px] relative z-10"
            >
                <div className="bg-[#0A0A0A] border border-stone-800/60 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight font-display">
                            Choose a Username
                        </h1>
                        <p className="text-stone-400 text-xs">
                            Complete your profile to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500 text-xs overflow-hidden"
                            >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300 caret-[#FF6A00]"
                                placeholder="chef123"
                                required
                                minLength={3}
                                maxLength={20}
                                pattern="[a-zA-Z0-9_]+"
                                title="Username can only contain letters, numbers, and underscores"
                            />
                            <p className="text-stone-600 text-[10px] ml-1">
                                Letters, numbers, and underscores only
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !username.trim()}
                                className="w-full bg-[#FF6A00] hover:bg-[#FF8533] text-black font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:shadow-[0_0_25px_rgba(255,106,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group text-sm"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-4 border-t border-stone-900 text-center text-xs text-stone-500">
                        Not you?{" "}
                        <button
                            onClick={() => signOut()}
                            className="text-white hover:text-[#FF6A00] font-medium transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
