import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import Notification from "../components/Notification";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  removeUserThunk,
  updateUserRoleThunk,
} from "../store/usersSlice";
import {
  fetchListings,
  selectProducts,
  selectProductsStatus,
  deleteListingThunk,
  updateListingThunk,
} from "../store/productsSlice";
import {
  getAllBrands,
  getAllDeviceModels,
  getAllVariants,
  updateBrand,
  updateDeviceModel,
  updateVariant,
} from "../api/products";

export default function Admin() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const usersStatus = useSelector(selectUsersStatus);
  const listings = useSelector(selectProducts);
  const listingsStatus = useSelector(selectProductsStatus);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [listingEdits, setListingEdits] = useState({});
  const [brandEdits, setBrandEdits] = useState({});
  const [modelEdits, setModelEdits] = useState({});
  const [variantEdits, setVariantEdits] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const bootstrapped = useRef(false);
  const listingsBootstrapped = useRef(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!bootstrapped.current && currentUser?.roles?.includes("ADMIN")) {
      bootstrapped.current = true;
      dispatch(fetchUsers());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!listingsBootstrapped.current && currentUser?.roles?.includes("ADMIN")) {
      listingsBootstrapped.current = true;
      dispatch(fetchListings({ page: 0, size: 100 }));
      (async () => {
        try {
          const [brandsData, modelsData, variantsData] = await Promise.all([
            getAllBrands(),
            getAllDeviceModels(),
            getAllVariants(),
          ]);
          setBrands(brandsData);
          setModels(modelsData);
          setVariants(variantsData);
        } catch (err) {
          console.error("Error cargando catálogos globales", err);
        }
      })();
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    setBrandEdits((prev) => {
      const next = { ...prev };
      brands.forEach((brand) => {
        if (!next[brand.id]) {
          next[brand.id] = { name: brand.name || "" };
        }
      });
      Object.keys(next).forEach((id) => {
        if (!brands.find((brand) => String(brand.id) === String(id))) {
          delete next[id];
        }
      });
      return next;
    });
  }, [brands]);

  useEffect(() => {
    setModelEdits((prev) => {
      const next = { ...prev };
      models.forEach((model) => {
        if (!next[model.id]) {
          next[model.id] = { modelName: model.modelName || "" };
        }
      });
      Object.keys(next).forEach((id) => {
        if (!models.find((model) => String(model.id) === String(id))) {
          delete next[id];
        }
      });
      return next;
    });
  }, [models]);

  useEffect(() => {
    setVariantEdits((prev) => {
      const next = { ...prev };
      variants.forEach((variant) => {
        if (!next[variant.id]) {
          next[variant.id] = {
            ram: variant.ram ?? "",
            storage: variant.storage ?? "",
            color: variant.color ?? "",
            condition: variant.condition ?? "NEW",
          };
        }
      });
      Object.keys(next).forEach((id) => {
        if (!variants.find((variant) => String(variant.id) === String(id))) {
          delete next[id];
        }
      });
      return next;
    });
  }, [variants]);

  useEffect(() => {
    setListingEdits((prev) => {
      const next = { ...prev };
      listings.forEach((listing) => {
        if (!next[listing.id]) {
          next[listing.id] = {
            price: Number(listing.price ?? listing.effectivePrice ?? 0),
            stock: Number(listing.stock ?? 0),
          };
        }
      });
      // Remove edits of deleted listings
      Object.keys(next).forEach((id) => {
        if (!listings.find((listing) => String(listing.id) === String(id))) {
          delete next[id];
        }
      });
      return next;
    });
  }, [listings]);

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`¿Estás seguro que deseas eliminar al usuario "${username}"?`)) return;

    try {
      await dispatch(removeUserThunk(userId)).unwrap();
      showNotification(`Usuario "${username}" eliminado correctamente`, "success");
    } catch (error) {
      showNotification(error.message || "Error al eliminar usuario", "error");
    }
  };

  const handleRoleChange = async (userId, newRole, username) => {
    try {
      await dispatch(updateUserRoleThunk({ userId, newRole })).unwrap();
      showNotification(`Rol de "${username}" actualizado a ${newRole}`, "success");
    } catch (error) {
      showNotification(error.message || "Error al cambiar el rol", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "success" });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-contrast"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.roles?.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  const isLoading = usersStatus === "loading";
  const listingsLoading = listingsStatus === "loading";

  const deriveListingPayload = (listing, overrides = {}) => {
    const sellerId = listing.sellerId ?? listing.seller?.id;
    const variantId = listing.variantId ?? listing.variant?.id;
    return {
      sellerId,
      variantId,
      price: Number(listing.price ?? 0),
      stock: Number(listing.stock ?? 0),
      active: listing.active,
      discountType: listing.discountType ?? "NONE",
      discountValue: Number(listing.discountValue ?? 0),
      discountActive: Boolean(listing.discountActive),
      ...overrides,
    };
  };

  const handleUpdateListing = async (listing, overrides) => {
    const payload = deriveListingPayload(listing, overrides);
    if (!payload.sellerId || !payload.variantId) {
      showNotification("No se encontró información del vendedor/variante para esta publicación.", "error");
      return;
    }
    try {
      await dispatch(
        updateListingThunk({ listingId: listing.id, data: payload })
      ).unwrap();
      showNotification("Publicación actualizada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al actualizar la publicación", "error");
    }
  };

  const handleSaveListing = async (listing) => {
    const edits = listingEdits[listing.id];
    if (!edits) return;
    await handleUpdateListing(listing, {
      price: Number(edits.price ?? listing.price ?? 0),
      stock: Number(edits.stock ?? listing.stock ?? 0),
    });
  };

  const handleDeleteListing = async (listing) => {
    if (
      !confirm(
        `¿Estás seguro que deseas eliminar la publicación "${listing.orderNumber ?? listing.id}"?`
      )
    )
      return;

    const sellerId = listing.sellerId ?? listing.seller?.id;
    if (!sellerId) {
      showNotification("No se encontró información del vendedor para esta publicación.", "error");
      return;
    }

    try {
      await dispatch(
        deleteListingThunk({ listingId: listing.id, sellerId })
      ).unwrap();
      showNotification("Publicación eliminada correctamente", "success");
      setListingEdits((prev) => {
        const next = { ...prev };
        delete next[listing.id];
        return next;
      });
    } catch (error) {
      showNotification(error.message || "Error al eliminar la publicación", "error");
    }
  };

  const handleSaveBrand = async (brand) => {
    const edits = brandEdits[brand.id];
    if (!edits) return;
    try {
      const updated = await updateBrand(brand.id, { name: edits.name });
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, ...updated } : b))
      );
      showNotification("Marca actualizada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al actualizar la marca", "error");
    }
  };

  const handleSaveModel = async (model) => {
    const edits = modelEdits[model.id];
    if (!edits) return;
    try {
      const updated = await updateDeviceModel(model.id, {
        modelName: edits.modelName,
        brandId: model.brandId,
      });
      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, ...updated } : m))
      );
      showNotification("Modelo actualizado correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al actualizar el modelo", "error");
    }
  };

  const handleSaveVariant = async (variant) => {
    const edits = variantEdits[variant.id];
    if (!edits) return;
    try {
      const payload = {
        deviceModelId: variant.deviceModelId,
        ram: Number(edits.ram ?? variant.ram ?? 0),
        storage: Number(edits.storage ?? variant.storage ?? 0),
        color: edits.color ?? variant.color ?? "",
        condition: edits.condition ?? variant.condition ?? "NEW",
      };
      const updated = await updateVariant(variant.id, payload);
      setVariants((prev) =>
        prev.map((v) => (v.id === variant.id ? { ...v, ...updated } : v))
      );
      showNotification("Variante actualizada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al actualizar la variante", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark">Administración de Usuarios</h1>
          <p className="mt-2 text-gray-600">Gestiona usuarios y sus roles</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-contrast"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                        {user.id === currentUser.id && (
                          <span className="ml-2 text-xs text-brand-contrast">(Tú)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.roles?.[0] || "BUYER"}
                          onChange={(e) => handleRoleChange(user.id, e.target.value, `${user.firstname} ${user.lastname}`)}
                          disabled={user.id === currentUser.id}
                          className={`text-sm px-3 py-1 rounded-full font-semibold ${
                            user.roles?.includes("ADMIN")
                              ? "bg-purple-100 text-purple-800"
                              : user.roles?.includes("SELLER")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          } ${user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="SELLER">SELLER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteUser(user.id, `${user.firstname} ${user.lastname}`)}
                          disabled={user.id === currentUser.id}
                          className={`text-red-600 hover:text-red-900 font-medium ${
                            user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Total Usuarios</div>
            <div className="mt-2 text-3xl font-bold text-brand-dark">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Compradores</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {users.filter((u) => u.roles?.includes("BUYER")).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Vendedores</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {users.filter((u) => u.roles?.includes("SELLER")).length}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-brand-dark">Moderación de publicaciones</h2>
              <p className="text-sm text-gray-600">
                Activa, desactiva o elimina cualquier publicación del marketplace.
              </p>
            </div>
            <button
              onClick={() => dispatch(fetchListings({ page: 0, size: 100 }))}
              className="px-4 py-2 rounded-lg border border-brand-dark/20 text-brand-dark hover:bg-brand-dark/10"
            >
              Actualizar publicaciones
            </button>
          </div>

          {listingsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-brand-contrast"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No hay publicaciones registradas.
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendedor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => {
                    const displayTitle =
                      listing.title ||
                      listing.productTitle ||
                      listing.variant?.model?.modelName ||
                      listing.variant?.name ||
                      `Listing #${listing.id}`;
                    const sellerName =
                      listing.seller?.shopName ||
                      `${listing.seller?.firstname ?? ""} ${listing.seller?.lastname ?? ""}`.trim() ||
                      `Seller #${listing.sellerId ?? "?"}`;
                    const price =
                      Number(listing.discountActive ? listing.effectivePrice ?? listing.price : listing.price || 0);
                    const stock = Number(listing.stock ?? listing.variant?.stock ?? 0);
                    return (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{listing.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{displayTitle}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{sellerName}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-brand-dark">
                          <input
                            type="number"
                            step="0.01"
                            value={listingEdits[listing.id]?.price ?? price}
                            onChange={(e) =>
                              setListingEdits((prev) => ({
                                ...prev,
                                [listing.id]: {
                                  ...(prev[listing.id] || {}),
                                  price: e.target.value,
                                  stock: prev[listing.id]?.stock ?? stock,
                                },
                              }))
                            }
                            className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <input
                            type="number"
                            value={listingEdits[listing.id]?.stock ?? stock}
                            onChange={(e) =>
                              setListingEdits((prev) => ({
                                ...prev,
                                [listing.id]: {
                                  ...(prev[listing.id] || {}),
                                  stock: e.target.value,
                                  price: prev[listing.id]?.price ?? price,
                                },
                              }))
                            }
                            className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              listing.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {listing.active ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td className="px-4 py-3 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleUpdateListing(listing, { active: !listing.active })}
                            className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                              listing.active
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {listing.active ? "Desactivar" : "Activar"}
                          </button>
                          <button
                            onClick={() => handleSaveListing(listing)}
                            className="px-3 py-1 rounded-lg border border-brand-dark/30 text-sm font-medium text-brand-dark hover:bg-brand-dark/5"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing)}
                            className="px-3 py-1 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-brand-dark">Catálogos (marcas, modelos y variantes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-brand-dark">Marcas</h3>
                <span className="text-sm text-gray-500">{brands.length}</span>
              </div>
              <div className="max-h-64 overflow-auto space-y-3">
                {brands.slice(0, 15).map((brand) => (
                  <div
                    key={brand.id}
                    className="px-3 py-3 rounded-lg bg-gray-50 text-sm text-brand-dark space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">ID {brand.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={brandEdits[brand.id]?.name ?? brand.name ?? ""}
                        onChange={(e) =>
                          setBrandEdits((prev) => ({
                            ...prev,
                            [brand.id]: { name: e.target.value },
                          }))
                        }
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1"
                      />
                      <button
                        onClick={() => handleSaveBrand(brand)}
                        className="px-3 py-1 rounded-lg border border-brand-dark/20 text-sm text-brand-dark hover:bg-brand-dark/5"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
                {brands.length === 0 && (
                  <div className="text-sm text-gray-500">No hay marcas registradas.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-brand-dark">Modelos</h3>
                <span className="text-sm text-gray-500">{models.length}</span>
              </div>
              <div className="max-h-64 overflow-auto space-y-3">
                {models.slice(0, 15).map((model) => (
                  <div
                    key={model.id}
                    className="px-3 py-3 rounded-lg bg-gray-50 text-sm text-brand-dark space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        ID {model.id} · Marca {model.brandId ?? "—"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={modelEdits[model.id]?.modelName ?? model.modelName ?? ""}
                        onChange={(e) =>
                          setModelEdits((prev) => ({
                            ...prev,
                            [model.id]: { modelName: e.target.value },
                          }))
                        }
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1"
                      />
                      <button
                        onClick={() => handleSaveModel(model)}
                        className="px-3 py-1 rounded-lg border border-brand-dark/20 text-sm text-brand-dark hover:bg-brand-dark/5"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
                {models.length === 0 && (
                  <div className="text-sm text-gray-500">No hay modelos cargados.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-brand-dark">Variantes</h3>
                <span className="text-sm text-gray-500">{variants.length}</span>
              </div>
              <div className="max-h-64 overflow-auto space-y-3">
                {variants.slice(0, 15).map((variant) => (
                  <div
                    key={variant.id}
                    className="px-3 py-3 rounded-lg bg-gray-50 text-sm text-brand-dark space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        ID {variant.id} · Modelo {variant.deviceModelId ?? "—"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={variantEdits[variant.id]?.ram ?? variant.ram ?? ""}
                        onChange={(e) =>
                          setVariantEdits((prev) => ({
                            ...prev,
                            [variant.id]: { ...(prev[variant.id] || {}), ram: e.target.value },
                          }))
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1"
                        placeholder="RAM"
                      />
                      <input
                        type="number"
                        value={variantEdits[variant.id]?.storage ?? variant.storage ?? ""}
                        onChange={(e) =>
                          setVariantEdits((prev) => ({
                            ...prev,
                            [variant.id]: { ...(prev[variant.id] || {}), storage: e.target.value },
                          }))
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1"
                        placeholder="Storage"
                      />
                      <input
                        type="text"
                        value={variantEdits[variant.id]?.color ?? variant.color ?? ""}
                        onChange={(e) =>
                          setVariantEdits((prev) => ({
                            ...prev,
                            [variant.id]: { ...(prev[variant.id] || {}), color: e.target.value },
                          }))
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 col-span-2"
                        placeholder="Color"
                      />
                      <select
                        value={variantEdits[variant.id]?.condition ?? variant.condition ?? "NEW"}
                        onChange={(e) =>
                          setVariantEdits((prev) => ({
                            ...prev,
                            [variant.id]: { ...(prev[variant.id] || {}), condition: e.target.value },
                          }))
                        }
                        className="border border-gray-200 rounded-lg px-2 py-1 col-span-2"
                      >
                        <option value="NEW">Nuevo</option>
                        <option value="USED">Usado</option>
                        <option value="REFURB">Reacondicionado</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSaveVariant(variant)}
                        className="px-3 py-1 rounded-lg border border-brand-dark/20 text-sm text-brand-dark hover:bg-brand-dark/5"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
                {variants.length === 0 && (
                  <div className="text-sm text-gray-500">No hay variantes disponibles.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      )}
    </div>
  );
}
