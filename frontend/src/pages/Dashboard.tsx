// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import { MetricCard } from '@/components/MetricCard';
// import { RecentOrdersTable } from '@/components/RecentOrdersTable';
// import { RevenueChart } from '@/components/RevenueChart';
// import { DeadlinesWidget } from '@/components/DeadlinesWidget';
// import { ClipboardList, AlertCircle, Users, Wallet } from 'lucide-react';
// import { getDashboardMetrics, getOrders, DashboardMetrics, Order } from '@/data/mockData';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
//   const [recentOrders, setRecentOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [metricsData, ordersData] = await Promise.all([
//           getDashboardMetrics(),
//           getOrders(),
//         ]);
//         setMetrics(metricsData);
//         setRecentOrders(ordersData.slice(0, 5));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading || !metrics) {
//     return (
//       <Layout title="Dashboard">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
//           ))}
//         </div>
//         <div className="h-96 bg-muted rounded-2xl animate-pulse" />
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Dashboard">
//       {/* Metric Cards - Clickable */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <MetricCard
//           title="Active Orders"
//           value={metrics.activeOrders}
//           icon={ClipboardList}
//           variant="success"
//           subtitle="Currently in progress"
//           href="/orders?status=active"
//         />
//         <MetricCard
//           title="Urgent Today"
//           value={metrics.urgentToday}
//           icon={AlertCircle}
//           variant="danger"
//           subtitle="Due today"
//           href="/orders?status=urgent"
//         />
//         <MetricCard
//           title="Total Customers"
//           value={metrics.totalCustomers}
//           icon={Users}
//           variant="info"
//           subtitle="Registered clients"
//           href="/customers"
//         />
//         <MetricCard
//           title="Pending Payments"
//           value={`Rs.${metrics.pendingPayments.toLocaleString()}`}
//           icon={Wallet}
//           variant="gold"
//           subtitle="Balance to collect"
//           href="/orders?status=unpaid"
//         />
//       </div>

//       {/* Revenue Chart and Deadlines */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <RevenueChart />
//         <DeadlinesWidget />
//       </div>

//       {/* Recent Orders Table */}
//       <RecentOrdersTable orders={recentOrders} />
//     </Layout>
//   );
// }
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import { MetricCard } from '@/components/MetricCard';
// import { RecentOrdersTable } from '@/components/RecentOrdersTable';
// import { RevenueChart } from '@/components/RevenueChart';
// import { DeadlinesWidget } from '@/components/DeadlinesWidget';
// import { ClipboardList, AlertCircle, Users, Wallet, Loader2 } from 'lucide-react';
// import apiClient from '@/api/client';
// import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button'; // Add this line

// // Define types to match your SQLAlchemy models
// interface Order {
//   id: number;
//   customer_id: number;
//   status: string;
//   total_amount: number;
//   advance_paid: number;
//   balance_due: number;
//   due_date: string;
//   created_at: string;
//   customer_name?: string; // If your backend returns this
// }

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customerCount, setCustomerCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   // Stats derived from real data
//   const [metrics, setMetrics] = useState({
//     activeOrders: 0,
//     urgentToday: 0,
//     pendingPayments: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//   setIsLoading(true);
//   try {
//     const [ordersRes, customersRes] = await Promise.all([
//       apiClient.get('/orders/'),
//       apiClient.get('/customers/')
//     ]);

//     // Check if data actually exists before processing
//     if (ordersRes.data && Array.isArray(ordersRes.data)) {
//       const allOrders = ordersRes.data;
//       // ... (your calculation logic)
//       setOrders(allOrders);
//     }
    
//     if (customersRes.data) {
//       setCustomerCount(customersRes.data.length);
//     }

//   } catch (error: any) {
//     console.error("Dashboard Sync Error:", error.response?.data || error.message);
//     toast({
//       title: "Backend Error (500)",
//       description: "The server failed to provide order data. Please check your Python console.",
//       variant: "destructive"
//     });
//     // Set empty defaults so the UI doesn't crash
//     setOrders([]);
//     setCustomerCount(0);
//   } finally {
//     setIsLoading(false);
//   }
// };

//     fetchData();
//   }, [toast]);

//   if (isLoading) {
//     return (
//       <Layout title="Dashboard">
//         <div className="flex flex-col items-center justify-center min-h-[60vh]">
//           <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//           <p className="text-muted-foreground animate-pulse font-medium">Synchronizing shop data...</p>
//         </div>
//       </Layout>
//     );
//   }

//   // Get the 5 most recent orders for the table
//   const recentOrders = [...orders]
//     .sort((a, b) => b.id - a.id)
//     .slice(0, 5);

//   return (
//     <Layout title="Dashboard">
//       {/* Metric Cards - Clickable and Dynamic */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <MetricCard
//           title="Active Orders"
//           value={metrics.activeOrders}
//           icon={ClipboardList}
//           variant="success"
//           subtitle="Orders in workshop"
//           onClick={() => navigate('/orders')} 
//         />
//         <MetricCard
//           title="Urgent Today"
//           value={metrics.urgentToday}
//           icon={AlertCircle}
//           variant="danger"
//           subtitle="Deadlines for today"
//           onClick={() => navigate('/workshop')} 
//         />
//         <MetricCard
//           title="Total Customers"
//           value={customerCount}
//           icon={Users}
//           variant="info"
//           subtitle="Client database"
//           onClick={() => navigate('/customers')}
//         />
//         <MetricCard
//           title="Pending Payments"
//           value={`Rs.${metrics.pendingPayments.toLocaleString()}`}
//           icon={Wallet}
//           variant="gold"
//           subtitle="Total balance due"
//           onClick={() => navigate('/orders')}
//         />
//       </div>

//       {/* Revenue Chart and Deadlines */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Pass real orders to chart if needed, or it can fetch inside */}
//         <RevenueChart orders={orders} />
//         <DeadlinesWidget orders={orders} />
//       </div>

//       {/* Recent Orders Table */}
//       <div className="bg-card rounded-3xl shadow-luxury border border-border/50 overflow-hidden">
//         <div className="p-6 border-b border-border/50 flex justify-between items-center">
//             <h3 className="font-bold text-lg">Recent Bookings</h3>
//             <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>View All</Button>
//         </div>
//         <RecentOrdersTable orders={recentOrders} />
//       </div>
//     </Layout>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { MetricCard } from '@/components/MetricCard';
import { RecentOrdersTable } from '@/components/RecentOrdersTable';
import { RevenueChart } from '@/components/RevenueChart';
import { DeadlinesWidget } from '@/components/DeadlinesWidget';
import { ClipboardList, AlertCircle, Users, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/client';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersRes, customersRes] = await Promise.all([
          apiClient.get('/orders/'),
          apiClient.get('/customers/')
        ]);
        
        // Ensure we always have an array even if backend fails
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setCustomerCount(Array.isArray(customersRes.data) ? customersRes.data.length : 0);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        toast({ 
          title: "Connection Error", 
          description: "Could not sync with the workshop database.", 
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [toast]);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  // --- Real Logic for Widgets ---
  
  // 1. Active Orders: pending, in_progress, stitching, etc.
  const activeOrders = orders.filter(o => 
    !['completed', 'delivered', 'cancelled'].includes(o.status?.toLowerCase())
  ).length;

  // 2. Pending Payments: Total of balance_due column
  const totalBalance = orders.reduce((sum, o) => sum + (Number(o.balance_due) || 0), 0);

  // 3. Urgent Today: Comparing due_date (YYYY-MM-DD) to today
  const today = new Date().toISOString().split('T')[0];
  const urgentCount = orders.filter(o => o.due_date === today && o.status !== 'completed').length;

  return (
    <Layout title="Business Control Center">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Active Orders" 
          value={activeOrders} 
          icon={ClipboardList} 
          variant="success" 
          onClick={() => navigate('/orders')} 
        />
        <MetricCard 
          title="Urgent Today" 
          value={urgentCount} 
          icon={AlertCircle} 
          variant="danger" 
          onClick={() => navigate('/workshop')} 
        />
        <MetricCard 
          title="Clients" 
          value={customerCount} 
          icon={Users} 
          variant="info" 
          onClick={() => navigate('/customers')} 
        />
        <MetricCard 
          title="To Collect" 
          value={`Rs.${totalBalance.toLocaleString()}`} 
          icon={Wallet} 
          variant="gold" 
        />
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pass the actual orders array to your charts */}
        <RevenueChart orders={orders} /> 
        <DeadlinesWidget orders={orders} />
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-3xl shadow-luxury border border-border/40 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-muted/30">
            <div>
              <h3 className="font-bold text-lg">Recent Bookings</h3>
              <p className="text-xs text-muted-foreground">Latest 5 orders from the shop</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/orders')}>
              View Full History
            </Button>
        </div>
        {/* Pass only the last 5 orders to the table */}
        <RecentOrdersTable orders={orders.slice(0, 5)} />
      </div>
    </Layout>
  );
}