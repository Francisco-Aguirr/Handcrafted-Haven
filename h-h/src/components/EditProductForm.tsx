"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditProductFormProps = {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
    };
};

export default function EditProductForm({ product }: EditProductFormProps) {
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

            // Redirect to product details page on success
            router.push(`/products/details/${product.id}`);
            router.refresh();
        } catch (err: any) {
            console.error("Update error:", err);
            setError(err.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <div className="flex items-start gap-4">
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Product preview"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border rounded-lg p-3"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Upload a new image or keep the current one
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
