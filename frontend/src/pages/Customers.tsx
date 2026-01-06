// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import { getCustomers, Customer } from '@/data/mockData';
// import { Plus, Phone, Mail, MoreHorizontal } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// export default function Customers() {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       setIsLoading(true);
//       const data = await getCustomers();
//       setCustomers(data);
//       setFilteredCustomers(data);
//       setIsLoading(false);
//     };

//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = customers.filter(
//         (c) =>
//           c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.phone.includes(searchQuery) ||
//           c.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredCustomers(filtered);
//     } else {
//       setFilteredCustomers(customers);
//     }
//   }, [searchQuery, customers]);

//   if (isLoading) {
//     return (
//       <Layout title="Customers">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
//           ))}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Customers">
//       {/* Header with search and add button */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <Input
//           placeholder="Filter customers..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-sm h-11 rounded-xl"
//         />
//         <Button className="h-11 rounded-xl gap-2 ml-auto">
//           <Plus className="h-4 w-4" />
//           Add Customer
//         </Button>
//       </div>

//       {/* Customer cards grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <div
//             key={customer.id}
//             className="bg-card rounded-2xl shadow-luxury p-6 transition-luxury hover:shadow-luxury-hover cursor-pointer"
//             onClick={() => navigate(`/customers/${customer.id}`)}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
//                   <span className="text-xl font-semibold text-primary">
//                     {customer.name.charAt(0)}
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     {customer.totalOrders} orders
//                   </p>
//                 </div>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-muted-foreground"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="rounded-xl">
//                   <DropdownMenuItem>View Profile</DropdownMenuItem>
//                   <DropdownMenuItem>New Order</DropdownMenuItem>
//                   <DropdownMenuItem>Edit</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Phone className="h-4 w-4" />
//                 <span>{customer.phone}</span>
//               </div>
//               {customer.email && (
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Mail className="h-4 w-4" />
//                   <span className="truncate">{customer.email}</span>
//                 </div>
//               )}
//             </div>

//             {customer.measurements && (
//               <div className="mt-4 pt-4 border-t border-border">
//                 <p className="text-xs text-muted-foreground">Measurements on file</p>
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {customer.measurements.chest && (
//                     <span className="text-xs bg-muted px-2 py-1 rounded-lg">
//                       Chest: {customer.measurements.chest}"
//                     </span>
//                   )}
//                   {customer.measurements.waist && (
//                     <span className="text-xs bg-muted px-2 py-1 rounded-lg">
//                       Waist: {customer.measurements.waist}"
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {filteredCustomers.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">No customers found.</p>
//         </div>
//       )}
//     </Layout>
//   );
// }
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { Plus, Phone, Mail, MoreHorizontal, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from '@/components/ui/label';

// export default function Customers() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Form State for new customer
//   const [newCust, setNewCust] = useState({ name: '', phone: '', email: '' });

//   const fetchCustomers = async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiClient.get('/customers/');
//       setCustomers(response.data);
//       setFilteredCustomers(response.data);
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { fetchCustomers(); }, []);

//   useEffect(() => {
//     const filtered = customers.filter(c =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.phone.includes(searchQuery)
//     );
//     setFilteredCustomers(filtered);
//   }, [searchQuery, customers]);

//  const handleAddCustomer = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSaving(true);

//   // Clean the data: If email is empty string, send null so FastAPI is happy
//   const payload = {
//     ...newCust,
//     email: newCust.email.trim() === '' ? null : newCust.email
//   };

//   try {
//     await apiClient.post('/customers/', payload);
//     toast({ title: "Success", description: "Customer created successfully" });
//     setIsDialogOpen(false);
//     setNewCust({ name: '', phone: '', email: '' });
//     fetchCustomers(); 
//   } catch (error: any) {
//     // FIX FOR THE OBJECT ERROR:
//     let errorMessage = "Failed to save customer";
    
//     const backendDetail = error.response?.data?.detail;

//     if (typeof backendDetail === 'string') {
//       errorMessage = backendDetail;
//     } else if (Array.isArray(backendDetail)) {
//       // If it's a FastAPI validation array, pick the first error message
//       errorMessage = backendDetail[0]?.msg || "Validation Error";
//     }

//     toast({ 
//       title: "Error", 
//       description: errorMessage, // Now this is always a string!
//       variant: "destructive" 
//     });
//   } finally {
//     setIsSaving(false);
//   }
// };

//   if (isLoading) {
//     return (
//       <Layout title="Customers">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
//           ))}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Customers">
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <Input
//           placeholder="Search by name or phone..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-sm h-11 rounded-xl"
//         />
        
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="h-11 rounded-xl gap-2 ml-auto">
//               <Plus className="h-4 w-4" /> Add Customer
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px] rounded-2xl">
//             <DialogHeader>
//               <DialogTitle>Add New Customer</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleAddCustomer} className="space-y-4 pt-4">
//               <div className="space-y-2">
//                 <Label>Full Name *</Label>
//                 <Input required value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
//               </div>
//               <div className="space-y-2">
//                 <Label>Phone Number *</Label>
//                 <Input required value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email (Optional)</Label>
//                 <Input type="email" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} />
//               </div>
//               <DialogFooter>
//                 <Button type="submit" disabled={isSaving} className="w-full">
//                   {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'Save Customer'}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <div
//             key={customer.id}
//             className="bg-card rounded-2xl shadow-luxury p-6 hover:shadow-luxury-hover cursor-pointer"
//             onClick={() => navigate(`/customers/${customer.id}`)}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
//                   <span className="text-xl font-semibold text-primary">{customer.name.charAt(0)}</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">{customer.name}</h3>
//                   <p className="text-sm text-muted-foreground">ID: #{customer.id}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Phone className="h-4 w-4" /> <span>{customer.phone}</span>
//               </div>
//               {customer.email && (
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Mail className="h-4 w-4" /> <span className="truncate">{customer.email}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </Layout>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { Plus, Phone, Mail, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Customers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '' });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/customers/');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  useEffect(() => {
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      ...newCust,
      email: newCust.email.trim() === '' ? null : newCust.email
    };

    try {
      await apiClient.post('/customers/', payload);
      toast({ title: "Success", description: "Customer created successfully" });
      setIsDialogOpen(false);
      setNewCust({ name: '', phone: '', email: '' });
      fetchCustomers(); 
    } catch (error: any) {
      let errorMessage = "Failed to save customer";
      const backendDetail = error.response?.data?.detail;
      if (typeof backendDetail === 'string') errorMessage = backendDetail;
      else if (Array.isArray(backendDetail)) errorMessage = backendDetail[0]?.msg || "Validation Error";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigation to profile
    if (!confirm("Are you sure you want to delete this customer? This will also remove all their order records.")) return;
    
    try {
      await apiClient.delete(`/customers/${id}`);
      toast({ title: "Deleted", description: "Customer removed successfully" });
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      toast({ title: "Error", description: "Could not delete customer", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout title="Customers">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customers">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm h-11 rounded-xl"
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl gap-2 ml-auto">
              <Plus className="h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input required value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input required value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input type="email" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'Save Customer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="group bg-card rounded-2xl shadow-luxury p-6 hover:shadow-luxury-hover cursor-pointer border border-transparent hover:border-primary/20 transition-all relative"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">{customer.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: #{customer.id}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => handleDeleteCustomer(customer.id, e)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 rounded-full transition-opacity"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /> <span className="truncate">{customer.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}