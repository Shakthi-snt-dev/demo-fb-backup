import React, { useState, useEffect } from 'react';
import {
  HiLockClosed,
  HiChevronDown,
  HiPencil
} from 'react-icons/hi2';
import Breadcrumb from '../../../components/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getProfile, updateProfile, type ProfileData } from '../../../Slices/dashboard/settings/Update Profile';
import { updatePassword, type PasswordUpdateData } from '../../../Slices/dashboard/settings/security-slice';
import { useToast } from '../../../components/Toast';
import Loading from '../../../components/Loading';
import StoreSettings from './store-Settings';
const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isLoading, isSuccess, isError, message, errorMessage, profile } = useAppSelector((state) => state.settings);
  const {
    isLoading: isSecurityLoading,
    isSuccess: isSecuritySuccess,
    isError: isSecurityError,
    message: securityMessage,
    errorMessage: securityErrorMessage
  } = useAppSelector((state) => state.security);

  const [activeTab, setActiveTab] = useState<'profile' | 'store'>('profile');

  // Profile form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    accessPin: '',
    language: '',
    phoneNumber: '',
    streetNumber: '',
    streetName: '',
    mobileNumber: '',
    defaultStore: '',
    // address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    twoFactorEnabled: false,
  });

  // Security form states (separate from profile data)
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load profile data on mount
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        accessPin: '', // Access PIN is not stored, user enters it
        language: profile.language || '',
        phoneNumber: profile.phone || '',
        mobileNumber: profile.mobile || '',
        defaultStore: profile.defaultStoreId || '',
        // address: profile.streetName || '',
        streetNumber: profile.streetNumber || '',
        streetName: profile.streetName || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postalCode: profile.postalCode || '',
        twoFactorEnabled: profile.twoFactorEnabled || false,
      });
    }
  }, [profile]);

  // Show toast notifications for settings
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

  // Show toast notifications for security
  useEffect(() => {
    if (isSecuritySuccess && securityMessage) {
      showToast({
        message: securityMessage,
        type: 'success',
      });
      // Reset security form on success
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [isSecuritySuccess, securityMessage, showToast]);

  useEffect(() => {
    if (isSecurityError && securityErrorMessage) {
      showToast({
        message: securityErrorMessage,
        type: 'error',
      });
    }
  }, [isSecurityError, securityErrorMessage, showToast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityInputChange = (field: string, value: string) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Map form data to API format
      const profileData: ProfileData = {
        username: formData.username,
        email: formData.email,
        language: formData.language,
        phone: formData.phoneNumber,
        twoFactorEnabled: formData.twoFactorEnabled ?? false,
        mobile: formData.mobileNumber,
        streetNumber: formData.streetNumber,
          streetName: formData.streetName,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        defaultStoreId: formData.defaultStore,
      };

      await dispatch(updateProfile(profileData)).unwrap();
    } catch (error: any) {
      // Error is handled by the slice and shown via toast
      console.error('Failed to update profile:', error);
    }
  };

  const handleUpdatePassword = async () => {
    // Validate password fields
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      showToast({
        message: 'Please fill in all password fields',
        type: 'error',
      });
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast({
        message: 'New password and confirm password do not match',
        type: 'error',
      });
      return;
    }

    try {
      const passwordData: PasswordUpdateData = {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
        confirmPassword: securityData.confirmPassword,
      };

      await dispatch(updatePassword(passwordData)).unwrap();
    } catch (error: any) {
      // Error is handled by the slice and shown via toast
      console.error('Failed to update password:', error);
    }
  };

  if (isLoading && !profile) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in" style={{ maxWidth: '1400px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Settings', path: '/dashboard/settings' },
        { label: 'Basic Settings' }
      ]} />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F36] mb-2">Update Profile</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E0E7F1]">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === 'profile'
              ? 'text-[#007BFF]'
              : 'text-[#4A5568] hover:text-[#1A1F36]'
            }`}
        >
          User Profile
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007BFF]"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === 'store'
              ? 'text-[#007BFF]'
              : 'text-[#4A5568] hover:text-[#1A1F36]'
            }`}
        >
          Store Settings
          {activeTab === 'store' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007BFF]"></span>
          )}
        </button>
      </div>

      {/* User Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Two Column Layout: Personal Information and Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Personal Information</h2>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF] text-2xl font-semibold overflow-hidden">
                    {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#007BFF] rounded-full flex items-center justify-center text-white hover:bg-[#0065D1] transition-colors shadow-md">
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Your Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="Name"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="yourmail@gmail.com"
                />
              </div>

              {/* Access PIN */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Access PIN</label>
                <input
                  type="password"
                  value={formData.accessPin}
                  onChange={(e) => handleInputChange('accessPin', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="**********"
                />
              </div>

              {/* Language */}
              <div className="mb-6">
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
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Contact Information</h2>
              </div>

              {/* Default Store */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Default Store</label>
                <div className="relative">
                  <select
                    value={formData.defaultStore}
                    onChange={(e) => handleInputChange('defaultStore', e.target.value)}
                    className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
                  >
                    <option value="">Select default store</option>
                    <option value="b710a040-2052-4808-bb39-a426d82d32a4">default store</option>
                    <option value="b710a040-2052-4808-bb39-a426d82d32a4">Store 2</option>
                    <option value="store3">Store 3</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="yourmail@gmail.com"
                />
              </div>

              {/* Mobile */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Mobile</label>
                <input
                  type="password"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="**********"
                />
              </div>

              {/* Address
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="Abc"
                />
              </div> */}

              {/* Street Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Number</label>
                <input
                  type="text"
                  value={formData.streetNumber}
                  onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="123"
                />
              </div>
              {/* Street Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Street Name</label>
                <input
                  type="text"
                  value={formData.streetName}
                  onChange={(e) => handleInputChange('streetName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="Main Street"
                />
              </div>
              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="Chennai"
                />
              </div>

              {/* ZIP */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">ZIP</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="628654"
                />
              </div>

              {/* State */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36] placeholder:text-[#4A5568]/60"
                  placeholder="Tamilnadu"
                />
              </div>

              {/* Country */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Country</label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 pr-10 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white text-[#1A1F36]"
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E7F1] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Security</h2>
            </div>

            {/* Two-Factor Authentication */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1A1F36] mb-2">Two-factor Authentication (2FA)</h3>
                  <p className="text-sm text-[#4A5568] mb-4">
                    Two-Factor Authentication (2FA) adds an extra layer of security to your account. In addition to your password, you'll need to verify your identity using a second method.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleChange('twoFactorEnabled', !formData.twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 flex-shrink-0 ${formData.twoFactorEnabled ? 'bg-[#007BFF]' : 'bg-[#CBD5E0]'
                    }`}
                  role="switch"
                  aria-checked={formData.twoFactorEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? 'Updating...' : 'Update'}
                {!isLoading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </div>
          </div>



          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0E7F1] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Security</h2>
              <p className="text-sm text-[#4A5568]">Manage your security settings</p>
            </div>



            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1F36] mb-4">Change Password</h3>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Current Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4A5568]/60">
                    <HiLockClosed className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => handleSecurityInputChange('currentPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-[#F5F8FF] text-[#1A1F36] placeholder:text-[#4A5568]/60"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4A5568]/60">
                    <HiLockClosed className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => handleSecurityInputChange('newPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-[#F5F8FF] text-[#1A1F36] placeholder:text-[#4A5568]/60"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1A1F36] mb-2">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4A5568]/60">
                    <HiLockClosed className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => handleSecurityInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-[#F5F8FF] text-[#1A1F36] placeholder:text-[#4A5568]/60"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Update Password Button */}
            <button
              onClick={handleUpdatePassword}
              disabled={isSecurityLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSecurityLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}

      {/* Store Settings Tab Content */}
      {activeTab === 'store' && (
        <StoreSettings />
      )}
    </div>
  );
};

export default Settings;

