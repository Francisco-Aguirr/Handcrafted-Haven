"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

type EditProductModalProps = {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        category_id?: string;
    };
    isOpen: boolean;
    onClose: () => void;
};

export default function EditProductModal({
    product,
    isOpen,
    onClose,
}: EditProductModalProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: product.name,
        description: product.description || "",
        price: String(product.price),
    });

    const [productImage, setProductImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(product.image || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setProductImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.name || !form.price) {
            setError("Name and price are required");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", form.price);

            if (productImage) {
                formData.append("image", productImage);
            } else if (product.image && !imagePreview.startsWith("data:")) {
                formData.append("existingImageUrl", product.image);
            }

            const response = await fetch(`/api/artisans/products/${product.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            // Close modal and refresh page to show updates
            onClose();
            router.refresh();
        } catch (err: any) {
            console.error("Update error:", err);
            setError(err.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl m-4 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <FaTimes className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Image
                        </label>
                        <div className="flex items-start gap-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Upload a new image or keep the current one
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
