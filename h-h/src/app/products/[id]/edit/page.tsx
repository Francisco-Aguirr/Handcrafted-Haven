import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProductWithOwnerInfo } from "@/lib/db/products";
import EditProductForm from "@/components/EditProductForm";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user) {
        redirect(`/products/details/${id}`);
    }

    // Get product with owner info
    const product = await getProductWithOwnerInfo(id);
    if (!product) {
        redirect("/products");
    }

    // Check authorization - only product owner can edit
    if (product.ownerUserId !== session.user.id) {
        redirect(`/products/details/${id}`);
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6">
            <EditProductForm
                product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                }}
            />
        </div>
    );
}
