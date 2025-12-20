"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Star, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ReviewFormProps {
    recipeId: string;
    existingReview?: {
        rating: number;
        comment: string | null;
    } | null;
}

export function ReviewForm({ recipeId, existingReview }: ReviewFormProps) {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            setError("Please select a rating");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/recipes/${recipeId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment: comment.trim() || null }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit review");
            }

            toast.success(existingReview ? "Review updated!" : "Review submitted!");
            setTimeout(() => {
                router.refresh(); // Refresh to show new review
            }, 500);
        } catch (err: any) {
            const errorMsg = err.message || "Failed to submit review";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return null;
    }

    if (!user) {
        return (
            <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/50 text-center">
                <p className="text-stone-400 mb-4">Sign in to leave a review</p>
                <button
                    onClick={() => window.location.href = '/sign-in'}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    aria-label="Sign in to leave a review"
                >
                    Sign in to leave a review
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/50">
                <h4 className="text-lg font-bold text-white mb-4">
                    {existingReview ? "Update Your Review" : "Leave a Review"}
                </h4>

                {/* Star Rating */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-400 mb-3">
                        Rating
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                        ? "fill-[#FF6A00] text-[#FF6A00]"
                                        : "fill-none text-stone-600"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-400 mb-2">
                        Comment (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this recipe..."
                        rows={4}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-[#FF6A00]/50 transition-colors resize-none"
                    />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !rating}
                    className="w-full bg-[#FF6A00] hover:bg-[#FF8533] text-black font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:shadow-[0_0_25px_rgba(255,106,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            {existingReview ? "Update Review" : "Submit Review"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
