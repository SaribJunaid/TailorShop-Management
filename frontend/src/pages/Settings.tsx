// import { Layout } from '@/components/Layout';
// import { User, Store, Bell, CreditCard, Shield, Palette } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Separator } from '@/components/ui/separator';

// export default function Settings() {
//   return (
//     <Layout title="Settings">
//       <div className="max-w-3xl space-y-8">
//         {/* Profile Section */}
//         <section className="bg-card rounded-2xl shadow-luxury p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
//               <User className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-card-foreground">Profile</h2>
//               <p className="text-sm text-muted-foreground">Manage your account details</p>
//             </div>
//           </div>

//           <div className="grid gap-4">
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Full Name</Label>
//                 <Input defaultValue="Master Tailor" className="h-11 rounded-xl" />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <Input defaultValue="tailor@stitchcraft.com" className="h-11 rounded-xl" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Phone</Label>
//               <Input defaultValue="+91 98765 43210" className="h-11 rounded-xl" />
//             </div>
//           </div>
//         </section>

//         {/* Shop Details */}
//         <section className="bg-card rounded-2xl shadow-luxury p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
//               <Store className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-card-foreground">Shop Details</h2>
//               <p className="text-sm text-muted-foreground">Information displayed on receipts</p>
//             </div>
//           </div>

//           <div className="grid gap-4">
//             <div className="space-y-2">
//               <Label>Shop Name</Label>
//               <Input defaultValue="StitchCraft Tailors" className="h-11 rounded-xl" />
//             </div>
//             <div className="space-y-2">
//               <Label>Shop Address</Label>
//               <Input defaultValue="123, Fashion Street, Mumbai - 400001" className="h-11 rounded-xl" />
//             </div>
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>GST Number</Label>
//                 <Input defaultValue="27AABCS1429B1ZS" className="h-11 rounded-xl" />
//               </div>
//               <div className="space-y-2">
//                 <Label>Shop Phone</Label>
//                 <Input defaultValue="+91 22 2345 6789" className="h-11 rounded-xl" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Notifications */}
//         <section className="bg-card rounded-2xl shadow-luxury p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
//               <Bell className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-card-foreground">Notifications</h2>
//               <p className="text-sm text-muted-foreground">Configure alerts and reminders</p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between py-2">
//               <div>
//                 <p className="font-medium text-card-foreground">Order Due Reminders</p>
//                 <p className="text-sm text-muted-foreground">Get notified about upcoming due dates</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between py-2">
//               <div>
//                 <p className="font-medium text-card-foreground">Payment Reminders</p>
//                 <p className="text-sm text-muted-foreground">Alerts for pending payments</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between py-2">
//               <div>
//                 <p className="font-medium text-card-foreground">SMS Notifications</p>
//                 <p className="text-sm text-muted-foreground">Send SMS updates to customers</p>
//               </div>
//               <Switch />
//             </div>
//           </div>
//         </section>

//         {/* Save button */}
//         <div className="flex justify-end">
//           <Button className="h-11 px-8 rounded-xl">Save Changes</Button>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// import { useState, useEffect } from 'react';
// import { Layout } from '@/components/Layout';
// import { User as UserIcon, Store, Bell, Loader2, Save, MapPin, Phone, Hash } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Separator } from '@/components/ui/separator';
// import apiClient from '@/api/client';
// import { useToast } from '@/hooks/use-toast';

// export default function Settings() {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   const [userData, setUserData] = useState({ name: '', phone: '' });
//   const [shopData, setShopData] = useState({
//     id: null,
//     name: '',
//     address: '',
//     phone: '',
//     gst_number: '', 
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [userRes, shopRes] = await Promise.all([
//           apiClient.get('/users/me'),
//           apiClient.get('/shops/my-shop')
//         ]);
//         setUserData({ name: userRes.data.name, phone: userRes.data.phone });
//         setShopData(shopRes.data);
//       } catch (err) {
//         toast({ title: "Error", description: "Could not load settings.", variant: "destructive" });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       await Promise.all([
//         apiClient.put('/users/me', userData),
//         apiClient.put(`/shops/${shopData.id}`, shopData)
//       ]);
//       toast({ title: "Settings Saved", description: "Your profile and shop details are updated." });
//     } catch (err) {
//       toast({ title: "Update Failed", description: "Please check your inputs.", variant: "destructive" });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex h-[60vh] items-center justify-center">
//           <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto space-y-8 pb-12">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//           <p className="text-muted-foreground">Manage your tailor shop and account preferences.</p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
//           <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
//             <UserIcon className="h-5 w-5 text-primary" />
//             <h2 className="font-semibold">Personal Profile</h2>
//           </div>
//           <div className="p-6 grid gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Owner Name</Label>
//               <Input 
//                 value={userData.name} 
//                 onChange={e => setUserData({...userData, name: e.target.value})}
//                 placeholder="Enter your name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Personal Phone</Label>
//               <Input 
//                 value={userData.phone} 
//                 onChange={e => setUserData({...userData, phone: e.target.value})}
//                 placeholder="+92..."
//               />
//             </div>
//           </div>
//         </div>

//         {/* Shop Card */}
//         <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
//           <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
//             <Store className="h-5 w-5 text-primary" />
//             <h2 className="font-semibold">Shop Information</h2>
//           </div>
//           <div className="p-6 space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label>Shop Name (on Receipt)</Label>
//                 <Input 
//                   value={shopData.name} 
//                   onChange={e => setShopData({...shopData, name: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Shop Contact Number</Label>
//                 <Input 
//                   value={shopData.phone} 
//                   onChange={e => setShopData({...shopData, phone: e.target.value})}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Address</Label>
//               <Input 
//                 value={shopData.address} 
//                 onChange={e => setShopData({...shopData, address: e.target.value})}
//                 placeholder="Full shop address..."
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Tax/GST Number (Optional)</Label>
//               <Input 
//                 value={shopData.gst_number || ''} 
//                 onChange={e => setShopData({...shopData, gst_number: e.target.value})}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Preferences */}
//         <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
//           <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
//             <Bell className="h-5 w-5 text-primary" />
//             <h2 className="font-semibold">Preferences</h2>
//           </div>
//           <div className="p-6 space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <p className="font-medium">SMS Notifications</p>
//                 <p className="text-sm text-muted-foreground">Send auto-updates to customers on order completion.</p>
//               </div>
//               <Switch />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <p className="font-medium">Daily Summary</p>
//                 <p className="text-sm text-muted-foreground">Get an email report of today's earnings.</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
//           <Button onClick={handleSave} disabled={isSaving} className="min-w-[150px]">
//             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// }
import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { User as UserIcon, Store, Bell, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import apiClient from '@/api/client';
import { useToast } from '@/hooks/use-toast';

// Defined strict interfaces to resolve "Unexpected any" errors
interface UserProfile {
  name: string;
  phone: string;
}

interface ShopProfile {
  id: number | null;
  name: string;
  address: string;
  phone: string;
  gst_number: string;
}

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [userData, setUserData] = useState<UserProfile>({ name: '', phone: '' });
  const [shopData, setShopData] = useState<ShopProfile>({
    id: null,
    name: '',
    address: '',
    phone: '',
    gst_number: '', 
  });

  // FIXED: Wrapped loadData in useCallback to safely include 'toast' in dependency array
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [userRes, shopRes] = await Promise.all([
        apiClient.get<UserProfile>('/users/me'),
        apiClient.get<ShopProfile>('/shops/my-shop')
      ]);
      setUserData({ name: userRes.data.name, phone: userRes.data.phone });
      setShopData(shopRes.data);
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Could not load settings.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!shopData.id) return;
    
    setIsSaving(true);
    try {
      await Promise.all([
        apiClient.put('/users/me', userData),
        apiClient.put(`/shops/${shopData.id}`, shopData)
      ]);
      toast({ 
        title: "Settings Saved", 
        description: "Your profile and shop details are updated." 
      });
    } catch (err) {
      toast({ 
        title: "Update Failed", 
        description: "Please check your inputs.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Settings">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings">
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your tailor shop and account preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Personal Profile</h2>
          </div>
          <div className="p-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Owner Name</Label>
              <Input 
                value={userData.name} 
                onChange={e => setUserData({...userData, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Personal Phone</Label>
              <Input 
                value={userData.phone} 
                onChange={e => setUserData({...userData, phone: e.target.value})}
                placeholder="+92..."
              />
            </div>
          </div>
        </div>

        {/* Shop Card */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Shop Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Shop Name (on Receipt)</Label>
                <Input 
                  value={shopData.name} 
                  onChange={e => setShopData({...shopData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Shop Contact Number</Label>
                <Input 
                  value={shopData.phone} 
                  onChange={e => setShopData({...shopData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={shopData.address} 
                onChange={e => setShopData({...shopData, address: e.target.value})}
                placeholder="Full shop address..."
              />
            </div>
            <div className="space-y-2">
              <Label>Tax/GST Number (Optional)</Label>
              <Input 
                value={shopData.gst_number || ''} 
                onChange={e => setShopData({...shopData, gst_number: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Send auto-updates to customers on order completion.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Get an email report of today's earnings.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[150px]">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}