import React, { useState, useEffect } from 'react';
import { getVariantImages, uploadImage, deleteImage, setPrimaryImage, getImageBlob } from '../../api/images';

// Componente para mostrar una imagen con autenticación
function AuthenticatedImage({ variantId, imageId, isPrimary, className }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await getImageBlob(variantId, imageId);
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error('Error loading image:', err);
      }
    };

    loadImage();

    // Cleanup
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [variantId, imageId]);

  if (!imageUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-2xl">📱</div>
      </div>
    );
  }

  return <img src={imageUrl} alt="Product" className={className} />;
}

export default function ImageUploader({ variantId, onImagesChange }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (variantId) {
      loadImages();
    }
  }, [variantId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getVariantImages(variantId);
      setImages(Array.isArray(data) ? data : []);
      if (onImagesChange) onImagesChange(data);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('No se pudieron cargar las imágenes');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await uploadImage(variantId, file);
      await loadImages();
      e.target.value = ''; // Limpiar input
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      await deleteImage(variantId, imageId);
      await loadImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.message || 'Error al eliminar la imagen');
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setPrimaryImage(variantId, imageId);
      await loadImages();
    } catch (err) {
      console.error('Error setting primary image:', err);
      setError(err.message || 'Error al establecer imagen principal');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-contrast mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Cargando imágenes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-dark">📸 Imágenes del Producto</h3>
        <label className="cursor-pointer bg-brand-contrast text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-contrast-600 transition-all text-sm">
          {uploading ? '⏳ Subiendo...' : '+ Agregar Imagen'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-gray-600 text-sm">No hay imágenes. Agrega la primera imagen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.primaryImage ? 'border-brand-contrast shadow-lg' : 'border-gray-200'
              }`}
            >
              <AuthenticatedImage
                variantId={variantId}
                imageId={image.id}
                isPrimary={image.primaryImage}
                className="w-full h-32 object-cover"
              />
              
              {image.primaryImage && (
                <div className="absolute top-2 left-2 bg-brand-contrast text-white text-xs font-bold px-2 py-1 rounded">
                  ⭐ Principal
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.primaryImage && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="bg-white text-brand-dark px-3 py-1 rounded text-xs font-semibold hover:bg-brand-contrast hover:text-white transition-all"
                    title="Establecer como principal"
                  >
                    ⭐
                  </button>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-all"
                  title="Eliminar imagen"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
