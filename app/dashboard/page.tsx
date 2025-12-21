'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Plus, ArrowUpRight, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/animations/PageTransition';

// -- Interfaces --
interface Recipe {
    id: string;
    title: string;
    description?: string;
    category: 'VEG' | 'NON_VEG' | 'EGG';
    images: string[];
    createdAt: string;
    avgRating?: number;
    servings: number;
    totalTime: number;
    author: {
        id: string;
        name: string;
        profileImage?: string;
    };
    _count: { reviews: number; comments: number };
}

interface Review {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    recipe: {
        id: string;
        title: string;
        images: string[];
    };
}

interface DashboardData {
    user: {
        id: string;
        name: string;
        email: string;
        profileImage?: string;
        createdAt: string;
    };
    recipes: Recipe[];
    savedRecipes: Recipe[];
    reviews: Review[];
    stats: {
        totalRecipes: number;
        totalReviews: number;
        totalSaved: number;
        totalReviewsReceived: number;
    };
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'recipes' | 'saved' | 'reviews'>('recipes');

    useEffect(() => {
        if (isLoaded && user) {
            fetchDashboardData();
        }
    }, [isLoaded, user]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/user/dashboard', { cache: 'no-store' });
            if (res.ok) {
                const dashboardData = await res.json();
                setData(dashboardData);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
            if (response.ok) {
                setData(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        recipes: prev.recipes.filter(r => r.id !== recipeId),
                        stats: { ...prev.stats, totalRecipes: prev.stats.totalRecipes - 1 }
                    }
                });
            }
        } catch (error) {
            console.error('Failed to delete recipe:', error);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-stone-800 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#050505] text-stone-200 font-sans selection:bg-stone-800 selection:text-white">

                {/* --- HERO SECTION --- */}
                {/* Max width constrained to 5xl as per previous alignment request */}
                <div className="container mx-auto max-w-5xl px-6 pt-32 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">

                        {/* Simple Profile Info */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                                {user.fullName || user.username}
                            </h1>

                            {/* Functional Stats Row */}
                            <div className="flex items-center gap-6 text-sm text-stone-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{data?.stats.totalRecipes || 0}</span>
                                    <span>Recipes</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-stone-800" />
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{data?.stats.totalSaved || 0}</span>
                                    <span>Saved</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-stone-800" />
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{data?.stats.totalReviewsReceived || 0}</span>
                                    <span>Reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Primary Action - Elevated Moment (Solid Brand Color) */}
                        <Link href="/create">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-6 py-3 bg-[#FF6A00] text-black rounded-xl font-semibold text-sm shadow-[0_0_20px_rgba(255,106,0,0.15)] hover:shadow-[0_0_30px_rgba(255,106,0,0.3)] transition-all duration-300 overflow-hidden border border-white/5"
                            >
                                <span className="relative z-10 flex items-center gap-2.5">
                                    <div className="bg-black/10 p-1 rounded-full group-hover:bg-black group-hover:text-[#FF6A00] transition-colors duration-300">
                                        <Plus className="w-4 h-4 text-black group-hover:text-[#FF6A00] transition-colors duration-300" />
                                    </div>
                                    <span className="tracking-wide text-black">Start Cooking</span>
                                </span>
                            </motion.button>
                        </Link>
                    </div>

                    {/* --- SIMPLE TABS --- */}
                    <div className="border-b border-stone-900 flex items-center gap-8">
                        {['recipes', 'saved', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-medium capitalize tracking-wide transition-colors relative ${activeTab === tab ? 'text-white' : 'text-stone-500 hover:text-stone-300'
                                    }`}
                            >
                                {tab === 'recipes' ? 'My Recipes' : tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="container mx-auto max-w-5xl px-6 pb-24 min-h-[50vh]">
                    <AnimatePresence mode="wait">

                        {/* MY RECIPES */}
                        {activeTab === 'recipes' && (
                            <motion.div
                                key="recipes"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {data?.recipes && data.recipes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {data.recipes.map((recipe) => (
                                            <div
                                                key={recipe.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => router.push(`/explore/${recipe.id}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        router.push(`/explore/${recipe.id}`);
                                                    }
                                                }}
                                                className="group bg-stone-900/30 border border-stone-800/50 rounded-xl overflow-hidden hover:border-stone-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                aria-label={`View ${recipe.title} recipe`}
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                                                    <img
                                                        src={recipe.images[0]}
                                                        alt={recipe.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />

                                                    {/* Actions Overlay */}
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/explore/${recipe.id}/edit`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-white hover:text-black transition-colors"
                                                            aria-label="Edit recipe"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4">
                                                    <h3 className="text-white font-semibold mb-1 truncate">{recipe.title}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.totalTime}m</span>
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {recipe.servings}</span>
                                                        <span className="capitalize px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px]">{recipe.category.replace('_', ' ').toLowerCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="Your kitchen is empty"
                                        description="Share your first recipe and let the community discover it."
                                        actionLink="/create"
                                        actionText="Create Recipe"
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* SAVED RECIPES */}
                        {activeTab === 'saved' && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {data?.savedRecipes && data.savedRecipes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {data.savedRecipes.map((recipe) => (
                                            <Link href={`/explore/${recipe.id}`} key={recipe.id} className="group bg-stone-900/30 border border-stone-800/50 rounded-xl overflow-hidden hover:border-stone-700 transition-colors block">
                                                <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                                                    {recipe.images && recipe.images.length > 0 ? (
                                                        <img
                                                            src={recipe.images[0]}
                                                            alt={recipe.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                                                            <span className="text-stone-600 text-sm">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-white font-semibold mb-1 truncate">{recipe.title}</h3>
                                                    <p className="text-xs text-stone-500">by {recipe.author.name}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Saved Recipes"
                                        description="Form your personal cookbook by saving recipes you love."
                                        actionLink="/explore"
                                        actionText="Explore Recipes"
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* REVIEWS */}
                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {data?.reviews && data.reviews.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.reviews.map((review) => (
                                            <div key={review.id} className="bg-stone-900/30 border border-stone-800 p-6 rounded-xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Link href={`/explore/${review.recipe.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                        <img src={review.recipe.images[0]} alt="" className="w-10 h-10 rounded-md object-cover bg-stone-800" />
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{review.recipe.title}</p>
                                                            <p className="text-[10px] text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-stone-800 text-stone-800'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-stone-300 text-sm leading-relaxed">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Reviews"
                                        description="You haven't reviewed any recipes yet."
                                        actionLink="/explore"
                                        actionText="Write a Review"
                                    />
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
}

function EmptyState({ title, description, actionLink, actionText }: { title: string, description: string, actionLink: string, actionText: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-stone-800 rounded-xl bg-stone-900/20">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-stone-500 text-sm max-w-xs mb-6">{description}</p>
            <Link href={actionLink}>
                <button className="text-white text-sm font-medium underline decoration-stone-600 underline-offset-4 hover:decoration-white transition-all">
                    {actionText}
                </button>
            </Link>
        </div>
    );
}
