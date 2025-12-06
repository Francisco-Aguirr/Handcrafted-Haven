"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditProductModal from "@/components/EditProductModal";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  created_at?: string;
};

type Profile = {
  id: string;
  bio?: string | null;
  verified?: boolean;
  avatar_url?: string | null;
};

export default function ArtisanDashboard({ user }: { user: any }) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form state for create/edit
  const [editing, setEditing] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  // Estado para las imágenes
  const [productImage, setProductImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Profile edit state
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [pRes, profRes] = await Promise.all([
        fetch("/api/artisans/products"),
        fetch("/api/artisans/profile"),
      ]);
      const pJson = await pRes.json();
      const profJson = await profRes.json();

      setProducts(Array.isArray(pJson) ? pJson : []);
      setProfile(profJson || null);
      setBio(profJson?.bio ?? "");
      setAvatarUrl(profJson?.avatar_url ?? "");
    } catch (err) {
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", price: "" });
    setProductImage(null);
    setImagePreview("");
  }

  function openEdit(prod: Product) {
    setEditing(prod);
    setIsEditModalOpen(true);
  }

  function openEditForm(prod: Product) {
    setEditing(prod);
    setForm({
      name: prod.name,
      description: prod.description ?? "",
      price: String(prod.price ?? ""),
    });
    setImagePreview(prod.image_url ?? "");
    setProductImage(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Manejador para imagen del producto
  function handleProductImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Manejador para imagen del perfil
  function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


  async function submitProduct(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name and price required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);

      if (productImage) {
        formData.append("image", productImage);
        console.log('Product image details:', {
          name: productImage.name,
          size: productImage.size,
          type: productImage.type
        });
      } else if (editing?.image_url && !productImage && !imagePreview.startsWith('data:')) {
        formData.append("existingImageUrl", editing.image_url);
      }

      const url = editing ? `/api/artisans/products/${editing.id}` : "/api/artisans/products";
      const method = editing ? "PUT" : "POST";

      console.log('Sending request to:', url, 'method:', method);
      console.log('Form data entries:');
      for (const [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        // Intentar leer el mensaje de error del response
        let errorMessage = `${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Error response data:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Success response:', result);

      await loadAll();
      setEditing(null);
      setForm({ name: "", description: "", price: "" });
      setProductImage(null);
      setImagePreview("");

    } catch (err: any) {
      console.error("Save error details:", err);
      alert(`Error saving product: ${err.message || 'Unknown error'}`);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/artisans/products/${id}`, { method: "DELETE" });
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting");
    }
  }

  async function updateProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bio", bio);

      if (profileImage) {
        formData.append("avatar", profileImage);
      } else if (profile?.avatar_url && !profileImage && !avatarPreview.startsWith('data:')) {
        // Mantener la URL existente si no se cambia la imagen
        formData.append("existingAvatarUrl", profile.avatar_url);
      }

      const response = await fetch("/api/artisans/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      await loadAll();
      alert("Profile updated");
      setProfileImage(null);
      setAvatarPreview("");

    } catch (err) {
      console.error("Profile error", err);
      alert("Error updating profile");
    }
  }

  if (loading) return <p>Loading artisan dashboard...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Artisan Dashboard</h1>
      <p className="mb-6">Welcome, {user?.name}</p>

      {/* PROFILE */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">My profile</h2>
        <p className="text-sm text-gray-600 mb-3">
          {profile?.verified ? (
            <span className="text-green-600 font-medium">Verified artisan</span>
          ) : (
            <span className="text-yellow-600 font-medium">Not verified</span>
          )}
        </p>

        <form onSubmit={updateProfile} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Profile Image</label>
            <div className="flex items-center gap-4 mb-3">
              {(avatarPreview || profile?.avatar_url) && (
                <img
                  src={avatarPreview || profile?.avatar_url || "/placeholder.png"}
                  alt="Profile preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="w-full border rounded p-2"
              />
            </div>
            <p className="text-xs text-gray-500">Upload a new image or keep the current one</p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded" type="submit">
              Save profile
            </button>
          </div>
        </form>
      </section>

      {/* PRODUCTS */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My products</h2>
          <div className="flex gap-2">
            <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded">
              + New product
            </button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 border rounded">
              Back
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-600">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded shadow">
                <img
                  src={p.image_url ?? "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                <p className="font-medium mb-3">${Number(p.price).toFixed(2)}</p>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="px-3 py-1 border rounded">
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                  <button onClick={() => router.push(`/products/${p.id}`)} className="px-3 py-1 border rounded ml-auto">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CREATE / EDIT FORM */}
      <section className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">{editing ? "Edit product" : "Create product"}</h2>
        <form onSubmit={submitProduct} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price *</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Product Image</label>
            <div className="flex items-center gap-4 mb-3">
              {(imagePreview || editing?.image_url) && (
                <img
                  src={imagePreview || editing?.image_url || "/placeholder.png"}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
                className="w-full border rounded p-2"
              />
            </div>
            <p className="text-xs text-gray-500">
              {editing
                ? "Upload a new image or keep the current one"
                : "Upload an image for your product"}
            </p>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {editing ? "Save changes" : "Create product"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", description: "", price: "" });
                  setProductImage(null);
                  setImagePreview("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Edit Product Modal */}
      {editing && (
        <EditProductModal
          product={{
            id: editing.id,
            name: editing.name,
            description: editing.description,
            price: editing.price,
            image: editing.image_url || "",
          }}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditing(null);
            loadAll(); // Refresh the list
          }}
        />
      )}
    </div>
  );
}
