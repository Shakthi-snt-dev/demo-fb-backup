import React, { useState } from 'react';
import {
  HiMagnifyingGlass,
  HiPlus,
  HiChevronDown,
  HiDevicePhoneMobile,
  HiComputerDesktop,
  HiTicket,
  HiDocumentText,
  HiShieldCheck,
  HiEllipsisVertical,
  HiReceiptPercent,
  HiBell,
  HiChevronUp,
  HiCalculator,
  HiTrash,
  HiBuildingOffice2,
} from 'react-icons/hi2';

interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const POS: React.FC = () => {
  const [cartItems] = useState<CartItem[]>([]);
  const [itemSearch, setItemSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [subTotal] = useState(0);
  const [discount] = useState(0);
  const [tax] = useState(0);

  const categories: Category[] = [
    {
      id: '1',
      name: 'Mobile Repair',
      icon: HiDevicePhoneMobile,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: '2',
      name: 'Tablet Repair',
      icon: HiComputerDesktop,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      id: '3',
      name: 'Macbook Repair',
      icon: HiComputerDesktop,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: '4',
      name: 'Onsite/Remote Assistance',
      icon: HiBuildingOffice2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    return itemsTotal - discount + tax;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section with Primary Color */}
      <header className="bg-[#007BFF] text-white shadow-md">
        <div className="px-4 md:px-6 py-3 md:py-4">
          {/* Top Navigation Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4 mb-3">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold">Cell Care Plus</h1>
              <nav className="hidden md:flex items-center gap-4 text-sm">
                <button className="hover:text-white/80 transition-colors">Repairs</button>
                <button className="hover:text-white/80 transition-colors">Inventory</button>
                <button className="hover:text-white/80 transition-colors">Customer</button>
                <button className="bg-white/20 px-3 py-1 rounded-md font-medium">Point Of Sale</button>
                <button className="hover:text-white/80 transition-colors">Reports</button>
                <button className="hover:text-white/80 transition-colors">Campaigner</button>
                <button className="hover:text-white/80 transition-colors">Expense</button>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm transition-colors">
                Contact Support
                <HiChevronDown className="inline-block ml-1 w-4 h-4" />
              </button>
              <span className="text-sm">0%</span>
              <button className="p-2 hover:bg-white/20 rounded-md transition-colors">
                <HiBell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Secondary Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/20">
            <button className="text-sm hover:text-white/80 transition-colors">
              Re-open in POS
            </button>
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Scan or enter Ticket ID"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full pl-4 pr-8 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder:text-white/70 text-sm"
                />
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors">
                Repairs
              </button>
              <button className="px-3 py-1.5 hover:bg-white/20 rounded-md text-sm transition-colors">
                Unlocking
              </button>
              <button className="px-3 py-1.5 hover:bg-white/20 rounded-md text-sm transition-colors">
                Products
              </button>
              <button className="px-3 py-1.5 hover:bg-white/20 rounded-md text-sm transition-colors">
                Miscellaneous
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-6 max-w-[1600px] mx-auto">
          {/* Left Section - Sales Transaction Details */}
          <div className="space-y-4 md:space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#007BFF] flex items-center justify-center text-white font-semibold text-lg md:text-xl flex-shrink-0">
                    W
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">
                      Walkin Customer
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      Default customer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <HiMagnifyingGlass className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors">
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Item Entry */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter item name, SKU or scan barcode"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent text-sm md:text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hidden sm:block">
                    Ctrl S
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 md:py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm md:text-base font-medium whitespace-nowrap">
                  <span>Advance Search</span>
                  <HiChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Item List Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">
                        QTY
                      </th>
                      <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">
                        Item Name
                      </th>
                      <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">
                        Tax
                      </th>
                      <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 md:py-16 text-center text-gray-500 text-sm md:text-base"
                        >
                          No items added yet
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm md:text-base text-gray-900">
                            {item.qty}
                          </td>
                          <td className="px-4 py-3 text-sm md:text-base text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-sm md:text-base text-gray-900 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm md:text-base text-gray-900 text-right">
                            ${item.tax.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm md:text-base text-gray-900 text-right font-medium">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600">
                    Total Items:
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600">
                    Sub Total:
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-900">
                    ${subTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600">
                    Discount:
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-900">
                    ${discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600">Tax:</span>
                  <span className="text-sm md:text-base font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-base md:text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-lg font-bold text-[#007BFF]">
                      ${total.toFixed(2)}
                    </span>
                    <HiChevronUp className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Categories and Actions */}
          <div className="space-y-4 md:space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              <span className="hover:text-[#007BFF] cursor-pointer">Category</span>
              <span className="text-[#007BFF]">&gt;</span>
              <span className="hover:text-[#007BFF] cursor-pointer">Manufacturer</span>
              <span className="text-[#007BFF]">&gt;</span>
              <span className="hover:text-[#007BFF] cursor-pointer">Devices</span>
              <span className="text-[#007BFF]">&gt;</span>
              <span className="hover:text-[#007BFF] cursor-pointer">Problems</span>
              <span className="text-[#007BFF]">&gt;</span>
              <span className="hover:text-[#007BFF] cursor-pointer">Parts</span>
              <span className="text-[#007BFF]">&gt;</span>
              <span className="text-gray-900 font-medium">Details</span>
            </div>

            {/* Service Category Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {/* Add Category Card */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px] hover:border-[#007BFF] hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                  <HiPlus className="w-6 h-6 md:w-7 md:h-7 text-[#007BFF]" />
                </div>
                <p className="text-sm md:text-base font-medium text-gray-900 text-center">
                  Add Category
                </p>
              </div>

              {/* Service Category Cards */}
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px] hover:shadow-md transition-all cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 ${category.bgColor} rounded-lg flex items-center justify-center mb-3`}
                    >
                      <Icon className={`w-6 h-6 md:w-7 md:h-7 ${category.color}`} />
                    </div>
                    <p className="text-sm md:text-base font-medium text-gray-900 text-center">
                      {category.name}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors text-sm md:text-base font-medium">
                <HiTicket className="w-5 h-5" />
                <span>View Tickets</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors text-sm md:text-base font-medium">
                <HiDocumentText className="w-5 h-5" />
                <span>View Invoices</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors text-sm md:text-base font-medium">
                <HiCalculator className="w-5 h-5" />
                <span>Create Estimate</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm md:text-base font-medium">
                <HiTicket className="w-5 h-5" />
                <span>Create Ticket</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors text-sm md:text-base font-medium">
                <HiShieldCheck className="w-5 h-5" />
                <span>Warranty Claim</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors text-sm md:text-base font-medium">
                <HiEllipsisVertical className="w-5 h-5" />
                <span>More Actions</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm md:text-base font-medium">
                <HiTrash className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button className="col-span-2 lg:col-span-1 flex items-center justify-center gap-3 px-4 py-3 md:py-4 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-base md:text-lg font-semibold shadow-md">
                <HiReceiptPercent className="w-5 h-5 md:w-6 md:h-6" />
                <span>Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section with Primary Color */}
      <footer className="bg-[#007BFF] text-white py-4 md:py-6 px-4 md:px-6 mt-auto">
        <div className="max-w-[1600px] mx-auto text-center text-xs md:text-sm">
          <p>
            © 2025 - Cell Care Plus - 3350 Fairview St. Unit 11, Burlington Canada L7N 3L5 - +1 647-766-7971
          </p>
        </div>
      </footer>
    </div>
  );
};

export default POS;
