import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiCloudArrowDown,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

interface Employee {
  id: string;
  name: string;
  role: 'Manager' | 'Admin' | 'Technician';
  empCode: string;
  joiningDate: string;
  avatar?: string;
  isManagement: boolean;
}

const Employees: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedManagement, setSelectedManagement] = useState<string>('all');
  const filterRef = useRef<HTMLDivElement>(null);

  // Form state for Add Employee
  const [formData, setFormData] = useState({
    name: '',
    role: 'Technician' as 'Manager' | 'Admin' | 'Technician',
    empCode: '',
    joiningDate: '',
    email: '',
    phone: '',
  });

  // Sample employee data - in production, this would come from an API
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Manager',
      empCode: '01102021-7437',
      joiningDate: '03-Jan-2022',
      isManagement: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Admin',
      empCode: '7634768-673',
      joiningDate: '11-Jan-2021',
      isManagement: true,
    },
    {
      id: '3',
      name: 'Mike Davis',
      role: 'Technician',
      empCode: '647637-009',
      joiningDate: '08-Feb-2022',
      isManagement: false,
    },
    {
      id: '4',
      name: 'Emily Wilson',
      role: 'Manager',
      empCode: '6565647-6737',
      joiningDate: '01-Aug-2021',
      isManagement: true,
    },
    {
      id: '5',
      name: 'David Brown',
      role: 'Technician',
      empCode: '754788-747',
      joiningDate: '01-Oct-2022',
      isManagement: false,
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      role: 'Admin',
      empCode: '456578-737',
      joiningDate: '01-Jan-2023',
      isManagement: true,
    },
    {
      id: '7',
      name: 'Robert Taylor',
      role: 'Technician',
      empCode: '01102021-786',
      joiningDate: '01-Jan-2021',
      isManagement: false,
    },
    {
      id: '8',
      name: 'Jennifer Martinez',
      role: 'Manager',
      empCode: '01102021-676',
      joiningDate: '01-Jan-2021',
      isManagement: true,
    },
    {
      id: '9',
      name: 'Michael Garcia',
      role: 'Technician',
      empCode: '01102021-009',
      joiningDate: '05-Jan-2021',
      isManagement: false,
    },
    {
      id: '10',
      name: 'Amanda Lee',
      role: 'Admin',
      empCode: '01102021-010',
      joiningDate: '06-Jan-2021',
      isManagement: true,
    },
    {
      id: '11',
      name: 'Christopher White',
      role: 'Technician',
      empCode: '01102021-011',
      joiningDate: '05-Jan-2021',
      isManagement: false,
    },
    {
      id: '12',
      name: 'Jessica Harris',
      role: 'Manager',
      empCode: '16502021-56',
      joiningDate: '01-Jan-2021',
      isManagement: true,
    },
  ]);

  const employeesPerPage = 12;
  const totalEmployees = employees.length;

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
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
      const matchesManagement =
        selectedManagement === 'all' ||
        (selectedManagement === 'management' && employee.isManagement) ||
        (selectedManagement === 'non-management' && !employee.isManagement);

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
    const date = new Date(dateString);
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
        return 'bg-blue-100 text-blue-700';
      case 'Admin':
        return 'bg-blue-100 text-blue-700';
      case 'Technician':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle add employee
  const handleAddEmployee = () => {
    if (!formData.name || !formData.empCode || !formData.joiningDate) {
      showToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    const isManagement = formData.role === 'Manager' || formData.role === 'Admin';
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role,
      empCode: formData.empCode,
      joiningDate: formatDate(formData.joiningDate),
      isManagement,
    };

    setEmployees([...employees, newEmployee]);
    showToast({
      message: 'Employee added successfully',
      type: 'success',
    });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      role: 'Technician',
      empCode: '',
      joiningDate: '',
      email: '',
      phone: '',
    });
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
        <div className="flex gap-3">
          <button
            onClick={handleImportEmployees}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm font-medium"
          >
            <HiCloudArrowDown className="w-5 h-5" />
            <span className="hidden sm:inline">Import Employees</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
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

      {/* Employees Grid */}
      {currentEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl border border-[#E0E7F1] p-6 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056B3] flex items-center justify-center text-white text-2xl font-semibold">
                  {getInitials(employee.name)}
                </div>
              </div>

              {/* Name and Role */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-[#1A1F36] mb-1">
                  {employee.name}
                </h3>
                <p className="text-sm text-[#4A5568]">{employee.role}</p>
              </div>

              {/* Tags */}
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleTagColor(
                    employee.role
                  )}`}
                >
                  {employee.role}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.isManagement
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {employee.isManagement ? 'Management' : 'Non-Management'}
                </span>
              </div>

              {/* Employee Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4A5568]">Emp Code:</span>
                  <span className="text-[#1A1F36] font-medium">
                    {employee.empCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A5568]">Joining Date:</span>
                  <span className="text-[#1A1F36] font-medium">
                    {employee.joiningDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E0E7F1] p-12 text-center">
          <p className="text-[#4A5568]">No employees found matching your criteria.</p>
        </div>
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

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'Manager' | 'Admin' | 'Technician',
                })
              }
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
              value={formData.empCode}
              onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
              placeholder="Enter employee code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Joining Date *
            </label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-white text-[#1A1F36]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1F36] mb-2">
              Email
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

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2.5 border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEmployee}
              className="px-6 py-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors font-medium"
            >
              Add Employee
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;

