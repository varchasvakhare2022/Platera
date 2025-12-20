"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface CommentFormProps {
    recipeId: string;
    parentId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export function CommentForm({
    recipeId,
    parentId = null,
    onSuccess,
    onCancel,
    placeholder = "Add a comment...",
    autoFocus = false,
}: CommentFormProps) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/recipes/${recipeId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to post comment");
            }

            toast.success(parentId ? "Reply posted!" : "Comment posted!");
            setContent("");
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus={autoFocus}
                maxLength={1000}
                rows={3}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />

            <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                    {content.length}/1000 • Ctrl+Enter to submit
                </span>

                <div className="flex gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {parentId ? "Reply" : "Comment"}
                    </button>
                </div>
            </div>
        </motion.form>
    );
}
