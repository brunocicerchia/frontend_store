import React, { useState, useEffect } from 'react';
import { getVariantImages, getImageBlob } from '../../api/images';

function ProductImage({ variantId, className = "" }) {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (variantId) {
      loadImages();
    }

    // Cleanup: Revocar todos los blob URLs cuando el componente se desmonte
    return () => {
      imageUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [variantId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const imageList = await getVariantImages(variantId);
      
      if (imageList && imageList.length > 0) {
        setImages(imageList);
        
        // Cargar todas las imágenes como blobs
        const urls = await Promise.all(
          imageList.map(async (img) => {
            try {
              const blob = await getImageBlob(variantId, img.id);
              return URL.createObjectURL(blob);
            } catch (err) {
              console.error('Error loading image:', err);
              return null;
            }
          })
        );
        
        setImageUrls(urls.filter(url => url !== null));
        
        // Establecer la imagen principal como la primera
        const primaryIndex = imageList.findIndex(img => img.primaryImage);
        if (primaryIndex !== -1) {
          setCurrentImageIndex(primaryIndex);
        }
      }
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-brand-dark-100 to-brand-light-200 p-12 sm:p-16 lg:p-20 flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-9xl sm:text-[12rem] lg:text-[14rem]">📱</div>
      </div>
    );
  }

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-brand-dark-100 to-brand-light-200 p-12 sm:p-16 lg:p-20 flex items-center justify-center ${className}`}>
        <div className="text-9xl sm:text-[12rem] lg:text-[14rem]">📱</div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={imageUrls[currentImageIndex]}
          alt={`Product ${currentImageIndex + 1}`}
          className="w-full h-full object-contain p-8"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Imagen anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Siguiente imagen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
        )}
      </div>

      {imageUrls.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                currentImageIndex === index 
                  ? 'border-brand-contrast shadow-lg' 
                  : 'border-gray-200 hover:border-brand-contrast/50'
              }`}
            >
              <img
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {images[index]?.primaryImage && (
                <div className="absolute top-1 left-1 text-xs">⭐</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImage;
