"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/Product";
import { 
  FaHeart, 
  FaPlus, 
  FaShareAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaFacebook, 
  FaTwitter,
  FaLink
} from "react-icons/fa";
import StarRating from "./StarRating";

export default function ProductCard({
  product,
  favoriteIds = [],
}: {
  product: Product;
  favoriteIds?: string[];
}) {
  const [isFavorite, setIsFavorite] = useState(favoriteIds.includes(product.id));
  const [showShareOptions, setShowShareOptions] = useState(false);

  const toggleFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!res.ok) throw new Error("Failed favorite update");
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const goToPage = (id: string) => {
    window.location.href = `/products/details/${id}`;
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
    <div className="product-card">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={250}
        className="product-image cursor-pointer"
        onClick={() => goToPage(product.id)}
      />

      <h3 onClick={() => goToPage(product.id)} className="cursor-pointer">{product.name}</h3>
      <p className="price cursor-pointer" onClick={() => goToPage(product.id)}>${product.price.toFixed(2)}</p>
      <p className="description cursor-pointer" onClick={() => goToPage(product.id)}>{product.description}</p>

      <div onClick={() => goToPage(product.id)} className="cursor-pointer">
        <StarRating
          productId={product.id}
          initialRating={product.rating}
          size="sm"
          interactive={false}
        />
      </div>

      <div className="product-footer">
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

        <div className="footer-actions relative">
          {/* Botón de compartir */}
          <div className="relative">
            <button 
              className="icon-btn"
              onClick={handleShare}
              aria-label="Share product"
            >
              <FaShareAlt />
            </button>
            
            {/* Dropdown de opciones de compartir (fallback) */}
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
          </div>

          <button className="icon-btn cursor-pointer" onClick={toggleFavorite}>
            <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
          </button>

          <button className="icon-btn">
            <FaPlus />
          </button>
        </div>
      </div>

      <button className="btn-cart">Add to Cart</button>
    </div>
  );
}