import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiCurrencyDollar,
  HiWrenchScrewdriver,
  HiDocumentText,
  HiUserGroup,
  HiClock,
  HiCheckCircle,
} from 'react-icons/hi2';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import { Table } from '../../components/Table';
import SalesChart from '../../components/SalesChart';
import Breadcrumb from '../../components/Breadcrumb';

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: 'repair' | 'sale' | 'inventory' | 'customer';
  status: 'completed' | 'pending';
}

const Dashboard: React.FC = () => {
  const salesData = [120, 190, 300, 250, 280, 320, 290];
  const salesLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const recentOrders: RecentOrder[] = [
    {
      id: '1',
      customer: 'John Doe',
      product: 'iPhone 14 Pro Repair',
      amount: '$450.00',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      product: 'Samsung Screen Replacement',
      amount: '$320.50',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: '3',
      customer: 'Mike Johnson',
      product: 'Battery Replacement',
      amount: '$189.99',
      date: '2024-01-14',
      status: 'processing',
    },
    {
      id: '4',
      customer: 'Sarah Williams',
      product: 'iPad Screen Repair',
      amount: '$550.00',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: '5',
      customer: 'David Brown',
      product: 'MacBook Keyboard Fix',
      amount: '$275.75',
      date: '2024-01-13',
      status: 'pending',
    },
  ];

  const activities: ActivityItem[] = [
    {
      id: '1',
      text: 'iPhone 14 Pro repair completed',
      time: '2 hours ago',
      type: 'repair',
      status: 'completed',
    },
    {
      id: '2',
      text: 'New sale: $450',
      time: '5 hours ago',
      type: 'sale',
      status: 'completed',
    },
    {
      id: '3',
      text: 'Samsung Galaxy screen replacement in progress',
      time: '1 day ago',
      type: 'repair',
      status: 'pending',
    },
    {
      id: '4',
      text: 'Inventory restocked: 25 items',
      time: '2 days ago',
      type: 'inventory',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status === 'completed' && <HiCheckCircle className="w-3 h-3 mr-1" />}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in" style={{ maxWidth: '1400px' }}>
      {/* <Breadcrumb items={[{ label: 'Dashboard' }]} /> */}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F36] mb-2">Dashboard</h1>
        <p className="text-[#4A5568]">Overview of your business performance</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="$24,567"
          trend={{ value: '12.5%', isPositive: true }}
          icon={<HiCurrencyDollar className="w-6 h-6" />}
        />
        <StatCard
          title="Repairs Done"
          value="142"
          trend={{ value: '8.2%', isPositive: true }}
          icon={<HiWrenchScrewdriver className="w-6 h-6" />}
        />
        <StatCard
          title="Pending Invoices"
          value="23"
          trend={{ value: '5.1%', isPositive: false }}
          icon={<HiDocumentText className="w-6 h-6" />}
        />
        <StatCard
          title="Active Employees"
          value="12"
          trend={{ value: '2', isPositive: true }}
          icon={<HiUserGroup className="w-6 h-6" />}
        />
      </div>

      {/* Sales Chart */}
      <ChartCard
        title="Sales Overview"
        subtitle="Weekly sales performance"
        dateRange="Jan 8 - Jan 14, 2024"
      >
        <SalesChart data={salesData} labels={salesLabels} height={300} />
      </ChartCard>

      {/* Recent Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Recent Orders</h2>
            <p className="text-sm text-[#4A5568]">Latest transactions and repairs</p>
          </div>
          <Link
            to="/dashboard/reports"
            className="text-sm font-medium text-[#007BFF] hover:text-[#0065D1] transition-colors"
          >
            View All →
          </Link>
        </div>
        <Table
          data={recentOrders}
          columns={[
            {
              key: 'customer',
              header: 'Customer',
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF] font-semibold text-sm">
                    {item.customer.charAt(0)}
                  </div>
                  <span className="font-medium text-[#1A1F36]">{item.customer}</span>
                </div>
              ),
            },
            {
              key: 'product',
              header: 'Product',
              render: (item) => (
                <span className="text-[#4A5568]">{item.product}</span>
              ),
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (item) => (
                <span className="font-semibold text-[#1A1F36]">{item.amount}</span>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (item) => (
                <span className="text-[#4A5568]">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (item) => getStatusBadge(item.status),
            },
          ]}
          onRowClick={(item) => console.log('Row clicked:', item)}
          onEdit={(item) => console.log('Edit:', item)}
          onDelete={(item) => console.log('Delete:', item)}
        />
      </div>

      {/* Latest Activity Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E7F1] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1F36] mb-1">Latest Activity</h2>
            <p className="text-sm text-[#4A5568]">Recent updates and notifications</p>
          </div>
          <Link
            to="/dashboard/reports"
            className="text-sm font-medium text-[#007BFF] hover:text-[#0065D1] transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-[#F5F8FF]/50 hover:bg-[#F5F8FF] transition-colors group"
            >
              <div className="p-2 rounded-lg bg-[#007BFF]/10 text-[#007BFF] group-hover:bg-[#007BFF]/20 transition-colors">
                {activity.type === 'repair' && (
                  <HiWrenchScrewdriver className="w-5 h-5" />
                )}
                {activity.type === 'sale' && <HiCurrencyDollar className="w-5 h-5" />}
                {activity.type === 'inventory' && (
                  <HiDocumentText className="w-5 h-5" />
                )}
                {activity.type === 'customer' && <HiUserGroup className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[#1A1F36] font-medium">{activity.text}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-[#4A5568] flex items-center gap-1">
                  <HiClock className="w-4 h-4" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
