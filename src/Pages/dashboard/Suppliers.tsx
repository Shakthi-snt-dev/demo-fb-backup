import React, { useState, useRef, useEffect } from 'react';
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useConfirmToast } from '../../components/ConfirmToast';
import { Table } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getSuppliers,
  getActiveSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  resetSupplierState,
  type CreateSupplierData,
  type Supplier,
} from '../../Slices/dashboard/Suppliers/Suppliers-slice';

const Suppliers: React.FC = () => {
  const { showToast } = useToast();
  const { showConfirm } = useConfirmToast();
  const dispatch = useAppDispatch();
  const { suppliers, isLoading, isSuccess, isError, errorMessage, message } = useAppSelector(
    (state) => state.suppliers
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const filterRef = useRef<HTMLDivElement>(null);

  // Form state for Add/Edit Supplier
  const [formData, setFormData] = useState<CreateSupplierData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
  });

  const suppliersPerPage = 12;
  const startIndex = (currentPage - 1) * suppliersPerPage;
  const endIndex = startIndex + suppliersPerPage;

  // Fetch suppliers on mount
  useEffect(() => {
    if (statusFilter === 'active') {
      dispatch(getActiveSuppliers());
    } else {
      dispatch(getSuppliers());
    }
  }, [dispatch, statusFilter]);

  // Filter suppliers based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
      dispatch(resetSupplierState());
      if (isAddModalOpen) setIsAddModalOpen(false);
      if (isEditModalOpen) setIsEditModalOpen(false);
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
      dispatch(resetSupplierState());
    }
  }, [isSuccess, isError, message, errorMessage, showToast, dispatch, isAddModalOpen, isEditModalOpen]);

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

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.phone.includes(searchQuery) ||
      supplier.address.toLowerCase().includes(searchLower) ||
      supplier.contactPerson.toLowerCase().includes(searchLower)
    );
  });

  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  // Handle create supplier
  const handleCreateSupplier = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showToast({
        message: 'Please fill in all required fields (Name, Email, Phone)',
        type: 'error',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast({
        message: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(createSupplier(formData)).unwrap();
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
      });
      if (statusFilter === 'active') {
        dispatch(getActiveSuppliers());
      } else {
        dispatch(getSuppliers());
      }
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle edit supplier
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
    });
    setIsEditModalOpen(true);
  };

  // Handle update supplier
  const handleUpdateSupplier = async () => {
    if (!selectedSupplier || !formData.name || !formData.email || !formData.phone) {
      showToast({
        message: 'Please fill in all required fields (Name, Email, Phone)',
        type: 'error',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast({
        message: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(updateSupplier({ id: selectedSupplier.id, data: formData })).unwrap();
      setSelectedSupplier(null);
      if (statusFilter === 'active') {
        dispatch(getActiveSuppliers());
      } else {
        dispatch(getSuppliers());
      }
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = (supplier: Supplier) => {
    showConfirm({
      title: 'Delete Supplier',
      message: `Are you sure you want to delete "${supplier.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await dispatch(deleteSupplier(supplier.id)).unwrap();
          if (statusFilter === 'active') {
            dispatch(getActiveSuppliers());
          } else {
            dispatch(getSuppliers());
          }
        } catch (error) {
          // Error is handled by the slice and shown via toast
        }
      },
    });
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const totalFilteredPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

    if (totalFilteredPages <= maxVisible) {
      for (let i = 1; i <= totalFilteredPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalFilteredPages);
      } else if (currentPage >= totalFilteredPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalFilteredPages - 2; i <= totalFilteredPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalFilteredPages);
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

  const totalFilteredPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">
            Suppliers ({filteredSuppliers.length})
          </h1>
          <p className="text-sm text-[#4A5568] mt-1">
            Manage your supplier information
          </p>
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium"
          >
            <HiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Supplier</span>
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
            placeholder="Search suppliers by name, email, phone, address, or contact person..."
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
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-sm"
                  >
                    <option value="all">All Suppliers</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
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
          <p className="text-[#4A5568]">Loading suppliers...</p>
        </div>
      )}

      {/* Suppliers Table */}
      {!isLoading && (
        <Table
          data={paginatedSuppliers}
          columns={[
            {
              key: 'name',
              header: 'Supplier Name',
              render: (supplier) => (
                <div>
                  <div className="font-semibold text-[#1A1F36]">{supplier.name || 'N/A'}</div>
                  <div className="text-xs text-[#4A5568]">{supplier.email || 'N/A'}</div>
                </div>
              ),
            },
            {
              key: 'phone',
              header: 'Phone',
              render: (supplier) => <span className="text-[#4A5568]">{supplier.phone || 'N/A'}</span>,
            },
            {
              key: 'address',
              header: 'Address',
              render: (supplier) => <span className="text-[#4A5568]">{supplier.address || 'N/A'}</span>,
            },
            {
              key: 'contactPerson',
              header: 'Contact Person',
              render: (supplier) => <span className="text-[#4A5568]">{supplier.contactPerson || 'N/A'}</span>,
            },
            {
              key: 'isActive',
              header: 'Status',
              render: (supplier) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    supplier.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {supplier.isActive ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'createdOn',
              header: 'Created',
              render: (supplier) => (
                <span className="text-[#4A5568]">
                  {supplier.createdOn ? formatDate(supplier.createdOn) : 'N/A'}
                </span>
              ),
            },
          ]}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
          emptyMessage="No suppliers found."
        />
      )}

      {/* Pagination */}
      {totalFilteredPages > 1 && (
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages))}
            disabled={currentPage === totalFilteredPages}
            className="flex items-center gap-2 px-4 py-2 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supplier"
        size="lg"
      >
        <div className="space-y-4">
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
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter supplier address"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSupplier}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Supplier'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupplier(null);
        }}
        title="Edit Supplier"
        size="lg"
      >
        <div className="space-y-4">
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
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter supplier address"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedSupplier(null);
              }}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSupplier}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Supplier'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Suppliers;

