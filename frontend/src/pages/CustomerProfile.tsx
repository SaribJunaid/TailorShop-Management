// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import { getCustomerById, getOrders, Customer, Order } from '@/data/mockData';
// import { ArrowLeft, Phone, Mail, MapPin, Calendar, Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

// const statusStyles: Record<Order['status'], string> = {
//   'Pending': 'bg-status-warning/10 text-status-warning',
//   'In Progress': 'bg-primary/10 text-primary',
//   'Ready': 'bg-status-success/10 text-status-success',
//   'Delivered': 'bg-muted text-muted-foreground',
//   'Cancelled': 'bg-status-danger/10 text-status-danger',
// };

// export default function CustomerProfile() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       setIsLoading(true);
      
//       const [customerData, ordersData] = await Promise.all([
//         getCustomerById(id),
//         getOrders(),
//       ]);
      
//       setCustomer(customerData || null);
//       setCustomerOrders(ordersData.filter((o) => o.customerId === id));
//       setIsLoading(false);
//     };

//     fetchData();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 w-48 bg-muted rounded-lg" />
//           <div className="h-64 bg-muted rounded-2xl" />
//         </div>
//       </Layout>
//     );
//   }

//   if (!customer) {
//     return (
//       <Layout>
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">Customer not found.</p>
//           <Button onClick={() => navigate('/customers')} className="mt-4">
//             Back to Customers
//           </Button>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       {/* Back button */}
//       <Button
//         variant="ghost"
//         onClick={() => navigate('/customers')}
//         className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to Customers
//       </Button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Customer info card */}
//         <div className="lg:col-span-1">
//           <div className="bg-card rounded-2xl shadow-luxury p-6">
//             <div className="flex flex-col items-center text-center mb-6">
//               <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
//                 <span className="text-3xl font-semibold text-primary">
//                   {customer.name.charAt(0)}
//                 </span>
//               </div>
//               <h2 className="text-xl font-semibold text-card-foreground">{customer.name}</h2>
//               <p className="text-sm text-muted-foreground">
//                 Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//                   <Phone className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Phone</p>
//                   <p className="text-sm font-medium text-card-foreground">{customer.phone}</p>
//                 </div>
//               </div>

//               {customer.email && (
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//                     <Mail className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Email</p>
//                     <p className="text-sm font-medium text-card-foreground">{customer.email}</p>
//                   </div>
//                 </div>
//               )}

//               {customer.address && (
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//                     <MapPin className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Address</p>
//                     <p className="text-sm font-medium text-card-foreground">{customer.address}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Button
//               onClick={() => navigate('/orders/new', { state: { customerId: customer.id } })}
//               className="w-full mt-6 h-11 rounded-xl gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               New Order
//             </Button>
//           </div>
//         </div>

//         {/* Right column - Measurements and Orders */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Measurements */}
//           <div className="bg-card rounded-2xl shadow-luxury p-6">
//             <h3 className="text-lg font-semibold text-card-foreground mb-4">Saved Measurements</h3>
            
//             {customer.measurements ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {Object.entries(customer.measurements)
//                   .filter(([key, value]) => value !== undefined && key !== 'notes')
//                   .map(([key, value]) => (
//                     <div key={key} className="bg-muted/50 rounded-xl p-4">
//                       <p className="text-xs text-muted-foreground capitalize">
//                         {key.replace(/([A-Z])/g, ' $1').trim()}
//                       </p>
//                       <p className="text-lg font-semibold text-card-foreground">{value}"</p>
//                     </div>
//                   ))}
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-sm">No measurements saved yet.</p>
//             )}
//           </div>

//           {/* Order History */}
//           <div className="bg-card rounded-2xl shadow-luxury p-6">
//             <h3 className="text-lg font-semibold text-card-foreground mb-4">Order History</h3>
            
//             {customerOrders.length > 0 ? (
//               <div className="space-y-3">
//                 {customerOrders.map((order) => (
//                   <div
//                     key={order.id}
//                     onClick={() => navigate(`/orders/${order.id}`)}
//                     className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div>
//                         <p className="font-medium text-card-foreground">{order.orderId}</p>
//                         <p className="text-sm text-muted-foreground">{order.garmentType}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-right">
//                         <p className="text-sm font-medium text-card-foreground">
//                           Rs.{order.totalAmount.toLocaleString()}
//                         </p>
//                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                           <Calendar className="h-3 w-3" />
//                           {new Date(order.dueDate).toLocaleDateString()}
//                         </div>
//                       </div>
//                       <span
//                         className={cn(
//                           'px-2.5 py-1 rounded-full text-xs font-medium',
//                           statusStyles[order.status]
//                         )}
//                       >
//                         {order.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-sm">No orders yet.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }
// 
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { ArrowLeft, Phone, Mail, Plus, Loader2, Package, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, ordersRes] = await Promise.all([
          apiClient.get(`/customers/${id}`),
          apiClient.get(`/orders/?customer_id=${id}`)
        ]);
        setCustomer(custRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <Layout><div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div></Layout>;
  if (!customer) return <Layout><div className="p-10 text-center">Customer not found</div></Layout>;

  return (
    <Layout>
      <Button variant="ghost" onClick={() => navigate('/customers')} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-luxury p-6 sticky top-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-semibold text-primary">{customer.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-semibold">{customer.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Customer ID: #{customer.id}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{customer.phone}</p>
                </div>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{customer.email}</p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={() => navigate('/orders/new', { state: { customerId: customer.id } })}
              className="w-full mt-6 h-11 rounded-xl gap-2"
            >
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl shadow-luxury p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order History ({orders.length})
            </h3>
            
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                  <p className="text-muted-foreground">No orders found for this customer.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="p-4 border rounded-xl hover:border-primary/30 transition-all cursor-pointer bg-muted/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center font-bold text-xs">
                        ORD
                      </div>
                      <div>
                        <p className="font-bold text-sm">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" /> {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-medium">Total</p>
                        <p className="font-bold text-sm">Rs.{order.total_amount.toLocaleString()}</p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border",
                        order.status === 'delivered' ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}