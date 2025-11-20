import React from 'react';
import { Card } from '../../components/Card';
import { HiUserGroup, HiPlus } from 'react-icons/hi2';
import Breadcrumb from '../../components/Breadcrumb';

const Customers: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Customers' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage your customer database</p>
      </div>

      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <HiUserGroup className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h2>
          <p className="text-gray-600 mb-6">View and manage customer information</p>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <HiPlus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Customers;

