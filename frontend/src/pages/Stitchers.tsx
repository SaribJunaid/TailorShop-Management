import React, { useState } from 'react';
import { Plus, Search, Phone, Star, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge, Status } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Stitcher {
  id: string;
  name: string;
  phone: string;
  specialty: string[];
  status: 'active' | 'inactive';
  rating: number;
  completedOrders: number;
  activeOrders: number;
  joinedDate: string;
}

const specialties = [
  'Men\'s Suits',
  'Women\'s Dresses',
  'Sherwani',
  'Kurta',
  'Bridal Wear',
  'Alterations',
  'Embroidery',
  'Western Wear',
];

const initialStitchers: Stitcher[] = [
  { id: '1', name: 'Hassan Ali', phone: '+92 300 1112233', specialty: ['Men\'s Suits', 'Sherwani'], status: 'active', rating: 4.8, completedOrders: 245, activeOrders: 4, joinedDate: '2022-03-15' },
  { id: '2', name: 'Amina Bibi', phone: '+92 321 4445566', specialty: ['Women\'s Dresses', 'Bridal Wear', 'Embroidery'], status: 'active', rating: 4.9, completedOrders: 312, activeOrders: 6, joinedDate: '2021-08-20' },
  { id: '3', name: 'Bilal Ahmed', phone: '+92 333 7778899', specialty: ['Kurta', 'Alterations'], status: 'active', rating: 4.5, completedOrders: 189, activeOrders: 3, joinedDate: '2023-01-10' },
  { id: '4', name: 'Zara Khan', phone: '+92 345 0001122', specialty: ['Women\'s Dresses', 'Western Wear'], status: 'inactive', rating: 4.6, completedOrders: 156, activeOrders: 0, joinedDate: '2022-11-05' },
  { id: '5', name: 'Rashid Malik', phone: '+92 312 3334455', specialty: ['Men\'s Suits', 'Kurta', 'Sherwani'], status: 'active', rating: 4.7, completedOrders: 278, activeOrders: 5, joinedDate: '2021-04-22' },
];

const Stitchers: React.FC = () => {
  const [stitchers, setStitchers] = useState<Stitcher[]>(initialStitchers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStitcher, setEditingStitcher] = useState<Stitcher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });
  const { toast } = useToast();

  const filteredStitchers = stitchers.filter((stitcher) => {
    const matchesSearch = stitcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stitcher.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || stitcher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (stitcher?: Stitcher) => {
    if (stitcher) {
      setEditingStitcher(stitcher);
      setFormData({
        name: stitcher.name,
        phone: stitcher.phone,
        specialty: stitcher.specialty,
        status: stitcher.status,
      });
    } else {
      setEditingStitcher(null);
      setFormData({ name: '', phone: '', specialty: [], status: 'active' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStitcher(null);
    setFormData({ name: '', phone: '', specialty: [], status: 'active' });
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialty: formData.specialty.includes(specialty)
        ? formData.specialty.filter((s) => s !== specialty)
        : [...formData.specialty, specialty],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name and phone are required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.specialty.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one specialty.',
        variant: 'destructive',
      });
      return;
    }

    if (editingStitcher) {
      setStitchers(
        stitchers.map((s) =>
          s.id === editingStitcher.id
            ? { ...s, ...formData }
            : s
        )
      );
      toast({
        title: 'Stitcher Updated',
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newStitcher: Stitcher = {
        id: String(Date.now()),
        ...formData,
        rating: 0,
        completedOrders: 0,
        activeOrders: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setStitchers([newStitcher, ...stitchers]);
      toast({
        title: 'Stitcher Added',
        description: `${formData.name} has been added to the team.`,
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (stitcher: Stitcher) => {
    if (stitcher.activeOrders > 0) {
      toast({
        title: 'Cannot Delete',
        description: 'This stitcher has active orders. Reassign them first.',
        variant: 'destructive',
      });
      return;
    }
    setStitchers(stitchers.filter((s) => s.id !== stitcher.id));
    toast({
      title: 'Stitcher Removed',
      description: `${stitcher.name} has been removed from the team.`,
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Stitchers"
        description="Manage your tailoring team and their specializations."
      >
        <Button onClick={() => handleOpenDialog()} className="gradient-gold text-accent-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Stitcher
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-muted/50"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40 h-11 bg-muted/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stitchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStitchers.map((stitcher, index) => (
          <div
            key={stitcher.id}
            className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-semibold",
                  stitcher.status === 'active' 
                    ? "bg-success/10 text-success" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {stitcher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{stitcher.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-accent">
                    <Star className="w-4 h-4 fill-accent" />
                    <span>{stitcher.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge status={stitcher.status} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Phone className="w-4 h-4" />
              <span>{stitcher.phone}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {stitcher.specialty.map((spec) => (
                <span
                  key={spec}
                  className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-display font-bold">{stitcher.completedOrders}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-accent">{stitcher.activeOrders}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleOpenDialog(stitcher)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(stitcher)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredStitchers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No stitchers found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingStitcher ? 'Edit Stitcher' : 'Add New Stitcher'}
            </DialogTitle>
            <DialogDescription>
              {editingStitcher
                ? 'Update stitcher information and specializations.'
                : 'Add a new stitcher to your team.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter stitcher name"
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specializations *</Label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full border transition-all",
                      formData.specialty.includes(specialty)
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-muted/50 text-muted-foreground border-border hover:border-accent"
                    )}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-gold text-accent-foreground">
                {editingStitcher ? 'Update' : 'Add Stitcher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Stitchers;
