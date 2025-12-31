import React, { useState } from 'react';
import { Plus, Search, Save, User, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface MeasurementRecord {
  id: string;
  customerId: string;
  customerName: string;
  type: 'shirt' | 'pants' | 'suit' | 'kurta' | 'sherwani' | 'dress';
  measurements: Record<string, number>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

type GarmentType = 'shirt' | 'pants' | 'suit' | 'kurta' | 'sherwani' | 'dress';

interface Customer {
  id: string;
  name: string;
}

const customers: Customer[] = [
  { id: '1', name: 'Muhammad Ali' },
  { id: '2', name: 'Fatima Khan' },
  { id: '3', name: 'Ahmed Raza' },
  { id: '4', name: 'Sara Ahmed' },
  { id: '5', name: 'Usman Malik' },
  { id: '6', name: 'Ayesha Siddiqui' },
];

const measurementFields: Record<string, string[]> = {
  shirt: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Shirt Length', 'Collar', 'Bicep'],
  pants: ['Waist', 'Hips', 'Thigh', 'Inseam', 'Outseam', 'Bottom Width', 'Crotch'],
  suit: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Jacket Length', 'Lapel Width', 'Back Width'],
  kurta: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Kurta Length', 'Collar', 'Armhole'],
  sherwani: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Sherwani Length', 'Collar', 'Back Width'],
  dress: ['Bust', 'Waist', 'Hips', 'Shoulder', 'Dress Length', 'Sleeve Length', 'Armhole'],
};

const initialMeasurements: MeasurementRecord[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Muhammad Ali',
    type: 'sherwani',
    measurements: { Chest: 42, Waist: 36, Shoulder: 18, 'Sleeve Length': 25, 'Sherwani Length': 44, Collar: 16, 'Back Width': 17 },
    notes: 'Prefers slightly loose fit',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Fatima Khan',
    type: 'dress',
    measurements: { Bust: 36, Waist: 28, Hips: 38, Shoulder: 14, 'Dress Length': 52, 'Sleeve Length': 22, Armhole: 18 },
    notes: 'For wedding, add embroidery details',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Ahmed Raza',
    type: 'suit',
    measurements: { Chest: 40, Waist: 34, Shoulder: 17, 'Sleeve Length': 24, 'Jacket Length': 30, 'Lapel Width': 3, 'Back Width': 16 },
    notes: 'Slim fit preference',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
];

const Measurements: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedCustomerId = searchParams.get('customerId');
  
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>(initialMeasurements);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCustomer, setFilterCustomer] = useState<string>(preselectedCustomerId || 'all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MeasurementRecord | null>(null);
  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    type: 'shirt' as keyof typeof measurementFields,
    measurements: {} as Record<string, number>,
    notes: '',
  });
  const { toast } = useToast();

  const filteredMeasurements = measurements.filter((m) => {
    const matchesSearch = m.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustomer = filterCustomer === 'all' || m.customerId === filterCustomer;
    return matchesSearch && matchesCustomer;
  });

  const handleOpenDialog = (record?: MeasurementRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        customerId: record.customerId,
        type: record.type,
        measurements: { ...record.measurements },
        notes: record.notes,
      });
    } else {
      setSelectedRecord(null);
      const defaultMeasurements: Record<string, number> = {};
      measurementFields.shirt.forEach((field) => {
        defaultMeasurements[field] = 0;
      });
      setFormData({
        customerId: preselectedCustomerId || '',
        type: 'shirt',
        measurements: defaultMeasurements,
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleTypeChange = (type: string) => {
    const newMeasurements: Record<string, number> = {};
    measurementFields[type as keyof typeof measurementFields].forEach((field) => {
      newMeasurements[field] = formData.measurements[field] || 0;
    });
    setFormData({ ...formData, type: type as keyof typeof measurementFields, measurements: newMeasurements });
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      measurements: {
        ...formData.measurements,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a customer.',
        variant: 'destructive',
      });
      return;
    }

    const customer = customers.find((c) => c.id === formData.customerId);
    const today = new Date().toISOString().split('T')[0];

    if (selectedRecord) {
      setMeasurements(
        measurements.map((m) =>
          m.id === selectedRecord.id
            ? {
                ...m,
                customerId: formData.customerId,
                type: formData.type as GarmentType,
                measurements: formData.measurements,
                notes: formData.notes,
                customerName: customer?.name || '',
                updatedAt: today,
              }
            : m
        )
      );
      toast({
        title: 'Measurements Updated',
        description: 'The measurements have been saved successfully.',
      });
    } else {
      const newRecord: MeasurementRecord = {
        id: String(Date.now()),
        customerId: formData.customerId,
        customerName: customer?.name || '',
        type: formData.type as GarmentType,
        measurements: formData.measurements,
        notes: formData.notes,
        createdAt: today,
        updatedAt: today,
      };
      setMeasurements([newRecord, ...measurements]);
      toast({
        title: 'Measurements Added',
        description: 'New measurement record has been created.',
      });
    }

    setIsDialogOpen(false);
  };

  const typeLabels: Record<string, string> = {
    shirt: 'Shirt',
    pants: 'Pants/Trousers',
    suit: 'Suit',
    kurta: 'Kurta',
    sherwani: 'Sherwani',
    dress: 'Dress/Gown',
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Measurements"
        description="Track and manage customer measurements for perfect tailoring."
      >
        <Button onClick={() => handleOpenDialog()} className="gradient-gold text-accent-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Measurement
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-muted/50"
          />
        </div>
        <Select value={filterCustomer} onValueChange={setFilterCustomer}>
          <SelectTrigger className="w-full sm:w-48 h-11 bg-muted/50">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Measurements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMeasurements.map((record, index) => (
          <div
            key={record.id}
            onClick={() => handleOpenDialog(record)}
            className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">{record.customerName}</h3>
                  <p className="text-sm text-accent font-medium">{typeLabels[record.type]}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(record.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(record.measurements).slice(0, 6).map(([key, value]) => (
                <div key={key} className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground truncate">{key}</p>
                  <p className="font-semibold text-sm">{value}"</p>
                </div>
              ))}
            </div>

            {record.notes && (
              <p className="mt-4 text-sm text-muted-foreground italic truncate">
                "{record.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredMeasurements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No measurements found. Add a new measurement record to get started.</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedRecord ? 'Edit Measurements' : 'Add New Measurements'}
            </DialogTitle>
            <DialogDescription>
              Record detailed measurements for tailoring.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Garment Type *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Measurements (in inches)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {measurementFields[formData.type].map((field) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{field}</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.measurements[field] || ''}
                      onChange={(e) => handleMeasurementChange(field, e.target.value)}
                      className="bg-muted/50 h-10"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or preferences..."
                className="bg-muted/50"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-gold text-accent-foreground">
                <Save className="w-4 h-4 mr-2" />
                {selectedRecord ? 'Update' : 'Save Measurements'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Measurements;
