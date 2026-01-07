import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client'; // Import your axios instance
import { Plus, Calendar, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Styles for the status badges
const statusStyles: Record<string, string> = {
  'pending': 'bg-status-warning/10 text-status-warning border-status-warning/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  'ready': 'bg-status-success/10 text-status-success border-status-success/20',
  'delivered': 'bg-muted text-muted-foreground border-border',
  'cancelled': 'bg-status-danger/10 text-status-danger border-status-danger/20',
};

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetching from your FastAPI router: @router.get("/")
      const response = await apiClient.get('/orders/', {
        params: {
          status: statusFilter === 'all' ? undefined : statusFilter
        }
      });
      setOrders(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load orders from server",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) =>
    o.public_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `ORD-${o.id}`.includes(searchQuery)
  );

  const copyReceiptLink = (publicId: string) => {
    const url = `${window.location.origin}/receipt/${publicId}`;
    navigator.clipboard.writeText(url);
    toast({ description: "Receipt link copied to clipboard!" });
  };

  if (isLoading) {
    return (
      <Layout title="Orders">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Orders">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by ID or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm h-11 rounded-xl"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-11 rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => navigate('/orders/new')}
          className="h-11 rounded-xl gap-2 sm:ml-auto"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          // Logic to handle multiple items in one order display
          const firstItem = order.items?.[0]?.garment_type || "Garment";
          const extraItemsCount = order.items?.length - 1;

          return (
            <div
              key={order.id}
              className="bg-card rounded-2xl shadow-luxury p-6 transition-luxury hover:shadow-luxury-hover border border-transparent hover:border-primary/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {firstItem.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">ORD-{order.id}</h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border',
                          statusStyles[order.status?.toLowerCase()] || statusStyles['pending']
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer?.name || "Unknown Customer"} • {firstItem}
                      {extraItemsCount > 0 && ` (+${extraItemsCount} more)`}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(order.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-card-foreground">
                      Rs.{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p
                      className={cn(
                        'font-semibold',
                        order.balance_due > 0 ? 'text-status-warning' : 'text-status-success'
                      )}
                    >
                      Rs.{order.balance_due.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyReceiptLink(order.public_id)}
                      className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
                      title="Copy public receipt link"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      )}
    </Layout>
  );
}
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   Plus, 
//   Calendar, 
//   Eye, 
//   ExternalLink, 
//   Loader2, 
//   Trash2, 
//   CheckCircle2, 
//   User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import{ Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { cn } from '@/lib/utils';

// const statusStyles: Record<string, string> = {
//   'pending': 'bg-status-warning/10 text-status-warning border-status-warning/20',
//   'in_progress': 'bg-primary/10 text-primary border-primary/20',
//   'ready': 'bg-status-success/10 text-status-success border-status-success/20',
//   'delivered': 'bg-muted text-muted-foreground border-border',
//   'cancelled': 'bg-status-danger/10 text-status-danger border-status-danger/20',
// };

// export default function Orders() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [orders, setOrders] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isLoading, setIsLoading] = useState(true);
  
//   // States for Requirement #3 (Eye Modal)
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiClient.get('/orders/', {
//         params: { status: statusFilter === 'all' ? undefined : statusFilter }
//       });
//       setOrders(response.data);
//     } catch (error) {
//       toast({ title: "Error", description: "Could not load orders", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { fetchOrders(); }, [statusFilter]);

//   // Requirement #5: Manual Status Update for individual items
//   const handleUpdateItemStatus = async (itemId: number, newStatus: string) => {
//     try {
//       await apiClient.patch(`/orders/items/${itemId}/status?new_status=${newStatus}`);
//       toast({ title: "Updated", description: `Item status changed to ${newStatus}` });
      
//       // Refresh local data to reflect change in Modal
//       if (selectedOrder) {
//         const updatedItems = selectedOrder.items.map((item: any) => 
//           item.id === itemId ? { ...item, status: newStatus } : item
//         );
//         setSelectedOrder({ ...selectedOrder, items: updatedItems });
//       }
//       fetchOrders(); // Refresh background list
//     } catch (error) {
//       toast({ title: "Update Failed", variant: "destructive" });
//     }
//   };

//   // Requirement #6: Delete Order
//   const handleDeleteOrder = async (orderId: number) => {
//     if (!confirm("Are you sure you want to delete this entire order? This cannot be undone.")) return;
//     try {
//       await apiClient.delete(`/orders/${orderId}/`);
//       toast({ title: "Order Deleted", description: "The order has been removed." });
//       fetchOrders();
//     } catch (error) {
//       toast({ title: "Delete Failed", variant: "destructive" });
//     }
//   };

//   const filteredOrders = orders.filter((o) =>
//     o.public_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     `ORD-${o.id}`.includes(searchQuery)
//   );

//   const copyReceiptLink = (publicId: string) => {
//     const url = `${window.location.origin}/receipt/${publicId}`;
//     navigator.clipboard.writeText(url);
//     toast({ description: "Receipt link copied!" });
//   };

//   return (
//     <Layout title="Orders">
//       {/* Header Actions */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <Input
//           placeholder="Search by ID or Customer..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-sm h-11 rounded-xl"
//         />
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-44 h-11 rounded-xl">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="in_progress">In Progress</SelectItem>
//             <SelectItem value="ready">Ready</SelectItem>
//             <SelectItem value="delivered">Delivered</SelectItem>
//           </SelectContent>
//         </Select>
//         <Button onClick={() => navigate('/orders/new')} className="h-11 rounded-xl gap-2 sm:ml-auto">
//           <Plus className="h-4 w-4" /> New Order
//         </Button>
//       </div>

//       {/* Orders List */}
//       <div className="space-y-4">
//         {isLoading ? (
//           <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
//         ) : filteredOrders.map((order) => (
//           <div key={order.id} className="bg-card rounded-2xl p-6 shadow-sm border hover:border-primary/20 transition-all">
//             <div className="flex flex-col lg:flex-row justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
//                   {order.customer?.name?.charAt(0) || "U"}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-bold">ORD-{order.id}</h3>
//                     <Badge className={cn("text-[10px] uppercase font-bold", statusStyles[order.status] || statusStyles.pending)}>
//                       {order.status}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground">{order.customer?.name} • {order.items?.length} items</p>
//                   <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
//                     <Calendar className="h-3 w-3" /> Due: {new Date(order.due_date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-6">
//                 <div className="text-right">
//                   <p className="text-xs text-muted-foreground">Total</p>
//                   <p className="font-bold">Rs.{order.total_amount}</p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   {/* Eye Icon Button (Req #3) */}
//                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}>
//                     <Eye className="h-5 w-5 text-muted-foreground" />
//                   </Button>
//                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => copyReceiptLink(order.public_id)}>
//                     <ExternalLink className="h-5 w-5 text-muted-foreground" />
//                   </Button>
//                   {/* Delete Button (Req #6) */}
//                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500" onClick={() => handleDeleteOrder(order.id)}>
//                     <Trash2 className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Requirement #3 & #5: Item Detail Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-2xl rounded-3xl">
//           <DialogHeader>
//             <DialogTitle>Order Details - ORD-{selectedOrder?.id}</DialogTitle>
//             <DialogDescription>Manage individual item statuses and assignments.</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             {selectedOrder?.items?.map((item: any) => (
//               <div key={item.id} className="p-4 border rounded-2xl bg-muted/10 flex items-center justify-between">
//                 <div>
//                   <p className="font-bold">{item.garment_type}</p>
//                   <p className="text-xs text-muted-foreground">Stitcher: {item.stitcher?.name || 'Unassigned'}</p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   {/* Manual Status Dropdown (Req #5) */}
//                   <Select 
//                     defaultValue={item.status} 
//                     onValueChange={(val) => handleUpdateItemStatus(item.id, val)}
//                   >
//                     <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="in_progress">In Progress</SelectItem>
//                       <SelectItem value="ready">Ready</SelectItem>
//                       <SelectItem value="delivered">Delivered</SelectItem>
//                       <SelectItem value="cancelled">Cancelled</SelectItem>
//                     </SelectContent>
//                   </Select>
                  
//                   {item.status === 'ready' && <CheckCircle2 className="h-5 w-5 text-status-success" />}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-3 mt-6">
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
//             <Button onClick={() => navigate(`/receipt/${selectedOrder?.public_id}`)}>View Receipt</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// }

// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   Plus, 
//   Calendar, 
//   Eye, 
//   ExternalLink, 
//   Loader2, 
//   Trash2, 
//   CheckCircle2 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { cn } from '@/lib/utils';

// // --- TYPES TO FIX VS CODE ERRORS ---
// export interface Customer {
//   id: number;
//   name: string;
//   phone?: string;
// }

// export interface OrderItem {
//   id: number;
//   garment_type: string;
//   status: string;
//   stitcher?: { name: string };
// }

// export interface Order {
//   id: number;
//   public_id: string;
//   customer_id: number;
//   total_amount: number;
//   status: string;
//   due_date: string;
//   customer?: Customer; // Path for "Sarib"
//   items?: OrderItem[];
// }

// const statusStyles: Record<string, string> = {
//   'pending': 'bg-amber-100 text-amber-700 border-amber-200',
//   'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
//   'ready': 'bg-emerald-100 text-emerald-700 border-emerald-200',
//   'delivered': 'bg-slate-100 text-slate-700 border-border',
//   'cancelled': 'bg-red-100 text-red-700 border-red-200',
// };

// export default function Orders() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [orders, setOrders] = useState<Order[]>([]); // Use Order[] instead of any[]
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Wrapped in useCallback to fix the "Missing Dependency" warning in your screenshot
//   const fetchOrders = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiClient.get('/orders/', {
//         params: { status: statusFilter === 'all' ? undefined : statusFilter }
//       });
//       setOrders(response.data);
//     } catch (error) {
//       toast({ title: "Error", description: "Could not load orders", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [statusFilter, toast]);

//   useEffect(() => { 
//     fetchOrders(); 
//   }, [fetchOrders]);

//   const handleUpdateItemStatus = async (itemId: number, newStatus: string) => {
//     try {
//       await apiClient.patch(`/orders/items/${itemId}/status?new_status=${newStatus}`);
//       toast({ title: "Updated", description: `Item status changed to ${newStatus}` });
      
//       if (selectedOrder && selectedOrder.items) {
//         const updatedItems = selectedOrder.items.map((item) => 
//           item.id === itemId ? { ...item, status: newStatus } : item
//         );
//         setSelectedOrder({ ...selectedOrder, items: updatedItems });
//       }
//       fetchOrders(); 
//     } catch (error) {
//       toast({ title: "Update Failed", variant: "destructive" });
//     }
//   };

//   const handleDeleteOrder = async (orderId: number) => {
//     if (!confirm("Are you sure you want to delete this entire order?")) return;
//     try {
//       await apiClient.delete(`/orders/${orderId}/`);
//       toast({ title: "Order Deleted" });
//       fetchOrders();
//     } catch (error) {
//       toast({ title: "Delete Failed", variant: "destructive" });
//     }
//   };

//   const filteredOrders = orders.filter((o) =>
//     o.public_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     `ORD-${o.id}`.includes(searchQuery)
//   );

//   const copyReceiptLink = (publicId: string) => {
//     const url = `${window.location.origin}/receipt/${publicId}`;
//     navigator.clipboard.writeText(url);
//     toast({ description: "Receipt link copied!" });
//   };

//   return (
//     <Layout title="Orders">
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <Input
//           placeholder="Search by ID or Customer..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-sm h-11 rounded-xl"
//         />
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-44 h-11 rounded-xl">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="in_progress">In Progress</SelectItem>
//             <SelectItem value="ready">Ready</SelectItem>
//             <SelectItem value="delivered">Delivered</SelectItem>
//           </SelectContent>
//         </Select>
//         <Button onClick={() => navigate('/orders/new')} className="h-11 rounded-xl gap-2 sm:ml-auto">
//           <Plus className="h-4 w-4" /> New Order
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {isLoading ? (
//           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
//         ) : filteredOrders.map((order) => (
//           <div key={order.id} className="bg-card rounded-2xl p-6 shadow-sm border hover:border-primary/20 transition-all">
//             <div className="flex flex-col lg:flex-row justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
//                   {order.customer?.name?.charAt(0) || "G"}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-bold">ORD-{order.id}</h3>
//                     <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-2 py-0", statusStyles[order.status] || statusStyles.pending)}>
//                       {order.status}
//                     </Badge>
//                   </div>
//                   {/* DISPLAYING CUSTOMER NAME HERE */}
//                   <p className="text-sm font-medium mt-1">
//                     {order.customer?.name || "Guest Client"} • {order.items?.length || 0} items
//                   </p>
//                   <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
//                     <Calendar className="h-3 w-3" /> Due: {new Date(order.due_date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-6">
//                 <div className="text-right">
//                   <p className="text-xs text-muted-foreground">Total</p>
//                   <p className="font-bold text-primary">Rs.{order.total_amount?.toLocaleString()}</p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}>
//                     <Eye className="h-5 w-5" />
//                   </Button>
//                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => copyReceiptLink(order.public_id)}>
//                     <ExternalLink className="h-5 w-5" />
//                   </Button>
//                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteOrder(order.id)}>
//                     <Trash2 className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-2xl rounded-3xl">
//           <DialogHeader>
//             <DialogTitle>Order Details - ORD-{selectedOrder?.id}</DialogTitle>
//             <DialogDescription>
//                Customer: {selectedOrder?.customer?.name || 'Guest'}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             {selectedOrder?.items?.map((item) => (
//               <div key={item.id} className="p-4 border rounded-2xl bg-muted/10 flex items-center justify-between">
//                 <div>
//                   <p className="font-bold capitalize">{item.garment_type?.replace('_', ' ')}</p>
//                   <p className="text-xs text-muted-foreground">Stitcher: {item.stitcher?.name || 'Unassigned'}</p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Select 
//                     defaultValue={item.status} 
//                     onValueChange={(val) => handleUpdateItemStatus(item.id, val)}
//                   >
//                     <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="in_progress">In Progress</SelectItem>
//                       <SelectItem value="ready">Ready</SelectItem>
//                       <SelectItem value="delivered">Delivered</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {item.status === 'ready' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-3 mt-6">
//             <Button variant="outline" className="rounded-xl" onClick={() => setIsModalOpen(false)}>Close</Button>
//             <Button className="rounded-xl" onClick={() => navigate(`/receipt/${selectedOrder?.public_id}`)}>View Receipt</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// }