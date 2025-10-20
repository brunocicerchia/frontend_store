import React from 'react';

export default function ProductsTable({ 
  listings, 
  mySeller,
  onEdit, 
  onDelete 
}) {
  const filteredListings = listings.filter(listing => mySeller && listing.sellerId === mySeller.id);

  return (
    <div className="bg-brand-light rounded-xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-brand-dark">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-brand-light uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredListings.map((listing) => (
              <tr key={listing.id} className="hover:bg-brand-dark/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">
                  #{listing.id}
                </td>
                <td className="px-6 py-4 text-sm text-brand-dark">
                  <div className="font-semibold">{listing.brand?.name || 'N/A'}</div>
                  <div className="text-gray-600">{listing.variant?.model?.modelName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {listing.variant?.ram}GB / {listing.variant?.storage}GB - {listing.variant?.color}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-button">
                  ${listing.price?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    listing.stock > 5 ? 'bg-green-100 text-green-800' :
                    listing.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {listing.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    listing.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(listing)}
                      className="text-brand-contrast hover:text-brand-contrast-600 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(listing)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 bg-brand-light">
          <p className="text-brand-dark text-lg">No tienes listings disponibles</p>
          <p className="text-gray-500 text-sm mt-2">Crea tu primer producto usando el botón de arriba</p>
        </div>
      )}
    </div>
  );
}
