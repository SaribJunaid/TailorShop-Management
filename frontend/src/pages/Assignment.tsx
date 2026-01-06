// import { useEffect, useState ,useCallback} from 'react';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   UserCog, 
//   ChevronRight, 
//   Search, 
//   Clock, 
//   CheckCircle2, 
//   AlertCircle,
//   Loader2,
//   UserCheck
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';

// interface OrderItem {
//   id: number;
//   garment_type: string;
//   status: string;
//   order_id: number;
//   stitcher_id: number | null;
//   notes?: string;
// }

// interface Stitcher {
//   id: number;
//   name: string;
//   specialty: string;
// }

// export default function Assignment() {
//   const { toast } = useToast();
//   const [items, setItems] = useState<OrderItem[]>([]);
//   const [stitchers, setStitchers] = useState<Stitcher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchData = useCallback(async () => {
//   setLoading(true);
//   try {
//     const [itemsRes, stitchersRes] = await Promise.all([
//       apiClient.get('/orders/items/?assigned=false'), 
//       apiClient.get('/stitchers/')
//     ]);
    
//     const unassignedItems = itemsRes.data.filter((item: any) => !item.stitcher_id);
//     setItems(unassignedItems);
//     setStitchers(stitchersRes.data);
//   } catch (error) {
//     toast({
//       title: "Error",
//       description: "Failed to load data.",
//       variant: "destructive"
//     });
//   } finally {
//     setLoading(false);
//   }
// }, [toast]); // Dependencies for the function

// useEffect(() => {
//   fetchData();
// }, [fetchData]);

//   const handleAssign = async (stitcherId: number) => {
//     if (!selectedItemId) return;

//     try {
//       // Update the specific Order Item with the selected Stitcher ID
//       await apiClient.put(`/orders/items/${selectedItemId}/`, {
//         stitcher_id: stitcherId,
//         status: 'in_progress' // Automatically move to in_progress when assigned
//       });

//       toast({
//         title: "Assigned Successfully",
//         description: "The item has been assigned to the stitcher.",
//       });

//       setSelectedItemId(null);
//       fetchData(); // Refresh lists
//     } catch (error) {
//       toast({
//         title: "Assignment Failed",
//         description: "Could not update the order item.",
//         variant: "destructive"
//       });
//     }
//   };

//   const filteredItems = items.filter(item => 
//     item.garment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.id.toString().includes(searchTerm)
//   );

//   return (
//     <Layout title="Work Assignment">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
//         {/* Left Column: Unassigned Items */}
//         <div className="lg:col-span-7 space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold flex items-center gap-2">
//               <Clock className="h-5 w-5 text-status-warning" />
//               Pending Assignment
//               <Badge variant="secondary" className="ml-2">{items.length}</Badge>
//             </h2>
//             <div className="relative w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input 
//                 placeholder="Search items..." 
//                 className="pl-9 h-10 rounded-xl"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
//             {loading ? (
//               [...Array(4)].map((_, i) => <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />)
//             ) : filteredItems.length > 0 ? (
//               filteredItems.map((item) => (
//                 <div 
//                   key={item.id}
//                   onClick={() => setSelectedItemId(item.id)}
//                   className={cn(
//                     "p-5 rounded-2xl border-2 transition-all cursor-pointer group",
//                     selectedItemId === item.id 
//                       ? "border-primary bg-primary/5 shadow-md" 
//                       : "border-border bg-card hover:border-primary/50"
//                   )}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex gap-4">
//                       <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
//                         <AlertCircle className={cn("h-6 w-6", selectedItemId === item.id ? "text-primary" : "text-muted-foreground")} />
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-lg">{item.garment_type}</h3>
//                         <p className="text-sm text-muted-foreground">Order ID: #{item.order_id} • Item ID: {item.id}</p>
//                         {item.notes && <p className="text-xs mt-2 text-primary italic">Note: {item.notes}</p>}
//                       </div>
//                     </div>
//                     <ChevronRight className={cn("h-5 w-5 transition-transform", selectedItemId === item.id ? "rotate-90 text-primary" : "text-muted-foreground")} />
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
//                 <CheckCircle2 className="h-12 w-12 text-status-success mx-auto mb-3 opacity-20" />
//                 <p className="text-muted-foreground">All caught up! No pending assignments.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Stitcher Selection */}
//         <div className="lg:col-span-5">
//           <div className={cn(
//             "sticky top-8 p-6 rounded-3xl border-2 transition-all",
//             selectedItemId ? "border-primary bg-card shadow-luxury" : "border-dashed border-muted bg-muted/5 opacity-60"
//           )}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <UserCheck className="h-5 w-5 text-primary" />
//               </div>
//               <h2 className="text-xl font-bold">Assign to Stitcher</h2>
//             </div>

//             {!selectedItemId ? (
//               <div className="text-center py-12">
//                 <p className="text-muted-foreground">Select an item from the list to assign it to a team member.</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <p className="text-sm font-medium text-muted-foreground mb-4">
//                   Select a stitcher for the <span className="text-foreground font-bold underline">Item #{selectedItemId}</span>
//                 </p>
//                 {stitchers.map((s) => (
//                   <button
//                     key={s.id}
//                     onClick={() => handleAssign(s.id)}
//                     className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20">
//                         <UserCog className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
//                       </div>
//                       <div className="text-left">
//                         <p className="font-bold text-sm">{s.name}</p>
//                         <p className="text-xs text-muted-foreground">{s.specialty || 'General Tailor'}</p>
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">Assign</Badge>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </Layout>
//   );
// }
// import { useEffect, useState, useCallback } from 'react';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   UserCog, 
//   ChevronRight, 
//   Search, 
//   Clock, 
//   CheckCircle2, 
//   AlertCircle,
//   Loader2,
//   UserCheck,
//   TrendingUp,
//   History
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// interface OrderItem {
//   id: number;
//   garment_type: string;
//   status: string;
//   order_id: number;
//   stitcher_id: number | null;
//   notes?: string;
//   stitcher?: {
//     name: string;
//     specialty?: string;
//   };
// }

// interface Stitcher {
//   id: number;
//   name: string;
//   specialty: string;
// }

// export default function Assignment() {
//   const { toast } = useToast();
//   const [items, setItems] = useState<OrderItem[]>([]);
//   const [stitchers, setStitchers] = useState<Stitcher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Requirement #8: Fetch ALL items to categorize into tabs
//       const [itemsRes, stitchersRes] = await Promise.all([
//         apiClient.get('/orders/items/'), 
//         apiClient.get('/stitchers/')
//       ]);
      
//       setItems(itemsRes.data);
//       setStitchers(stitchersRes.data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load workshop data.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleAssign = async (stitcherId: number) => {
//     if (!selectedItemId) return;

//     try {
//       // Requirement #4: Automatically move to in_progress on assignment
//       await apiClient.put(`/orders/items/${selectedItemId}/`, {
//         stitcher_id: stitcherId,
//         status: 'in_progress' 
//       });

//       toast({
//         title: "Assigned Successfully",
//         description: "Item moved to In-Progress status.",
//       });

//       setSelectedItemId(null);
//       fetchData(); 
//     } catch (error) {
//       toast({
//         title: "Assignment Failed",
//         description: "Could not update the order item.",
//         variant: "destructive"
//       });
//     }
//   };

//   // Requirement #8 Logic: Filter items into categories
//   const pendingItems = items.filter(item => 
//     !item.stitcher_id && (item.status === 'pending' || !item.status)
//   ).filter(item => 
//     item.garment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.id.toString().includes(searchTerm)
//   );

//   const inProgressItems = items.filter(item => 
//     item.stitcher_id && item.status === 'in_progress'
//   );

//   const completedItems = items.filter(item => 
//     item.status === 'completed' || item.status === 'delivered' || item.status === 'ready'
//   );

//   return (
//     <Layout title="Workshop Management">
//       <Tabs defaultValue="pending" className="w-full">
//         <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 p-1 rounded-xl">
//           <TabsTrigger value="pending" className="rounded-lg">
//             Pending ({pendingItems.length})
//           </TabsTrigger>
//           <TabsTrigger value="progress" className="rounded-lg">
//             In Progress ({inProgressItems.length})
//           </TabsTrigger>
//           <TabsTrigger value="completed" className="rounded-lg">
//             Completed ({completedItems.length})
//           </TabsTrigger>
//         </TabsList>

//         {/* --- PENDING TAB --- */}
//         <TabsContent value="pending" className="grid grid-cols-1 lg:grid-cols-12 gap-8 focus-visible:outline-none">
//           <div className="lg:col-span-7 space-y-4">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
//                 <AlertCircle className="h-4 w-4" />
//                 Waitlist for Tailors
//               </h2>
//               <div className="relative w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input 
//                   placeholder="Search items..." 
//                   className="pl-9 h-9 rounded-xl text-xs"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="space-y-3">
//               {loading ? (
//                 <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
//               ) : pendingItems.length > 0 ? (
//                 pendingItems.map((item) => (
//                   <div 
//                     key={item.id}
//                     onClick={() => setSelectedItemId(item.id)}
//                     className={cn(
//                       "p-4 rounded-2xl border-2 transition-all cursor-pointer",
//                       selectedItemId === item.id ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/50"
//                     )}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div className="flex gap-4 items-center">
//                         <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//                           <Clock className="h-5 w-5 text-status-warning" />
//                         </div>
//                         <div>
//                           <h3 className="font-bold">{item.garment_type}</h3>
//                           <p className="text-xs text-muted-foreground">Order ID: #{item.order_id} • Item #{item.id}</p>
//                         </div>
//                       </div>
//                       <ChevronRight className={cn("h-5 w-5", selectedItemId === item.id ? "text-primary rotate-90" : "text-muted-foreground")} />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed">
//                   <p className="text-muted-foreground">No pending items found.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="lg:col-span-5">
//             <div className={cn(
//               "sticky top-8 p-6 rounded-3xl border-2 transition-all",
//               selectedItemId ? "border-primary bg-card shadow-lg" : "border-dashed border-muted bg-muted/5 opacity-50"
//             )}>
//               <h3 className="font-bold mb-4 flex items-center gap-2">
//                 <UserCheck className="h-5 w-5 text-primary" />
//                 Assign Stitcher
//               </h3>
//               {!selectedItemId ? (
//                 <p className="text-sm text-muted-foreground text-center py-10">Select an item to assign a tailor.</p>
//               ) : (
//                 <div className="space-y-2">
//                   {stitchers.map((s) => (
//                     <button
//                       key={s.id}
//                       onClick={() => handleAssign(s.id)}
//                       className="w-full flex items-center justify-between p-3 rounded-xl border hover:bg-primary/5 hover:border-primary transition-all group"
//                     >
//                       <div className="text-left">
//                         <p className="font-bold text-sm">{s.name}</p>
//                         <p className="text-[10px] text-muted-foreground">{s.specialty}</p>
//                       </div>
//                       <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white">Assign</Badge>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>

//         {/* --- IN PROGRESS TAB --- */}
//         <TabsContent value="progress" className="focus-visible:outline-none">
//           <div className="grid gap-4">
//             {inProgressItems.length > 0 ? (
//               inProgressItems.map(item => (
//                 <div key={item.id} className="p-5 border rounded-2xl bg-card flex justify-between items-center shadow-sm">
//                   <div className="flex gap-4 items-center">
//                     <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
//                       <TrendingUp className="h-6 w-6 text-blue-500" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-lg">{item.garment_type}</h3>
//                       <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
//                         <UserCog className="h-3 w-3" /> Assigned to: {item.stitcher?.name || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                   <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1">In Progress</Badge>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed italic text-muted-foreground">
//                 No items currently with tailors.
//               </div>
//             )}
//           </div>
//         </TabsContent>

//         {/* --- COMPLETED TAB --- */}
//         <TabsContent value="completed" className="focus-visible:outline-none">
//           <div className="grid gap-4">
//             {completedItems.length > 0 ? (
//               completedItems.map(item => (
//                 <div key={item.id} className="p-5 border rounded-2xl bg-muted/5 flex justify-between items-center opacity-80">
//                   <div className="flex gap-4 items-center">
//                     <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
//                       <CheckCircle2 className="h-6 w-6 text-green-500" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-lg">{item.garment_type}</h3>
//                       <p className="text-xs text-muted-foreground">Finished by: {item.stitcher?.name || 'Workshop'}</p>
//                     </div>
//                   </div>
//                   <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed italic text-muted-foreground">
//                 No completed items yet.
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </Layout>
//   );
// }
import { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { 
  UserCog, 
  ChevronRight, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  UserCheck,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: number;
  garment_type: string;
  status: string;
  order_id: number;
  stitcher_id: number | null;
  notes?: string;
  stitcher?: {
    name: string;
    specialty?: string;
  };
}

interface Stitcher {
  id: number;
  name: string;
  specialty: string;
}

export default function Assignment() {
  const { toast } = useToast();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [stitchers, setStitchers] = useState<Stitcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // 1. Data Fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, stitchersRes] = await Promise.all([
        apiClient.get('/orders/items/'), 
        apiClient.get('/stitchers/')
      ]);
      setItems(itemsRes.data);
      setStitchers(stitchersRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workshop data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Status Update (Individual Item)
  const handleUpdateStatus = async (itemId: number, newStatus: string, stitcherId?: number) => {
    setIsUpdating(itemId);
    try {
      const payload: any = { status: newStatus };
      if (stitcherId) payload.stitcher_id = stitcherId;

      // Backend logic in order.py will auto-sync the Main Order status here
      await apiClient.put(`/orders/items/${itemId}`, payload);
      
      toast({
        title: `Status: ${newStatus.toUpperCase()}`,
        description: "Workshop updated and main order synced.",
      });

      setSelectedItemId(null);
      await fetchData(); // Refresh list to show new statuses/names
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update the status.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // 3. Main Order Update (Manual Override)
  const handleUpdateMainOrder = async (orderId: number, status: string) => {
    try {
      await apiClient.put(`/orders/${orderId}`, { status });
      toast({ title: "Order Updated", description: `Main Order #${orderId} is now ${status}.` });
      await fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update main order status.", variant: "destructive" });
    }
  };

  // --- 4. Logic/Filtering (Defined BEFORE return to prevent ReferenceErrors) ---
  
  const filteredItems = items.filter(item => 
    item.garment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm) ||
    item.order_id.toString().includes(searchTerm)
  );

  const pendingItems = filteredItems.filter(item => 
    (item.status === 'queued' || item.status === 'pending' || !item.stitcher_id) && 
    !['completed', 'ready', 'delivered'].includes(item.status)
  );

  const inProgressItems = filteredItems.filter(item => 
    ['in_progress', 'stitching', 'cutting'].includes(item.status)
  );

  const completedItems = filteredItems.filter(item => 
    ['completed', 'ready', 'delivered'].includes(item.status)
  );

  return (
    <Layout title="Workshop Management">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 p-1 rounded-xl shadow-inner">
          <TabsTrigger value="pending" className="rounded-lg">Pending ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-lg">In Progress ({inProgressItems.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg">Completed ({completedItems.length})</TabsTrigger>
        </TabsList>

        {/* --- PENDING TAB --- */}
        <TabsContent value="pending" className="grid grid-cols-1 lg:grid-cols-12 gap-8 focus-visible:outline-none">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Waitlist
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search order or garment..." 
                  className="pl-9 h-9 rounded-xl text-xs bg-card border-border/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                      selectedItemId === item.id ? "border-primary bg-primary/5 shadow-primary/10" : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-status-warning" />
                        </div>
                        <div>
                          <h3 className="font-bold">{item.garment_type}</h3>
                          <p className="text-xs text-muted-foreground">Order ID: #{item.order_id} • Item #{item.id}</p>
                        </div>
                      </div>
                      <ChevronRight className={cn("h-5 w-5 transition-transform", selectedItemId === item.id ? "text-primary rotate-90" : "text-muted-foreground")} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                  <p className="text-muted-foreground">No pending items found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={cn(
              "sticky top-8 p-6 rounded-3xl border-2 transition-all duration-300",
              selectedItemId ? "border-primary bg-card shadow-luxury" : "border-dashed border-muted bg-muted/5 opacity-50"
            )}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> Assign Stitcher
              </h3>
              {!selectedItemId ? (
                <p className="text-sm text-muted-foreground text-center py-10 italic">Select an item from the waitlist to assign a tailor.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {stitchers.map((s) => (
                    <button
                      key={s.id}
                      disabled={isUpdating !== null}
                      onClick={() => handleUpdateStatus(selectedItemId, 'in_progress', s.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/5 hover:bg-primary/5 hover:border-primary transition-all group disabled:opacity-50"
                    >
                      <div className="text-left">
                        <p className="font-bold text-sm">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{s.specialty}</p>
                      </div>
                      <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">Assign</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* --- IN PROGRESS TAB --- */}
        <TabsContent value="progress" className="focus-visible:outline-none space-y-4">
          {inProgressItems.length > 0 ? (
            inProgressItems.map(item => (
              <div key={item.id} className="p-5 border border-border/50 rounded-2xl bg-card flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{item.garment_type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 border-blue-100">
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <UserCog className="h-3 w-3 text-primary" /> Tailor: <span className="text-primary font-bold">{item.stitcher?.name || "Assigned"}</span>
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">Order Reference: #{item.order_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isUpdating === item.id}
                    className="text-green-600 border-green-200 hover:bg-green-50 gap-2 rounded-xl h-10 px-4"
                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                  >
                    {isUpdating === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Mark Complete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed italic text-muted-foreground">
              No garments are currently in production.
            </div>
          )}
        </TabsContent>

        {/* --- COMPLETED TAB --- */}
        <TabsContent value="completed" className="focus-visible:outline-none space-y-4">
          {completedItems.length > 0 ? (
            completedItems.map(item => (
              <div key={item.id} className="p-5 border border-border/50 rounded-2xl bg-muted/5 flex justify-between items-center transition-all">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.garment_type}</h3>
                    <p className="text-xs text-muted-foreground">Successfully finished by {item.stitcher?.name || "Tailor"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Order Reference: #{item.order_id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1 uppercase text-[10px] font-bold">
                    {item.status}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-7 gap-1 hover:text-primary transition-colors"
                    onClick={() => handleUpdateMainOrder(item.order_id, 'ready')}
                  >
                    <PackageCheck className="h-3 w-3" /> Mark Entire Order Ready
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed italic text-muted-foreground">
              No completed items yet. Finished garments will appear here.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}