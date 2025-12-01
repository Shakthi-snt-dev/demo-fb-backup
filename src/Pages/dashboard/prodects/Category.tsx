import React, { useState, useEffect } from 'react';
import {
  HiMagnifyingGlass,
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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCategoriesState,
  type CreateCategoryData,
  type ProductCategory,
} from '../../../Slices/dashboard/categories/categories-slice';

const Category: React.FC = () => {
  const { showToast } = useToast();
  const { showConfirm } = useConfirmToast();
  const dispatch = useAppDispatch();
  const { categories, isLoading, isSuccess, isError, errorMessage, message } = useAppSelector(
    (state) => state.categories
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
  });

  const categoriesPerPage = 12;
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
      dispatch(resetCategoriesState());
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
      dispatch(resetCategoriesState());
    }
  }, [isSuccess, isError, message, errorMessage, showToast, dispatch]);

  // Handle create category
  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      showToast({
        message: 'Please enter a category name',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(createCategory(formData)).unwrap();
      setIsAddModalOpen(false);
      setFormData({ name: '' });
      dispatch(getCategories());
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle edit category
  const handleEditCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
    });
    setIsEditModalOpen(true);
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      showToast({
        message: 'Please enter a category name',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(
        updateCategory({
          id: selectedCategory.id,
          data: formData,
        })
      ).unwrap();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setFormData({ name: '' });
      dispatch(getCategories());
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle delete category
  const handleDeleteCategory = (category: ProductCategory) => {
    showConfirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await dispatch(deleteCategory(category.id)).unwrap();
          dispatch(getCategories());
        } catch (error) {
          // Error is handled by the slice and shown via toast
        }
      },
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

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">
            Categories ({totalCategories})
          </h1>
          <p className="text-sm text-[#4A5568] mt-1">
            Manage your product categories
          </p>
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium"
          >
            <HiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-[#E0E7F1] p-12 text-center">
          <p className="text-[#4A5568]">Loading categories...</p>
        </div>
      )}

      {/* Categories Table */}
      {!isLoading && (
        <Table
          data={currentCategories}
          columns={[
            {
              key: 'name',
              header: 'Category Name',
              render: (category) => (
                <div>
                  <div className="font-semibold text-[#1A1F36]">{category.name || 'N/A'}</div>
                  <div className="text-xs text-[#4A5568]">ID: {category.id || 'N/A'}</div>
                </div>
              ),
            },
            {
              key: 'subCategories',
              header: 'Sub Categories',
              render: (category) => (
                <span className="text-[#4A5568]">
                  {category.subCategories?.length || 0} subcategories
                </span>
              ),
            },
          ]}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          emptyMessage="No categories found."
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

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ name: '' });
        }}
        title="Add New Category"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter category name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setFormData({ name: '' });
              }}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCategory}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
          setFormData({ name: '' });
        }}
        title="Edit Category"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter category name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
                setFormData({ name: '' });
              }}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCategory}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
