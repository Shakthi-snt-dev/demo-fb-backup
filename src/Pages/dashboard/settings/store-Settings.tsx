import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiEnvelope, HiArrowPath } from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  getStoreSettings,
  updateStoreSettings,
  sendVerificationEmail,
  resetApiKey,
  type StoreSettingsData,
} from '../../../Slices/dashboard/settings/store-settings-slice';
import { useToast } from '../../../components/Toast';
import Loading from '../../../components/Loading';

const StoreSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const {
    isLoading,
    isSuccess,
    isError,
    message,
    errorMessage,
    storeSettings,
  } = useAppSelector((state) => state.storeSettings);


  // Default store ID - can be retrieved from user profile or props
  const [currentStoreId] = useState<string>('b710a040-2052-4808-bb39-a426d82d32a4'); // TODO: Get from user profile or props

  // Form state
  const [formData, setFormData] = useState<StoreSettingsData>({
    businessName: '',
    storeEmail: '',
    alternateName: '',
    storeLogoUrl: '',
    phone: '',
    mobile: '',
    website: '',
    address: {
      streetNumber: '',
      streetName: '',
      city: '',
      state: '',
      postalCode: '',
    },
    timeZone: '',
    timeFormat: '',
    language: '',
    defaultCurrency: '',
    priceFormat: '',
    decimalFormat: '',
    chargeSalesTax: false,
    defaultTaxClass: '',
    taxPercentage: 0,
    registrationNumber: '',
    startTime: '',
    endTime: '',
    defaultAddress: {
      streetNumber: '',
      streetName: '',
      city: '',
      state: '',
      postalCode: '',
    },
    apiKey: '',
    accountingMethod: '',
    companyEmail: '',
    companyEmailVerified: false,
    emailNotifications: false,
    requireTwoFactorForAllUsers: false,
    chargeRestockingFee: false,
    diagnosticBenchFee: 0,
    chargeDepositOnRepairs: false,
    lockScreenTimeoutMinutes: 0,
  });

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isResettingApiKey, setIsResettingApiKey] = useState(false);

  // Load store settings on mount
  useEffect(() => {
    if (currentStoreId) {
      dispatch(getStoreSettings(currentStoreId));
    }
  }, [dispatch, currentStoreId]);

  // Update form data when store settings are loaded
  useEffect(() => {
    if (storeSettings) {
      setFormData({
        ...storeSettings,
        address: storeSettings.address || {
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          postalCode: '',
        },
        defaultAddress: storeSettings.defaultAddress || {
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          postalCode: '',
        },
      });
    }
  }, [storeSettings]);

  // Show toast notifications
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message: message,
        type: 'success',
      });
    }
  }, [isSuccess, message, showToast]);

  useEffect(() => {
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [isError, errorMessage, showToast]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      // Handle nested fields like address.streetName
      const [parent, child] = field.split('.');
      setFormData((prev) => {
        const parentValue = prev[parent as keyof StoreSettingsData] as any;
        return {
          ...prev,
          [parent]: {
            ...(parentValue || {}),
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(
        updateStoreSettings({ storeId: currentStoreId, data: formData })
      ).unwrap();
    } catch (error: any) {
      console.error('Failed to update store settings:', error);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!formData.companyEmail) {
      showToast({
        message: 'Please enter a company email address first',
        type: 'error',
      });
      return;
    }

    setIsVerifyingEmail(true);
    try {
      await dispatch(
        sendVerificationEmail({ storeId: currentStoreId, email: formData.companyEmail })
      ).unwrap();
    } catch (error: any) {
      console.error('Failed to send verification email:', error);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleResetApiKey = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset the API key? This will invalidate the current key.'
      )
    ) {
      return;
    }

    setIsResettingApiKey(true);
    try {
      const result = await dispatch(resetApiKey(currentStoreId)).unwrap();
      if (result.data?.apiKey) {
        setFormData((prev) => ({ ...prev, apiKey: result.data!.apiKey! }));
      }
    } catch (error: any) {
      console.error('Failed to reset API key:', error);
    } finally {
      setIsResettingApiKey(false);
    }
  };

  if (isLoading && !storeSettings) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Business Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Basic Information</h2>
          </div>

          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter business name"
            />
          </div>

          {/* Alternate Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Alternate Name</label>
            <input
              type="text"
              value={formData.alternateName}
              onChange={(e) => handleInputChange('alternateName', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter alternate name"
            />
          </div>

          {/* Store Logo URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Store Logo URL</label>
            <input
              type="url"
              value={formData.storeLogoUrl}
              onChange={(e) => handleInputChange('storeLogoUrl', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Registration Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter registration number"
            />
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Contact Information</h2>
          </div>

          {/* Store Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Store Email *</label>
            <input
              type="email"
              value={formData.storeEmail}
              onChange={(e) => handleInputChange('storeEmail', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="store@example.com"
            />
          </div>

          {/* Company Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Company Email *</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="company@example.com"
              />
              <button
                onClick={handleSendVerificationEmail}
                disabled={isVerifyingEmail || !formData.companyEmail}
                className="px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Send Verification Email"
              >
                <HiEnvelope className="w-5 h-5" />
                {isVerifyingEmail ? 'Sending...' : formData.companyEmailVerified ? 'Verified' : 'Send Verification'}
              </button>
            </div>
            {formData.companyEmailVerified && (
              <p className="text-sm text-green-600 mt-1">✓ Email verified</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Mobile</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Address Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Store Address</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Number</label>
              <input
                type="text"
                value={formData.address.streetNumber}
                onChange={(e) => handleInputChange('address.streetNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Name</label>
              <input
                type="text"
                value={formData.address.streetName}
                onChange={(e) => handleInputChange('address.streetName', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Main St"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="State"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="12345"
            />
          </div>
        </div>

        {/* Default Address Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Default Address</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Number</label>
              <input
                type="text"
                value={formData.defaultAddress.streetNumber}
                onChange={(e) => handleInputChange('defaultAddress.streetNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Name</label>
              <input
                type="text"
                value={formData.defaultAddress.streetName}
                onChange={(e) => handleInputChange('defaultAddress.streetName', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Main St"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">City</label>
              <input
                type="text"
                value={formData.defaultAddress.city}
                onChange={(e) => handleInputChange('defaultAddress.city', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">State</label>
              <input
                type="text"
                value={formData.defaultAddress.state}
                onChange={(e) => handleInputChange('defaultAddress.state', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="State"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.defaultAddress.postalCode}
              onChange={(e) => handleInputChange('defaultAddress.postalCode', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Localization & Formatting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Localization Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Localization</h2>
          </div>

          {/* Time Zone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Time Zone</label>
            <div className="relative">
              <select
                value={formData.timeZone}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
              >
                <option value="">Select time zone</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
            </div>
          </div>

          {/* Time Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Time Format</label>
            <div className="relative">
              <select
                value={formData.timeFormat}
                onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
              >
                <option value="">Select format</option>
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
            </div>
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Language</label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
            </div>
          </div>

          {/* Default Currency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Default Currency</label>
            <div className="relative">
              <select
                value={formData.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
              >
                <option value="">Select currency</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Formatting Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Price Formatting</h2>
          </div>

          {/* Price Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Price Format</label>
            <input
              type="text"
              value={formData.priceFormat}
              onChange={(e) => handleInputChange('priceFormat', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="e.g., $0.00"
            />
          </div>

          {/* Decimal Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Decimal Format</label>
            <input
              type="text"
              value={formData.decimalFormat}
              onChange={(e) => handleInputChange('decimalFormat', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="e.g., 2"
            />
          </div>

          {/* Accounting Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Accounting Method</label>
            <div className="relative">
              <select
                value={formData.accountingMethod}
                onChange={(e) => handleInputChange('accountingMethod', e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
              >
                <option value="">Select method</option>
                <option value="FIFO">FIFO</option>
                <option value="LIFO">LIFO</option>
                <option value="Average">Average Cost</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tax & Business Hours Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Tax Settings</h2>
          </div>

          {/* Charge Sales Tax Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#1A1F36]">Charge Sales Tax</h3>
                <p className="text-xs text-[#4A5568]">Enable sales tax calculation</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleChange('chargeSalesTax', !formData.chargeSalesTax)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                  formData.chargeSalesTax ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.chargeSalesTax ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Default Tax Class */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Default Tax Class</label>
            <input
              type="text"
              value={formData.defaultTaxClass}
              onChange={(e) => handleInputChange('defaultTaxClass', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Standard"
            />
          </div>

          {/* Tax Percentage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Tax Percentage (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.taxPercentage}
              onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Business Hours Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Business Hours</h2>
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Start Time</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
            />
          </div>

          {/* End Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">End Time</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
            />
          </div>
        </div>
      </div>

      {/* Security & API Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Security & API Settings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.apiKey}
                readOnly
                className="flex-1 px-4 py-2.5 border border-[#E0E7F1] rounded-lg bg-[#F5F8FF] text-[#1A1F36] cursor-not-allowed"
                placeholder="No API key set"
              />
              <button
                onClick={handleResetApiKey}
                disabled={isResettingApiKey}
                className="px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Reset API Key"
              >
                <HiArrowPath className="w-5 h-5" />
                {isResettingApiKey ? 'Resetting...' : 'Reset'}
              </button>
            </div>
            <p className="text-xs text-[#4A5568] mt-1">
              Keep your API key secure. Resetting will invalidate the current key.
            </p>
          </div>

          {/* Lock Screen Timeout */}
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Lock Screen Timeout (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={formData.lockScreenTimeoutMinutes}
              onChange={(e) =>
                handleInputChange('lockScreenTimeoutMinutes', parseInt(e.target.value) || 0)
              }
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="0"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1A1F36]">Email Notifications</h3>
              <p className="text-xs text-[#4A5568]">Receive email notifications for important events</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleChange('emailNotifications', !formData.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                formData.emailNotifications ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Require Two Factor for All Users */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1A1F36]">Require Two-Factor for All Users</h3>
              <p className="text-xs text-[#4A5568]">Enforce 2FA for all users in the store</p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleToggleChange('requireTwoFactorForAllUsers', !formData.requireTwoFactorForAllUsers)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                formData.requireTwoFactorForAllUsers ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.requireTwoFactorForAllUsers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Charge Restocking Fee */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1A1F36]">Charge Restocking Fee</h3>
              <p className="text-xs text-[#4A5568]">Apply restocking fee for returned items</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleChange('chargeRestockingFee', !formData.chargeRestockingFee)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                formData.chargeRestockingFee ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.chargeRestockingFee ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Charge Deposit on Repairs */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1A1F36]">Charge Deposit on Repairs</h3>
              <p className="text-xs text-[#4A5568]">Require deposit payment for repair orders</p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleToggleChange('chargeDepositOnRepairs', !formData.chargeDepositOnRepairs)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 ${
                formData.chargeDepositOnRepairs ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.chargeDepositOnRepairs ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Diagnostic Bench Fee */}
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">Diagnostic Bench Fee</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.diagnosticBenchFee}
              onChange={(e) =>
                handleInputChange('diagnosticBenchFee', parseFloat(e.target.value) || 0)
              }
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? 'Updating...' : 'Update Settings'}
            {!isLoading && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;

