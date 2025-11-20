import { useState, useEffect, useMemo } from "react";
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
  updateBrandDetails,
  updateDeviceModelDetails,
  updateVariantDetails,
} from "../store/productsSlice";
import {
  updateBrand,
  updateDeviceModel,
  updateVariant,
  createBrand,
  createDeviceModel as createDeviceModelApi,
  createVariant as createVariantApi,
  deleteBrand as deleteBrandApi,
  deleteDeviceModel as deleteDeviceModelApi,
  deleteVariant as deleteVariantApi,
} from "../api/products";
import {
  fetchCatalogs,
  selectBrands,
  selectDeviceModels,
  selectVariants,
  selectCatalogStatus,
  upsertBrand,
  upsertDeviceModel,
  upsertVariant,
  removeBrandCascade,
  removeDeviceModelCascade,
  removeVariantEntry,
} from "../store/catalogSlice";

export default function Admin() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const usersStatus = useSelector(selectUsersStatus);
  const listings = useSelector(selectProducts);
  const listingsStatus = useSelector(selectProductsStatus);
  const brands = useSelector(selectBrands);
  const models = useSelector(selectDeviceModels);
  const variants = useSelector(selectVariants);
  const catalogStatus = useSelector(selectCatalogStatus);

  const [listingEdits, setListingEdits] = useState({});
  const [brandEdits, setBrandEdits] = useState({});
  const [modelEdits, setModelEdits] = useState({});
  const [variantEdits, setVariantEdits] = useState({});
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelData, setNewModelData] = useState({
    brandId: "",
    modelName: "",
  });
  const [newVariantData, setNewVariantData] = useState({
    deviceModelId: "",
    ram: "",
    storage: "",
    color: "",
    condition: "NEW",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState("users"); // "users" | "listings" | "catalogs"

  const brandMap = useMemo(() => {
    const map = new Map();
    brands.forEach((brand) => {
      map.set(String(brand.id), brand);
    });
    return map;
  }, [brands]);

  const modelMap = useMemo(() => {
    const map = new Map();
    models.forEach((model) => {
      map.set(String(model.id), model);
    });
    return map;
  }, [models]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!currentUser?.roles?.includes("ADMIN")) return;
    if (usersStatus === "idle" || usersStatus === "failed") {
      dispatch(fetchUsers());
    }
  }, [currentUser, dispatch, usersStatus]);

  useEffect(() => {
    if (!currentUser?.roles?.includes("ADMIN")) return;
    if (listingsStatus === "idle") {
      dispatch(fetchListings({ page: 0, size: 100 }));
    }
  }, [currentUser, dispatch, listingsStatus]);

  useEffect(() => {
    if (!currentUser?.roles?.includes("ADMIN")) return;
    if (catalogStatus === "idle" || catalogStatus === "failed") {
      dispatch(fetchCatalogs());
    }
  }, [currentUser, dispatch, catalogStatus]);

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
    if (!newModelData.brandId && brands.length > 0) {
      setNewModelData((prev) => ({
        ...prev,
        brandId: String(brands[0].id),
      }));
    } else if (
      newModelData.brandId &&
      !brands.find((brand) => String(brand.id) === String(newModelData.brandId))
    ) {
      setNewModelData((prev) => ({
        ...prev,
        brandId: brands[0] ? String(brands[0].id) : "",
      }));
    }
  }, [brands, newModelData.brandId]);

  useEffect(() => {
    if (!newVariantData.deviceModelId && models.length > 0) {
      setNewVariantData((prev) => ({
        ...prev,
        deviceModelId: String(models[0].id),
      }));
    } else if (
      newVariantData.deviceModelId &&
      !models.find(
        (model) => String(model.id) === String(newVariantData.deviceModelId)
      )
    ) {
      setNewVariantData((prev) => ({
        ...prev,
        deviceModelId: models[0] ? String(models[0].id) : "",
      }));
    }
  }, [models, newVariantData.deviceModelId]);

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
      Object.keys(next).forEach((id) => {
        if (!listings.find((listing) => String(listing.id) === String(id))) {
          delete next[id];
        }
      });
      return next;
    });
  }, [listings]);

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`¿Estás seguro que deseas eliminar al usuario "${username}"?`))
      return;

    try {
      await dispatch(removeUserThunk(userId)).unwrap();
      showNotification(
        `Usuario "${username}" eliminado correctamente`,
        "success"
      );
    } catch (error) {
      showNotification(error.message || "Error al eliminar usuario", "error");
    }
  };

  const handleRoleChange = async (userId, newRole, username) => {
    try {
      await dispatch(updateUserRoleThunk({ userId, newRole })).unwrap();
      showNotification(
        `Rol de "${username}" actualizado a ${newRole}`,
        "success"
      );
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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
      showNotification(
        "No se encontró información del vendedor/variante para esta publicación.",
        "error"
      );
      return;
    }
    try {
      await dispatch(
        updateListingThunk({ listingId: listing.id, data: payload })
      ).unwrap();
      showNotification("Publicación actualizada correctamente", "success");
    } catch (error) {
      showNotification(
        error.message || "Error al actualizar la publicación",
        "error"
      );
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
        `¿Estás seguro que deseas eliminar la publicación "${
          listing.orderNumber ?? listing.id
        }"?`
      )
    )
      return;

    const sellerId = listing.sellerId ?? listing.seller?.id;
    if (!sellerId) {
      showNotification(
        "No se encontró información del vendedor para esta publicación.",
        "error"
      );
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
      showNotification(
        error.message || "Error al eliminar la publicación",
        "error"
      );
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    const name = newBrandName.trim();
    if (!name) {
      showNotification("Ingresa un nombre para la marca", "warning");
      return;
    }
    try {
      const created = await createBrand({ name });
      dispatch(upsertBrand(created));
      setNewBrandName("");
      showNotification("Marca creada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al crear la marca", "error");
    }
  };

  const handleCreateModel = async (e) => {
    e.preventDefault();
    if (!newModelData.brandId || !newModelData.modelName.trim()) {
      showNotification("Completa la marca y el nombre del modelo", "warning");
      return;
    }
    try {
      const payload = {
        brandId: Number(newModelData.brandId),
        modelName: newModelData.modelName.trim(),
      };
      const created = await createDeviceModelApi(payload);
      dispatch(upsertDeviceModel(created));
      setNewModelData((prev) => ({ ...prev, modelName: "" }));
      showNotification("Modelo creado correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al crear el modelo", "error");
    }
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    if (
      !newVariantData.deviceModelId ||
      !newVariantData.ram ||
      !newVariantData.storage ||
      !newVariantData.color.trim()
    ) {
      showNotification("Completa todos los campos de la variante", "warning");
      return;
    }
    try {
      const payload = {
        deviceModelId: Number(newVariantData.deviceModelId),
        ram: Number(newVariantData.ram),
        storage: Number(newVariantData.storage),
        color: newVariantData.color.trim(),
        condition: newVariantData.condition || "NEW",
      };
      const created = await createVariantApi(payload);
      dispatch(upsertVariant(created));
      setNewVariantData((prev) => ({
        ...prev,
        ram: "",
        storage: "",
        color: "",
      }));
      showNotification("Variante creada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al crear la variante", "error");
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!confirm(`Estas seguro que quieres eliminar la marca "${brand.name}"?`)) {
      return;
    }
    try {
      await deleteBrandApi(brand.id);
      dispatch(removeBrandCascade(brand.id));
      showNotification("Marca eliminada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al eliminar la marca", "error");
    }
  };

  const handleDeleteModel = async (model) => {
    if (
      !confirm(
        `Estas seguro que quieres eliminar el modelo "${model.modelName}"?`
      )
    ) {
      return;
    }
    try {
      await deleteDeviceModelApi(model.id);
      dispatch(removeDeviceModelCascade(model.id));
      showNotification("Modelo eliminado correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al eliminar el modelo", "error");
    }
  };

  const handleDeleteVariant = async (variant) => {
    if (!confirm(`Estas seguro que quieres eliminar la variante #${variant.id}?`)) {
      return;
    }
    try {
      await deleteVariantApi(variant.id);
      dispatch(removeVariantEntry(variant.id));
      showNotification("Variante eliminada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al eliminar la variante", "error");
    }
  };

  const handleSaveBrand = async (brand) => {
    const edits = brandEdits[brand.id];
    if (!edits) return;
    try {
      const updated = await updateBrand(brand.id, { name: edits.name });
      if (updated) {
        dispatch(upsertBrand(updated));
        dispatch(updateBrandDetails(updated));
      }
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
      if (updated) {
        dispatch(upsertDeviceModel(updated));
        dispatch(updateDeviceModelDetails(updated));
      }
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
      if (updated) {
        dispatch(upsertVariant(updated));
        dispatch(updateVariantDetails(updated));
      }
      showNotification("Variante actualizada correctamente", "success");
    } catch (error) {
      showNotification(error.message || "Error al actualizar la variante", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header principal */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Panel de administración
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Gestiona usuarios, publicaciones del marketplace y catálogos
              desde un solo lugar.
            </p>
          </div>

          {/* Tarjetas igualadas */}
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sesión */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 min-h-[96px] flex flex-col justify-between">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Sesión
                </div>
                <div className="mt-0.5 text-sm font-semibold text-slate-900">
                  {currentUser?.firstname} {currentUser?.lastname}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 w-fit">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ADMIN activo
                </div>
              </div>

              {/* Usuarios */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 min-h-[96px] flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Usuarios
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900 leading-none">
                  {users.length}
                </div>
              </div>

              {/* Publicaciones */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 min-h-[96px] flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Publicaciones
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900 leading-none">
                  {listings.length}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs navegación */}
        <nav className="mb-6 border-b border-slate-200">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: "users", label: "Usuarios" },
              { id: "listings", label: "Publicaciones" },
              { id: "catalogs", label: "Catálogos" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-brand-dark"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-all ${
                      active ? "bg-brand-contrast" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        {/* TAB: Usuarios */}
        {activeTab === "users" && (
          <section className="space-y-8">
            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Administración de usuarios
                  </h2>
                  <p className="text-sm text-slate-500">
                    Cambia roles, revisa cuentas y elimina usuarios.
                  </p>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-brand-contrast animate-pulse" />
                    Actualizando usuarios...
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-contrast"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50/70">
                      <tr>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-6 text-center text-slate-500"
                          >
                            No se encontraron usuarios.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-500">
                              #{user.id}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>
                                  {user.firstname} {user.lastname}
                                </span>
                                {user.id === currentUser.id && (
                                  <span className="inline-flex items-center rounded-full bg-brand-contrast/10 px-2 py-0.5 text-[11px] font-semibold text-brand-contrast">
                                    Tú
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <select
                                value={user.roles?.[0] || "BUYER"}
                                onChange={(e) =>
                                  handleRoleChange(
                                    user.id,
                                    e.target.value,
                                    `${user.firstname} ${user.lastname}`
                                  )
                                }
                                disabled={user.id === currentUser.id}
                                className={`text-xs px-3 py-1 rounded-full font-semibold border border-transparent focus:outline-none focus:ring-1 focus:ring-brand-contrast/50 ${
                                  user.roles?.includes("ADMIN")
                                    ? "bg-purple-100 text-purple-800"
                                    : user.roles?.includes("SELLER")
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-emerald-100 text-emerald-800"
                                } ${
                                  user.id === currentUser.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <option value="BUYER">BUYER</option>
                                <option value="SELLER">SELLER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-500">
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user.id,
                                    `${user.firstname} ${user.lastname}`
                                  )
                                }
                                disabled={user.id === currentUser.id}
                                className={`inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 ${
                                  user.id === currentUser.id
                                    ? "opacity-40 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <span>Eliminar</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Resumen rápido usuarios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total usuarios
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {users.length}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Compradores
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-600">
                  {users.filter((u) => u.roles?.includes("BUYER")).length}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Vendedores
                </div>
                <div className="mt-2 text-3xl font-bold text-blue-600">
                  {users.filter((u) => u.roles?.includes("SELLER")).length}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB: Publicaciones */}
        {activeTab === "listings" && (
          <section className="mt-2 space-y-6">
            <div className="bg-white shadow-sm rounded-2xl border border-slate-200">
              <div className="px-6 py-4 flex flex-wrap gap-3 items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Moderación de publicaciones
                  </h2>
                  <p className="text-sm text-slate-500">
                    Activa, desactiva o elimina cualquier publicación del
                    marketplace.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                    Total: {listings.length}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        fetchListings({ page: 0, size: 100, force: true })
                      )
                    }
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Actualizar
                  </button>
                </div>
              </div>

              {listingsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-brand-contrast"></div>
                </div>
              ) : listings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No hay publicaciones registradas.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50/70">
                      <tr>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Producto
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Vendedor
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {listings.map((listing) => {
                        const displayTitle =
                          listing.title ||
                          listing.productTitle ||
                          listing.variant?.model?.modelName ||
                          listing.variant?.name ||
                          `Listing #${listing.id}`;
                        const sellerName =
                          listing.seller?.shopName ||
                          `${listing.seller?.firstname ?? ""} ${
                            listing.seller?.lastname ?? ""
                          }`.trim() ||
                          `Seller #${listing.sellerId ?? "?"}`;
                        const price = Number(
                          listing.discountActive
                            ? listing.effectivePrice ?? listing.price
                            : listing.price || 0
                        );
                        const stock = Number(
                          listing.stock ?? listing.variant?.stock ?? 0
                        );
                        return (
                          <tr
                            key={listing.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-4 py-3 text-xs text-slate-500">
                              #{listing.id}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">
                              {displayTitle}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                              {sellerName}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">
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
                                      stock:
                                        prev[listing.id]?.stock ?? stock,
                                    },
                                  }))
                                }
                                className="w-28 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              <input
                                type="number"
                                value={listingEdits[listing.id]?.stock ?? stock}
                                onChange={(e) =>
                                  setListingEdits((prev) => ({
                                    ...prev,
                                    [listing.id]: {
                                      ...(prev[listing.id] || {}),
                                      stock: e.target.value,
                                      price:
                                        prev[listing.id]?.price ?? price,
                                    },
                                  }))
                                }
                                className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  listing.active
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                                {listing.active ? "Activa" : "Inactiva"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateListing(listing, {
                                      active: !listing.active,
                                    })
                                  }
                                  className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                    listing.active
                                      ? "border-red-200 text-red-600 hover:bg-red-50"
                                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                  }`}
                                >
                                  {listing.active ? "Desactivar" : "Activar"}
                                </button>
                                <button
                                  onClick={() => handleSaveListing(listing)}
                                  className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(listing)}
                                  className="px-3 py-1 rounded-lg border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: Catálogos */}
        {activeTab === "catalogs" && (
          <section className="mt-2 w-full max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Catálogos (marcas, modelos y variantes)
              </h2>
              <p className="text-sm text-slate-500">
                Administra el catálogo base sobre el que se crean las
                publicaciones.
              </p>
            </div>

            {/* Marcas */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Marcas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Crea nuevas marcas y edita nombres existentes.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center text-xs text-slate-500 rounded-full bg-slate-50 px-3 py-1 border border-slate-200 min-w-[72px]">
                  {brands.length} total
                </span>
              </div>

              <form
                onSubmit={handleCreateBrand}
                className="flex gap-2 mb-1"
              >
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Nueva marca"
                  className="flex-1 h-10 border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                />
                <button
                  type="submit"
                  disabled={!newBrandName.trim()}
                  className="h-10 px-4 rounded-xl bg-brand-contrast text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Agregar
                </button>
              </form>

              <div className="mt-1 max-h-[28rem] overflow-auto space-y-3 pr-1">
                {brands.slice(0, 50).map((brand) => (
                  <div
                    key={brand.id}
                    className="px-3 py-3 rounded-2xl bg-slate-50 text-xs text-slate-900 border border-slate-200/70 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 font-mono">
                        ID {brand.id}
                      </span>
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
                        className="flex-1 h-9 border border-slate-200 rounded-xl px-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveBrand(brand)}
                          className="h-9 px-3 rounded-xl border border-slate-300 text-[11px] font-medium text-slate-800 hover:bg-slate-100 min-w-[80px]"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brand)}
                          className="h-9 px-3 rounded-xl border border-red-400 text-[11px] font-medium text-red-600 hover:bg-red-50 min-w-[80px]"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {brands.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No hay marcas registradas.
                  </div>
                )}
              </div>
            </div>

            {/* Modelos */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Modelos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Asocia modelos a una marca y edita sus nombres.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center text-xs text-slate-500 rounded-full bg-slate-50 px-3 py-1 border border-slate-200 min-w-[72px]">
                  {models.length} total
                </span>
              </div>

              <form
                onSubmit={handleCreateModel}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-1"
              >
                <select
                  value={newModelData.brandId}
                  onChange={(e) =>
                    setNewModelData((prev) => ({
                      ...prev,
                      brandId: e.target.value,
                    }))
                  }
                  className="h-10 border border-slate-200 rounded-xl px-2 text-xs sm:col-span-4 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                >
                  <option value="">Marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newModelData.modelName}
                  onChange={(e) =>
                    setNewModelData((prev) => ({
                      ...prev,
                      modelName: e.target.value,
                    }))
                  }
                  placeholder="Nombre del modelo"
                  className="h-10 border border-slate-200 rounded-xl px-3 text-xs sm:col-span-6 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                />
                <button
                  type="submit"
                  disabled={
                    !newModelData.brandId || !newModelData.modelName.trim()
                  }
                  className="h-10 px-4 rounded-xl bg-brand-contrast text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm sm:col-span-2"
                >
                  Agregar
                </button>
              </form>

              <div className="mt-1 max-h-[28rem] overflow-auto space-y-3 pr-1">
                {models.slice(0, 50).map((model) => (
                  <div
                    key={model.id}
                    className="px-3 py-3 rounded-2xl bg-slate-50 text-xs text-slate-900 border border-slate-200/70 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 font-mono">
                        ID {model.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Marca{" "}
                        {brandMap.get(String(model.brandId))?.name ??
                          model.brandId ??
                          "-"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          modelEdits[model.id]?.modelName ??
                          model.modelName ??
                          ""
                        }
                        onChange={(e) =>
                          setModelEdits((prev) => ({
                            ...prev,
                            [model.id]: { modelName: e.target.value },
                          }))
                        }
                        className="flex-1 h-9 border border-slate-200 rounded-xl px-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveModel(model)}
                          className="h-9 px-3 rounded-xl border border-slate-300 text-[11px] font-medium text-slate-800 hover:bg-slate-100 min-w-[80px]"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModel(model)}
                          className="h-9 px-3 rounded-xl border border-red-400 text-[11px] font-medium text-red-600 hover:bg-red-50 min-w-[80px]"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {models.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No hay modelos cargados.
                  </div>
                )}
              </div>
            </div>

            {/* Variantes */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Variantes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define RAM, almacenamiento, color y estado para cada modelo.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center text-xs text-slate-500 rounded-full bg-slate-50 px-3 py-1 border border-slate-200 min-w-[72px]">
                  {variants.length} total
                </span>
              </div>

              <form
                onSubmit={handleCreateVariant}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-1"
              >
                <select
                  value={newVariantData.deviceModelId}
                  onChange={(e) =>
                    setNewVariantData((prev) => ({
                      ...prev,
                      deviceModelId: e.target.value,
                    }))
                  }
                  className="h-10 border border-slate-200 rounded-xl px-2 text-xs sm:col-span-4 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                >
                  <option value="">Modelo</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelName} (
                      {brandMap.get(String(model.brandId))?.name ??
                        "Sin marca"}
                      )
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newVariantData.ram}
                  onChange={(e) =>
                    setNewVariantData((prev) => ({
                      ...prev,
                      ram: e.target.value,
                    }))
                  }
                  placeholder="RAM (GB)"
                  className="h-10 border border-slate-200 rounded-xl px-3 text-xs sm:col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                />
                <input
                  type="number"
                  value={newVariantData.storage}
                  onChange={(e) =>
                    setNewVariantData((prev) => ({
                      ...prev,
                      storage: e.target.value,
                    }))
                  }
                  placeholder="Almacenamiento"
                  className="h-10 border border-slate-200 rounded-xl px-3 text-xs sm:col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                />
                <input
                  type="text"
                  value={newVariantData.color}
                  onChange={(e) =>
                    setNewVariantData((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  placeholder="Color"
                  className="h-10 border border-slate-200 rounded-xl px-3 text-xs sm:col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                />
                <select
                  value={newVariantData.condition}
                  onChange={(e) =>
                    setNewVariantData((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                  className="h-10 border border-slate-200 rounded-xl px-2 text-xs sm:col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                >
                  <option value="NEW">Nuevo</option>
                  <option value="USED">Usado</option>
                  <option value="REFURB">Reacondicionado</option>
                </select>
                <button
                  type="submit"
                  disabled={
                    !newVariantData.deviceModelId ||
                    !newVariantData.ram ||
                    !newVariantData.storage ||
                    !newVariantData.color.trim()
                  }
                  className="h-10 px-4 rounded-xl bg-brand-contrast text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm sm:col-span-2"
                >
                  Agregar
                </button>
              </form>

              <div className="mt-1 max-h-[28rem] overflow-auto space-y-3 pr-1">
                {variants.slice(0, 50).map((variant) => {
                  const modelInfo = modelMap.get(String(variant.deviceModelId));
                  const modelLabel = modelInfo?.modelName
                    ? `Modelo ${modelInfo.modelName}`
                    : `Modelo ${variant.deviceModelId ?? "-"}`;
                  return (
                    <div
                      key={variant.id}
                      className="px-3 py-3 rounded-2xl bg-slate-50 text-xs text-slate-900 border border-slate-200/70 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500 font-mono">
                          ID {variant.id}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {modelLabel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={
                            variantEdits[variant.id]?.ram ??
                            variant.ram ??
                            ""
                          }
                          onChange={(e) =>
                            setVariantEdits((prev) => ({
                              ...prev,
                              [variant.id]: {
                                ...(prev[variant.id] || {}),
                                ram: e.target.value,
                              },
                            }))
                          }
                          className="h-9 border border-slate-200 rounded-xl px-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                          placeholder="RAM"
                        />
                        <input
                          type="number"
                          value={
                            variantEdits[variant.id]?.storage ??
                            variant.storage ??
                            ""
                          }
                          onChange={(e) =>
                            setVariantEdits((prev) => ({
                              ...prev,
                              [variant.id]: {
                                ...(prev[variant.id] || {}),
                                storage: e.target.value,
                              },
                            }))
                          }
                          className="h-9 border border-slate-200 rounded-xl px-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                          placeholder="Almacenamiento"
                        />
                        <input
                          type="text"
                          value={
                            variantEdits[variant.id]?.color ??
                            variant.color ??
                            ""
                          }
                          onChange={(e) =>
                            setVariantEdits((prev) => ({
                              ...prev,
                              [variant.id]: {
                                ...(prev[variant.id] || {}),
                                color: e.target.value,
                              },
                            }))
                          }
                          className="h-9 border border-slate-200 rounded-xl px-2 text-xs col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                          placeholder="Color"
                        />
                        <select
                          value={
                            variantEdits[variant.id]?.condition ??
                            variant.condition ??
                            "NEW"
                          }
                          onChange={(e) =>
                            setVariantEdits((prev) => ({
                              ...prev,
                              [variant.id]: {
                                ...(prev[variant.id] || {}),
                                condition: e.target.value,
                              },
                            }))
                          }
                          className="h-9 border border-slate-200 rounded-xl px-2 text-xs col-span-2 focus:outline-none focus:ring-1 focus:ring-brand-contrast/60"
                        >
                          <option value="NEW">Nuevo</option>
                          <option value="USED">Usado</option>
                          <option value="REFURB">Reacondicionado</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveVariant(variant)}
                          className="h-9 px-3 rounded-xl border border-slate-300 text-[11px] font-medium text-slate-800 hover:bg-slate-100 min-w-[80px]"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(variant)}
                          className="h-9 px-3 rounded-xl border border-red-400 text-[11px] font-medium text-red-600 hover:bg-red-50 min-w-[80px]"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
                {variants.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No hay variantes disponibles.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
