// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { ArrowLeft, ArrowRight, Check, Search, User, Shirt, Ruler, FileText, Plus, Minus, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { OrderSuccessModal } from '@/components/OrderSuccessModal';

// const steps = [
//   { id: 1, name: 'Customer', icon: User },
//   { id: 2, name: 'Garments', icon: Shirt },
//   { id: 3, name: 'Measurements', icon: Ruler },
//   { id: 4, name: 'Details', icon: FileText },
// ];

// const garmentTypes = [
//   { id: 'Shirt', name: 'Shirt', description: 'Formal or casual shirts' },
//   { id: 'Sherwani', name: 'Sherwani', description: 'Traditional wedding wear' },
//   { id: 'Pant', name: 'Pant', description: 'Trousers and formal pants' },
//   { id: 'Blazer', name: 'Blazer', description: 'Blazers and sport coats' },
//   { id: 'Vest', name: 'Vest', description: 'Waistcoats and vests' },
// ];

// const measurementFields: Record<string, { label: string; placeholder: string }[]> = {
//   Shirt: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }, { label: 'Length', placeholder: '30' }],
//   Sherwani: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Length', placeholder: '44' }],
//   Pant: [{ label: 'Waist', placeholder: '34' }, { label: 'Hips', placeholder: '40' }, { label: 'Length', placeholder: '42' }, { label: 'Thigh', placeholder: '24' }],
//   Blazer: [{ label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }],
//   Vest: [{ label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }],
// };

// interface GarmentSelection {
//   type: string;
//   quantity: number;
// }

// export default function NewOrder() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
//   const [selectedGarments, setSelectedGarments] = useState<GarmentSelection[]>([]);
//   const [measurements, setMeasurements] = useState<Record<string, string>>({});
//   const [orderDetails, setOrderDetails] = useState({
//     dueDate: '',
//     fabricNotes: '',
//     totalAmount: '',
//     advancePayment: '',
//   });
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [createdOrderId, setCreatedOrderId] = useState('');
//   const [createdOrderUuid, setCreatedOrderUuid] = useState('');

//   useEffect(() => {
//     apiClient.get('/customers/').then(res => setCustomers(res.data)).catch(() => {
//       toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
//     });
//   }, []);

//   const handleNext = () => {
//     if (currentStep === 1 && !selectedCustomer) return toast({ title: 'Select a customer', variant: 'destructive' });
//     if (currentStep === 2 && selectedGarments.length === 0) return toast({ title: 'Select a garment', variant: 'destructive' });
//     setCurrentStep(prev => prev + 1);
//   };

//   const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

//   const handleGarmentToggle = (garmentId: string) => {
//     setSelectedGarments(prev => {
//       const exists = prev.find(g => g.type === garmentId);
//       return exists ? prev.filter(g => g.type !== garmentId) : [...prev, { type: garmentId, quantity: 1 }];
//     });
//   };

//   const handleGarmentQuantity = (garmentId: string, delta: number) => {
//     setSelectedGarments(prev => prev.map(g => 
//       g.type === garmentId ? { ...g, quantity: Math.max(1, g.quantity + delta) } : g
//     ));
//   };

//   const handleSubmit = async () => {
//     if (!orderDetails.dueDate || !orderDetails.totalAmount) {
//       return toast({ title: 'Missing details', description: 'Due date and price are required.', variant: 'destructive' });
//     }

//     setIsSubmitting(true);
//     try {
//       const totalItems = selectedGarments.reduce((sum, g) => sum + g.quantity, 0);
//       const payload = {
//         customer_id: selectedCustomer.id,
//         due_date: orderDetails.dueDate,
//         total_amount: parseFloat(orderDetails.totalAmount),
//         advance_paid: parseFloat(orderDetails.advancePayment || "0"),
//         status: "pending",
//         items: selectedGarments.flatMap(g => 
//           Array(g.quantity).fill(null).map(() => ({
//             garment_type: g.type,
//             price: parseFloat(orderDetails.totalAmount) / totalItems,
//             measurement_id: 1, // Placeholder
//             notes: orderDetails.fabricNotes,
//             status: "queued"
//           }))
//         )
//       };

//       const res = await apiClient.post('/orders/', payload);
//       setCreatedOrderId(`ORD-${res.data.id}`);
//       setCreatedOrderUuid(res.data.public_id);
//       setShowSuccessModal(true);
//     } catch (err: any) {
//       toast({ title: "Order Failed", description: err.response?.data?.detail || "Connection error", variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
//   );

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto">
//         {/* Step indicator */}
//         <div className="flex items-center justify-between mb-8 px-4">
//           {steps.map((step, idx) => (
//             <div key={step.id} className="flex items-center">
//               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", currentStep >= step.id ? "bg-primary border-primary text-white" : "border-muted text-muted-foreground")}>
//                 {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
//               </div>
//               {idx < steps.length - 1 && <div className={cn("h-0.5 w-12 sm:w-20 mx-2", currentStep > step.id ? "bg-primary" : "bg-muted")} />}
//             </div>
//           ))}
//         </div>

//         <div className="bg-card rounded-2xl shadow-luxury p-6 mb-6 relative min-h-[450px]">
//           {isSubmitting && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}

//           {currentStep === 1 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
//               <h2 className="text-xl font-bold">Select Customer</h2>
//               <Input placeholder="Search name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12" />
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
//                 {filteredCustomers.map(c => (
//                   <button key={c.id} onClick={() => setSelectedCustomer(c)} className={cn("p-4 border-2 rounded-xl text-left transition-all", selectedCustomer?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
//                     <p className="font-bold">{c.name}</p>
//                     <p className="text-sm text-muted-foreground">{c.phone}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Select Garments</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {garmentTypes.map(g => {
//                   const selection = selectedGarments.find(s => s.type === g.id);
//                   return (
//                     <div key={g.id} className={cn("p-4 border-2 rounded-xl text-center transition-all", selection ? "border-primary bg-primary/5" : "border-border")}>
//                       <button onClick={() => handleGarmentToggle(g.id)} className="w-full">
//                         <Shirt className={cn("mx-auto mb-2 h-8 w-8", selection ? "text-primary" : "text-muted-foreground")} />
//                         <p className="font-bold">{g.name}</p>
//                       </button>
//                       {selection && (
//                         <div className="flex items-center justify-between mt-4 bg-background rounded-lg p-1 border shadow-sm">
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, -1)}><Minus className="h-4 w-4" /></Button>
//                           <span className="font-bold">{selection.quantity}</span>
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, 1)}><Plus className="h-4 w-4" /></Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Measurements ({selectedGarments[0]?.type})</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
//                 {measurementFields[selectedGarments[0]?.type]?.map(f => (
//                   <div key={f.label} className="space-y-1">
//                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
//                     <Input type="number" placeholder={f.placeholder} value={measurements[f.label] || ''} onChange={e => setMeasurements({...measurements, [f.label]: e.target.value})} className="h-10" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 4 && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Order Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Due Date</Label>
//                   <Input type="date" value={orderDetails.dueDate} onChange={e => setOrderDetails({...orderDetails, dueDate: e.target.value})} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Total Amount (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.totalAmount} onChange={e => setOrderDetails({...orderDetails, totalAmount: e.target.value})} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Advance Paid (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.advancePayment} onChange={e => setOrderDetails({...orderDetails, advancePayment: e.target.value})} />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Fabric & Style Notes</Label>
//                 <Textarea placeholder="Describe fabric color, pattern, and special requests..." value={orderDetails.fabricNotes} onChange={e => setOrderDetails({...orderDetails, fabricNotes: e.target.value})} className="min-h-[100px]" />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center px-2">
//           <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="w-24">Back</Button>
//           <Button onClick={currentStep === 4 ? handleSubmit : handleNext} disabled={isSubmitting} className={cn("w-32", currentStep === 4 ? "bg-status-success hover:bg-status-success/90" : "")}>
//             {currentStep === 4 ? "Create Order" : "Next"}
//           </Button>
//         </div>
//       </div>

//       <OrderSuccessModal open={showSuccessModal} onClose={() => navigate('/orders')} orderId={createdOrderId} customerName={selectedCustomer?.name || ''} receiptUuid={createdOrderUuid} />
//     </Layout>
//   );
// }
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   Check, 
//   User, 
//   Shirt, 
//   Ruler, 
//   FileText, 
//   Plus, 
//   Minus, 
//   Loader2, 
//   UserPlus, 
//   Search 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger,
//   DialogFooter
// } from "@/components/ui/dialog";
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { OrderSuccessModal } from '@/components/OrderSuccessModal';

// const steps = [
//   { id: 1, name: 'Customer', icon: User },
//   { id: 2, name: 'Garments', icon: Shirt },
//   { id: 3, name: 'Measurements', icon: Ruler },
//   { id: 4, name: 'Details', icon: FileText },
// ];

// const garmentTypes = [
//   { id: 'Shirt', name: 'Shirt' },
//   { id: 'Sherwani', name: 'Sherwani' },
//   { id: 'Pant', name: 'Pant' },
//   { id: 'Blazer', name: 'Blazer' },
//   { id: 'Vest', name: 'Vest' },
// ];

// const measurementFields: Record<string, { label: string; placeholder: string }[]> = {
//   Shirt: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }, { label: 'Length', placeholder: '30' }],
//   Sherwani: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Length', placeholder: '44' }],
//   Pant: [{ label: 'Waist', placeholder: '34' }, { label: 'Hips', placeholder: '40' }, { label: 'Length', placeholder: '42' }, { label: 'Thigh', placeholder: '24' }],
//   Blazer: [{ label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }],
//   Vest: [{ label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }],
// };

// interface GarmentSelection {
//   type: string;
//   quantity: number;
// }

// export default function NewOrder() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
//   const [selectedGarments, setSelectedGarments] = useState<GarmentSelection[]>([]);
//   const [measurements, setMeasurements] = useState<Record<string, string>>({});
//   const [orderDetails, setOrderDetails] = useState({
//     dueDate: '',
//     fabricNotes: '',
//     totalAmount: '',
//     advancePayment: '',
//   });

//   // Requirement #1 States
//   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
//   const [isAddingCustomer, setIsAddingCustomer] = useState(false);

//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [createdOrderId, setCreatedOrderId] = useState('');
//   const [createdOrderUuid, setCreatedOrderUuid] = useState('');

//   const fetchCustomers = async () => {
//     try {
//       const res = await apiClient.get('/customers/');
//       setCustomers(res.data);
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
//     }
//   };

//   useEffect(() => { fetchCustomers(); }, []);

//   // Requirement #1: Handle Quick Add
//  const handleQuickAddCustomer = async () => {
//   // 1. Basic Validation
//   if (!newCustomer.name || !newCustomer.phone) {
//     return toast({ 
//       title: "Required", 
//       description: "Name and Phone are mandatory", 
//       variant: "destructive" 
//     });
//   }

//   setIsAddingCustomer(true);
//   try {
//     // 2. Data Cleaning: 
//     // We create a payload and ONLY add the email if it has text in it.
//     // This prevents sending "" which breaks the backend's EmailStr validation.
//     const payload: any = {
//       name: newCustomer.name,
//       phone: newCustomer.phone,
//     };
    
//     if (newCustomer.email && newCustomer.email.trim() !== "") {
//       payload.email = newCustomer.email;
//     } else {
//       payload.email = null; // Or simply don't include it
//     }

//     const res = await apiClient.post('/customers/', payload);
//     const created = res.data;
    
//     // 3. Update UI
//     setCustomers(prev => [...prev, created]);
//     setSelectedCustomer(created); 
//     setIsCustomerModalOpen(false);
    
//     // Reset form
//     setNewCustomer({ name: '', phone: '', email: '' });
    
//     toast({ title: "Success", description: "Customer added and selected." });
//   } catch (err: any) {
//     // Log the exact error from FastAPI to the console for debugging
//     console.error("FastAPI Error:", err.response?.data);
    
//     toast({ 
//       title: "Failed", 
//       description: err.response?.data?.detail?.[0]?.msg || "Invalid email format or data", 
//       variant: "destructive" 
//     });
//   } finally {
//     setIsAddingCustomer(false);
//   }
// };

//   const handleNext = () => {
//     if (currentStep === 1 && !selectedCustomer) return toast({ title: 'Select a customer', variant: 'destructive' });
//     if (currentStep === 2 && selectedGarments.length === 0) return toast({ title: 'Select a garment', variant: 'destructive' });
//     setCurrentStep(prev => prev + 1);
//   };

//   const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

//   const handleGarmentToggle = (garmentId: string) => {
//     setSelectedGarments(prev => {
//       const exists = prev.find(g => g.type === garmentId);
//       return exists ? prev.filter(g => g.type !== garmentId) : [...prev, { type: garmentId, quantity: 1 }];
//     });
//   };

//   const handleGarmentQuantity = (garmentId: string, delta: number) => {
//     setSelectedGarments(prev => prev.map(g => 
//       g.type === garmentId ? { ...g, quantity: Math.max(1, g.quantity + delta) } : g
//     ));
//   };

//   const handleSubmit = async () => {
//     if (!orderDetails.dueDate || !orderDetails.totalAmount) {
//       return toast({ title: 'Missing details', description: 'Due date and price are required.', variant: 'destructive' });
//     }
//     setIsSubmitting(true);
//     try {
//       const totalItems = selectedGarments.reduce((sum, g) => sum + g.quantity, 0);
//       const payload = {
//         customer_id: selectedCustomer.id,
//         due_date: orderDetails.dueDate,
//         total_amount: parseFloat(orderDetails.totalAmount),
//         advance_paid: parseFloat(orderDetails.advancePayment || "0"),
//         status: "pending",
//         items: selectedGarments.flatMap(g => 
//           Array(g.quantity).fill(null).map(() => ({
//             garment_type: g.type,
//             price: parseFloat(orderDetails.totalAmount) / totalItems,
//             measurement_id: 1,
//             notes: orderDetails.fabricNotes,
//             status: "pending"
//           }))
//         )
//       };

//       const res = await apiClient.post('/orders/', payload);
//       setCreatedOrderId(`ORD-${res.data.id}`);
//       setCreatedOrderUuid(res.data.public_id);
//       setShowSuccessModal(true);
//     } catch (err: any) {
//       toast({ title: "Order Failed", description: err.response?.data?.detail || "Error creating order", variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
//   );

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto">
//         {/* Progress Bar */}
//         <div className="flex items-center justify-between mb-8 px-4">
//           {steps.map((step, idx) => (
//             <div key={step.id} className="flex items-center">
//               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", currentStep >= step.id ? "bg-primary border-primary text-white" : "border-muted text-muted-foreground")}>
//                 {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
//               </div>
//               {idx < steps.length - 1 && <div className={cn("h-0.5 w-12 sm:w-20 mx-2", currentStep > step.id ? "bg-primary" : "bg-muted")} />}
//             </div>
//           ))}
//         </div>

//         <div className="bg-card rounded-2xl shadow-luxury p-6 mb-6 relative min-h-[450px]">
//           {isSubmitting && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}

//           {/* STEP 1: CUSTOMER SELECTION + QUICK ADD */}
//           {currentStep === 1 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold">Select Customer</h2>
                
//                 {/* Requirement #1: Quick Add Dialog */}
//                 <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="gap-2 rounded-xl border-dashed">
//                       <UserPlus className="h-4 w-4" /> New Customer
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px] rounded-3xl">
//                     <DialogHeader>
//                       <DialogTitle>Quick Register</DialogTitle>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="space-y-2">
//                         <Label>Full Name *</Label>
//                         <Input placeholder="John Doe" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Phone Number *</Label>
//                         <Input placeholder="0300-1234567" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Email (Optional)</Label>
//                         <Input placeholder="john@example.com" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button onClick={handleQuickAddCustomer} disabled={isAddingCustomer} className="w-full rounded-xl">
//                         {isAddingCustomer ? <Loader2 className="animate-spin h-4 w-4" /> : "Save & Select"}
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>

//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 pl-10 rounded-xl" />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 {filteredCustomers.map(c => (
//                   <button key={c.id} onClick={() => setSelectedCustomer(c)} className={cn("p-4 border-2 rounded-xl text-left transition-all", selectedCustomer?.id === c.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50")}>
//                     <p className="font-bold">{c.name}</p>
//                     <p className="text-sm text-muted-foreground">{c.phone}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* STEP 2: GARMENTS */}
//           {currentStep === 2 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Select Garments</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {garmentTypes.map(g => {
//                   const selection = selectedGarments.find(s => s.type === g.id);
//                   return (
//                     <div key={g.id} className={cn("p-4 border-2 rounded-xl text-center transition-all", selection ? "border-primary bg-primary/5" : "border-border")}>
//                       <button onClick={() => handleGarmentToggle(g.id)} className="w-full">
//                         <Shirt className={cn("mx-auto mb-2 h-8 w-8", selection ? "text-primary" : "text-muted-foreground")} />
//                         <p className="font-bold">{g.name}</p>
//                       </button>
//                       {selection && (
//                         <div className="flex items-center justify-between mt-4 bg-background rounded-lg p-1 border shadow-sm">
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, -1)}><Minus className="h-4 w-4" /></Button>
//                           <span className="font-bold">{selection.quantity}</span>
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, 1)}><Plus className="h-4 w-4" /></Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* STEP 3: MEASUREMENTS */}
//           {currentStep === 3 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Measurements ({selectedGarments[0]?.type})</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
//                 {measurementFields[selectedGarments[0]?.type]?.map(f => (
//                   <div key={f.label} className="space-y-1">
//                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
//                     <Input type="number" placeholder={f.placeholder} value={measurements[f.label] || ''} onChange={e => setMeasurements({...measurements, [f.label]: e.target.value})} className="h-10 rounded-lg" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* STEP 4: FINAL DETAILS */}
//           {currentStep === 4 && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
//               <h2 className="text-xl font-bold">Order Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Due Date</Label>
//                   <Input type="date" value={orderDetails.dueDate} onChange={e => setOrderDetails({...orderDetails, dueDate: e.target.value})} className="rounded-xl" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Total Amount (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.totalAmount} onChange={e => setOrderDetails({...orderDetails, totalAmount: e.target.value})} className="rounded-xl" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Advance Paid (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.advancePayment} onChange={e => setOrderDetails({...orderDetails, advancePayment: e.target.value})} className="rounded-xl" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Fabric & Style Notes</Label>
//                 <Textarea placeholder="Describe fabric color, pattern..." value={orderDetails.fabricNotes} onChange={e => setOrderDetails({...orderDetails, fabricNotes: e.target.value})} className="min-h-[100px] rounded-xl" />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer Navigation */}
//         <div className="flex justify-between items-center px-2">
//           <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="w-24 rounded-xl">Back</Button>
//           <Button onClick={currentStep === 4 ? handleSubmit : handleNext} disabled={isSubmitting} className={cn("w-32 rounded-xl", currentStep === 4 ? "bg-status-success hover:bg-status-success/90" : "")}>
//             {currentStep === 4 ? "Create Order" : "Next"}
//           </Button>
//         </div>
//       </div>

//       <OrderSuccessModal 
//         open={showSuccessModal} 
//         onClose={() => navigate('/orders')} 
//         orderId={createdOrderId} 
//         customerName={selectedCustomer?.name || ''} 
//         receiptUuid={createdOrderUuid} 
//       />
//     </Layout>
//   );
// }

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   Check, 
//   User, 
//   Shirt, 
//   Ruler, 
//   FileText, 
//   Plus, 
//   Minus, 
//   Loader2, 
//   UserPlus, 
//   Search 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger,
//   DialogFooter
// } from "@/components/ui/dialog";
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { OrderSuccessModal } from '@/components/OrderSuccessModal';

// // --- PDF LIBRARIES ---
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const steps = [
//   { id: 1, name: 'Customer', icon: User },
//   { id: 2, name: 'Garments', icon: Shirt },
//   { id: 3, name: 'Measurements', icon: Ruler },
//   { id: 4, name: 'Details', icon: FileText },
// ];

// const garmentTypes = [
//   { id: 'Shirt', name: 'Shirt' },
//   { id: 'Sherwani', name: 'Sherwani' },
//   { id: 'Pant', name: 'Pant' },
//   { id: 'Blazer', name: 'Blazer' },
//   { id: 'Vest', name: 'Vest' },
// ];

// const measurementFields: Record<string, { label: string; placeholder: string }[]> = {
//   Shirt: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }, { label: 'Length', placeholder: '30' }],
//   Sherwani: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Length', placeholder: '44' }],
//   Pant: [{ label: 'Waist', placeholder: '34' }, { label: 'Hips', placeholder: '40' }, { label: 'Length', placeholder: '42' }, { label: 'Thigh', placeholder: '24' }],
//   Blazer: [{ label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }],
//   Vest: [{ label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }],
// };

// interface GarmentSelection {
//   type: string;
//   quantity: number;
// }

// export default function NewOrder() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
//   const [selectedGarments, setSelectedGarments] = useState<GarmentSelection[]>([]);
//   const [measurements, setMeasurements] = useState<Record<string, string>>({});
//   const [orderDetails, setOrderDetails] = useState({
//     dueDate: '',
//     fabricNotes: '',
//     totalAmount: '',
//     advancePayment: '',
//   });

//   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
//   const [isAddingCustomer, setIsAddingCustomer] = useState(false);

//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [createdOrderId, setCreatedOrderId] = useState('');
//   const [createdOrderUuid, setCreatedOrderUuid] = useState('');

//   const fetchCustomers = async () => {
//     try {
//       const res = await apiClient.get('/customers/');
//       setCustomers(res.data);
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
//     }
//   };

//   useEffect(() => { fetchCustomers(); }, []);

//   // --- PDF GENERATION FUNCTION ---
//   const generatePDF = (order: any, customerName: string) => {
//     const doc = new jsPDF();
//     const date = new Date().toLocaleDateString();

//     // Styling & Header
//     doc.setFontSize(22);
//     doc.text("ORDER RECEIPT", 105, 20, { align: "center" });
    
//     doc.setFontSize(10);
//     doc.text(`Date: ${date}`, 15, 35);
//     doc.text(`Order ID: ORD-${order.id}`, 15, 40);
//     doc.text(`Customer: ${customerName}`, 15, 45);
//     doc.text(`Due Date: ${order.due_date}`, 15, 50);

//     // Items Table
//     autoTable(doc, {
//       startY: 60,
//       head: [['Garment Type', 'Status', 'Price']],
//       body: order.items.map((item: any) => [
//         item.garment_type.toUpperCase(),
//         item.status.toUpperCase(),
//         `Rs. ${item.price.toLocaleString()}`
//       ]),
//       headStyles: { fillColor: [0, 0, 0] }
//     });

//     const finalY = (doc as any).lastAutoTable.finalY + 10;
    
//     // Totals
//     doc.text(`Total Amount: Rs. ${order.total_amount.toLocaleString()}`, 140, finalY);
//     doc.text(`Advance Paid: Rs. ${order.advance_paid.toLocaleString()}`, 140, finalY + 7);
//     doc.setFont("helvetica", "bold");
//     doc.text(`Balance Due: Rs. ${order.balance_due.toLocaleString()}`, 140, finalY + 14);

//     doc.save(`Receipt_ORD_${order.id}_${customerName}.pdf`);
//   };

//   const handleQuickAddCustomer = async () => {
//     if (!newCustomer.name || !newCustomer.phone) {
//       return toast({ title: "Required", description: "Name and Phone are mandatory", variant: "destructive" });
//     }
//     setIsAddingCustomer(true);
//     try {
//       const payload: any = { name: newCustomer.name, phone: newCustomer.phone };
//       if (newCustomer.email?.trim()) payload.email = newCustomer.email;
//       const res = await apiClient.post('/customers/', payload);
//       setCustomers(prev => [...prev, res.data]);
//       setSelectedCustomer(res.data); 
//       setIsCustomerModalOpen(false);
//       setNewCustomer({ name: '', phone: '', email: '' });
//       toast({ title: "Success", description: "Customer added and selected." });
//     } catch (err: any) {
//       toast({ title: "Failed", variant: "destructive" });
//     } finally {
//       setIsAddingCustomer(false);
//     }
//   };

//   const handleNext = () => {
//     if (currentStep === 1 && !selectedCustomer) return toast({ title: 'Select a customer', variant: 'destructive' });
//     if (currentStep === 2 && selectedGarments.length === 0) return toast({ title: 'Select a garment', variant: 'destructive' });
//     setCurrentStep(prev => prev + 1);
//   };

//   const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

//   const handleGarmentToggle = (garmentId: string) => {
//     setSelectedGarments(prev => {
//       const exists = prev.find(g => g.type === garmentId);
//       return exists ? prev.filter(g => g.type !== garmentId) : [...prev, { type: garmentId, quantity: 1 }];
//     });
//   };

//   const handleGarmentQuantity = (garmentId: string, delta: number) => {
//     setSelectedGarments(prev => prev.map(g => 
//       g.type === garmentId ? { ...g, quantity: Math.max(1, g.quantity + delta) } : g
//     ));
//   };

//   const handleSubmit = async () => {
//     if (!orderDetails.dueDate || !orderDetails.totalAmount) {
//       return toast({ title: 'Missing details', variant: 'destructive' });
//     }
//     setIsSubmitting(true);
//     try {
//       const totalItems = selectedGarments.reduce((sum, g) => sum + g.quantity, 0);
//       const payload = {
//         customer_id: selectedCustomer.id,
//         due_date: orderDetails.dueDate,
//         total_amount: parseFloat(orderDetails.totalAmount),
//         advance_paid: parseFloat(orderDetails.advancePayment || "0"),
//         status: "pending",
//         items: selectedGarments.flatMap(g => 
//           Array(g.quantity).fill(null).map(() => ({
//             garment_type: g.type,
//             price: parseFloat(orderDetails.totalAmount) / totalItems,
//             measurement_id: 1,
//             notes: orderDetails.fabricNotes,
//             status: "pending"
//           }))
//         )
//       };

//       const res = await apiClient.post('/orders/', payload);
      
//       // TRIGGER PDF AUTO-DOWNLOAD
//       generatePDF(res.data, selectedCustomer.name);

//       setCreatedOrderId(`ORD-${res.data.id}`);
//       setCreatedOrderUuid(res.data.public_id);
//       setShowSuccessModal(true);
//     } catch (err: any) {
//       toast({ title: "Order Failed", variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredCustomers = customers.filter(c =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
//   );

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto">
//         {/* Progress Bar */}
//         <div className="flex items-center justify-between mb-8 px-4">
//           {steps.map((step, idx) => (
//             <div key={step.id} className="flex items-center">
//               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", currentStep >= step.id ? "bg-primary border-primary text-white" : "border-muted text-muted-foreground")}>
//                 {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
//               </div>
//               {idx < steps.length - 1 && <div className={cn("h-0.5 w-12 sm:w-20 mx-2", currentStep > step.id ? "bg-primary" : "bg-muted")} />}
//             </div>
//           ))}
//         </div>

//         <div className="bg-card rounded-2xl shadow-luxury p-6 mb-6 relative min-h-[450px]">
//           {isSubmitting && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}

//           {currentStep === 1 && (
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold">Select Customer</h2>
//                 <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="gap-2 rounded-xl border-dashed">
//                       <UserPlus className="h-4 w-4" /> New Customer
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px] rounded-3xl">
//                     <DialogHeader><DialogTitle>Quick Register</DialogTitle></DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="space-y-2"><Label>Full Name *</Label><Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} /></div>
//                       <div className="space-y-2"><Label>Phone Number *</Label><Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} /></div>
//                     </div>
//                     <DialogFooter><Button onClick={handleQuickAddCustomer} disabled={isAddingCustomer} className="w-full">Save & Select</Button></DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 pl-10 rounded-xl" />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 {filteredCustomers.map(c => (
//                   <button key={c.id} onClick={() => setSelectedCustomer(c)} className={cn("p-4 border-2 rounded-xl text-left transition-all", selectedCustomer?.id === c.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50")}>
//                     <p className="font-bold">{c.name}</p>
//                     <p className="text-sm text-muted-foreground">{c.phone}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold">Select Garments</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {garmentTypes.map(g => {
//                   const selection = selectedGarments.find(s => s.type === g.id);
//                   return (
//                     <div key={g.id} className={cn("p-4 border-2 rounded-xl text-center transition-all", selection ? "border-primary bg-primary/5" : "border-border")}>
//                       <button onClick={() => handleGarmentToggle(g.id)} className="w-full">
//                         <Shirt className={cn("mx-auto mb-2 h-8 w-8", selection ? "text-primary" : "text-muted-foreground")} />
//                         <p className="font-bold">{g.name}</p>
//                       </button>
//                       {selection && (
//                         <div className="flex items-center justify-between mt-4 bg-background rounded-lg p-1 border shadow-sm">
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, -1)}><Minus className="h-4 w-4" /></Button>
//                           <span className="font-bold">{selection.quantity}</span>
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleGarmentQuantity(g.id, 1)}><Plus className="h-4 w-4" /></Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold">Measurements ({selectedGarments[0]?.type})</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
//                 {measurementFields[selectedGarments[0]?.type]?.map(f => (
//                   <div key={f.label} className="space-y-1">
//                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
//                     <Input type="number" placeholder={f.placeholder} value={measurements[f.label] || ''} onChange={e => setMeasurements({...measurements, [f.label]: e.target.value})} className="h-10 rounded-lg" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 4 && (
//             <div className="space-y-6">
//               <h2 className="text-xl font-bold">Order Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={orderDetails.dueDate} onChange={e => setOrderDetails({...orderDetails, dueDate: e.target.value})} className="rounded-xl" /></div>
//                 <div className="space-y-2"><Label>Total Amount (Rs.)</Label><Input type="number" value={orderDetails.totalAmount} onChange={e => setOrderDetails({...orderDetails, totalAmount: e.target.value})} className="rounded-xl" /></div>
//                 <div className="space-y-2"><Label>Advance Paid (Rs.)</Label><Input type="number" value={orderDetails.advancePayment} onChange={e => setOrderDetails({...orderDetails, advancePayment: e.target.value})} className="rounded-xl" /></div>
//               </div>
//               <div className="space-y-2"><Label>Fabric & Style Notes</Label><Textarea placeholder="Notes..." value={orderDetails.fabricNotes} onChange={e => setOrderDetails({...orderDetails, fabricNotes: e.target.value})} className="min-h-[100px] rounded-xl" /></div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center px-2">
//           <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="w-24 rounded-xl">Back</Button>
//           <Button onClick={currentStep === 4 ? handleSubmit : handleNext} disabled={isSubmitting} className={cn("w-32 rounded-xl", currentStep === 4 ? "bg-status-success hover:bg-status-success/90" : "")}>
//             {currentStep === 4 ? "Create Order" : "Next"}
//           </Button>
//         </div>
//       </div>

//       <OrderSuccessModal 
//         open={showSuccessModal} 
//         onClose={() => navigate('/orders')} 
//         orderId={createdOrderId} 
//         customerName={selectedCustomer?.name || ''} 
//         receiptUuid={createdOrderUuid} 
//       />
//     </Layout>
//   );
// }

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Layout } from '@/components/Layout';
// import apiClient from '@/api/client';
// import { 
//   Check, User, Shirt, Ruler, FileText, Plus, Minus, 
//   Loader2, UserPlus, Search 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Dialog, DialogContent, DialogHeader, DialogTitle, 
//   DialogTrigger, DialogFooter
// } from "@/components/ui/dialog";
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { OrderSuccessModal } from '@/components/OrderSuccessModal';

// // PDF LIBRARIES
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // --- Interfaces ---
// interface Customer {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string;
// }

// interface GarmentSelection {
//   type: string;
//   quantity: number;
// }

// interface ShopInfo {
//   name: string;
//   owner: string;
//   phone: string;
// }

// interface OrderResponse {
//   id: string;
//   public_id: string;
//   due_date: string;
//   total_amount: number;
//   advance_paid: number;
//   balance_due: number;
// }

// const steps = [
//   { id: 1, name: 'Customer', icon: User },
//   { id: 2, name: 'Garments', icon: Shirt },
//   { id: 3, name: 'Measurements', icon: Ruler },
//   { id: 4, name: 'Details', icon: FileText },
// ];

// const garmentTypes = [
//   { id: 'Shirt', name: 'Shirt' },
//   { id: 'Sherwani', name: 'Sherwani' },
//   { id: 'Pant', name: 'Pant' },
//   { id: 'Blazer', name: 'Blazer' },
//   { id: 'Vest', name: 'Vest' },
// ];

// const measurementFields: Record<string, { label: string; placeholder: string }[]> = {
//   Shirt: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }, { label: 'Length', placeholder: '30' }],
//   Sherwani: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Length', placeholder: '44' }],
//   Pant: [{ label: 'Waist', placeholder: '34' }, { label: 'Hips', placeholder: '40' }, { label: 'Length', placeholder: '42' }, { label: 'Thigh', placeholder: '24' }],
//   Blazer: [{ label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }],
//   Vest: [{ label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }],
// };

// export default function NewOrder() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [selectedGarments, setSelectedGarments] = useState<GarmentSelection[]>([]);
//   const [measurements, setMeasurements] = useState<Record<string, string>>({});
//   const [orderDetails, setOrderDetails] = useState({
//     dueDate: '',
//     fabricNotes: '',
//     totalAmount: '',
//     advancePayment: '',
//   });

//   const [shopInfo, setShopInfo] = useState<ShopInfo>({ name: 'Tailor Shop', owner: 'Owner', phone: '' });
//   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
//   const [isAddingCustomer, setIsAddingCustomer] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [createdOrderId, setCreatedOrderId] = useState('');
//   const [createdOrderUuid, setCreatedOrderUuid] = useState('');

//   // 1. Fetch Customers and Shop Info
//   useEffect(() => {
//     const initData = async () => {
//       try {
//         const [custRes, shopRes, userRes] = await Promise.all([
//           apiClient.get<Customer[]>('/customers/'),
//           apiClient.get('/shops/my-shop'),
//           apiClient.get('/users/me')
//         ]);
//         setCustomers(custRes.data);
//         setShopInfo({
//           name: shopRes.data.name,
//           owner: userRes.data.name,
//           phone: shopRes.data.phone || userRes.data.phone
//         });
//       } catch (err) {
//         console.error("Failed to load initial data", err);
//       }
//     };
//     initData();
//   }, []);

//   // 2. FIXED: Fetch Existing Measurements - Dependency logic improved
//   const isAtMeasurementStep = currentStep === 3;
//   useEffect(() => {
//     const fetchExistingMeasurements = async () => {
//       if (!selectedCustomer || selectedGarments.length === 0 || !isAtMeasurementStep) return;
      
//       const primaryGarment = selectedGarments[0].type;
//       try {
//         const res = await apiClient.get(`/measurements/customer/${selectedCustomer.id}`);
//         if (res.data && res.data.length > 0) {
//           const latestForType = [...res.data]
//             .reverse()
//             .find((m: { garment_type: string; data_values: Record<string, string> }) => m.garment_type === primaryGarment);

//           if (latestForType) {
//             setMeasurements(latestForType.data_values || {}); 
//             toast({ description: `Loaded previous ${primaryGarment} measurements.` });
//           } else {
//             setMeasurements({});
//           }
//         }
//       } catch (err) {
//         setMeasurements({});
//       }
//     };
//     fetchExistingMeasurements();
//   }, [selectedCustomer, isAtMeasurementStep, selectedGarments, toast]);

//   // Balance Calculation
//   const balanceToPay = useMemo(() => {
//     const total = parseFloat(orderDetails.totalAmount || "0");
//     const advance = parseFloat(orderDetails.advancePayment || "0");
//     return (total - advance).toLocaleString();
//   }, [orderDetails.totalAmount, orderDetails.advancePayment]);

//   // 3. FIXED: PDF Layout to prevent overwriting/overlap
//   const generatePDF = useCallback((order: OrderResponse, customerName: string, garments: GarmentSelection[]) => {
//     const doc = new jsPDF();
//     doc.setFontSize(22);
//     doc.setTextColor(30, 41, 59);
//     doc.text(shopInfo.name.toUpperCase(), 105, 15, { align: "center" });
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(`Owner: ${shopInfo.owner} | Contact: ${shopInfo.phone}`, 105, 22, { align: "center" });
//     doc.setDrawColor(226, 232, 240);
//     doc.line(15, 28, 195, 28);

//     doc.setTextColor(0);
//     doc.setFontSize(11);
//     doc.text(`Order ID: ORD-${order.id}`, 15, 40);
//     doc.text(`Customer: ${customerName}`, 15, 46);
//     doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 140, 40);
//     doc.text(`Due Date: ${order.due_date}`, 140, 46);

//     autoTable(doc, {
//       startY: 55,
//       head: [['Garment Item', 'Qty', 'Unit Price', 'Subtotal']],
//       body: garments.map(g => {
//         const totalItems = garments.reduce((a,b) => a + b.quantity, 0);
//         const unitPrice = parseFloat(orderDetails.totalAmount) / totalItems;
//         return [
//           g.type.toUpperCase(),
//           g.quantity.toString(),
//           `Rs. ${unitPrice.toFixed(0)}`,
//           `Rs. ${(unitPrice * g.quantity).toFixed(0)}`
//         ];
//       }),
//       headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
//       theme: 'striped'
//     });

//     const finalY = (doc as any).lastAutoTable.finalY + 15;
//     doc.setFontSize(10);
    
//     // Adjusted X positions to ensure labels and values don't overlap
//     doc.text(`Total Amount:`, 125, finalY);
//     doc.text(`Rs. ${order.total_amount.toLocaleString()}`, 190, finalY, { align: 'right' });
    
//     doc.text(`Advance Paid:`, 125, finalY + 8);
//     doc.text(`Rs. ${order.advance_paid.toLocaleString()}`, 190, finalY + 8, { align: 'right' });
    
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.text(`Balance Due:`, 125, finalY + 18);
//     doc.text(`Rs. ${order.balance_due.toLocaleString()}`, 190, finalY + 18, { align: 'right' });
    
//     doc.save(`Receipt_${customerName}_${order.id}.pdf`);
//   }, [shopInfo, orderDetails.totalAmount]);

//   // Handlers
//   const handleQuickAddCustomer = async () => {
//     if (!newCustomer.name || !newCustomer.phone) return;
//     setIsAddingCustomer(true);
//     try {
//       const payload: Partial<Customer> = { name: newCustomer.name, phone: newCustomer.phone };
//       if (newCustomer.email?.trim()) payload.email = newCustomer.email;
//       const res = await apiClient.post<Customer>('/customers/', payload);
//       setCustomers(prev => [...prev, res.data]);
//       setSelectedCustomer(res.data);
//       setIsCustomerModalOpen(false);
//       setNewCustomer({ name: '', phone: '', email: '' });
//     } catch (err) { 
//       toast({ title: "Failed to add customer", variant: "destructive" }); 
//     } finally { 
//       setIsAddingCustomer(false); 
//     }
//   };

//   const handleSubmit = async () => {
//     if (!orderDetails.dueDate || !orderDetails.totalAmount || !selectedCustomer) {
//       toast({ title: "Missing Info", description: "Please fill date and amount", variant: "destructive" });
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const measRes = await apiClient.post('/measurements/', {
//         customer_id: selectedCustomer.id,
//         garment_type: selectedGarments[0].type,
//         data_values: measurements
//       });

//       const totalItems = selectedGarments.reduce((sum, g) => sum + g.quantity, 0);
//       const payload = {
//         customer_id: selectedCustomer.id,
//         due_date: orderDetails.dueDate,
//         total_amount: parseFloat(orderDetails.totalAmount),
//         advance_paid: parseFloat(orderDetails.advancePayment || "0"),
//         status: "pending",
//         items: selectedGarments.flatMap(g => 
//           Array(g.quantity).fill(null).map(() => ({
//             garment_type: g.type,
//             price: parseFloat(orderDetails.totalAmount) / totalItems,
//             measurement_id: measRes.data.id,
//             notes: orderDetails.fabricNotes,
//             status: "pending"
//           }))
//         )
//       };

//       const res = await apiClient.post<OrderResponse>('/orders/', payload);
//       setCreatedOrderId(`ORD-${res.data.id}`);
//       setCreatedOrderUuid(res.data.public_id);
//       generatePDF(res.data, selectedCustomer.name, selectedGarments);
//       setShowSuccessModal(true);
//     } catch (err) { 
//       toast({ title: "Order Failed", description: "Check backend logs", variant: "destructive" }); 
//     } finally { 
//       setIsSubmitting(false); 
//     }
//   };

//   return (
//     <Layout title="New Order">
//       <div className="max-w-4xl mx-auto pb-20">
//         <div className="flex items-center justify-between mb-8 px-4">
//           {steps.map((step, idx) => (
//             <div key={step.id} className="flex items-center">
//               <div className={cn(
//                 "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", 
//                 currentStep >= step.id ? "bg-primary border-primary text-white" : "border-muted text-muted-foreground"
//               )}>
//                 {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
//               </div>
//               {idx < steps.length - 1 && (
//                 <div className={cn("h-0.5 w-12 sm:w-20 mx-2", currentStep > step.id ? "bg-primary" : "bg-muted")} />
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="bg-card rounded-2xl shadow-luxury p-6 mb-6 relative min-h-[450px] border">
//           {isSubmitting && (
//             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
//               <Loader2 className="animate-spin h-12 w-12 text-primary mb-2" />
//               <p className="font-medium">Saving Order...</p>
//             </div>
//           )}

//           {currentStep === 1 && (
//             <div className="space-y-4 animate-in fade-in duration-300">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold">Select Customer</h2>
//                 <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="gap-2 rounded-xl border-dashed">
//                       <UserPlus className="h-4 w-4" /> New Customer
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px] rounded-3xl">
//                     <DialogHeader><DialogTitle>Quick Register</DialogTitle></DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="space-y-2"><Label>Full Name *</Label><Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} /></div>
//                       <div className="space-y-2"><Label>Phone Number *</Label><Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} /></div>
//                     </div>
//                     <DialogFooter>
//                       <Button onClick={handleQuickAddCustomer} disabled={isAddingCustomer} className="w-full rounded-xl">Save & Select</Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 pl-10 rounded-xl" />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)).map(c => (
//                   <button key={c.id} onClick={() => setSelectedCustomer(c)} className={cn("p-4 border-2 rounded-xl text-left transition-all", selectedCustomer?.id === c.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50")}>
//                     <p className="font-bold">{c.name}</p>
//                     <p className="text-sm text-muted-foreground">{c.phone}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="space-y-4 animate-in fade-in duration-300">
//               <h2 className="text-xl font-bold">Select Garments</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {garmentTypes.map(g => {
//                   const selection = selectedGarments.find(s => s.type === g.id);
//                   return (
//                     <div key={g.id} className={cn("p-4 border-2 rounded-xl text-center transition-all", selection ? "border-primary bg-primary/5" : "border-border")}>
//                       <button onClick={() => {
//                         const exists = selectedGarments.find(s => s.type === g.id);
//                         if (exists) {
//                            setSelectedGarments(selectedGarments.filter(s => s.type !== g.id));
//                         } else {
//                            setSelectedGarments([...selectedGarments, { type: g.id, quantity: 1 }]);
//                         }
//                       }} className="w-full">
//                         <Shirt className={cn("mx-auto mb-2 h-8 w-8", selection ? "text-primary" : "text-muted-foreground")} />
//                         <p className="font-bold">{g.name}</p>
//                       </button>
//                       {selection && (
//                         <div className="flex items-center justify-between mt-4 bg-background rounded-lg p-1 border shadow-sm">
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedGarments(selectedGarments.map(s => s.type === g.id ? {...s, quantity: Math.max(1, s.quantity - 1)} : s))}><Minus className="h-4 w-4" /></Button>
//                           <span className="font-bold">{selection.quantity}</span>
//                           <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedGarments(selectedGarments.map(s => s.type === g.id ? {...s, quantity: s.quantity + 1} : s))}><Plus className="h-4 w-4" /></Button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div className="space-y-4 animate-in fade-in duration-300">
//               <h2 className="text-xl font-bold">Measurements ({selectedGarments[0]?.type})</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
//                 {measurementFields[selectedGarments[0]?.type]?.map(f => (
//                   <div key={f.label} className="space-y-1">
//                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
//                     <Input 
//                       type="number" 
//                       placeholder={f.placeholder}
//                       value={measurements[f.label] || ''} 
//                       onChange={e => setMeasurements({...measurements, [f.label]: e.target.value})} 
//                       className="h-10 rounded-lg focus:ring-primary" 
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {currentStep === 4 && (
//             <div className="space-y-6 animate-in fade-in duration-300">
//               <h2 className="text-xl font-bold">Order Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Due Date</Label>
//                   <Input type="date" value={orderDetails.dueDate} onChange={e => setOrderDetails({...orderDetails, dueDate: e.target.value})} className="rounded-xl" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Total Amount (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.totalAmount} onChange={e => setOrderDetails({...orderDetails, totalAmount: e.target.value})} className="rounded-xl" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Advance Paid (Rs.)</Label>
//                   <Input type="number" placeholder="0.00" value={orderDetails.advancePayment} onChange={e => setOrderDetails({...orderDetails, advancePayment: e.target.value})} className="rounded-xl" />
//                 </div>
//                 <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between">
//                   <span className="text-sm font-medium">Balance to Pay:</span>
//                   <span className="text-lg font-bold text-primary">Rs. {balanceToPay}</span>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Fabric & Style Notes</Label>
//                 <Textarea value={orderDetails.fabricNotes} onChange={e => setOrderDetails({...orderDetails, fabricNotes: e.target.value})} placeholder="e.g. Double pocket, slim fit..." className="min-h-[100px] rounded-xl" />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center px-2">
//           <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1 || isSubmitting} className="w-24 rounded-xl">Back</Button>
//           <Button onClick={() => {
//               if (currentStep === 1 && !selectedCustomer) {
//                 toast({ title: "Selection Required", description: "Please select a customer first", variant: "destructive" });
//                 return;
//               }
//               if (currentStep === 2 && selectedGarments.length === 0) {
//                 toast({ title: "Selection Required", description: "Select at least one garment", variant: "destructive" });
//                 return;
//               }
//               if (currentStep === 4) {
//                 handleSubmit();
//               } else {
//                 setCurrentStep(s => s + 1);
//               }
//             }} 
//             disabled={isSubmitting} 
//             className={cn("w-32 rounded-xl shadow-lg", currentStep === 4 ? "bg-status-success hover:bg-status-success/90" : "bg-primary")}
//           >
//             {currentStep === 4 ? "Create Order" : "Next"}
//           </Button>
//         </div>
//       </div>

//       <OrderSuccessModal 
//         open={showSuccessModal} 
//         onClose={() => {
//           setShowSuccessModal(false);
//           navigate('/orders');
//         }} 
//         orderId={createdOrderId} 
//         customerName={selectedCustomer?.name || ''} 
//         receiptUuid={createdOrderUuid} 
//       />
//     </Layout>
//   );
// }

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { 
  Check, User, Shirt, Ruler, FileText, Plus, Minus, 
  Loader2, UserPlus, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';

// PDF LIBRARIES
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Interfaces ---
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface GarmentSelection {
  type: string;
  quantity: number;
}

interface ShopInfo {
  name: string;
  owner: string;
  phone: string;
}

interface OrderResponse {
  id: string;
  public_id: string;
  due_date: string;
  total_amount: number;
  advance_paid: number;
  balance_due: number;
}

interface MeasurementResponse {
  garment_type: string;
  data_values: Record<string, string>;
}

// Added for jsPDF internal state tracking
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const steps = [
  { id: 1, name: 'Customer', icon: User },
  { id: 2, name: 'Garments', icon: Shirt },
  { id: 3, name: 'Measurements', icon: Ruler },
  { id: 4, name: 'Details', icon: FileText },
];

const garmentTypes = [
  { id: 'Shirt', name: 'Shirt' },
  { id: 'Sherwani', name: 'Sherwani' },
  { id: 'Pant', name: 'Pant' },
  { id: 'Blazer', name: 'Blazer' },
  { id: 'Vest', name: 'Vest' },
];

const measurementFields: Record<string, { label: string; placeholder: string }[]> = {
  Shirt: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }, { label: 'Length', placeholder: '30' }],
  Sherwani: [{ label: 'Neck', placeholder: '15.5' }, { label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Length', placeholder: '44' }],
  Pant: [{ label: 'Waist', placeholder: '34' }, { label: 'Hips', placeholder: '40' }, { label: 'Length', placeholder: '42' }, { label: 'Thigh', placeholder: '24' }],
  Blazer: [{ label: 'Chest', placeholder: '40' }, { label: 'Shoulders', placeholder: '18' }, { label: 'Sleeve', placeholder: '25' }],
  Vest: [{ label: 'Chest', placeholder: '40' }, { label: 'Waist', placeholder: '34' }],
};

export default function NewOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedGarments, setSelectedGarments] = useState<GarmentSelection[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [orderDetails, setOrderDetails] = useState({
    dueDate: '',
    fabricNotes: '',
    totalAmount: '',
    advancePayment: '',
  });

  const [shopInfo, setShopInfo] = useState<ShopInfo>({ name: 'Tailor Shop', owner: 'Owner', phone: '' });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [createdOrderUuid, setCreatedOrderUuid] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        const [custRes, shopRes, userRes] = await Promise.all([
          apiClient.get<Customer[]>('/customers/'),
          apiClient.get('/shops/my-shop'),
          apiClient.get('/users/me')
        ]);
        setCustomers(custRes.data);
        setShopInfo({
          name: shopRes.data.name,
          owner: userRes.data.name,
          phone: shopRes.data.phone || userRes.data.phone
        });
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    initData();
  }, []);

  const isAtMeasurementStep = currentStep === 3;
  
  // FIXED: Fetching logic wrapped to satisfy ESLint dependencies
  const fetchExistingMeasurements = useCallback(async () => {
    if (!selectedCustomer || selectedGarments.length === 0 || !isAtMeasurementStep) return;
    
    const primaryGarment = selectedGarments[0].type;
    try {
      const res = await apiClient.get<MeasurementResponse[]>(`/measurements/customer/${selectedCustomer.id}`);
      if (res.data && res.data.length > 0) {
        const latestForType = [...res.data]
          .reverse()
          .find((m) => m.garment_type === primaryGarment);

        if (latestForType) {
          setMeasurements(latestForType.data_values || {}); 
          toast({ description: `Loaded previous ${primaryGarment} measurements.` });
        } else {
          setMeasurements({});
        }
      }
    } catch (err) {
      setMeasurements({});
    }
  }, [selectedCustomer, isAtMeasurementStep, selectedGarments, toast]);

  useEffect(() => {
    fetchExistingMeasurements();
  }, [fetchExistingMeasurements]);

  const balanceToPay = useMemo(() => {
    const total = parseFloat(orderDetails.totalAmount || "0");
    const advance = parseFloat(orderDetails.advancePayment || "0");
    return (total - advance).toLocaleString();
  }, [orderDetails.totalAmount, orderDetails.advancePayment]);

  // FIXED: Removed any by using ExtendedJsPDF interface
  const generatePDF = useCallback((order: OrderResponse, customerName: string, garments: GarmentSelection[]) => {
    const doc = new jsPDF() as ExtendedJsPDF;
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text(shopInfo.name.toUpperCase(), 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Owner: ${shopInfo.owner} | Contact: ${shopInfo.phone}`, 105, 22, { align: "center" });
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 28, 195, 28);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Order ID: ORD-${order.id}`, 15, 40);
    doc.text(`Customer: ${customerName}`, 15, 46);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 140, 40);
    doc.text(`Due Date: ${order.due_date}`, 140, 46);

    autoTable(doc, {
      startY: 55,
      head: [['Garment Item', 'Qty', 'Unit Price', 'Subtotal']],
      body: garments.map(g => {
        const totalItems = garments.reduce((a,b) => a + b.quantity, 0);
        const unitPrice = parseFloat(orderDetails.totalAmount) / totalItems;
        return [
          g.type.toUpperCase(),
          g.quantity.toString(),
          `Rs. ${unitPrice.toFixed(0)}`,
          `Rs. ${(unitPrice * g.quantity).toFixed(0)}`
        ];
      }),
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      theme: 'striped'
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    
    doc.text(`Total Amount:`, 125, finalY);
    doc.text(`Rs. ${order.total_amount.toLocaleString()}`, 190, finalY, { align: 'right' });
    
    doc.text(`Advance Paid:`, 125, finalY + 8);
    doc.text(`Rs. ${order.advance_paid.toLocaleString()}`, 190, finalY + 8, { align: 'right' });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Balance Due:`, 125, finalY + 18);
    doc.text(`Rs. ${order.balance_due.toLocaleString()}`, 190, finalY + 18, { align: 'right' });
    
    doc.save(`Receipt_${customerName}_${order.id}.pdf`);
  }, [shopInfo, orderDetails.totalAmount]);

  const handleQuickAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    setIsAddingCustomer(true);
    try {
      const payload: Partial<Customer> = { name: newCustomer.name, phone: newCustomer.phone };
      if (newCustomer.email?.trim()) payload.email = newCustomer.email;
      const res = await apiClient.post<Customer>('/customers/', payload);
      setCustomers(prev => [...prev, res.data]);
      setSelectedCustomer(res.data);
      setIsCustomerModalOpen(false);
      setNewCustomer({ name: '', phone: '', email: '' });
    } catch (err) { 
      toast({ title: "Failed to add customer", variant: "destructive" }); 
    } finally { 
      setIsAddingCustomer(false); 
    }
  };

  const handleSubmit = async () => {
    if (!orderDetails.dueDate || !orderDetails.totalAmount || !selectedCustomer) {
      toast({ title: "Missing Info", description: "Please fill date and amount", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const measRes = await apiClient.post<{id: string}>('/measurements/', {
        customer_id: selectedCustomer.id,
        garment_type: selectedGarments[0].type,
        data_values: measurements
      });

      const totalItems = selectedGarments.reduce((sum, g) => sum + g.quantity, 0);
      const payload = {
        customer_id: selectedCustomer.id,
        due_date: orderDetails.dueDate,
        total_amount: parseFloat(orderDetails.totalAmount),
        advance_paid: parseFloat(orderDetails.advancePayment || "0"),
        status: "pending",
        items: selectedGarments.flatMap(g => 
          Array(g.quantity).fill(null).map(() => ({
            garment_type: g.type,
            price: parseFloat(orderDetails.totalAmount) / totalItems,
            measurement_id: measRes.data.id,
            notes: orderDetails.fabricNotes,
            status: "pending"
          }))
        )
      };

      const res = await apiClient.post<OrderResponse>('/orders/', payload);
      setCreatedOrderId(`ORD-${res.data.id}`);
      setCreatedOrderUuid(res.data.public_id);
      generatePDF(res.data, selectedCustomer.name, selectedGarments);
      setShowSuccessModal(true);
    } catch (err) { 
      toast({ title: "Order Failed", description: "Check backend logs", variant: "destructive" }); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <Layout title="New Order">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", 
                currentStep >= step.id ? "bg-primary border-primary text-white" : "border-muted text-muted-foreground"
              )}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              {idx < steps.length - 1 && (
                <div className={cn("h-0.5 w-12 sm:w-20 mx-2", currentStep > step.id ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-luxury p-6 mb-6 relative min-h-[450px] border">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="animate-spin h-12 w-12 text-primary mb-2" />
              <p className="font-medium">Saving Order...</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Select Customer</h2>
                <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-xl border-dashed">
                      <UserPlus className="h-4 w-4" /> New Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader><DialogTitle>Quick Register</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2"><Label>Full Name *</Label><Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Phone Number *</Label><Input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} /></div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleQuickAddCustomer} disabled={isAddingCustomer} className="w-full rounded-xl">Save & Select</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 pl-10 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)).map(c => (
                  <button key={c.id} onClick={() => setSelectedCustomer(c)} className={cn("p-4 border-2 rounded-xl text-left transition-all", selectedCustomer?.id === c.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50")}>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold">Select Garments</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {garmentTypes.map(g => {
                  const selection = selectedGarments.find(s => s.type === g.id);
                  return (
                    <div key={g.id} className={cn("p-4 border-2 rounded-xl text-center transition-all", selection ? "border-primary bg-primary/5" : "border-border")}>
                      <button onClick={() => {
                        const exists = selectedGarments.find(s => s.type === g.id);
                        if (exists) {
                           setSelectedGarments(selectedGarments.filter(s => s.type !== g.id));
                        } else {
                           setSelectedGarments([...selectedGarments, { type: g.id, quantity: 1 }]);
                        }
                      }} className="w-full">
                        <Shirt className={cn("mx-auto mb-2 h-8 w-8", selection ? "text-primary" : "text-muted-foreground")} />
                        <p className="font-bold">{g.name}</p>
                      </button>
                      {selection && (
                        <div className="flex items-center justify-between mt-4 bg-background rounded-lg p-1 border shadow-sm">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedGarments(selectedGarments.map(s => s.type === g.id ? {...s, quantity: Math.max(1, s.quantity - 1)} : s))}><Minus className="h-4 w-4" /></Button>
                          <span className="font-bold">{selection.quantity}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedGarments(selectedGarments.map(s => s.type === g.id ? {...s, quantity: s.quantity + 1} : s))}><Plus className="h-4 w-4" /></Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold">Measurements ({selectedGarments[0]?.type})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                {measurementFields[selectedGarments[0]?.type]?.map(f => (
                  <div key={f.label} className="space-y-1">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                    <Input 
                      type="number" 
                      placeholder={f.placeholder}
                      value={measurements[f.label] || ''} 
                      onChange={e => setMeasurements({...measurements, [f.label]: e.target.value})} 
                      className="h-10 rounded-lg focus:ring-primary" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold">Order Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={orderDetails.dueDate} onChange={e => setOrderDetails({...orderDetails, dueDate: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount (Rs.)</Label>
                  <Input type="number" placeholder="0.00" value={orderDetails.totalAmount} onChange={e => setOrderDetails({...orderDetails, totalAmount: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Advance Paid (Rs.)</Label>
                  <Input type="number" placeholder="0.00" value={orderDetails.advancePayment} onChange={e => setOrderDetails({...orderDetails, advancePayment: e.target.value})} className="rounded-xl" />
                </div>
                <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-medium">Balance to Pay:</span>
                  <span className="text-lg font-bold text-primary">Rs. {balanceToPay}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fabric & Style Notes</Label>
                <Textarea value={orderDetails.fabricNotes} onChange={e => setOrderDetails({...orderDetails, fabricNotes: e.target.value})} placeholder="e.g. Double pocket, slim fit..." className="min-h-[100px] rounded-xl" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-2">
          <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1 || isSubmitting} className="w-24 rounded-xl">Back</Button>
          <Button onClick={() => {
              if (currentStep === 1 && !selectedCustomer) {
                toast({ title: "Selection Required", description: "Please select a customer first", variant: "destructive" });
                return;
              }
              if (currentStep === 2 && selectedGarments.length === 0) {
                toast({ title: "Selection Required", description: "Select at least one garment", variant: "destructive" });
                return;
              }
              if (currentStep === 4) {
                handleSubmit();
              } else {
                setCurrentStep(s => s + 1);
              }
            }} 
            disabled={isSubmitting} 
            className={cn("w-32 rounded-xl shadow-lg", currentStep === 4 ? "bg-status-success hover:bg-status-success/90" : "bg-primary")}
          >
            {currentStep === 4 ? "Create Order" : "Next"}
          </Button>
        </div>
      </div>

      <OrderSuccessModal 
        open={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/orders');
        }} 
        orderId={createdOrderId} 
        customerName={selectedCustomer?.name || ''} 
        receiptUuid={createdOrderUuid} 
      />
    </Layout>
  );
}