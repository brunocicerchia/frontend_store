import React, { useState, useEffect } from 'react';
import { getVariantImages, getImageBlob } from '../api/images';

export default function ProductImage({ variantId, className = "" }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (variantId) {
      loadPrimaryImage();
    }
    
    // Revocar el blob URL cuando el componente se desmonte
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [variantId]);

  const loadPrimaryImage = async () => {
    try {
      const images = await getVariantImages(variantId);
      const primaryImage = images.find(img => img.primaryImage) || images[0];
      
      if (primaryImage?.id) {
        const blob = await getImageBlob(variantId, primaryImage.id);
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
      }
    } catch (err) {
      console.error('Error loading image:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-brand-dark-100 to-brand-light-200 flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-6xl">📱</div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={`bg-gradient-to-br from-brand-dark-100 to-brand-light-200 flex items-center justify-center ${className}`}>
        <div className="text-7xl sm:text-8xl">📱</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Product"
      className={`object-cover ${className}`}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML = '<div class="text-7xl sm:text-8xl">📱</div>';
      }}
    />
  );
}
