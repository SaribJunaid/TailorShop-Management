// import { useEffect, useState } from 'react';
// import { Layout } from '@/components/Layout';
// import { getCustomers, Customer } from '@/data/mockData';
// import { Input } from '@/components/ui/input';
// import { Ruler, Edit2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function Measurements() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       setIsLoading(true);
//       const data = await getCustomers();
//       setCustomers(data.filter((c) => c.measurements));
//       setIsLoading(false);
//     };

//     fetchCustomers();
//   }, []);

//   const filteredCustomers = customers.filter((c) =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (isLoading) {
//     return (
//       <Layout title="Measurements">
//         <div className="space-y-4">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
//           ))}
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Measurements">
//       <div className="mb-6">
//         <Input
//           placeholder="Search customer measurements..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="max-w-sm h-11 rounded-xl"
//         />
//       </div>

//       <div className="space-y-6">
//         {filteredCustomers.map((customer) => (
//           <div
//             key={customer.id}
//             className="bg-card rounded-2xl shadow-luxury p-6"
//           >
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                   <Ruler className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
//                   <p className="text-sm text-muted-foreground">{customer.phone}</p>
//                 </div>
//               </div>
//               <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
//                 <Edit2 className="h-4 w-4" />
//                 Edit
//               </Button>
//             </div>

//             {customer.measurements && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 {Object.entries(customer.measurements)
//                   .filter(([key, value]) => value !== undefined && key !== 'notes')
//                   .map(([key, value]) => (
//                     <div key={key} className="bg-muted/50 rounded-xl p-3 text-center">
//                       <p className="text-xs text-muted-foreground capitalize mb-1">
//                         {key.replace(/([A-Z])/g, ' $1').trim()}
//                       </p>
//                       <p className="text-lg font-semibold text-card-foreground">{value}"</p>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {filteredCustomers.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">No measurements found.</p>
//         </div>
//       )}
//     </Layout>
//   );
// }

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { Input } from '@/components/ui/input';
import { Ruler, Edit2, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function Measurements() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Editing
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all customers
      const custRes = await apiClient.get('/customers/');
      const customersData = custRes.data;

      // 2. Fetch measurements for each customer to display them
      // In a large app, you'd optimize this, but for now, this is clean
      const customersWithM = await Promise.all(
        customersData.map(async (c: any) => {
          const mRes = await apiClient.get(`/measurements/customer/${c.id}`);
          return { ...c, measurements: mRes.data[0] || null }; // Take the latest profile
        })
      );
      
      setCustomers(customersWithM);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEditClick = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData(customer.measurements || { customer_id: customer.id });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (formData.id) {
        // Update existing
        await apiClient.put(`/measurements/${formData.id}`, formData);
      } else {
        // Create new
        await apiClient.post(`/measurements/`, { ...formData, customer_id: selectedCustomer.id });
      }
      toast({ title: "Success", description: "Measurements updated" });
      setIsEditOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCustomers = customers.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const measurementFields = [
    { key: 'neck', label: 'Neck' },
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'shoulder', label: 'Shoulder' },
    { key: 'sleeve_length', label: 'Sleeves' },
    { key: 'shalwar_length', label: 'Shalwar Length' },
    { key: 'pant_length', label: 'Pant Length' },
    { key: 'coat_length', label: 'Coat Length' },
  ];

  if (isLoading) return <Layout title="Measurements"><Loader2 className="animate-spin m-10" /></Layout>;

  return (
    <Layout title="Measurements">
      <div className="mb-6">
        <Input
          placeholder="Search customer by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm h-11 rounded-xl"
        />
      </div>

      <div className="space-y-6">
        {filteredCustomers.map((customer: any) => (
          <div key={customer.id} className="bg-card rounded-2xl shadow-luxury p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Ruler className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl"
                onClick={() => handleEditClick(customer)}
              >
                <Edit2 className="h-4 w-4" />
                {customer.measurements ? 'Edit' : 'Add Measurements'}
              </Button>
            </div>

            {customer.measurements ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {measurementFields.map((f) => (
                  customer.measurements[f.key] && (
                    <div key={f.key} className="bg-muted/50 rounded-xl p-3 text-center border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                      <p className="text-lg font-semibold">{customer.measurements[f.key]}"</p>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-xl text-center">
                No measurements recorded yet.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Measurements for {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {measurementFields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label} (inches)</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={formData[f.key] || ''} 
                  onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-xl gap-2">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4" />}
              Save Measurements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}