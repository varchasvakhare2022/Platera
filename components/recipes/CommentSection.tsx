"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        profileImage: string | null;
    };
    replies?: Comment[];
}

interface CommentSectionProps {
    recipeId: string;
}

export function CommentSection({ recipeId }: CommentSectionProps) {
    const { user, isLoaded } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/recipes/${recipeId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const handleCommentSuccess = () => {
        fetchComments(); // Refresh comments after posting
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-bold text-white">
                    Comments {comments.length > 0 && `(${comments.length})`}
                </h3>
            </div>

            {/* Add Comment Form */}
            {isLoaded && user ? (
                <CommentForm
                    recipeId={recipeId}
                    onSuccess={handleCommentSuccess}
                    placeholder="Share your thoughts..."
                />
            ) : (
                <div className="p-6 rounded-xl bg-stone-900/30 border border-stone-800/50 text-center">
                    <p className="text-stone-400 mb-4">Sign in to leave a comment</p>
                    <button
                        onClick={() => window.location.href = '/sign-in'}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            recipeId={recipeId}
                            currentUserId={user?.id}
                            onReplySuccess={handleCommentSuccess}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <MessageSquare className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                    <p className="text-stone-500">No comments yet. Be the first to comment!</p>
                </motion.div>
            )}
        </div>
    );
}
