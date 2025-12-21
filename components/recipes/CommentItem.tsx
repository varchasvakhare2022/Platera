"use client";

import { useState } from "react";
import { MessageCircle, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CommentForm } from "./CommentForm";

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

interface CommentItemProps {
    comment: Comment;
    recipeId: string;
    currentUserId?: string;
    recipeAuthorId?: string; // To check if current user is recipe owner
    onReplySuccess?: () => void;
    onDeleteSuccess?: () => void;
    isReply?: boolean; // Track if this is a nested reply
}

export function CommentItem({ comment, recipeId, currentUserId, recipeAuthorId, onReplySuccess, onDeleteSuccess, isReply = false }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const handleReplySuccess = () => {
        setShowReplyForm(false);
        onReplySuccess?.();
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/recipes/${recipeId}/comments?commentId=${comment.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete comment');

            onDeleteSuccess?.();
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    // Check if current user can delete this comment
    const canDelete = currentUserId && (
        comment.user.id === currentUserId || // Comment owner
        recipeAuthorId === currentUserId // Recipe owner
    );

    return (
        <div className="space-y-4">
            {/* Main Comment */}
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.user.profileImage ? (
                        <Image
                            src={comment.user.profileImage}
                            alt={comment.user.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 font-medium">
                            {comment.user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                            {comment.user.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-stone-500">
                            {formatTimeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-stone-300 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Only show Reply button on top-level comments */}
                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-sm text-stone-400 hover:text-orange-500 transition-colors flex items-center gap-1"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Reply
                            </button>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-sm text-stone-400 hover:text-white transition-colors"
                            >
                                {showReplies ? "Hide" : "Show"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}

                        {/* Delete button - only show if user can delete */}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-sm text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                        {showReplyForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3"
                            >
                                <CommentForm
                                    recipeId={recipeId}
                                    parentId={comment.id}
                                    onSuccess={handleReplySuccess}
                                    onCancel={() => setShowReplyForm(false)}
                                    placeholder="Write a reply..."
                                    autoFocus
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nested Replies */}
            <AnimatePresence>
                {showReplies && comment.replies && comment.replies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-12 space-y-4 border-l-2 border-stone-800 pl-4"
                    >
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                recipeId={recipeId}
                                currentUserId={currentUserId}
                                recipeAuthorId={recipeAuthorId}
                                onReplySuccess={onReplySuccess}
                                onDeleteSuccess={onDeleteSuccess}
                                isReply={true}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
