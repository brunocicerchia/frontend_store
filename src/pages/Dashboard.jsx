import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api/user';
import Notification from '../components/Notification';
import CreateStoreForm from '../components/dashboard/CreateStoreForm';
import SellerHeader from '../components/dashboard/SellerHeader';
import ProgressSteps from '../components/dashboard/ProgressSteps';
import Step1ModelSelect from '../components/dashboard/Step1ModelSelect';
import Step2VariantSelect from '../components/dashboard/Step2VariantSelect';
import Step3ListingForm from '../components/dashboard/Step3ListingForm';
import EditListingModal from '../components/dashboard/EditListingModal';
import ProductsTable from '../components/dashboard/ProductsTable';
import { getMySeller, createSeller } from '../api/store';
import {
  getListings,
  createListing,
  updateListing,
  deleteListing,
  getAllBrands,
  getAllDeviceModels,
  getAllVariants,
  createVariant,
  createDeviceModel,
} from '../api/products';

function Dashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [mySeller, setMySeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [needsStore, setNeedsStore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Creador de productos state
  const [showCreador, setShowCreador] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [useExistingModel, setUseExistingModel] = useState(true);
  const [useExistingVariant, setUseExistingVariant] = useState(true);
  
  const [modelFormData, setModelFormData] = useState({
    brandId: '',
    modelName: '',
  });

  const [variantFormData, setVariantFormData] = useState({
    deviceModelId: '',
    ram: '',
    storage: '',
    color: '',
    condition: 'NEW',
  });

  const [listingFormData, setListingFormData] = useState({
    price: '',
    stock: '',
    active: true,
  });

  // Edit state
  const [editingListing, setEditingListing] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userData = await getMe();
        
        setCurrentUser(userData);
        
        const hasAccess = userData && userData.roles && (
          userData.roles.includes('SELLER') || 
          userData.roles.includes('ADMIN')
        );
        
        if (!hasAccess) {
          setNotification({
            type: 'error',
            message: 'Acceso denegado. Solo vendedores y administradores pueden acceder a esta página.'
          });
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        
        // Verificar si el seller necesita crear su tienda
        await checkSellerStore();
      } catch (error) {
        console.error('❌ Error obteniendo usuario:', error);
        setNotification({
          type: 'error',
          message: 'Error al verificar permisos. Por favor, inicia sesión nuevamente.'
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    })();
  }, []);

  const checkSellerStore = async () => {
    try {
      const sellerData = await getMySeller();
      setMySeller(sellerData);
      setNeedsStore(false);
      // Si tiene tienda, cargar todos los datos
      await fetchAllData();
    } catch (error) {
      setNeedsStore(true);
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [listingsData, brandsData, modelsData, variantsData] = await Promise.all([
        getListings(0, 100),
        getAllBrands(),
        getAllDeviceModels(),
        getAllVariants()
      ]);
      
      setListings(listingsData);
      setBrands(brandsData);
      setModels(modelsData);
      setVariants(variantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({
        type: 'error',
        message: 'Error al cargar los datos: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Handlers del creador
  const handleStep1Next = async () => {
    try {
      if (!useExistingModel) {
        // Create new model
        const data = {
          brandId: parseInt(modelFormData.brandId),
          modelName: modelFormData.modelName,
        };
        const newModel = await createDeviceModel(data);
        setSelectedModelId(newModel.id.toString());
        setVariantFormData({ ...variantFormData, deviceModelId: newModel.id });
        await fetchAllData();
      } else if (!selectedModelId) {
        setNotification({
          type: 'warning',
          message: 'Por favor selecciona un modelo'
        });
        return;
      }
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating model:', error);
      setNotification({
        type: 'error',
        message: 'Error al crear modelo: ' + error.message
      });
    }
  };

  const handleStep2Next = async () => {
    try {
      if (!useExistingVariant) {
        const data = {
          deviceModelId: parseInt(selectedModelId),
          ram: parseInt(variantFormData.ram),
          storage: parseInt(variantFormData.storage),
          color: variantFormData.color,
          condition: variantFormData.condition,
        };
        const newVariant = await createVariant(data);
        setSelectedVariantId(newVariant.id.toString());
        await fetchAllData();
      } else if (!selectedVariantId) {
        setNotification({
          type: 'warning',
          message: 'Por favor selecciona una variante'
        });
        return;
      }
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating variant:', error);
      setNotification({
        type: 'error',
        message: 'Error al crear variante: ' + error.message
      });
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    if (!mySeller) {
      setNotification({
        type: 'error',
        message: 'Error: No se encontró información del vendedor'
      });
      return;
    }
    
    try {
      const data = {
        sellerId: mySeller.id,
        variantId: parseInt(selectedVariantId),
        price: parseFloat(listingFormData.price),
        stock: parseInt(listingFormData.stock),
        active: listingFormData.active,
      };

      await createListing(data);
      setNotification({
        type: 'success',
        message: '✅ Producto creado exitosamente!'
      });
      resetCreador();
      fetchAllData();
    } catch (error) {
      console.error('Error saving listing:', error);
      setNotification({
        type: 'error',
        message: 'Error al guardar: ' + error.message
      });
    }
  };

  const resetCreador = () => {
    setShowCreador(false);
    setCurrentStep(1);
    setSelectedModelId('');
    setSelectedVariantId('');
    setUseExistingModel(true);
    setUseExistingVariant(true);
    setModelFormData({ brandId: '', modelName: '' });
    setVariantFormData({ deviceModelId: '', ram: '', storage: '', color: '', condition: 'NEW' });
    setListingFormData({ price: '', stock: '', active: true });
  };

  // Edit handlers
  const handleEdit = (listing) => {
    setEditingListing(listing);
  };

  const handleEditUpdate = async (formData) => {
    try {
      const data = {
        sellerId: editingListing.sellerId,
        variantId: editingListing.variantId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        active: formData.active,
        discountType: formData.discountType || 'NONE',
        discountValue: parseFloat(formData.discountValue) || 0,
        discountActive: formData.discountActive || false
      };

      await updateListing(editingListing.id, data);
      setNotification({
        type: 'success',
        message: '✅ Producto actualizado exitosamente!'
      });
      setEditingListing(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating listing:', error);
      setNotification({
        type: 'error',
        message: 'Error al actualizar: ' + error.message
      });
    }
  };

  const handleDelete = async (listing) => {
    if (!window.confirm('¿Estás seguro de eliminar este listing?')) return;
    
    try {
      await deleteListing(listing.id, listing.sellerId);
      setNotification({
        type: 'success',
        message: 'Listing eliminado exitosamente'
      });
      fetchAllData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      setNotification({
        type: 'error',
        message: 'Error al eliminar: ' + error.message
      });
    }
  };

  const handleCreateStore = async (formData) => {
    try {
      const newSeller = await createSeller(formData);
      setMySeller(newSeller);
      setNeedsStore(false);
      setNotification({
        type: 'success',
        message: '🎉 ¡Tienda creada exitosamente! Ahora puedes comenzar a vender.'
      });
      await fetchAllData();
    } catch (error) {
      console.error('Error creating store:', error);
      setNotification({
        type: 'error',
        message: 'Error al crear la tienda: ' + error.message
      });
      throw error;
    }
  };

  // Si necesita crear tienda, mostrar formulario
  if (needsStore) {
    return (
      <>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        <CreateStoreForm 
          onSuccess={handleCreateStore}
          onError={(error) => {
            setNotification({
              type: 'error',
              message: 'Error al crear la tienda: ' + error.message
            });
          }}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-contrast mx-auto mb-4"></div>
          <p className="text-brand-light text-xl">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700 py-8">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SellerHeader 
          seller={mySeller} 
          productCount={listings.filter(l => l.sellerId === mySeller?.id).length}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-light mb-4">Dashboard de Productos</h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreador(true)}
              className="bg-brand-contrast text-brand-light px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-contrast-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Crear Nuevo Producto
            </button>
          </div>
        </div>

        {showCreador && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-light rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <ProgressSteps currentStep={currentStep} />
              
              {currentStep === 1 && (
                <Step1ModelSelect
                  models={models}
                  brands={brands}
                  selectedModelId={selectedModelId}
                  useExistingModel={useExistingModel}
                  modelFormData={modelFormData}
                  onModelSelect={(id) => {
                    setSelectedModelId(id);
                    setVariantFormData({ ...variantFormData, deviceModelId: id });
                  }}
                  onToggleExisting={setUseExistingModel}
                  onFormChange={setModelFormData}
                  onNext={handleStep1Next}
                  onCancel={resetCreador}
                />
              )}

              {currentStep === 2 && (
                <Step2VariantSelect
                  variants={variants}
                  selectedModelId={selectedModelId}
                  selectedVariantId={selectedVariantId}
                  useExistingVariant={useExistingVariant}
                  variantFormData={variantFormData}
                  onVariantSelect={setSelectedVariantId}
                  onToggleExisting={setUseExistingVariant}
                  onFormChange={setVariantFormData}
                  onNext={handleStep2Next}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3ListingForm
                  mySeller={mySeller}
                  listingFormData={listingFormData}
                  onFormChange={setListingFormData}
                  onSubmit={handleFinalSubmit}
                  onBack={() => setCurrentStep(2)}
                />
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingListing && (
          <EditListingModal
            listing={editingListing}
            onUpdate={handleEditUpdate}
            onCancel={() => setEditingListing(null)}
          />
        )}

        {/* Products Table */}
        <ProductsTable
          listings={listings}
          mySeller={mySeller}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default Dashboard;
