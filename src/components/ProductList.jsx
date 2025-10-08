import React from 'react';

function ProductList() {
  // Simulación de datos desde la API
  const productos = [
    { 
      id: 1, 
      nombre: 'iPhone 15 Pro', 
      precio: '$999', 
      imagen: '📱',
      descripcion: 'Lo último en tecnología Apple'
    },
    { 
      id: 2, 
      nombre: 'Samsung Galaxy S24', 
      precio: '$899', 
      imagen: '📱',
      descripcion: 'Potencia y elegancia'
    },
    { 
      id: 3, 
      nombre: 'Google Pixel 8', 
      precio: '$699', 
      imagen: '📱',
      descripcion: 'La mejor cámara del mercado'
    },
    { 
      id: 4, 
      nombre: 'OnePlus 12', 
      precio: '$799', 
      imagen: '📱',
      descripcion: 'Rendimiento excepcional'
    },
    { 
      id: 5, 
      nombre: 'Xiaomi 14 Pro', 
      precio: '$649', 
      imagen: '📱',
      descripcion: 'Calidad precio inigualable'
    },
    { 
      id: 6, 
      nombre: 'Motorola Edge 40', 
      precio: '$499', 
      imagen: '📱',
      descripcion: 'Innovación accesible'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {productos.map(producto => (
        <div 
          key={producto.id} 
          className="group bg-brand-light rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-brand-contrast"
        >
          {/* Imagen del producto */}
          <div className="bg-gradient-to-br from-brand-dark-100 to-brand-light-200 p-8 sm:p-12 flex items-center justify-center">
            <div className="text-7xl sm:text-8xl">
              {producto.imagen}
            </div>
          </div>
          
          {/* Información del producto */}
          <div className="p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-contrast transition-colors">
              {producto.nombre}
            </h3>
            
            <p className="text-3xl sm:text-4xl font-bold text-brand-button mb-6">
              {producto.precio}
            </p>
            
            {/* Botón de acción */}
            <button className="w-full bg-brand-contrast text-brand-light font-semibold py-3 px-6 rounded-lg hover:bg-brand-contrast-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-contrast/30 hover:-translate-y-0.5">
              Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
