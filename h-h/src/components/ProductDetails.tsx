
"use client";

import Image from "next/image";
import { Product } from "@/types/Product";
import { useState } from "react";
import EditProductModal from "./EditProductModal";
import { 
  FaHeart, 
  FaPlus, 
  FaShareAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaFacebook, 
  FaTwitter,
  FaLink,
  FaEdit
} from "react-icons/fa";
import StarRating from "./StarRating";

type ProductDetailsProps = Product & {
  isOwner?: boolean;
};

export default function ProductDetails(props: ProductDetailsProps) {

  const { isOwner, ...product } = props;
  const favoriteIds: string[] = [];
  const [showShareOptions, setShowShareOptions] = useState(false);

  const [isFavorite, setIsFavorite] = useState(
    favoriteIds.includes(product.id)
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error("Failed favorite update");

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const goToPageartisan = (id: string) => {
    window.location.href = `/artisans/details/${id}`;
  };

  // Función principal de compartir usando Web Share API si está disponible
  const handleShare = async () => {
    const productUrl = `${window.location.origin}/products/details/${product.id}`;
    const shareText = `Check out "${product.name}" by ${product.artisan.name} - ${product.description?.substring(0, 100)}...`;
    
    // Usar Web Share API si está disponible (navegadores móviles principalmente)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: mostrar opciones personalizadas
      setShowShareOptions(!showShareOptions);
    }
  };

  // Función para compartir en plataformas específicas
  const shareOnPlatform = (platform: string) => {
    const productUrl = `${window.location.origin}/products/details/${product.id}`;
    const shareText = `Check out "${product.name}" by ${product.artisan.name} - $${product.price.toFixed(2)}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(productUrl);
    
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${productUrl}`)
        .then(() => {
          alert('Link copied to clipboard!');
          setShowShareOptions(false);
        })
        .catch(() => alert('Failed to copy link'));
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
      setShowShareOptions(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl font-semibold text-green-600">
            ${product.price}
          </p>

          {/* Interactive Star Rating */}
          <StarRating
            productId={product.id}
            initialRating={product.rating}
            size="lg"
          />

          {/* Artesano */}
          <div className="border-t border-b py-4">
            <div className="artisan cursor-pointer" onClick={() => goToPageartisan(product.artisan.id)}>
              <Image
                src={product.artisan.avatar}
                alt={product.artisan.name}
                width={32}
                height={32}
                className="artisan-avatar"
              />
              <span className="artisan-name">{product.artisan.name}</span>
            </div>
          </div>

          {/* Icons: share, fav, add */}
          <div className="footer-actions">
            <button 
              onClick={handleShare}
              aria-label="Share product"
              className="icon-btn">
              <FaShareAlt />
            </button>
            <button className="icon-btn" onClick={toggleFavorite}>
              <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
            </button>
            <button className="icon-btn">
              <FaPlus />
            </button>

             {showShareOptions && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowShareOptions(false)}
                />
                
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border z-50 min-w-[200px] py-2">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-gray-700">Share this product</p>
                  </div>
                  
                  <button
                    onClick={() => shareOnPlatform('whatsapp')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-green-50 transition"
                  >
                    <FaWhatsapp className="text-green-500 mr-3 text-lg" />
                    <span>WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={() => shareOnPlatform('facebook')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition"
                  >
                    <FaFacebook className="text-blue-600 mr-3 text-lg" />
                    <span>Facebook</span>
                  </button>
                  
                  <button
                    onClick={() => shareOnPlatform('twitter')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition"
                  >
                    <FaTwitter className="text-blue-400 mr-3 text-lg" />
                    <span>Twitter</span>
                  </button>
                  
                  <button
                    onClick={() => shareOnPlatform('email')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaEnvelope className="text-red-500 mr-3 text-lg" />
                    <span>Email</span>
                  </button>
                  
                  <button
                    onClick={() => shareOnPlatform('copy')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaLink className="text-gray-500 mr-3 text-lg" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </>
            )}

            {/* Edit button - only visible to product owner */}
            {isOwner && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <FaEdit />
                Edit Product
              </button>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isOwner && (
        <EditProductModal
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
