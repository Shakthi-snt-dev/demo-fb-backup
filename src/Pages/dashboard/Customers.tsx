import React, { useState } from 'react';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  includeAddress: boolean;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
}

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState<any[]>([]); // Empty for now
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    includeAddress: true,
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      includeAddress: true,
      streetNumber: '',
      streetName: '',
      city: '',
      state: '',
      postalCode: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.name || !formData.phone) {
      return;
    }
    // Handle form submission here
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  const toggleAddress = () => {
    setFormData({ ...formData, includeAddress: !formData.includeAddress });
  };

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

      {/* Search Bar */}
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
        <input
          type="text"
          placeholder="Search customers..."
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
              <tr className="border-b border-[#E0E7F1]">
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-[#1A1F36]">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#1A1F36]">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-[#1A1F36]">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-[#1A1F36]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-12 text-center">
                    <p className="text-[#4A5568]">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[#E0E7F1] hover:bg-[#F5F8FF]/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-[#1A1F36]">
                      {customer.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[#1A1F36] text-center">
                      {customer.contact}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[#1A1F36] text-center">
                      {customer.address}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Action buttons will go here */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Customer"
        subtitle="Add a new customer to your database"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">

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
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-all text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-all text-sm font-semibold shadow-sm hover:shadow-md"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;

