import { Layout } from '@/components/Layout';
import { User, Store, Bell, CreditCard, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <Layout title="Settings">
      <div className="max-w-3xl space-y-8">
        {/* Profile Section */}
        <section className="bg-card rounded-2xl shadow-luxury p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your account details</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Master Tailor" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="tailor@stitchcraft.com" className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="+91 98765 43210" className="h-11 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Shop Details */}
        <section className="bg-card rounded-2xl shadow-luxury p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Shop Details</h2>
              <p className="text-sm text-muted-foreground">Information displayed on receipts</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Shop Name</Label>
              <Input defaultValue="StitchCraft Tailors" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Shop Address</Label>
              <Input defaultValue="123, Fashion Street, Mumbai - 400001" className="h-11 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input defaultValue="27AABCS1429B1ZS" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Shop Phone</Label>
                <Input defaultValue="+91 22 2345 6789" className="h-11 rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card rounded-2xl shadow-luxury p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure alerts and reminders</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-card-foreground">Order Due Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about upcoming due dates</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-card-foreground">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Alerts for pending payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-card-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Send SMS updates to customers</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end">
          <Button className="h-11 px-8 rounded-xl">Save Changes</Button>
        </div>
      </div>
    </Layout>
  );
}
