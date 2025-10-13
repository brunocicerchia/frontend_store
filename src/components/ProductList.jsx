import React, { useState, useEffect } from 'react';

function ProductList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funcion Fetch Listings
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Configurar token JWT
        const headers = {
          'Content-Type': 'application/json',
        };

        // Esto en produccion do puede estar, se debe guardar en localStorage
        headers['Authorization'] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjaWNlcmNoaWFicnVub0BnbWFpbC5jb20iLCJpYXQiOjE3NjAzOTU5MDMsImV4cCI6MTc2MDQ4MjMwM30.1YIfiB1EHvKrLEaqzBT-hbMvh8IzrqU28u3-9UudzcNbgyNdAoXQHT3JH68eDTGQcTKCTEYNAfMb4h52f4yLIQ`;
        
        //Se define el endpoint de la API al que se quiere acceder
        const response = await fetch('http://localhost:8080/listings?page=0&size=20', {
          // Metodo: GET POST DELETE UPDATE
          method: 'GET',
          // Esto hace referencia a el JWT definido mas arriba
          headers: headers,
        });
        
        // Verifica que la respuesta de la API fue correcta
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        
        // Se espera la respuesta de la API
        const data = await response.json();
        // Se guarda en el estado Listings los resultados
        setListings(data.content);

      } catch (err) {
        // En caso de error se muestra el error en consola
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
          
          {/* Información del producto */}
          <div className="p-6">
            {/* Stock */}
            {listing.stock > 0 ? (
              <span className="inline-block bg-green-500/10 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Stock: {listing.stock}
              </span>
            ) : (
              <span className="inline-block bg-red-500/10 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Sin stock
              </span>
            )}
            
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-contrast transition-colors">
              Listing #{listing.id}
            </h3>
            
            {/* Precio */}
            <div className="mb-4">
                <p className="text-3xl sm:text-4xl font-bold text-brand-button">
                  ${listing.price.toFixed(2)}
                </p>
            </div>
            
            {/* Información adicional temporal */}
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p>Variante ID: {listing.variantId}</p>
              <p>Vendedor ID: {listing.sellerId}</p>
            </div>
            
            {/* Botón de acción */}
            <button 
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 bg-brand-contrast text-brand-light hover:bg-brand-contrast-600 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5
              }`}
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
