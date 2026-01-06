import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/data/mockData';

interface AddCustomerModalProps {
  onCustomerAdded: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

export function AddCustomerModal({ onCustomerAdded, trigger }: AddCustomerModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter customer name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newCustomer: Customer = {
      id: `new-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      address: formData.address || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
    };

    onCustomerAdded(newCustomer);
    
    toast({
      title: 'Customer Added!',
      description: `${formData.name} has been added successfully.`,
    });

    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="h-11 rounded-xl gap-2 border-dashed border-2">
            <UserPlus className="h-4 w-4" />
            Add New Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="customer@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="rounded-xl min-h-20"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full h-11 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Customer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
