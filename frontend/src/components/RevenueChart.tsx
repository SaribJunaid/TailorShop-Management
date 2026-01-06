// import { useEffect, useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { getMonthlyRevenue, MonthlyRevenue } from '@/data/mockData';

// export function RevenueChart() {
//   const [data, setData] = useState<MonthlyRevenue[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     getMonthlyRevenue().then((revenue) => {
//       setData(revenue);
//       setIsLoading(false);
//     });
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-card rounded-2xl shadow-luxury p-6">
//         <div className="h-6 w-32 bg-muted rounded animate-pulse mb-6" />
//         <div className="h-64 bg-muted rounded-xl animate-pulse" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card rounded-2xl shadow-luxury p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-card-foreground">Monthly Revenue</h2>
//         <span className="text-sm text-muted-foreground">Last 6 months</span>
//       </div>
      
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//             <XAxis 
//               dataKey="month" 
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//             />
//             <YAxis 
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//               tickFormatter={(value) => `Rs.${(value / 1000)}k`}
//             />
//             <Tooltip 
//               contentStyle={{
//                 backgroundColor: 'hsl(var(--card))',
//                 border: '1px solid hsl(var(--border))',
//                 borderRadius: '12px',
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//               }}
//               labelStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 600 }}
//               formatter={(value: number) => [`Rs.${value.toLocaleString()}`, 'Revenue']}
//             />
//             <Line
//               type="monotone"
//               dataKey="revenue"
//               stroke="hsl(var(--primary))"
//               strokeWidth={3}
//               dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, strokeWidth: 0 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart({ orders }: { orders: any[] }) {
  // Process real orders to get monthly totals
  const processData = () => {
    const monthlyMap: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at || new Date());
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyMap[month] = (monthlyMap[month] || 0) + (Number(order.total_amount) || 0);
    });

    return Object.keys(monthlyMap).map(month => ({
      month,
      revenue: monthlyMap[month]
    }));
  };

  const chartData = processData();

  return (
    <div className="bg-card rounded-2xl shadow-luxury p-6 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Revenue Trend</h2>
        <span className="text-xs text-muted-foreground">Dynamic from Orders</span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}