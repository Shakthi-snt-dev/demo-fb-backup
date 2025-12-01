import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiCloudArrowDown,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import Modal from '../../../components/Modal';
import { useToast } from '../../../components/Toast';
import { useConfirmToast } from '../../../components/ConfirmToast';
import { Table } from '../../../components/Table';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  getProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProductState,
  type CreateProductData,
  type Product,
} from '../../../Slices/dashboard/prodcts-add/prodcts-slice';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirmToast();
  const dispatch = useAppDispatch();
  const { products, isLoading, isSuccess, isError, errorMessage, message } = useAppSelector(
    (state) => state.products
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Form state for Add/Edit Product
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

  const productsPerPage = 12;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Fetch products on mount
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Search products when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        dispatch(searchProducts(searchQuery));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(getProducts());
    }
  }, [searchQuery, dispatch]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
      dispatch(resetProductState());
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
      dispatch(resetProductState());
    }
  }, [isSuccess, isError, message, errorMessage, showToast, dispatch]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle create product
  const handleCreateProduct = async () => {
    if (!formData.name || !formData.sku) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(createProduct(formData)).unwrap();
      setIsAddModalOpen(false);
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
      dispatch(getProducts());
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      description: product.description,
      categoryId: product.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      productType: typeof product.productType === 'string' ? 0 : product.productType,
      trackSerials: product.trackSerials,
      supplierId: product.supplierId || null,
      condition: product.condition,
      inventoryValuationMethod: product.inventoryValuationMethod,
      minimumPrice: product.minimumPrice,
      taxClass: product.taxClass,
      showOnPOS: product.showOnPOS,
      onHandQty: (product as any).onHandQty || 0,
      stockWarning: (product as any).stockWarning || 0,
      reorderLevel: (product as any).reorderLevel || 0,
      warrantyDays: (product as any).warrantyDays || 0,
      upcCode: product.upcCode,
      variants: product.variants || [],
    });
    setIsEditModalOpen(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.sku) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(updateProduct({ id: selectedProduct.id, data: formData })).unwrap();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      dispatch(getProducts());
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    showConfirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await dispatch(deleteProduct(product.id)).unwrap();
          dispatch(getProducts());
        } catch (error) {
          // Error is handled by the slice and shown via toast
        }
      },
    });
  };

  // Handle import products
  const handleImportProducts = () => {
    showToast({
      message: 'Import functionality coming soon',
      type: 'info',
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">
            Products ({totalProducts})
          </h1>
          <p className="text-sm text-[#4A5568] mt-1">
            Manage your product inventory
          </p>
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={handleImportProducts}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
          >
            <HiCloudArrowDown className="w-5 h-5" />
            <span className="hidden sm:inline">Import Products</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/add-products')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium"
          >
            <HiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors"
          >
            <HiFunnel className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E0E7F1] rounded-lg shadow-lg z-10 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-[#E0E7F1] p-12 text-center">
          <p className="text-[#4A5568]">Loading products...</p>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && (
        <Table
          data={currentProducts}
          columns={[
            {
              key: 'name',
              header: 'Product Name',
              render: (product) => (
                <div>
                  <div className="font-semibold text-[#1A1F36]">{product.name || 'N/A'}</div>
                  <div className="text-xs text-[#4A5568]">SKU: {product.sku || 'N/A'}</div>
                </div>
              ),
            },
            {
              key: 'brand',
              header: 'Brand',
              render: (product) => <span className="text-[#4A5568]">{product.brand || 'N/A'}</span>,
            },
            {
              key: 'categoryName',
              header: 'Category',
              render: (product) => <span className="text-[#4A5568]">{product.categoryName || 'N/A'}</span>,
            },
            {
              key: 'costPrice',
              header: 'Cost Price',
              render: (product) => (
                <span className="font-semibold text-[#007BFF]">
                  ${product.costPrice?.toFixed(2) || '0.00'}
                </span>
              ),
            },
            {
              key: 'salePrice',
              header: 'Sale Price',
              render: (product) => (
                <span className="font-semibold text-green-600">
                  ${product.salePrice?.toFixed(2) || '0.00'}
                </span>
              ),
            },
            {
              key: 'profitMargin',
              header: 'Profit Margin',
              render: (product) => (
                <span className="text-[#1A1F36]">
                  {product.profitMargin?.toFixed(2) || '0.00'}%
                </span>
              ),
            },
            {
              key: 'isActive',
              header: 'Status',
              render: (product) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'createdAt',
              header: 'Created',
              render: (product) => (
                <span className="text-[#4A5568]">
                  {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
                </span>
              ),
            },
          ]}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          emptyMessage="No products found."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#E0E7F1] p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 text-[#4A5568]">...</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#007BFF] text-white'
                        : 'text-[#1A1F36] hover:bg-[#F5F8FF]'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                UPC Code
              </label>
              <input
                type="text"
                value={formData.upcCode}
                onChange={(e) => setFormData({ ...formData, upcCode: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter UPC code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Category ID
              </label>
              <input
                type="text"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter category ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Sub Category ID
              </label>
              <input
                type="text"
                value={formData.subCategoryId || ''}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter sub category ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Cost Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Minimum Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minimumPrice}
                onChange={(e) => setFormData({ ...formData, minimumPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Product Type
              </label>
              <input
                type="number"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Supplier ID
              </label>
              <input
                type="text"
                value={formData.supplierId || ''}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter supplier ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Condition
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter condition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Tax Class
              </label>
              <input
                type="text"
                value={formData.taxClass}
                onChange={(e) => setFormData({ ...formData, taxClass: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter tax class"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Inventory Valuation Method
            </label>
            <input
              type="text"
              value={formData.inventoryValuationMethod}
              onChange={(e) => setFormData({ ...formData, inventoryValuationMethod: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter inventory valuation method"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                On Hand Quantity
              </label>
              <input
                type="number"
                value={formData.onHandQty}
                onChange={(e) => setFormData({ ...formData, onHandQty: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Stock Warning
              </label>
              <input
                type="number"
                value={formData.stockWarning}
                onChange={(e) => setFormData({ ...formData, stockWarning: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Reorder Level
              </label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Warranty Days
              </label>
              <input
                type="number"
                value={formData.warrantyDays}
                onChange={(e) => setFormData({ ...formData, warrantyDays: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.trackSerials}
                onChange={(e) => setFormData({ ...formData, trackSerials: e.target.checked })}
                className="w-4 h-4 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF]"
              />
              <span className="text-sm text-[#1A1F36]">Track Serials</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showOnPOS}
                onChange={(e) => setFormData({ ...formData, showOnPOS: e.target.checked })}
                className="w-4 h-4 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF]"
              />
              <span className="text-sm text-[#1A1F36]">Show on POS</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProduct}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                UPC Code
              </label>
              <input
                type="text"
                value={formData.upcCode}
                onChange={(e) => setFormData({ ...formData, upcCode: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter UPC code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Category ID
              </label>
              <input
                type="text"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter category ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Sub Category ID
              </label>
              <input
                type="text"
                value={formData.subCategoryId || ''}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter sub category ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Cost Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Minimum Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minimumPrice}
                onChange={(e) => setFormData({ ...formData, minimumPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Product Type
              </label>
              <input
                type="number"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Supplier ID
              </label>
              <input
                type="text"
                value={formData.supplierId || ''}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value.trim() || null })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter supplier ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Condition
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter condition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Tax Class
              </label>
              <input
                type="text"
                value={formData.taxClass}
                onChange={(e) => setFormData({ ...formData, taxClass: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter tax class"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Inventory Valuation Method
            </label>
            <input
              type="text"
              value={formData.inventoryValuationMethod}
              onChange={(e) => setFormData({ ...formData, inventoryValuationMethod: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter inventory valuation method"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                On Hand Quantity
              </label>
              <input
                type="number"
                value={formData.onHandQty}
                onChange={(e) => setFormData({ ...formData, onHandQty: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Stock Warning
              </label>
              <input
                type="number"
                value={formData.stockWarning}
                onChange={(e) => setFormData({ ...formData, stockWarning: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Reorder Level
              </label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Warranty Days
              </label>
              <input
                type="number"
                value={formData.warrantyDays}
                onChange={(e) => setFormData({ ...formData, warrantyDays: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.trackSerials}
                onChange={(e) => setFormData({ ...formData, trackSerials: e.target.checked })}
                className="w-4 h-4 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF]"
              />
              <span className="text-sm text-[#1A1F36]">Track Serials</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showOnPOS}
                onChange={(e) => setFormData({ ...formData, showOnPOS: e.target.checked })}
                className="w-4 h-4 text-[#007BFF] border-[#E0E7F1] rounded focus:ring-[#007BFF]"
              />
              <span className="text-sm text-[#1A1F36]">Show on POS</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProduct}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;

