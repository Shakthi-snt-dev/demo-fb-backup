import React from 'react';
import { Card } from '../../components/Card';
import { HiChartBar } from 'react-icons/hi2';
import Breadcrumb from '../../components/Breadcrumb';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Reports' }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">View business analytics and insights</p>
      </div>

      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <HiChartBar className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Reports</h2>
          <p className="text-gray-600">Generate and view detailed business reports</p>
        </div>
      </Card>
    </div>
  );
};

export default Reports;

