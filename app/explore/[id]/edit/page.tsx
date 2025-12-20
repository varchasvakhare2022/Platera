"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Plus,
    X,
    Clock,
    Users,
    ChefHat,
    Loader2,
    Image as ImageIcon,
    Save,
    Trash2,
} from "lucide-react";
import { getErrorMessage } from "@/types/errors";

interface Recipe {
    id: string;
    title: string;
    description?: string;
    category: "VEG" | "NON_VEG" | "EGG";
    totalTime: number;
    servings: number;
    ingredients: string[];
    steps: string[];
    images: string[];
}

export default function EditRecipePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const params = useParams();
    const recipeId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Loading state
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<"VEG" | "NON_VEG" | "EGG">("VEG");
    const [cookingTime, setCookingTime] = useState("");
    const [servings, setServings] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [steps, setSteps] = useState<string[]>([""]);

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Load recipe data
    useEffect(() => {
        if (isLoaded && user && recipeId) {
            fetchRecipe();
        }
    }, [isLoaded, user, recipeId]);

    const fetchRecipe = async () => {
        try {
            const res = await fetch(`/api/recipes/${recipeId}`);
            if (!res.ok) throw new Error("Failed to load recipe");

            const data: Recipe = await res.json();

            // Populate form
            setTitle(data.title);
            setDescription(data.description || "");
            setCategory(data.category);
            setCookingTime(data.totalTime.toString());
            setServings(data.servings.toString());
            setIngredients(data.ingredients.length > 0 ? data.ingredients : [""]);
            setSteps(data.steps.length > 0 ? data.steps : [""]);
            setExistingImageUrl(data.images[0] || null);
            setImagePreview(data.images[0] || null);

            setIsLoadingRecipe(false);
        } catch (err) {
            setError("Failed to load recipe");
            setIsLoadingRecipe(false);
        }
    };

    // Auth Check
    if (isLoaded && !user) {
        router.push("/sign-in");
        return null;
    }

    // Handlers
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddIngredient = () => setIngredients([...ingredients, ""]);
    const handleRemoveIngredient = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };
    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleAddStep = () => setSteps([...steps, ""]);
    const handleRemoveStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };
    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const uploadImageToCloudinary = async (file: File) => {
        try {
            const signatureRes = await fetch("/api/upload/signature", {
                method: "POST",
            });

            const responseText = await signatureRes.text();

            if (!signatureRes.ok) {
                throw new Error("Failed to get upload signature");
            }

            const signatureData = JSON.parse(responseText);
            const { signature, timestamp, cloudName, apiKey, folder } = signatureData;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadRes.ok) {
                throw new Error("Image upload failed");
            }

            const data = await uploadRes.json();
            return data.secure_url;
        } catch (err) {
            throw new Error("Image upload failed");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Validation
            if (!title.trim()) throw new Error("Recipe title is required");
            if (!cookingTime || parseInt(cookingTime) <= 0)
                throw new Error("Valid cooking time is required");
            if (!servings || parseInt(servings) <= 0)
                throw new Error("Valid number of servings is required");

            const validIngredients = ingredients.filter((i) => i.trim() !== "");
            if (validIngredients.length === 0)
                throw new Error("Add at least one ingredient");

            const validSteps = steps.filter((s) => s.trim() !== "");
            if (validSteps.length === 0)
                throw new Error("Add at least one cooking step");

            // Upload new image if selected
            let imageUrl = existingImageUrl;
            if (imageFile) {
                setIsUploadingImage(true);
                imageUrl = await uploadImageToCloudinary(imageFile);
                setIsUploadingImage(false);
            }

            if (!imageUrl) throw new Error("Recipe image is required");

            // Update Recipe
            const payload = {
                title,
                description,
                category,
                totalTime: parseInt(cookingTime),
                servings: parseInt(servings),
                ingredients: validIngredients,
                steps: validSteps,
                images: [imageUrl],
            };

            const res = await fetch(`/api/recipes/${recipeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update recipe");
            }

            // Success Redirect
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            setIsSubmitting(false);
            setIsUploadingImage(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);

        try {
            const res = await fetch(`/api/recipes/${recipeId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete recipe");
            }

            router.push("/dashboard");
        } catch (err) {
            setError("Failed to delete recipe");
        }
    };

    if (!isLoaded || isLoadingRecipe) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-stone-200 font-sans selection:bg-stone-800 selection:text-white pt-28 pb-24">
            <div className="container mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="text-amber-500 font-medium tracking-wide uppercase text-xs mb-3">
                            Edit Recipe
                        </p>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                            Update Your Recipe
                        </h1>
                        <p className="text-stone-500">
                            Make changes to your culinary masterpiece.
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Cover Image & Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Image Upload */}
                        <div className="md:col-span-5 space-y-4">
                            <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                Cover Image
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                  relative aspect-[3/4] md:aspect-square rounded-2xl border-2 border-dashed border-stone-800 bg-stone-900/30 
                  flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden
                  ${imagePreview ? "border-none" : "hover:border-stone-600 hover:bg-stone-900/50"}
                `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />

                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                            <p className="text-white font-medium text-sm flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" /> Change Image
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-stone-700 transition-colors">
                                            <Upload className="w-5 h-5 text-stone-400 group-hover:text-white" />
                                        </div>
                                        <p className="text-stone-300 font-medium mb-1">
                                            Click to Upload
                                        </p>
                                        <p className="text-stone-600 text-xs">
                                            JPG or PNG, max 5MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Details */}
                        <div className="md:col-span-7 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                    Recipe Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Truffle Mushroom Risotto"
                                    className="w-full bg-stone-900/50 border border-stone-800 rounded-xl px-4 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                    Short Description{" "}
                                    <span className="text-stone-600 normal-case tracking-normal">
                                        (Optional)
                                    </span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell us a little story about this dish..."
                                    rows={3}
                                    className="w-full bg-stone-900/50 border border-stone-800 rounded-xl px-4 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                                />
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                        Cooking Time
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-600" />
                                        <input
                                            type="number"
                                            value={cookingTime}
                                            onChange={(e) => setCookingTime(e.target.value)}
                                            placeholder="45"
                                            className="w-full bg-stone-900/50 border border-stone-800 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                                        />
                                        <span className="absolute right-4 top-3.5 text-xs text-stone-600 font-medium pointer-events-none">
                                            MIN
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                        Servings
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-600" />
                                        <input
                                            type="number"
                                            value={servings}
                                            onChange={(e) => setServings(e.target.value)}
                                            placeholder="2"
                                            className="w-full bg-stone-900/50 border border-stone-800 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                                        />
                                        <span className="absolute right-4 top-3.5 text-xs text-stone-600 font-medium pointer-events-none">
                                            PPL
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400 uppercase tracking-wider">
                                    Dietary Category
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["VEG", "NON_VEG", "EGG"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setCategory(type)}
                                            className={`
                        flex items-center justify-center py-2.5 rounded-xl border text-sm font-medium transition-all
                        ${category === type
                                                    ? "bg-amber-500 text-black border-amber-500"
                                                    : "bg-stone-900/30 text-stone-400 border-stone-800 hover:border-stone-600 hover:text-stone-200"
                                                }
                      `}
                                        >
                                            {type.replace("_", "-")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-stone-900" />

                    {/* Ingredients */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Ingredients</h2>
                            <span className="text-xs text-stone-500 uppercase tracking-wider">
                                List all items needed
                            </span>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {ingredients.map((ingredient, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-xs text-stone-500 font-mono">
                                            {index + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) =>
                                                handleIngredientChange(index, e.target.value)
                                            }
                                            placeholder="e.g. 2 cups of Basmati rice"
                                            className="flex-1 bg-transparent border-b border-stone-800 py-2 text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(index)}
                                                className="p-1.5 text-stone-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-rose-500/10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-medium mt-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Ingredient
                        </button>
                    </div>

                    <div className="w-full h-px bg-stone-900" />

                    {/* Instructions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Instructions</h2>
                            <span className="text-xs text-stone-500 uppercase tracking-wider">
                                Step-by-step guide
                            </span>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-sm font-bold text-stone-400 font-mono mt-1">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={step}
                                                onChange={(e) =>
                                                    handleStepChange(index, e.target.value)
                                                }
                                                placeholder={`Step ${index + 1} details...`}
                                                rows={2}
                                                className="w-full bg-stone-900/30 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-stone-600 transition-colors resize-none"
                                            />
                                            {steps.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStep(index)}
                                                    className="absolute top-2 right-2 p-1.5 text-stone-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddStep}
                            className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-medium mt-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Step
                        </button>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Actions */}
                    <div className="pt-8 border-t border-stone-900 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 text-sm font-semibold text-stone-500 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative px-8 py-3 bg-[#FF6A00] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            <span
                                className={`flex items-center gap-2 ${isSubmitting ? "opacity-0" : "opacity-100"
                                    }`}
                            >
                                <Save className="w-5 h-5" />
                                Update Recipe
                            </span>
                            {isSubmitting && (
                                <div className="absolute inset-0 flex items-center justify-center text-black">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDeleteModal(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                                    <h3 className="text-2xl font-bold text-white mb-3">Delete Recipe?</h3>
                                    <p className="text-stone-400 mb-8">
                                        Are you sure you want to delete this recipe? This action cannot be undone.
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="flex-1 px-6 py-3 bg-stone-900 text-stone-300 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
