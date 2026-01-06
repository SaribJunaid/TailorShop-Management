// import { useEffect, useState } from 'react';
// import { Layout } from '@/components/Layout';
// import { getStitchers, getOrders, Stitcher, Order } from '@/data/mockData';
// import { UserCog, ClipboardList, Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';

// const statusStyles: Record<Order['status'], string> = {
//   'Pending': 'bg-status-warning/10 text-status-warning',
//   'In Progress': 'bg-primary/10 text-primary',
//   'Ready': 'bg-status-success/10 text-status-success',
//   'Delivered': 'bg-muted text-muted-foreground',
//   'Cancelled': 'bg-status-danger/10 text-status-danger',
// };

// export default function Stitchers() {
//   const { toast } = useToast();
//   const [stitchers, setStitchers] = useState<Stitcher[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [newStitcher, setNewStitcher] = useState({ name: '', phone: '', specialization: '' });

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       const [stitchersData, ordersData] = await Promise.all([
//         getStitchers(),
//         getOrders(),
//       ]);
//       setStitchers(stitchersData);
//       setOrders(ordersData);
//       setIsLoading(false);
//     };

//     fetchData();
//   }, []);

//   const getStitcherOrders = (stitcherId: string) => {
//     return orders.filter((o) => o.assignedStitcherId === stitcherId && o.status !== 'Delivered' && o.status !== 'Cancelled');
//   };

//   const handleAddStitcher = () => {
//     if (!newStitcher.name.trim()) {
//       toast({
//         title: 'Validation Error',
//         description: 'Please enter the stitcher name.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     // Simulate adding - would be API call in production
//     toast({
//       title: 'Stitcher Added',
//       description: `${newStitcher.name} has been added to your team.`,
//     });
//     setNewStitcher({ name: '', phone: '', specialization: '' });
//     setIsAddDialogOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <Layout title="Stitchers">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
//           ))}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Stitchers">
//       <div className="flex items-center justify-between mb-6">
//         <p className="text-muted-foreground">Manage your tailoring team and their workload</p>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="h-11 rounded-xl gap-2">
//               <Plus className="h-4 w-4" />
//               Add Stitcher
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="rounded-2xl">
//             <DialogHeader>
//               <DialogTitle>Add New Stitcher</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 pt-4">
//               <div className="space-y-2">
//                 <Label>Name *</Label>
//                 <Input
//                   placeholder="Enter name"
//                   value={newStitcher.name}
//                   onChange={(e) => setNewStitcher((prev) => ({ ...prev, name: e.target.value }))}
//                   className="h-11 rounded-xl"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Phone</Label>
//                 <Input
//                   placeholder="+92 300 1234567"
//                   value={newStitcher.phone}
//                   onChange={(e) => setNewStitcher((prev) => ({ ...prev, phone: e.target.value }))}
//                   className="h-11 rounded-xl"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Specialization</Label>
//                 <Input
//                   placeholder="e.g., Sherwani, Suits"
//                   value={newStitcher.specialization}
//                   onChange={(e) => setNewStitcher((prev) => ({ ...prev, specialization: e.target.value }))}
//                   className="h-11 rounded-xl"
//                 />
//               </div>
//               <Button onClick={handleAddStitcher} className="w-full h-11 rounded-xl">
//                 Add Stitcher
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stitchers.map((stitcher) => {
//           const stitcherOrders = getStitcherOrders(stitcher.id);
//           const workloadPercentage = Math.min((stitcherOrders.length / 5) * 100, 100);
          
//           return (
//             <div
//               key={stitcher.id}
//               className="bg-card rounded-2xl shadow-luxury p-6 transition-luxury hover:shadow-luxury-hover"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
//                     <UserCog className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-card-foreground">{stitcher.name}</h3>
//                     <p className="text-sm text-muted-foreground">{stitcher.specialization}</p>
//                   </div>
//                 </div>
//                 <span className={cn(
//                   'px-2.5 py-1 rounded-full text-xs font-medium',
//                   stitcher.status === 'Active' 
//                     ? 'bg-status-success/10 text-status-success' 
//                     : 'bg-muted text-muted-foreground'
//                 )}>
//                   {stitcher.status}
//                 </span>
//               </div>

//               {/* Workload bar */}
//               <div className="mb-4">
//                 <div className="flex items-center justify-between text-sm mb-2">
//                   <span className="text-muted-foreground">Workload</span>
//                   <span className="font-medium text-card-foreground">{stitcherOrders.length} active orders</span>
//                 </div>
//                 <div className="h-2 bg-muted rounded-full overflow-hidden">
//                   <div
//                     className={cn(
//                       'h-full rounded-full transition-all',
//                       workloadPercentage > 80 ? 'bg-status-danger' : workloadPercentage > 50 ? 'bg-status-warning' : 'bg-status-success'
//                     )}
//                     style={{ width: `${workloadPercentage}%` }}
//                   />
//                 </div>
//               </div>

//               {/* Assigned orders */}
//               {stitcherOrders.length > 0 ? (
//                 <div className="space-y-2">
//                   <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Current Orders
//                   </p>
//                   {stitcherOrders.slice(0, 3).map((order) => (
//                     <div
//                       key={order.id}
//                       className="flex items-center justify-between p-3 bg-muted/30 rounded-xl text-sm"
//                     >
//                       <div className="flex items-center gap-2">
//                         <ClipboardList className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-card-foreground">{order.orderId}</span>
//                       </div>
//                       <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusStyles[order.status])}>
//                         {order.status}
//                       </span>
//                     </div>
//                   ))}
//                   {stitcherOrders.length > 3 && (
//                     <p className="text-xs text-muted-foreground text-center pt-2">
//                       +{stitcherOrders.length - 3} more orders
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-4 text-sm text-muted-foreground">
//                   No active orders assigned
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {stitchers.length === 0 && (
//         <div className="text-center py-12">
//           <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <p className="text-muted-foreground">No stitchers added yet.</p>
//           <p className="text-sm text-muted-foreground mt-1">Add your first stitcher to start assigning orders.</p>
//         </div>
//       )}
//     </Layout>
//   );
// }
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { UserCog, ClipboardList, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface Stitcher {
  id: number;
  name: string;
  phone: string;
  specialty: string;
  shop_id: number;
}

interface OrderItem {
  id: number;
  garment_type: string;
  status: string;
  order_id: number;
  stitcher_id: number | null;
}

export default function Stitchers() {
  const { toast } = useToast();
  const navigate = useNavigate(); // Navigation initialized
  const [stitchers, setStitchers] = useState<Stitcher[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStitcher, setNewStitcher] = useState({ name: '', phone: '', specialty: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [stitcherRes, orderItemsRes] = await Promise.all([
        apiClient.get('/stitchers/'),
        apiClient.get('/orders/items/') 
      ]);
      setStitchers(stitcherRes.data);
      setOrderItems(orderItemsRes.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch team data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStitcherWorkload = (stitcherId: number) => {
    return orderItems.filter((item) => 
      item.stitcher_id === stitcherId && 
      !['delivered', 'cancelled', 'completed', 'ready'].includes(item.status)
    );
  };

  const handleAddStitcher = async () => {
    if (!newStitcher.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name is required.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/stitchers/', newStitcher);
      toast({
        title: 'Success',
        description: `${newStitcher.name} added to the team.`,
      });
      setNewStitcher({ name: '', phone: '', specialty: '' });
      setIsAddDialogOpen(false);
      fetchData(); 
    } catch (error: any) {
      toast({
        title: 'Failed to add',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Stitchers">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Stitchers">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tailoring Team</h1>
          <p className="text-muted-foreground">Manage workload and team performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl gap-2 shadow-luxury">
              <Plus className="h-4 w-4" />
              Add Stitcher
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Stitcher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  placeholder="e.g. Muhammad Ahmed"
                  value={newStitcher.name}
                  onChange={(e) => setNewStitcher((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+92 300 1234567"
                  value={newStitcher.phone}
                  onChange={(e) => setNewStitcher((prev) => ({ ...prev, phone: e.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Input
                  placeholder="e.g., Suits, Sherwani"
                  value={newStitcher.specialty}
                  onChange={(e) => setNewStitcher((prev) => ({ ...prev, specialty: e.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleAddStitcher} 
                className="w-full h-11 rounded-xl mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register Stitcher'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stitchers.map((stitcher) => {
          const currentWork = getStitcherWorkload(stitcher.id);
          const workloadPercentage = Math.min((currentWork.length / 5) * 100, 100);
          
          return (
            <div
              key={stitcher.id}
              onClick={() => navigate(`/stitchers/${stitcher.id}`)}
              className="group bg-card rounded-2xl shadow-luxury p-6 border border-border/50 hover:shadow-luxury-hover transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <UserCog className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{stitcher.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      {stitcher.specialty || 'General Tailor'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Workload</span>
                  <span className="font-bold">{currentWork.length} Items</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      workloadPercentage > 80 ? 'bg-red-500' : workloadPercentage > 50 ? 'bg-orange-500' : 'bg-green-500'
                    )}
                    style={{ width: `${workloadPercentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">In Progress</p>
                {currentWork.length > 0 ? (
                  currentWork.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <ClipboardList className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{item.garment_type}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] h-4 px-1 capitalize">{item.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs py-2 text-muted-foreground italic">Available for assignment</p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground">
                <span>{stitcher.phone || 'No contact'}</span>
                <span className="text-primary font-medium group-hover:underline">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {stitchers.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border-2 border-dashed">
          <UserCog className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">No team members yet</p>
          <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>Add your first stitcher</Button>
        </div>
      )}
    </Layout>
  );
}