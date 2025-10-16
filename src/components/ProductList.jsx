import React, { useState, useEffect } from 'react';

function ProductList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Configurar headers con el token Bearer
        const headers = {
          'Content-Type': 'application/json',
        };

<<<<<<< Updated upstream
        // Esto en produccion do puede estar, se debe guardar en localStorage
        headers['Authorization'] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc2MDQ2NzYwNiwiZXhwIjoxNzYwNTU0MDA2fQ.-yy8Sjyi64vOqY2PmyfvQx9e-3xULvpeau8A9I3aADKzm5OZPO6quv-cdpKIptdbUP7EBk7oMtfmn9N9j5G6iw`;
=======
        headers['Authorization'] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjaWNlcmNoaWFicnVub0BnbWFpbC5jb20iLCJpYXQiOjE3NjAzOTU5MDMsImV4cCI6MTc2MDQ4MjMwM30.1YIfiB1EHvKrLEaqzBT-hbMvh8IzrqU28u3-9UudzcNbgyNdAoXQHT3JH68eDTGQcTKCTEYNAfMb4h52f4yLIQ`;
>>>>>>> Stashed changes
        
        // 1. Obtener listings
        const response = await fetch('http://localhost:8080/listings?page=0&size=20', {
          method: 'GET',
          headers: headers,
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        
        const data = await response.json();
        const listingsData = data.content;

        // 2. Para cada listing, obtener detalles de variant y seller
        const enrichedListings = await Promise.all(
          listingsData.map(async (listing) => {
            try {
              // Fetch variant details
              const variantResponse = await fetch(`http://localhost:8080/variants/${listing.variantId}`, {
                method: 'GET',
                headers: headers,
              });
              
              // Fetch seller details
              const sellerResponse = await fetch(`http://localhost:8080/seller/${listing.sellerId}`, {
                method: 'GET',
                headers: headers,
              });

              const variant = variantResponse.ok ? await variantResponse.json() : null;
              const seller = sellerResponse.ok ? await sellerResponse.json() : null;

              // Si tenemos variant, también obtener el brand
              let brand = null;
              if (variant && variant.deviceModelId) {
                const modelResponse = await fetch(`http://localhost:8080/device-models/${variant.deviceModelId}`, {
                  method: 'GET',
                  headers: headers,
                });
                
                if (modelResponse.ok) {
                  const model = await modelResponse.json();
                  
                  // Ahora obtener el brand usando brandId del modelo
                  if (model.brandId) {
                    const brandResponse = await fetch(`http://localhost:8080/brands/${model.brandId}`, {
                      method: 'GET',
                      headers: headers,
                    });
                    
                    if (brandResponse.ok) {
                      brand = await brandResponse.json();
                    }
                  }
                  
                  // Agregar el modelo completo al variant
                  variant.model = model;
                }
              }

              return {
                ...listing,
                variant,
                seller,
                brand,
              };
            } catch (error) {
              console.error(`Error fetching details for listing ${listing.id}:`, error);
              return listing;
            }
          })
        );

        setListings(enrichedListings);

      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {listings.map(listing => (
        <div 
          key={listing.id} 
          className="group bg-brand-light rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-brand-contrast"
        >
          {/* Imagen del producto */}
          <div className="bg-gradient-to-br from-brand-dark-100 to-brand-light-200 p-8 sm:p-12 flex items-center justify-center">
            <div className="text-7xl sm:text-8xl">
              📱
            </div>
          </div>
          
          {/* Información del producto */}
          <div className="p-6">
            {/* Badges superiores */}
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Badge de stock */}
              {listing.stock > 0 ? (
                <span className="inline-block bg-green-500/10 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Stock: {listing.stock}
                </span>
              ) : (
                <span className="inline-block bg-red-500/10 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Sin stock
                </span>
              )}
              
              {/* Badge de condición */}
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
            
            {/* Marca */}
            {listing.brand && (
              <p className="text-sm font-semibold text-brand-contrast mb-1">
                {listing.brand.name}
              </p>
            )}
            
            {/* Nombre del modelo */}
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-contrast transition-colors">
              {listing.variant?.model?.modelName || `Producto #${listing.id}`}
            </h3>
            
            {/* Especificaciones técnicas */}
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
            
            {/* Vendedor */}
            {listing.seller && (
              <p className="text-xs text-gray-500 mb-3">
                Vendido por: <span className="font-semibold">{listing.seller.shopName}</span>
              </p>
            )}
            
            {/* Precio con descuento si aplica */}
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
            
            {/* Botón de acción */}
            <button 
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                listing.stock > 0 && listing.active
                  ? 'bg-brand-contrast text-brand-light hover:bg-brand-contrast-600 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={listing.stock === 0 || !listing.active}
            >
              {listing.stock > 0 && listing.active ? 'Agregar al carrito' : 'No disponible'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;