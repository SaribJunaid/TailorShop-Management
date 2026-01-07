// import { Order } from '@/data/mockData';
// import { cn } from '@/lib/utils';
// import { Eye } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

// interface RecentOrdersTableProps {
//   orders: Order[];
// }

// const statusStyles: Record<Order['status'], string> = {
//   'Pending': 'bg-status-warning/10 text-status-warning',
//   'In Progress': 'bg-primary/10 text-primary',
//   'Ready': 'bg-status-success/10 text-status-success',
//   'Delivered': 'bg-muted text-muted-foreground',
//   'Cancelled': 'bg-status-danger/10 text-status-danger',
// };

// export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-card rounded-2xl shadow-luxury overflow-hidden">
//       <div className="px-6 py-4 border-b border-border">
//         <h2 className="text-lg font-semibold text-card-foreground">Recent Orders</h2>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-muted/30">
//               <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Order ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Customer
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Garment
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Balance Due
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-border">
//             {orders.map((order) => (
//               <tr key={order.id} className="hover:bg-muted/20 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="text-sm font-medium text-foreground">{order.orderId}</span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="text-sm text-foreground">{order.customerName}</span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="text-sm text-muted-foreground">{order.garmentType}</span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={cn(
//                       'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
//                       statusStyles[order.status]
//                     )}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={cn(
//                       'text-sm font-medium',
//                       order.balanceDue > 0 ? 'text-status-warning' : 'text-status-success'
//                     )}
//                   >
//                     Rs.{order.balanceDue.toLocaleString()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => navigate(`/orders/${order.id}`)}
//                     className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
//                   >
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// import { cn } from '@/lib/utils';
// import { Eye } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';
// export interface Customer {
//   id: number;
//   name: string;
//   phone?: string;
//   email?: string | null;
// }

// export interface OrderItem {
//   id: number;
//   garment_name: string;
//   quantity: number;
//   unit_price: number;
// }

// export interface Order {
//   id: number;
//   customer_id: number;
//   total_amount: number;
//   balance_due: number;
//   status: string;
//   due_date: string;
//   customer?: Customer; // This is what allows 'Sarib' to show up
//   items?: OrderItem[]; // Replaces 'any[]'
// }

// export function RecentOrdersTable({ orders }: { orders: Order[] }) {
//   const navigate = useNavigate();

//   const getStatusStyle = (status: string) => {
//     const s = status?.toLowerCase();
//     if (s === 'pending') return 'bg-amber-100 text-amber-700';
//     if (s === 'in_progress') return 'bg-blue-100 text-blue-700';
//     if (s === 'ready') return 'bg-emerald-100 text-emerald-700';
//     return 'bg-slate-100 text-slate-700';
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="bg-muted/30">
//             <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">ID</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Customer</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Balance</th>
//             <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase">Action</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-border">
//           {orders.map((order) => (
//             <tr key={order.id} className="hover:bg-muted/10 transition-colors">
//               <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
//               <td className="px-6 py-4">
//                 <div className="text-sm font-medium">{order.customer?.name || 'Guest'}</div>
//               </td>
//               <td className="px-6 py-4">
//                 <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase', getStatusStyle(order.status))}>
//                   {order.status || 'Pending'}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-sm font-bold text-amber-600">
//                 Rs.{(order.balance_due ?? 0).toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-right">
//                 <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
//                   <Eye className="h-4 w-4" />
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// --- TYPES (Ensures VS Code red errors are cleared) ---

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string | null;
}

export interface OrderItem {
  id: number;
  garment_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  balance_due: number;
  status: string;
  due_date: string;
  customer?: Customer; // Matches your API response {"name": "Sarib", ...}
  items?: OrderItem[];
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('pending')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('progress') || s.includes('stitching')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s.includes('ready') || s.includes('completed')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('delivered')) return 'bg-slate-100 text-slate-700 border-slate-200';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/30 border-b border-border/50">
            <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Due</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="group hover:bg-muted/20 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold font-mono text-foreground">#{order.id}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {/* FIX: Explicitly check for customer.name. 
                        If Sarib is still not showing, the 'order.customer' object 
                        might be missing from the Dashboard's state. 
                      */}
                      {order.customer?.name || "Guest Client"}
                    </span>
                    {order.customer?.phone && (
                      <span className="text-[10px] text-muted-foreground">{order.customer.phone}</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-tight', 
                    getStatusStyle(order.status)
                  )}>
                    {order.status || 'Received'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "text-sm font-bold",
                    (order.balance_due ?? 0) > 0 ? "text-orange-600" : "text-emerald-600"
                  )}>
                    Rs.{(order.balance_due ?? 0).toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic text-sm">
                No orders found in this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}