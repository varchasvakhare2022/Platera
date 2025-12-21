"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface SaveButtonProps {
    recipeId: string;
    initialSaved?: boolean;
    variant?: "icon" | "button";
    size?: "sm" | "md" | "lg";
    onSaveChange?: (saved: boolean) => void;
}

export function SaveButton({
    recipeId,
    initialSaved = false,
    variant = "icon",
    size = "md",
    onSaveChange,
}: SaveButtonProps) {
    const { user, isLoaded } = useUser();
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch save status on mount
    useEffect(() => {
        if (isLoaded && user) {
            fetchSaveStatus();
        }
    }, [recipeId, isLoaded, user]);

    const fetchSaveStatus = async () => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}/save`);
            if (response.ok) {
                const data = await response.json();
                setIsSaved(data.saved);
            }
        } catch (error) {
            console.error('Error fetching save status:', error);
        }
    };

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            window.location.href = '/sign-in';
            return;
        }

        // Optimistic update
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/recipes/${recipeId}/save`, {
                method: 'POST',
            });

            if (!response.ok) {
                // Revert on error
                setIsSaved(!newSavedState);
                throw new Error('Failed to save recipe');
            }

            const data = await response.json();
            setIsSaved(data.saved);
            onSaveChange?.(data.saved);
        } catch (error) {
            console.error('Error toggling save:', error);
            // State already reverted above
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    if (variant === "button") {
        return (
            <button
                onClick={handleToggleSave}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 ${isSaved
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                    }`}
            >
                <Bookmark
                    className={`${iconSizes[size]} ${isSaved ? "fill-current" : ""}`}
                />
                {isSaved ? "Saved" : "Save Recipe"}
            </button>
        );
    }

    return (
        <motion.button
            onClick={handleToggleSave}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-stone-900/80 backdrop-blur-sm border border-stone-700/50 hover:border-orange-500/50 transition-all disabled:opacity-50 group`}
            title={isSaved ? "Unsave recipe" : "Save recipe"}
        >
            <Bookmark
                className={`${iconSizes[size]} transition-colors ${isSaved
                        ? "fill-orange-500 text-orange-500"
                        : "text-stone-400 group-hover:text-orange-500"
                    }`}
            />
        </motion.button>
    );
}
