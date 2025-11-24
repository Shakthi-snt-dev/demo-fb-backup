import React, { useState, useEffect, useMemo } from 'react';
import { HiMagnifyingGlass, HiPlus, HiPencil } from 'react-icons/hi2';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getAllCustomers,
  getCustomersByStore,
  createCustomer,
  updateCustomer,
  resetCustomerState,
  setSelectedStoreId,
  type CreateCustomerData,
  type UpdateCustomerData,
  type Customer,
  type Address,
} from '../../Slices/dashboard/customers/customer-slice';
import { getStoresList } from '../../Slices/dashboard/Employee/employee-slice';

interface CustomerFormData {
  storeId: string;
  name: string;
  email: string;
  phone: string;
  includeAddress: boolean;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
  status: string;
}

const Customers: React.FC = () => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const {
    customers,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    message,
  } = useAppSelector((state) => state.customer);
  const { stores } = useAppSelector((state) => state.employee);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [localSelectedStoreId, setLocalSelectedStoreId] = useState<string>('all');
  const [formData, setFormData] = useState<CustomerFormData>({
    storeId: '',
    name: '',
    email: '',
    phone: '',
    includeAddress: true,
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    postalCode: '',
    status: '',
  });

  // Fetch stores on mount
  useEffect(() => {
    dispatch(getStoresList());
  }, [dispatch]);

  // Fetch customers based on store selection
  useEffect(() => {
    if (localSelectedStoreId && localSelectedStoreId !== 'all') {
      dispatch(getCustomersByStore(localSelectedStoreId));
      dispatch(setSelectedStoreId(localSelectedStoreId));
    } else {
      dispatch(getAllCustomers());
      dispatch(setSelectedStoreId(null));
    }
  }, [dispatch, localSelectedStoreId]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
      dispatch(resetCustomerState());
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
      dispatch(resetCustomerState());
    }
  }, [isSuccess, isError, message, errorMessage, showToast, dispatch]);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower) ||
        (customer.address?.streetName || '').toLowerCase().includes(searchLower) ||
        (customer.address?.city || '').toLowerCase().includes(searchLower)
      );
    });
  }, [customers, searchQuery]);

  // Format address for display
  const formatAddress = (address: Address | undefined): string => {
    if (!address) return 'N/A';
    const parts = [
      address.streetNumber,
      address.streetName,
      address.city,
      address.state,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingCustomerId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingCustomerId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      storeId: localSelectedStoreId !== 'all' ? localSelectedStoreId : stores[0]?.id || '',
      name: '',
      email: '',
      phone: '',
      includeAddress: true,
      streetNumber: '',
      streetName: '',
      city: '',
      state: '',
      postalCode: '',
      status: '',
    });
  };

  const handleEdit = async (customer: Customer) => {
    setIsEditMode(true);
    setEditingCustomerId(customer.id);
    setFormData({
      storeId: customer.storeId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      includeAddress: !!customer.address,
      streetNumber: customer.address?.streetNumber || '',
      streetName: customer.address?.streetName || '',
      city: customer.address?.city || '',
      state: customer.address?.state || '',
      postalCode: customer.address?.postalCode || '',
      status: customer.status || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.storeId) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    try {
      const address: Address = formData.includeAddress
        ? {
            streetNumber: formData.streetNumber || '',
            streetName: formData.streetName || '',
            city: formData.city || '',
            state: formData.state || '',
            postalCode: formData.postalCode || '',
          }
        : {
            streetNumber: '',
            streetName: '',
            city: '',
            state: '',
            postalCode: '',
          };

      if (isEditMode && editingCustomerId) {
        // Update customer
        const updateData: UpdateCustomerData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address,
          status: formData.status || 'active',
        };
        await dispatch(updateCustomer({ id: editingCustomerId, data: updateData })).unwrap();
      } else {
        // Create customer
        const createData: CreateCustomerData = {
          storeId: formData.storeId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address,
        };
        await dispatch(createCustomer(createData)).unwrap();
      }

      handleCloseModal();
      // Refresh customers list
      if (localSelectedStoreId && localSelectedStoreId !== 'all') {
        dispatch(getCustomersByStore(localSelectedStoreId));
      } else {
        dispatch(getAllCustomers());
      }
    } catch (error: any) {
      // Error is handled by the slice and shown via toast
      console.error('Error submitting customer:', error);
    }
  };

  const toggleAddress = () => {
    setFormData({ ...formData, includeAddress: !formData.includeAddress });
  };

  if (isLoading && customers.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Customers' }]} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1F36] mb-2">
            Customers
          </h1>
          <p className="text-sm text-[#4A5568]">
            Manage your customer database
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium whitespace-nowrap"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Store Filter */}
      {stores.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-[#1A1F36] whitespace-nowrap">
            Filter by Store:
          </label>
          <select
            value={localSelectedStoreId}
            onChange={(e) => setLocalSelectedStoreId(e.target.value)}
            className="px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm"
          >
            <option value="all">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.storeName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
        <input
          type="text"
          placeholder="Search customers by name, email, phone, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-[#E0E7F1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E7F1] bg-[#F5F8FF]">
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-[#1A1F36]">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-[#1A1F36]">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-[#1A1F36]">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#1A1F36]">
                  Orders
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#1A1F36]">
                  Total Spent
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#1A1F36]">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-[#1A1F36]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                    <p className="text-[#4A5568]">
                      {searchQuery ? 'No customers found matching your search' : 'No customers found'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-[#E0E7F1] hover:bg-[#F5F8FF]/30 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-[#1A1F36]">
                        {customer.name}
                      </div>
                      <div className="text-xs text-[#4A5568] mt-1">
                        Created: {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-[#1A1F36]">
                        {customer.email || 'N/A'}
                      </div>
                      <div className="text-xs text-[#4A5568] mt-1">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-[#1A1F36] max-w-xs">
                        {formatAddress(customer.address)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#1A1F36]">
                      {customer.totalOrders || 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm text-[#1A1F36]">
                      ${(customer.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : customer.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {customer.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-[#007BFF] hover:bg-[#F5F8FF] rounded-lg transition-colors"
                          title="Edit customer"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Customer' : 'Add New Customer'}
        subtitle={isEditMode ? 'Update customer information' : 'Add a new customer to your database'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Store Selection - Only for create mode */}
          {!isEditMode && stores.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                Store <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.storeId}
                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
              >
                <option value="">Select a store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.storeName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name Field - Required */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
            />
          </div>

          {/* Phone Field - Required */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
            />
          </div>

          {/* Status Field - Only for edit mode */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          )}

          {/* Include Address Toggle */}
          <div className="flex items-center justify-between pt-4 pb-3 border-t border-[#E0E7F1]">
            <div className="flex-1 pr-4">
              <label className="block text-sm font-semibold text-[#1A1F36] mb-1">
                Include Address
              </label>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Add customer's physical address details (optional)
              </p>
            </div>
            <button
              type="button"
              onClick={toggleAddress}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                formData.includeAddress ? 'bg-[#007BFF]' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={formData.includeAddress}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  formData.includeAddress ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Address Fields - Conditionally Rendered */}
          {formData.includeAddress && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Street Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                    Street Number
                  </label>
                  <input
                    type="text"
                    value={formData.streetNumber}
                    onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })}
                    placeholder="e.g., 12B"
                    className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
                  />
                </div>

                {/* Street Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    value={formData.streetName}
                    onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                    placeholder="e.g., Main Street"
                    className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1F36] mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g., 12345"
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] text-sm transition-all"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[#E0E7F1]">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isLoading}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-all text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
