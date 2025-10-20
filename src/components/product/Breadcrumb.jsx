import React from 'react';
import { useNavigate } from 'react-router-dom';

function Breadcrumb({ product }) {
  const navigate = useNavigate();

  return (
    <nav className="mb-6 sm:mb-8">
      <ol className="flex items-center space-x-2 text-sm text-brand-light-400">
        <li>
          <button onClick={() => navigate('/')} className="hover:text-brand-contrast transition-colors">
            Inicio
          </button>
        </li>
        <li className="text-brand-light-600">/</li>
        <li>
          <button onClick={() => navigate('/productos')} className="hover:text-brand-contrast transition-colors">
            Productos
          </button>
        </li>
        <li className="text-brand-light-600">/</li>
        <li className="text-brand-contrast truncate">
          {product.variant?.model?.modelName || `Producto #${product.id}`}
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumb;
