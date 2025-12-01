import React, { useState } from 'react';
import { 
  FiSearch, 
  FiUser, 
  FiChevronDown,
  FiPlus,
  FiFileText,
  FiShield,
  FiMoreHorizontal,
  FiX,
  FiCheck
} from 'react-icons/fi';
import { 
  MdQrCodeScanner, 
  MdPhoneIphone, 
  MdTablet, 
  MdLaptop,
  MdBusiness,
  MdReceipt,
  MdDescription,
  MdShoppingCart
} from 'react-icons/md';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
  isSelected?: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const POS: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'iPhone Screen Repair', price: 80, quantity: 1, tax: 8, discount: 0, total: 80, isSelected: false },
    { id: 2, name: 'Diagnostic Fee', price: 50, quantity: 1, tax: 5, discount: 0, total: 50, isSelected: false },
    { id: 3, name: 'Battery Replacement', price: 60, quantity: 1, tax: 6, discount: 0, total: 60, isSelected: false },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const customerName = 'W Walkin Customer';

  const serviceCategories: ServiceCategory[] = [
    { id: 1, name: 'Mobile Repair', icon: <MdPhoneIphone className="w-6 h-6" />, color: 'bg-orange-500' },
    { id: 2, name: 'Tablet Repair', icon: <MdTablet className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 3, name: 'Macbook Repair', icon: <MdLaptop className="w-6 h-6" />, color: 'bg-purple-500' },
    { id: 4, name: 'Onsite/Remote Assistance', icon: <MdBusiness className="w-6 h-6" />, color: 'bg-teal-500' },
  ];

  const toggleItemSelection = (id: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const addItemFromSearch = (itemName: string) => {
    if (!itemName.trim()) return;
    const newItem: CartItem = {
      id: Date.now(),
      name: itemName,
      price: 0,
      quantity: 1,
      tax: 0,
      discount: 0,
      total: 0,
      isSelected: false,
    };
    setCartItems([...cartItems, newItem]);
    setSearchQuery('');
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
      return;
    }
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newTotal = quantity * item.price;
        return { ...item, quantity, total: newTotal, tax: newTotal * 0.1 };
      }
      return item;
    }));
  };

  const updatePrice = (id: number, price: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newTotal = item.quantity * price;
        return { ...item, price, total: newTotal, tax: newTotal * 0.1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = cartItems.reduce((sum, item) => sum + item.tax, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal + totalTax - totalDiscount;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Order Details */}
        <div className="w-full lg:w-3/5 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Customer Information */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                  <FiPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Item Entry */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <MdQrCodeScanner className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Item Name, SKU or Scan Barcode"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addItemFromSearch(searchQuery);
                    }
                  }}
                  className="w-full pl-9 pr-16 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-normal"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-normal">Ctrl S</span>
              </div>
              <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors whitespace-nowrap">
                Advance Search
              </button>
            </div>
          </div>

          {/* Items List Header */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              <div className="col-span-1"></div>
              <div className="col-span-1">QTY</div>
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Tax</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <div className="space-y-1.5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center py-2 px-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          item.isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}
                      >
                        {item.isSelected && <FiCheck className="w-2.5 h-2.5 text-white" />}
                      </button>
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-full px-1.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-4 text-xs font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-1.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-1 text-xs text-gray-600 dark:text-gray-400">
                      ${item.tax.toFixed(2)}
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-gray-900 dark:text-white">
                      ${item.total.toFixed(2)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Remove item"
                      >
                        <FiX className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-normal">Sub Total</span>
                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-normal">Discount</span>
                <span className="font-medium text-gray-900 dark:text-white">${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 font-normal">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">${totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Service Selection */}
        <div className="w-full lg:w-2/5 flex flex-col bg-white dark:bg-gray-800">
          {/* Breadcrumbs */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
              <span>Category</span>
              <FiChevronDown className="w-3 h-3" />
              <span>Manufacturer</span>
              <FiChevronDown className="w-3 h-3" />
              <span>Devices</span>
              <FiChevronDown className="w-3 h-3" />
              <span>Problems</span>
              <FiChevronDown className="w-3 h-3" />
              <span>Parts</span>
              <FiChevronDown className="w-3 h-3" />
              <span>Details</span>
            </div>
          </div>

          {/* Service Categories */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4">
              <button className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <FiPlus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 bg-white dark:bg-gray-700 rounded-lg border transition-all hover:shadow-md ${
                    selectedCategory === category.id
                      ? 'border-blue-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className={`${category.color} w-12 h-12 rounded-md flex items-center justify-center text-white mx-auto mb-2`}>
                    {category.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white text-center">
                    {category.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-4 gap-1.5">
              <button className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-gray-600">
                <MdReceipt className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">View Tickets</span>
              </button>
              <button className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-gray-600">
                <MdDescription className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">View Invoices</span>
              </button>
              <button className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-gray-600">
                <FiFileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">Create Estimate</span>
              </button>
              <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex flex-col items-center gap-1 transition-colors">
                <MdReceipt className="w-4 h-4" />
                <span className="text-xs font-medium">Create Ticket</span>
              </button>
              <button className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-gray-600">
                <FiShield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">Warranty Claim</span>
              </button>
              <button className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-gray-600">
                <FiMoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">More Actions</span>
              </button>
              <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex flex-col items-center gap-1 transition-colors">
                <FiX className="w-4 h-4" />
                <span className="text-xs font-medium">Cancel</span>
              </button>
              <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex flex-col items-center gap-1 transition-colors">
                <MdShoppingCart className="w-4 h-4" />
                <span className="text-xs font-medium">Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
