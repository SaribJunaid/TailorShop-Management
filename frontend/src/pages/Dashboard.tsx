import React from 'react';
import { Users, Ruler, Scissors, ClipboardList, TrendingUp, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge, Status } from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';

interface RecentOrder {
  id: string;
  customer: string;
  item: string;
  stitcher: string;
  status: Status;
  dueDate: string;
}

const recentOrders: RecentOrder[] = [
  { id: '1', customer: 'Muhammad Ali', item: 'Sherwani', stitcher: 'Hassan', status: 'in-progress', dueDate: '2024-01-15' },
  { id: '2', customer: 'Fatima Khan', item: 'Bridal Dress', stitcher: 'Amina', status: 'pending', dueDate: '2024-01-18' },
  { id: '3', customer: 'Ahmed Raza', item: 'Suit (3 Piece)', stitcher: 'Bilal', status: 'completed', dueDate: '2024-01-10' },
  { id: '4', customer: 'Sara Ahmed', item: 'Kurti Set', stitcher: 'Zara', status: 'in-progress', dueDate: '2024-01-20' },
  { id: '5', customer: 'Usman Malik', item: 'Kurta Shalwar', stitcher: 'Hassan', status: 'pending', dueDate: '2024-01-22' },
];

const columns: Column<RecentOrder>[] = [
  { key: 'customer', header: 'Customer' },
  { key: 'item', header: 'Item' },
  { key: 'stitcher', header: 'Stitcher' },
  {
    key: 'status',
    header: 'Status',
    render: (order) => <StatusBadge status={order.status} />,
  },
  {
    key: 'dueDate',
    header: 'Due Date',
    render: (order) => (
      <span className="text-sm text-muted-foreground">
        {new Date(order.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'User'}!`}
        description="Here's what's happening with your tailor shop today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value="248"
          subtitle="12 new this week"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Active Orders"
          value="56"
          subtitle="8 due this week"
          icon={ClipboardList}
          variant="accent"
          delay={100}
        />
        <StatCard
          title="Measurements"
          value="1,842"
          subtitle="Total recorded"
          icon={Ruler}
          delay={200}
        />
        <StatCard
          title="Stitchers"
          value="12"
          subtitle="3 available"
          icon={Scissors}
          variant="success"
          delay={300}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly earnings comparison</p>
            </div>
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+18.2%</span>
            </div>
          </div>
          
          {/* Simple bar chart visualization */}
          <div className="flex items-end justify-between h-40 gap-2">
            {[65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 80, 100].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-md transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: index === 11 
                    ? 'linear-gradient(180deg, hsl(38, 92%, 50%), hsl(45, 100%, 60%))'
                    : 'hsl(var(--muted))',
                  animationDelay: `${500 + index * 50}ms`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-display text-lg font-semibold">Upcoming Deadlines</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { customer: 'Muhammad Ali', item: 'Sherwani', days: 2 },
              { customer: 'Sara Ahmed', item: 'Kurti Set', days: 5 },
              { customer: 'Fatima Khan', item: 'Bridal Dress', days: 7 },
            ].map((deadline, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{deadline.customer}</p>
                  <p className="text-xs text-muted-foreground">{deadline.item}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  deadline.days <= 3 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {deadline.days} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
        <h3 className="font-display text-lg font-semibold mb-4">Recent Orders</h3>
        <DataTable data={recentOrders} columns={columns} />
      </div>
    </DashboardLayout>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default Dashboard;
