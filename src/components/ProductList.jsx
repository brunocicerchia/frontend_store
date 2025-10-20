import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListings } from "../api/products";
import { addItemMe } from "../api/cart";
import Notification from './Notification';

function ProductList() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null); 
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const enrichedListings = await getListings(0, 20);
        setListings(enrichedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleAddToCart = async (listingId, e) => {
    e.stopPropagation();
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('jwt');
    if (!token) {
      setNotification({ type: 'warning', message: 'Debes iniciar sesión para agregar productos al carrito' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    try {
      setAddingToCart(listingId);
      await addItemMe(listingId, 1);
      setNotification({ type: 'success', message: 'Producto agregado al carrito exitosamente' });
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      // Mensajes de error más específicos
      if (err.message.includes('401') || err.message.includes('403')) {
        setNotification({ type: 'warning', message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' });
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.message.includes('400')) {
        setNotification({ type: 'error', message: 'Error al agregar el producto. Verifica que el producto esté disponible.' });
      } else {
        setNotification({ type: 'error', message: err.message || 'Error al agregar al carrito. Intenta nuevamente.' });
      }
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-contrast mx-auto mb-4"></div>
          <p className="text-brand-light text-xl">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center bg-brand-light rounded-xl p-10 shadow-lg">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-brand-dark text-xl">No hay productos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {listings.map(listing => (
        <div 
          key={listing.id} 
          className="group bg-brand-light rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-brand-contrast"
        >
          <div className="bg-gradient-to-br from-brand-dark-100 to-brand-light-200 p-8 sm:p-12 flex items-center justify-center">
            <div className="text-7xl sm:text-8xl">
              📱
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.stock > 0 ? (
                <span className="inline-block bg-green-500/10 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Stock: {listing.stock}
                </span>
              ) : (
                <span className="inline-block bg-red-500/10 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Sin stock
                </span>
              )}
              
              {listing.variant?.condition && (
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  listing.variant.condition === 'NEW' ? 'bg-blue-500/10 text-blue-600' :
                  listing.variant.condition === 'REFURB' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-gray-500/10 text-gray-600'
                }`}>
                  {listing.variant.condition === 'NEW' ? 'Nuevo' : 
                   listing.variant.condition === 'REFURB' ? 'Reacondicionado' : 
                   'Usado'}
                </span>
              )}
            </div>
            
            {listing.brand && (
              <p className="text-sm font-semibold text-brand-contrast mb-1">
                {listing.brand.name}
              </p>
            )}
            
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-contrast transition-colors">
              {listing.variant?.model?.modelName || `Producto #${listing.id}`}
            </h3>
            
            {listing.variant && (
              <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-700">
                {listing.variant.ram && (
                  <span className="bg-brand-dark/5 px-2 py-1 rounded">
                    {listing.variant.ram}GB RAM
                  </span>
                )}
                {listing.variant.storage && (
                  <span className="bg-brand-dark/5 px-2 py-1 rounded">
                    {listing.variant.storage}GB
                  </span>
                )}
                {listing.variant.color && (
                  <span className="bg-brand-dark/5 px-2 py-1 rounded">
                    {listing.variant.color}
                  </span>
                )}
              </div>
            )}
            
            {listing.seller && (
              <p className="text-xs text-gray-500 mb-3">
                Vendido por: <span className="font-semibold">{listing.seller.shopName}</span>
              </p>
            )}
            
            <div className="mb-4">
              {listing.discountActive && listing.effectivePrice < listing.price ? (
                <div>
                  <p className="text-lg text-gray-500 line-through">
                    ${listing.price.toFixed(2)}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-brand-button">
                    ${listing.effectivePrice.toFixed(2)}
                  </p>
                  <span className="inline-block bg-brand-contrast/10 text-brand-contrast text-xs font-semibold px-2 py-1 rounded mt-1">
                    ¡Descuento!
                  </span>
                </div>
              ) : (
                <p className="text-3xl sm:text-4xl font-bold text-brand-button">
                  ${listing.price.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/producto/${listing.id}`);
                }}
                className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 bg-brand-button text-brand-light hover:bg-brand-button-600 hover:shadow-lg hover:-translate-y-0.5"
              >
                Ver Detalles
              </button>
              <button 
                onClick={(e) => handleAddToCart(listing.id, e)}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                  listing.stock > 0 && listing.active
                    ? 'bg-brand-contrast text-brand-light hover:bg-brand-contrast-600 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={listing.stock === 0 || !listing.active || addingToCart === listing.id}
              >
                {addingToCart === listing.id ? '🛒 Agregando...' : 
                 listing.stock > 0 && listing.active ? 'Agregar al carrito' : 
                 'No disponible'}
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}

export default ProductList;