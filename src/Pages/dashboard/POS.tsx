import React, { useState } from 'react';
import { 
  FiSearch, 
  FiUser, 
  FiTrash2, 
  FiSave, 
  FiDollarSign,
  FiHeart,
  FiChevronDown,
  FiShoppingBag,
  FiStar
} from 'react-icons/fi';
import { MdBuild, MdQrCodeScanner } from 'react-icons/md';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  isFavorite: boolean;
  isOutOfStock: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
}

const POS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'repairs' | 'products' | 'favorite'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const customerName = 'Walkin Customer';

  // Sample products data
  const products: Product[] = [
    {
      id: 1,
      name: 'DELL Studio XPS Keyboard',
      description: '(USA) Original keyboard for DELL Studio XPS PP175 X PS PP3SL US layout Back...',
      price: 59.99,
      stock: 0,
      isFavorite: true,
      isOutOfStock: true,
    },
    {
      id: 2,
      name: 'ARCTIC Case Fan',
      description: '120mm ARCTIC Case Fan',
      price: 19.99,
      stock: 5,
      isFavorite: true,
      isOutOfStock: false,
    },
    {
      id: 3,
      name: 'Lenovo Charger',
      description: '120W 19V 6.3AAC Adapter Charger For Lenovo Y410P YS10P',
      price: 39.99,
      stock: 8,
      isFavorite: true,
      isOutOfStock: false,
    },
    {
      id: 4,
      name: 'Product 4',
      description: 'Product description here',
      price: 29.99,
      stock: 3,
      isFavorite: false,
      isOutOfStock: false,
    },
    {
      id: 5,
      name: 'Product 5',
      description: 'Product description here',
      price: 49.99,
      stock: 10,
      isFavorite: false,
      isOutOfStock: false,
    },
    {
      id: 6,
      name: 'Product 6',
      description: 'Product description here',
      price: 79.99,
      stock: 2,
      isFavorite: false,
      isOutOfStock: false,
    },
  ];

  const categories = [
    { name: 'BUY BACKS', color: 'bg-purple-500' },
    { name: 'ACCESSORIES', color: 'bg-purple-500' },
    { name: 'TEMPERED GLASS', color: 'bg-blue-500' },
    { name: 'CASE', color: 'bg-purple-500' },
    { name: 'HANDSET', color: 'bg-orange-500' },
    { name: 'WIRELESS CHARGER', color: 'bg-purple-500' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'favorite') {
      return matchesSearch && product.isFavorite;
    }
    return matchesSearch;
  });

  const addToCart = (product: Product) => {
    if (product.isOutOfStock) return;
    
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        tax: product.price * 0.1, // 10% tax
        discount: 0,
        total: product.price,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const totalTax = cartItems.reduce((sum, item) => sum + item.tax, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal + totalTax - totalDiscount;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Left Panel - Add Products */}
      <div className="w-full lg:w-3/5 xl:w-3/5 flex flex-col bg-white dark:bg-gray-800 h-full overflow-hidden">
        {/* Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Products</h2>
        </div>

        {/* Search Bar */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <MdQrCodeScanner className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Products & Repairparts"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 lg:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('repairs')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'repairs'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <MdBuild className="w-4 h-4" />
                Repairs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FiShoppingBag className="w-4 h-4" />
                Products
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorite')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'favorite'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FiStar className="w-4 h-4" />
                Favorite
              </div>
            </button>
          </div>
        </div>

        {/* Search All Products */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search All Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors">
              New
              <FiChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className={`relative bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 cursor-pointer hover:shadow-md transition-shadow ${
                  product.isOutOfStock ? 'opacity-60' : ''
                }`}
              >
                {/* Product Image */}
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded mb-2 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-500 rounded flex items-center justify-center">
                      <FiShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      product.isOutOfStock 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {product.isOutOfStock 
                        ? 'Out of Stock' 
                        : `In Stock: ${product.stock}`
                      }
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    £{product.price.toFixed(2)}
                  </p>
                </div>

                {/* Favorite Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle favorite logic here
                  }}
                  className="absolute bottom-2 right-2 p-1"
                >
                  <FiHeart
                    className={`w-4 h-4 ${
                      product.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Buttons */}
        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${category.color} text-white px-3 py-3 rounded-lg font-medium text-xs lg:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-1`}
              >
                <FiShoppingBag className="w-4 h-4" />
                <span className="hidden lg:inline">{category.name}</span>
                <span className="lg:hidden">{category.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Ticket Preview */}
      <div className="w-full lg:w-2/5 xl:w-2/5 flex flex-col bg-white dark:bg-gray-800 h-full border-l border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ticket Preview</h2>
        </div>

        {/* Customer Info */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {customerName}
              </span>
            </div>
            <button className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Add Customer
            </button>
          </div>
        </div>

        {/* Items Table Header */}
        <div className="px-4 lg:px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <div className="col-span-4">Item name</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Qty/Hr</div>
            <div className="col-span-1">Tax</div>
            <div className="col-span-1">Disc</div>
            <div className="col-span-2">Total</div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No items added</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="col-span-4 text-sm text-gray-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                    £{item.price.toFixed(2)}
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 text-xs text-gray-600 dark:text-gray-400">
                    £{item.tax.toFixed(2)}
                  </div>
                  <div className="col-span-1 text-xs text-gray-600 dark:text-gray-400">
                    £{item.discount.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      £{item.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sub Total</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                £{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Discount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                £{totalDiscount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                £{totalTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-gray-900 dark:text-white">£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
              <FiTrash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <button className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
              <FiSave className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold">
              <FiDollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
