import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEnrichedListing } from '../../api/products';
import LoadingState from '../../components/product/LoadingState';
import ErrorState from '../../components/product/ErrorState';
import Breadcrumb from '../../components/product/Breadcrumb';
import ProductImage from '../../components/product/ProductImage';
import ProductDetails from '../../components/product/ProductDetails';
import Notification from '../../components/Notification';
import { addItemToCart } from '../../store/cartSlice';
import { selectIsAuthenticated } from '../../store/authSlice';

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEnrichedListing(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuth) {
      setNotification({
        type: 'warning',
        message: 'Necesitas iniciar sesión para agregar productos al carrito.',
      });
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    try {
      setAddingToCart(true);
      await dispatch(
        addItemToCart({ listingId: product.id, quantity })
      ).unwrap();
      setNotification({ type: 'success', message: 'Producto agregado al carrito exitosamente' });
    } catch (err) {
      console.error('Error adding to cart:', err);
      setNotification({ type: 'error', message: err.message || 'Error al agregar al carrito' });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const isAvailable = product.stock > 0 && product.active;
  const hasDiscount = product.discountActive && product.effectivePrice < product.price;

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Breadcrumb product={product} />

          <div className="bg-brand-light rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <ProductImage variantId={product.variantId} />

              <ProductDetails 
              product={product}
              hasDiscount={hasDiscount}
              isAvailable={isAvailable}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              addingToCart={addingToCart}
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Producto;
