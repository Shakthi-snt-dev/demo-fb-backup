import React, { useState } from 'react';
import {
  HiMagnifyingGlass,
  HiPlus,
  HiChevronDown,
  HiDevicePhoneMobile,
  HiComputerDesktop,
  HiWifi,
  HiTicket,
  HiDocumentText,
  HiShieldCheck,
  HiXMark,
  HiEllipsisVertical,
  HiReceiptPercent,
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemSearch, setItemSearch] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

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
      icon: HiWifi,
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
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-6">
        {/* Left Section - Sales Transaction Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1F36]">
              Point of Sale
            </h1>
            <p className="text-sm md:text-base text-[#4A5568] mt-1">
              Process sales and transactions
            </p>
          </div>

          {/* Customer Information Card */}
          <div className="bg-white border border-[#E0E7F1] rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#007BFF] flex items-center justify-center text-white font-semibold text-lg md:text-xl flex-shrink-0">
                  W
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-[#1A1F36]">
                    Walk-in Customer
                  </p>
                  <p className="text-xs md:text-sm text-[#4A5568]">
                    Default customer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 md:p-2.5 text-[#4A5568] hover:bg-[#F5F8FF] rounded-lg transition-colors">
                  <HiMagnifyingGlass className="w-5 h-5" />
                </button>
                <button className="p-2 md:p-2.5 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors">
                  <HiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Item Entry */}
          <div className="bg-white border border-[#E0E7F1] rounded-xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter item name, SKU or scan barcode"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full px-4 py-2.5 md:py-3 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent text-sm md:text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4A5568] hidden sm:block">
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
          <div className="bg-white border border-[#E0E7F1] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F8FF] border-b border-[#E0E7F1]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-[#1A1F36]">
                      QTY
                    </th>
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-[#1A1F36]">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-[#1A1F36]">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-[#1A1F36]">
                      Tax
                    </th>
                    <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-[#1A1F36]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 md:py-16 text-center text-[#4A5568] text-sm md:text-base"
                      >
                        No items added yet
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#E0E7F1] hover:bg-[#F5F8FF] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm md:text-base text-[#1A1F36]">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3 text-sm md:text-base text-[#1A1F36]">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm md:text-base text-[#1A1F36] text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm md:text-base text-[#1A1F36] text-right">
                          ${item.tax.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm md:text-base text-[#1A1F36] text-right font-medium">
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
          <div className="bg-white border border-[#E0E7F1] rounded-xl p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#4A5568]">
                  Total Items:
                </span>
                <span className="text-sm md:text-base font-medium text-[#1A1F36]">
                  {totalItems}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#4A5568]">
                  Sub Total:
                </span>
                <span className="text-sm md:text-base font-medium text-[#1A1F36]">
                  ${subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#4A5568]">
                  Discount:
                </span>
                <span className="text-sm md:text-base font-medium text-[#1A1F36]">
                  ${discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#4A5568]">Tax:</span>
                <span className="text-sm md:text-base font-medium text-[#1A1F36]">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#E0E7F1]">
                <span className="text-base md:text-lg font-semibold text-[#1A1F36]">
                  Total:
                </span>
                <span className="text-base md:text-lg font-bold text-[#007BFF]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Categories and Actions */}
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-[#4A5568]">
            <span>Category</span>
            <span className="text-[#007BFF]">&gt;</span>
            <span>Manufacturer</span>
            <span className="text-[#007BFF]">&gt;</span>
            <span>Devices</span>
            <span className="text-[#007BFF]">&gt;</span>
            <span>Problems</span>
            <span className="text-[#007BFF]">&gt;</span>
            <span>Parts</span>
            <span className="text-[#007BFF]">&gt;</span>
            <span className="text-[#1A1F36] font-medium">Details</span>
          </div>

          {/* Service Category Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            {/* Add Category Card */}
            <div className="bg-white border-2 border-dashed border-[#E0E7F1] rounded-xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px] hover:border-[#007BFF] hover:bg-[#F5F8FF] transition-colors cursor-pointer">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#F5F8FF] flex items-center justify-center mb-3">
                <HiPlus className="w-6 h-6 md:w-7 md:h-7 text-[#007BFF]" />
              </div>
              <p className="text-sm md:text-base font-medium text-[#1A1F36] text-center">
                Add Category
              </p>
            </div>

            {/* Service Category Cards */}
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white border border-[#E0E7F1] rounded-xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 ${category.bgColor} rounded-lg flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${category.color}`} />
                  </div>
                  <p className="text-sm md:text-base font-medium text-[#1A1F36] text-center">
                    {category.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 md:space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiTicket className="w-5 h-5" />
              <span>View Tickets</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiDocumentText className="w-5 h-5" />
              <span>Create Estimate</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiShieldCheck className="w-5 h-5" />
              <span>Warranty Claim</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiXMark className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiDocumentText className="w-5 h-5" />
              <span>View Invoices</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-sm md:text-base font-medium">
              <HiTicket className="w-5 h-5" />
              <span>Create Ticket</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white border border-[#E0E7F1] rounded-lg text-[#1A1F36] hover:bg-[#F5F8FF] transition-colors text-sm md:text-base font-medium">
              <HiEllipsisVertical className="w-5 h-5" />
              <span>More Actions</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 md:py-4 bg-[#007BFF] text-white rounded-lg hover:bg-[#0065D1] transition-colors text-base md:text-lg font-semibold">
              <HiReceiptPercent className="w-5 h-5 md:w-6 md:h-6" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
