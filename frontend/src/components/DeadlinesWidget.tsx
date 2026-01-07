// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUpcomingDeadlines, Order } from '@/data/mockData';
// import { Clock, AlertTriangle, Calendar } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export function DeadlinesWidget() {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     getUpcomingDeadlines().then((data) => {
//       setOrders(data);
//       setIsLoading(false);
//     });
//   }, []);

//   const getUrgencyColor = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffHours = (due.getTime() - today.getTime()) / (1000 * 60 * 60);
    
//     if (diffHours <= 24) return 'text-status-danger bg-status-danger/10 border-status-danger/20';
//     if (diffHours <= 48) return 'text-status-warning bg-status-warning/10 border-status-warning/20';
//     return 'text-primary bg-primary/10 border-primary/20';
//   };

//   const getTimeRemaining = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffHours = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60));
    
//     if (diffHours <= 0) return 'Overdue';
//     if (diffHours < 24) return `${diffHours}h remaining`;
//     const diffDays = Math.floor(diffHours / 24);
//     return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-card rounded-2xl shadow-luxury p-6">
//         <div className="h-6 w-40 bg-muted rounded animate-pulse mb-6" />
//         <div className="space-y-3">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card rounded-2xl shadow-luxury p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2">
//           <Clock className="h-5 w-5 text-primary" />
//           <h2 className="text-lg font-semibold text-card-foreground">Upcoming Deadlines</h2>
//         </div>
//         <span className="text-xs text-muted-foreground">Next 48 hours</span>
//       </div>
      
//       {orders.length > 0 ? (
//         <div className="space-y-3">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               onClick={() => navigate(`/orders/${order.id}`)}
//               className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md bg-muted/20 hover:bg-muted/40"
//             >
//               <div className="flex items-center gap-3">
//                 <div className={cn('p-2 rounded-lg border', getUrgencyColor(order.dueDate))}>
//                   <AlertTriangle className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-card-foreground">{order.orderId}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {order.customerName} • {order.garmentType}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className={cn('text-sm font-medium', getUrgencyColor(order.dueDate).split(' ')[0])}>
//                   {getTimeRemaining(order.dueDate)}
//                 </p>
//                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                   <Calendar className="h-3 w-3" />
//                   {new Date(order.dueDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
//           <p className="text-muted-foreground">No urgent deadlines</p>
//           <p className="text-xs text-muted-foreground mt-1">All orders are on schedule</p>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useNavigate } from 'react-router-dom';
// import { Clock, AlertTriangle, Calendar } from 'lucide-react';
// import { cn } from '@/lib/utils';
// export interface Customer{id: number;
//   name: string;
//   phone?: string;
//   email?: string | null;}

// export interface Order {
//   id: number;
//   customer_id: number;
//   customer?: Customer; // This is the missing link!
//   total_amount: number;
//   balance_due: number;
//   status: string;
//   due_date: string;
//   items?: any[]; 
// }

// interface DeadlinesWidgetProps {
//   orders: Order[];
// }

// export function DeadlinesWidget({ orders }: DeadlinesWidgetProps) {
//   const navigate = useNavigate();

//   // Filter for incomplete orders and sort by closest due date
//   const urgentOrders = orders
//     .filter(o => !['completed', 'delivered'].includes(o.status?.toLowerCase()))
//     .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
//     .slice(0, 4);

//   const getUrgencyColor = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffHours = (due.getTime() - today.getTime()) / (1000 * 60 * 60);
    
//     if (diffHours <= 24) return 'text-red-600 bg-red-50 border-red-100';
//     if (diffHours <= 48) return 'text-amber-600 bg-amber-50 border-amber-100';
//     return 'text-blue-600 bg-blue-50 border-blue-100';
//   };

//   const getTimeRemaining = (dueDate: string) => {
//     if (!dueDate) return 'No Date';
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffHours = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60));
    
//     if (diffHours <= 0) return 'Overdue';
//     if (diffHours < 24) return `${diffHours}h remaining`;
//     const diffDays = Math.floor(diffHours / 24);
//     return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
//   };

//   return (
//     <div className="bg-card rounded-2xl shadow-luxury p-6 border border-border/50">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2">
//           <Clock className="h-5 w-5 text-primary" />
//           <h2 className="text-lg font-semibold text-card-foreground">Upcoming Deadlines</h2>
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         {urgentOrders.length > 0 ? (
//           urgentOrders.map((order) => (
//             <div
//               key={order.id}
//               onClick={() => navigate(`/orders/${order.id}`)}
//               className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md bg-muted/10 hover:bg-muted/30"
//             >
//               <div className="flex items-center gap-3">
//                 <div className={cn('p-2 rounded-lg border', getUrgencyColor(order.due_date))}>
//                   <AlertTriangle className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm">Order #{order.id}</p>
//                   <p className="text-xs text-muted-foreground">
//                     {order.customer?.name || 'Guest'} • {order.items?.[0]?.garment_name || 'Garment'}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className={cn('text-sm font-bold', getUrgencyColor(order.due_date).split(' ')[0])}>
//                   {getTimeRemaining(order.due_date)}
//                 </p>
//                 <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
//                   <Calendar className="h-3 w-3" />
//                   {new Date(order.due_date).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-muted-foreground text-sm italic">All caught up!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// CLEAN TYPES TO REMOVE "ANY" ERRORS
export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string | null;
}

export interface OrderItem {
  id: number;
  garment_name: string;
  notes?: string;
}

export interface Order {
  id: number;
  customer_id: number;
  customer?: Customer;
  total_amount: number;
  balance_due: number;
  status: string;
  due_date: string;
  items?: OrderItem[]; // Replaced any[] with OrderItem[]
}

interface DeadlinesWidgetProps {
  orders: Order[];
}

export function DeadlinesWidget({ orders }: DeadlinesWidgetProps) {
  const navigate = useNavigate();

  // Filter for incomplete orders and sort by closest due date
  // Added optional chaining and default string to prevent status errors
  const urgentOrders = orders
    .filter(o => !['completed', 'delivered'].includes((o.status || '').toLowerCase()))
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 4);

  const getUrgencyColor = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffHours = (due.getTime() - today.getTime()) / (1000 * 60 * 60);
    
    if (diffHours <= 24) return 'text-red-600 bg-red-50 border-red-100';
    if (diffHours <= 48) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  const getTimeRemaining = (dueDate: string) => {
    if (!dueDate) return 'No Date';
    const today = new Date();
    const due = new Date(dueDate);
    const diffHours = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Overdue';
    if (diffHours < 24) return `${diffHours}h remaining`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
  };

  return (
    <div className="bg-card rounded-2xl shadow-luxury p-6 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Upcoming Deadlines</h2>
        </div>
      </div>
      
      <div className="space-y-3">
        {urgentOrders.length > 0 ? (
          urgentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md bg-muted/10 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg border', getUrgencyColor(order.due_date))}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-sm">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer?.name || 'Guest'} • {order.items?.[0]?.garment_name || 'Garment'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn('text-sm font-bold', getUrgencyColor(order.due_date).split(' ')[0])}>
                  {getTimeRemaining(order.due_date)}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
                  <Calendar className="h-3 w-3" />
                  {new Date(order.due_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm italic">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}