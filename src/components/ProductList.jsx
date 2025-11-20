// src/components/ProductList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductImage from "./ProductImage";
import Notification from "./Notification";

import { addItemToCart } from "../store/cartSlice";
import { selectIsAuthenticated } from "../store/authSlice";
import {
  fetchListings,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../store/productsSlice";

function ProductList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuthenticated);
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const productsError = useSelector(selectProductsError);

  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchListings({ page: 0, size: 100 }));
    }
  }, [dispatch, productsStatus]);

  const getSortedListings = () => {
    const listingsCopy = [...(products || [])].filter(
      (listing) => listing?.active !== false
    );

    if (sortOrder === "price-asc") {
      return listingsCopy.sort((a, b) => {
        const priceA = listingPrice(a);
        const priceB = listingPrice(b);
        return priceA - priceB;
      });
    }

    if (sortOrder === "price-desc") {
      return listingsCopy.sort((a, b) => {
        const priceA = listingPrice(a);
        const priceB = listingPrice(b);
        return priceB - priceA;
      });
    }

    return listingsCopy;
  };

  const listingPrice = (listing) =>
    listing.discountActive && listing.effectivePrice
      ? listing.effectivePrice
      : listing.price;

  const sortedListings = getSortedListings();

  const handleAddToCart = async (listingId, e) => {
    e.stopPropagation();

    if (!isAuth) {
      setNotification({
        type: "warning",
        message: "Debes iniciar sesión para agregar productos al carrito.",
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      setAddingToCart(listingId);
      await dispatch(addItemToCart({ listingId, quantity: 1 })).unwrap();
      setNotification({
        type: "success",
        message: "Producto agregado al carrito exitosamente.",
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      setNotification({
        type: "error",
        message:
          err.message ||
          "Error al agregar el producto. Intenta nuevamente.",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  if (productsStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-contrast mx-auto mb-4" />
          <p className="text-sm text-gray-300">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (productsStatus === "failed") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-3xl px-10 py-8 border border-red-200/40 max-w-lg">
          <div className="text-4xl mb-3 text-red-400">:(</div>
          <p className="text-base text-gray-100 mb-1">
            {productsError || "No se pudieron cargar los productos."}
          </p>
          <p className="text-xs text-gray-400">
            Intentá recargar la página en unos segundos.
          </p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-3xl px-10 py-8 border border-white/10 max-w-md">
          <div className="text-5xl mb-4">📱</div>
          <p className="text-base text-gray-100 mb-1">
            No hay productos disponibles
          </p>
          <p className="text-xs text-gray-400">
            Cuando se publiquen productos, los vas a ver acá.
          </p>
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

      {/* ENCABEZADO */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100 tracking-tight">
            Productos disponibles
          </h2>
          <p className="text-xs text-gray-400">
            Mostrando{" "}
            <span className="text-gray-100 font-medium">
              {sortedListings.length}
            </span>{" "}
            producto{sortedListings.length !== 1 && "s"}
          </p>
        </div>

        {/* Ordenamiento */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-400">Ordenar por</span>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="
              bg-white text-gray-800 border border-gray-300 
              rounded-full px-4 py-2 text-sm shadow-sm 
              hover:border-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#1282A2] 
              transition
            "
          >
            <option value="default">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedListings.map((listing) => {
          const hasDiscount =
            listing.discountActive &&
            listing.effectivePrice < listing.price;

          return (
            <article
              key={listing.id}
              className="
                bg-white rounded-3xl shadow 
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300 overflow-hidden flex flex-col
              "
            >
              <div className="bg-white">
                <ProductImage
                  variantId={listing.variantId}
                  className="w-full h-72 object-contain p-6"
                />
              </div>

              <div className="px-6 pt-3 pb-6 flex flex-col flex-1">
                {listing.brand && (
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                    {listing.brand.name}
                  </p>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {listing.variant?.model?.modelName}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  {[listing.variant?.ram + " GB RAM", listing.variant?.storage + " GB", listing.variant?.color]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                {listing.seller && (
                  <p className="text-[11px] text-gray-400 mb-4">
                    Vendido por{" "}
                    <span className="text-gray-600">{listing.seller.shopName}</span>
                  </p>
                )}

                <div className="border-t border-gray-100 my-3" />

                <div className="flex flex-wrap gap-2 items-center mb-4">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {listing.stock > 0 ? `Stock: ${listing.stock}` : "Sin stock"}
                  </span>

                  {listing.variant?.condition && (
                    <span className="text-[11px] px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {listing.variant.condition === "NEW"
                        ? "Nuevo"
                        : listing.variant.condition === "REFURB"
                        ? "Reacondicionado"
                        : "Usado"}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  {hasDiscount && (
                    <p className="text-xs text-gray-400 line-through">
                      ${listing.price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-3xl font-semibold text-gray-900">
                    $
                    {(
                      listing.effectivePrice ??
                      listing.price
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => navigate(`/producto/${listing.id}`)}
                    className="
                      w-full sm:w-1/2 py-2.5 rounded-xl
                      border border-gray-300 text-gray-800 bg-white
                      hover:bg-gray-50 hover:border-gray-400
                      transition
                    "
                  >
                    Ver detalles
                  </button>

                  <button
                    onClick={(e) => handleAddToCart(listing.id, e)}
                    disabled={listing.stock === 0}
                    className={`
                      w-full sm:w-1/2 py-2.5 rounded-xl text-white 
                      transition 
                      ${
                        listing.stock > 0
                          ? "bg-[#1282A2] hover:bg-[#0f6c88]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {listing.stock > 0 ? "Agregar al carrito" : "No disponible"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default ProductList;
