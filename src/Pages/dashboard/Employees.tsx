import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiCloudArrowDown,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
  HiTrash,
} from 'react-icons/hi2';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getStoresList,
  getEmployeesByStore,
  createEmployee,
  deleteEmployee,
  setSelectedStoreId,
  type CreateEmployeeData,
} from '../../Slices/dashboard/Employee/employee-slice';

const Employees: React.FC = () => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { employees, stores, isLoading, isSuccess, isError, errorMessage, message } = useAppSelector(
    (state) => state.employee
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedManagement, setSelectedManagement] = useState<string>('all');
  const filterRef = useRef<HTMLDivElement>(null);
  const [localSelectedStoreId, setLocalSelectedStoreId] = useState<string>('all');

  // Form state for Add Employee
  const [formData, setFormData] = useState<CreateEmployeeData>({
    storeId: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Technician',
    employeeCode: '',
    hourlyRate: 0,
    address: {
      streetNumber: '',
      streetName: '',
      city: '',
      state: '',
      postalCode: '',
    },
    emergencyContactName: '',
    emergencyContactPhone: '',
    permissions: {},
  });

  const employeesPerPage = 12;
  const totalEmployees = employees.length;

  // Fetch stores on mount
  useEffect(() => {
    dispatch(getStoresList());
  }, [dispatch]);

  // Fetch employees when store is selected
  useEffect(() => {
    if (localSelectedStoreId && localSelectedStoreId !== 'all') {
      dispatch(
        getEmployeesByStore({
          storeId: localSelectedStoreId,
          role: selectedRole !== 'all' ? selectedRole : undefined,
        })
      );
      dispatch(setSelectedStoreId(localSelectedStoreId));
    } else {
      dispatch(setSelectedStoreId(null));
    }
  }, [dispatch, localSelectedStoreId, selectedRole]);

  // Show toast messages
  useEffect(() => {
    if (isSuccess && message) {
      showToast({
        message,
        type: 'success',
      });
    }
    if (isError && errorMessage) {
      showToast({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [isSuccess, isError, message, errorMessage, showToast]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
      const isManagement = employee.role === 'Manager' || employee.role === 'Admin';
      const matchesManagement =
        selectedManagement === 'all' ||
        (selectedManagement === 'management' && isManagement) ||
        (selectedManagement === 'non-management' && !isManagement);

      return matchesSearch && matchesRole && matchesManagement;
    });
  }, [employees, searchQuery, selectedRole, selectedManagement]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Format date to DD-MMM-YYYY format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate().toString().padStart(2, '0');
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role tag color
  const getRoleTagColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-[#007BFF]/10 text-[#007BFF]';
      case 'Admin':
        return 'bg-[#007BFF]/10 text-[#007BFF]';
      case 'Technician':
        return 'bg-[#007BFF]/10 text-[#007BFF]';
      default:
        return 'bg-[#007BFF]/10 text-[#007BFF]';
    }
  };

  // Handle add employee
  const handleAddEmployee = async () => {
    if (!formData.fullName || !formData.employeeCode || !formData.email || !formData.password || !formData.storeId) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(createEmployee(formData)).unwrap();
      setIsAddModalOpen(false);
      setFormData({
        storeId: localSelectedStoreId !== 'all' ? localSelectedStoreId : '',
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: 'Technician',
        employeeCode: '',
        hourlyRate: 0,
        address: {
          streetNumber: '',
          streetName: '',
          city: '',
          state: '',
          postalCode: '',
        },
        emergencyContactName: '',
        emergencyContactPhone: '',
        permissions: {},
      });
      // Refresh employees list
      if (localSelectedStoreId && localSelectedStoreId !== 'all') {
        dispatch(
          getEmployeesByStore({
            storeId: localSelectedStoreId,
            role: selectedRole !== 'all' ? selectedRole : undefined,
          })
        );
      }
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        // Refresh employees list
        if (localSelectedStoreId && localSelectedStoreId !== 'all') {
          dispatch(
            getEmployeesByStore({
              storeId: localSelectedStoreId,
              role: selectedRole !== 'all' ? selectedRole : undefined,
            })
          );
        }
      } catch (error) {
        // Error is handled by the slice and shown via toast
      }
    }
  };

  // Handle import employees
  const handleImportEmployees = () => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">
            Employees ({totalEmployees})
          </h1>
          <p className="text-sm text-[#4A5568] mt-1">
            All the employees of the company are listed here.
          </p>
        </div>
        <div className="flex gap-[10px]">
          {/* Filter by store id */}
          <select
            value={localSelectedStoreId}
            onChange={(e) => {
              setLocalSelectedStoreId(e.target.value);
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
          >
            <option value="all">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.storeName}
              </option>
            ))}
          </select>

          <button
            onClick={handleImportEmployees}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
          >
            <HiCloudArrowDown className="w-5 h-5" />
            <span className="hidden sm:inline">Import Employees</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                storeId: localSelectedStoreId !== 'all' ? localSelectedStoreId : '',
                fullName: '',
                email: '',
                password: '',
                phone: '',
                role: 'Technician',
                employeeCode: '',
                hourlyRate: 0,
                address: {
                  streetNumber: '',
                  streetName: '',
                  city: '',
                  state: '',
                  postalCode: '',
                },
                emergencyContactName: '',
                emergencyContactPhone: '',
                permissions: {},
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm font-medium"
          >
            <HiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Employee</span>
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
            placeholder="Search" 
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
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Technician">Technician</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                    Management
                  </label>
                  <select
                    value={selectedManagement}
                    onChange={(e) => {
                      setSelectedManagement(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-sm"
                  >
                    <option value="all">All</option>
                    <option value="management">Management</option>
                    <option value="non-management">Non-Management</option>
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
          <p className="text-[#4A5568]">Loading employees...</p>
        </div>
      )}

      {/* Employees Grid */}
      {!isLoading && currentEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-2xl border border-[#E0E7F1] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col w-full max-w-[300px] mx-auto h-full min-h-[360px] group"
            >
              {/* Gradient Header */}
              <div className="relative bg-gradient-to-br from-[#007BFF] via-[#0056B3] to-[#003D82] h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/5"></div>
                {/* Avatar with border */}
                <div className="relative z-10 -mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056B3] flex items-center justify-center text-white text-lg font-semibold shadow-lg ring-3 ring-white">
                    {getInitials(employee.fullName)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col pt-8 px-4 pb-4">
                {/* Name and Role */}
                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-[#1A1F36] mb-0.5 truncate w-full">
                    {employee.fullName || 'N/A'}
                  </h3>
                  <p className="text-xs text-[#007BFF] font-medium">{employee.role || 'N/A'}</p>
                </div>

                {/* Tags */}
                <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getRoleTagColor(
                      employee.role
                    )}`}
                  >
                    {employee.role || 'N/A'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                      employee.role === 'Manager' || employee.role === 'Admin'
                        ? 'bg-[#007BFF]/10 text-[#007BFF]'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {employee.role === 'Manager' || employee.role === 'Admin'
                      ? 'Management'
                      : 'Non-Management'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                      employee.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Employee Details */}
                <div className="space-y-1 text-xs flex-grow bg-gradient-to-b from-transparent to-[#F5F8FF]/30 rounded-lg p-2.5 -mx-1">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#4A5568] font-medium">Emp Code:</span>
                    <span className="text-[#1A1F36] font-semibold truncate ml-2 text-right">
                      {employee.employeeCode || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#4A5568] font-medium">Email:</span>
                    <span className="text-[#1A1F36] font-semibold truncate ml-2 text-right max-w-[60%]" title={employee.email}>
                      {employee.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#4A5568] font-medium">Phone:</span>
                    <span className="text-[#1A1F36] font-semibold truncate ml-2 text-right">
                      {employee.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#4A5568] font-medium">Hourly Rate:</span>
                    <span className="text-[#007BFF] font-bold">
                      ${employee.hourlyRate || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#4A5568] font-medium">Created:</span>
                    <span className="text-[#1A1F36] font-semibold text-right">
                      {employee.createdAt ? formatDate(employee.createdAt) : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="mt-3 pt-3 border-t border-[#E0E7F1]">
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-red-50 text-red-600 rounded-lg hover:from-red-100 hover:to-red-100 transition-all duration-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div className="bg-white rounded-xl border border-[#E0E7F1] p-12 text-center">
          <p className="text-[#4A5568]">
            {localSelectedStoreId === 'all'
              ? 'Please select a store to view employees.'
              : 'No employees found matching your criteria.'}
          </p>
        </div>
      ) : null}

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
                    className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
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

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Store *
            </label>
            <select
              value={formData.storeId}
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
            >
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.storeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter full name"
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

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Phone
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
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
            >
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Technician">Technician</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Employee Code *
            </label>
            <input
              type="text"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter employee code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Hourly Rate
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter hourly rate"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Street Number
              </label>
              <input
                type="text"
                value={formData.address.streetNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, streetNumber: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Street number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Street Name
              </label>
              <input
                type="text"
                value={formData.address.streetName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, streetName: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Street name"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1F36] mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, postalCode: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
                placeholder="Postal code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Emergency Contact Name
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter emergency contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter emergency contact phone"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;

