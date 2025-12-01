import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiXMark, HiPlus, HiTrash } from 'react-icons/hi2';
import { HiCube, HiBriefcase } from 'react-icons/hi';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import type { ActionMeta, SingleValue, MultiValue } from 'react-select';
import { useToast } from '../../../components/Toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  createProduct,
  resetProductState,
  type CreateProductData,
} from '../../../Slices/dashboard/prodcts-add/prodcts-slice';
import {
  getCategories,
  getSubCategoriesByCategory,
  createCategory,
  createSubCategory,
} from '../../../Slices/dashboard/categories/categories-slice';
import { getSuppliers } from '../../../Slices/dashboard/Suppliers/Suppliers-slice';

interface ProductRow extends CreateProductData {
  id: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, errorMessage, message } = useAppSelector(
    (state) => state.products
  );
  const { categories, subCategories, isLoading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );
  const { suppliers } = useAppSelector((state) => state.suppliers);

  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    sku: '',
    brand: '',
    description: '',
    categoryId: null,
    subCategoryId: null,
    costPrice: 0,
    salePrice: 0,
    productType: 0,
    trackSerials: false,
    supplierId: null,
    condition: '',
    inventoryValuationMethod: '',
    minimumPrice: 0,
    taxClass: '',
    showOnPOS: true,
    onHandQty: 0,
    stockWarning: 0,
    reorderLevel: 0,
    warrantyDays: 0,
    upcCode: '',
    variants: [],
  });

  const [productsTable, setProductsTable] = useState<ProductRow[]>([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<SelectOption | null>(null);
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] = useState<SelectOption | null>(null);
  const [selectedSupplierOption, setSelectedSupplierOption] = useState<SelectOption | null>(null);

  // Fetch categories and suppliers on mount
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSuppliers());
  }, [dispatch]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      dispatch(getSubCategoriesByCategory(formData.categoryId));
      // Reset subcategory when category changes
      setFormData({ ...formData, subCategoryId: null });
      setSelectedSubCategoryOption(null);
    }
  }, [formData.categoryId]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
      dispatch(resetProductState());
      if (productsTable.length === 0) {
        navigate('/dashboard/products');
      }
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
      dispatch(resetProductState());
    }
  }, [isSuccess, isError, message, errorMessage, showToast, dispatch, navigate, productsTable.length]);


  // Handle category selection/create
  const handleCategoryChange = async (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    // Since we're not using isMulti, newValue will always be SingleValue
    const singleValue = newValue as SingleValue<SelectOption>;
    if (actionMeta.action === 'create-option' && singleValue) {
      // Create new category
      try {
        const result = await dispatch(createCategory({ name: singleValue.label })).unwrap();
        if (result.data) {
          // Refresh categories list to include the new one
          await dispatch(getCategories());
          setSelectedCategoryOption({ value: result.data.id, label: result.data.name });
          setFormData({ ...formData, categoryId: result.data.id });
          showToast({
            message: 'Category created successfully',
            type: 'success',
          });
        }
      } catch (error: any) {
        showToast({
          message: error.message || 'Failed to create category',
          type: 'error',
        });
      }
    } else if (singleValue) {
      setSelectedCategoryOption(singleValue);
      setFormData({ ...formData, categoryId: singleValue.value });
    } else {
      setSelectedCategoryOption(null);
      setFormData({ ...formData, categoryId: null });
    }
  };

  // Handle subcategory selection/create
  const handleSubCategoryChange = async (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    // Since we're not using isMulti, newValue will always be SingleValue
    const singleValue = newValue as SingleValue<SelectOption>;
    if (actionMeta.action === 'create-option' && singleValue && formData.categoryId) {
      // Create new subcategory
      try {
        const result = await dispatch(
          createSubCategory({ categoryId: formData.categoryId, name: singleValue.label })
        ).unwrap();
        if (result.data) {
          // Refresh subcategories list to include the new one
          await dispatch(getSubCategoriesByCategory(formData.categoryId));
          setSelectedSubCategoryOption({ value: result.data.id, label: result.data.name });
          setFormData({ ...formData, subCategoryId: result.data.id });
          showToast({
            message: 'Subcategory created successfully',
            type: 'success',
          });
        }
      } catch (error: any) {
        showToast({
          message: error.message || 'Failed to create subcategory',
          type: 'error',
        });
      }
    } else if (singleValue) {
      setSelectedSubCategoryOption(singleValue);
      setFormData({ ...formData, subCategoryId: singleValue.value });
    } else {
      setSelectedSubCategoryOption(null);
      setFormData({ ...formData, subCategoryId: null });
    }
  };

  // Handle supplier selection
  const handleSupplierChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    // Since we're not using isMulti, newValue will always be SingleValue
    const singleValue = newValue as SingleValue<SelectOption>;
    if (singleValue) {
      setSelectedSupplierOption(singleValue);
      setFormData({ ...formData, supplierId: singleValue.value });
    } else {
      setSelectedSupplierOption(null);
      setFormData({ ...formData, supplierId: null });
    }
  };

  // Prepare category options for React Select
  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Prepare subcategory options for React Select
  const subCategoryOptions: SelectOption[] = subCategories.map((subCat) => ({
    value: subCat.id,
    label: subCat.name,
  }));

  // Prepare supplier options for React Select
  const supplierOptions: SelectOption[] = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  const handleAddToTable = () => {
    if (!formData.name || !formData.sku) {
      showToast({
        message: 'Please fill in Product Name and SKU (required fields)',
        type: 'error',
      });
      return;
    }

    const newProduct: ProductRow = {
      ...formData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    setProductsTable([...productsTable, newProduct]);
    
    // Reset form
    setFormData({
      name: '',
      sku: '',
      brand: '',
      description: '',
      categoryId: null,
      subCategoryId: null,
      costPrice: 0,
      salePrice: 0,
      productType: 0,
      trackSerials: false,
      supplierId: null,
      condition: '',
      inventoryValuationMethod: '',
      minimumPrice: 0,
      taxClass: '',
      showOnPOS: true,
      onHandQty: 0,
      stockWarning: 0,
      reorderLevel: 0,
      warrantyDays: 0,
      upcCode: '',
      variants: [],
    });
    setSelectedCategoryOption(null);
    setSelectedSubCategoryOption(null);
    setSelectedSupplierOption(null);

    showToast({
      message: 'Product added to table successfully',
      type: 'success',
    });
  };

  const handleRemoveFromTable = (id: string) => {
    setProductsTable(productsTable.filter((p) => p.id !== id));
  };

  const handleSubmitAll = async () => {
    if (productsTable.length === 0) {
      showToast({
        message: 'Please add at least one product to the table',
        type: 'error',
      });
      return;
    }

    try {
      // Create all products sequentially
      for (const product of productsTable) {
        const productData: CreateProductData = {
          ...product,
        };
        await dispatch(createProduct(productData)).unwrap();
      }
      
      showToast({
        message: `Successfully created ${productsTable.length} product(s)`,
        type: 'success',
      });
      
      setProductsTable([]);
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1500);
    } catch (error) {
      showToast({
        message: 'Failed to create some products. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard/products')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <HiArrowLeft className="w-6 h-6 text-[#1A1F36]" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-[#1A1F36]">Products Add New Product</h1>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/products')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                aria-label="Close"
              >
                <HiXMark className="w-6 h-6 text-[#1A1F36]" />
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E7F1] p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Product Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Product name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiCube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                    placeholder="Product name"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                    placeholder="SKU"
                  />
                </div>
              </div>

              {/* UPC Code */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  UPC Code
                </label>
                <input
                  type="text"
                  value={formData.upcCode}
                  onChange={(e) => setFormData({ ...formData, upcCode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="UPC Code"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Brand"
                />
              </div>

              {/* Category - React Select with create option */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Category
                </label>
                <CreatableSelect
                  value={selectedCategoryOption}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  isClearable
                  isSearchable
                  isLoading={categoriesLoading}
                  placeholder="Select or create category"
                  formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
                  createOptionPosition="first"
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      borderColor: '#E0E7F1',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#E0E7F1',
                      },
                    }),
                    menu: (base: any) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Sub Category - React Select with create option */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Sub Category
                </label>
                <CreatableSelect
                  value={selectedSubCategoryOption}
                  onChange={handleSubCategoryChange}
                  options={subCategoryOptions}
                  isClearable
                  isSearchable
                  isDisabled={!formData.categoryId}
                  placeholder={formData.categoryId ? "Select or create subcategory" : "Select category first"}
                  formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
                  createOptionPosition="first"
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      borderColor: '#E0E7F1',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#E0E7F1',
                      },
                    }),
                    menu: (base: any) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Supplier - React Select */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Supplier
                </label>
                <Select
                  value={selectedSupplierOption}
                  onChange={handleSupplierChange}
                  options={supplierOptions}
                  isClearable
                  isSearchable
                  placeholder="Select supplier"
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      borderColor: '#E0E7F1',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#E0E7F1',
                      },
                    }),
                    menu: (base: any) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Condition
                </label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Condition"
                />
              </div>

              {/* Inventory Valuation Method */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Inventory Valuation Method
                </label>
                <input
                  type="text"
                  value={formData.inventoryValuationMethod}
                  onChange={(e) => setFormData({ ...formData, inventoryValuationMethod: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Inventory Valuation Method"
                />
              </div>

              {/* On Hand Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  On Hand Quantity
                </label>
                <input
                  type="number"
                  value={formData.onHandQty}
                  onChange={(e) => setFormData({ ...formData, onHandQty: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="On Hand Quantity"
                />
              </div>

              {/* Alert Quantity / Stock Warning */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Stock Warning
                </label>
                <input
                  type="number"
                  value={formData.stockWarning}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, stockWarning: val });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Stock Warning"
                />
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Reorder Level
                </label>
                <input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Reorder Level"
                />
              </div>

              {/* Track Serials */}
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.trackSerials}
                  onChange={(e) => setFormData({ ...formData, trackSerials: e.target.checked })}
                  className="w-5 h-5 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF] cursor-pointer"
                />
                <label className="text-sm font-medium text-[#1A1F36] cursor-pointer">
                  Track Serials
                </label>
              </div>

              {/* Show on POS */}
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.showOnPOS}
                  onChange={(e) => setFormData({ ...formData, showOnPOS: e.target.checked })}
                  className="w-5 h-5 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF] cursor-pointer"
                />
                <label className="text-sm font-medium text-[#1A1F36] cursor-pointer">
                  Show on POS
                </label>
              </div>

              {/* Product Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Product Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Product Description"
                  rows={3}
                />
              </div>

              {/* Warranty Days */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Warranty Days
                </label>
                <input
                  type="number"
                  value={formData.warrantyDays}
                  onChange={(e) => setFormData({ ...formData, warrantyDays: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Warranty Days"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Product Type Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E7F1] p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Product Type
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => {
                    setFormData({ ...formData, productType: parseInt(e.target.value) });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                >
                  <option value={0}>Single</option>
                  <option value={1}>Variable</option>
                  <option value={2}>Combo</option>
                </select>
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, costPrice: val });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Cost Price"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Sale Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, salePrice: val });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Sale Price"
                />
              </div>

              {/* Minimum Price */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Minimum Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minimumPrice}
                  onChange={(e) => setFormData({ ...formData, minimumPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Minimum Price"
                />
              </div>

              {/* Tax Class */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                  Tax Class
                </label>
                <input
                  type="text"
                  value={formData.taxClass}
                  onChange={(e) => setFormData({ ...formData, taxClass: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] bg-white text-[#1A1F36]"
                  placeholder="Tax Class"
                />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddToTable}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" />
              Add
            </button>
          </div>

          {/* Products Table */}
          {productsTable.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E7F1] p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#1A1F36] mb-4">
                Products Added ({productsTable.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F5F8FF] border-b border-[#E0E7F1]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Cost Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Sale Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1F36] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E7F1]">
                    {productsTable.map((product) => (
                      <tr key={product.id} className="hover:bg-[#F5F8FF]/50">
                        <td className="px-4 py-3 text-sm text-[#4A5568]">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">{product.sku}</td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">{product.brand || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">
                          {categories.find(cat => cat.id === product.categoryId)?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">
                          {suppliers.find(sup => sup.id === product.supplierId)?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">${product.costPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-[#4A5568]">${product.salePrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRemoveFromTable(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E7F1] p-6">
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="px-6 py-3 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors font-medium"
              >
                Close
              </button>
              {productsTable.length > 0 && (
                <button
                  type="button"
                  onClick={handleSubmitAll}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Send to Database'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
