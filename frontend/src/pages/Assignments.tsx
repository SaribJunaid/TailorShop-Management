import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Scissors, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge, Status } from '@/components/ui/status-badge';
import { DataTable, Column } from '@/components/ui/data-table';
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

interface Assignment {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  stitcherId: string;
  stitcherName: string;
  item: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedDate: string;
  notes: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Stitcher {
  id: string;
  name: string;
}

const customers: Customer[] = [
  { id: '1', name: 'Muhammad Ali' },
  { id: '2', name: 'Fatima Khan' },
  { id: '3', name: 'Ahmed Raza' },
  { id: '4', name: 'Sara Ahmed' },
  { id: '5', name: 'Usman Malik' },
];

const stitchers: Stitcher[] = [
  { id: '1', name: 'Hassan Ali' },
  { id: '2', name: 'Amina Bibi' },
  { id: '3', name: 'Bilal Ahmed' },
  { id: '4', name: 'Rashid Malik' },
];

const items = [
  'Sherwani',
  'Suit (2 Piece)',
  'Suit (3 Piece)',
  'Kurta Shalwar',
  'Bridal Dress',
  'Party Dress',
  'Kurti Set',
  'Waistcoat',
  'Shirt',
  'Trousers',
];

const initialAssignments: Assignment[] = [
  { id: '1', orderId: 'ORD-001', customerId: '1', customerName: 'Muhammad Ali', stitcherId: '1', stitcherName: 'Hassan Ali', item: 'Sherwani', status: 'in-progress', priority: 'high', dueDate: '2024-01-15', assignedDate: '2024-01-08', notes: 'Gold embroidery on collar' },
  { id: '2', orderId: 'ORD-002', customerId: '2', customerName: 'Fatima Khan', stitcherId: '2', stitcherName: 'Amina Bibi', item: 'Bridal Dress', status: 'pending', priority: 'high', dueDate: '2024-01-18', assignedDate: '2024-01-05', notes: 'Red with heavy embellishments' },
  { id: '3', orderId: 'ORD-003', customerId: '3', customerName: 'Ahmed Raza', stitcherId: '1', stitcherName: 'Hassan Ali', item: 'Suit (3 Piece)', status: 'completed', priority: 'medium', dueDate: '2024-01-10', assignedDate: '2024-01-02', notes: 'Navy blue, slim fit' },
  { id: '4', orderId: 'ORD-004', customerId: '4', customerName: 'Sara Ahmed', stitcherId: '2', stitcherName: 'Amina Bibi', item: 'Kurti Set', status: 'in-progress', priority: 'low', dueDate: '2024-01-20', assignedDate: '2024-01-10', notes: 'Cotton casual wear' },
  { id: '5', orderId: 'ORD-005', customerId: '5', customerName: 'Usman Malik', stitcherId: '3', stitcherName: 'Bilal Ahmed', item: 'Kurta Shalwar', status: 'pending', priority: 'medium', dueDate: '2024-01-22', assignedDate: '2024-01-12', notes: 'White for Eid' },
];

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStitcher, setFilterStitcher] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    stitcherId: '',
    item: '',
    status: 'pending' as Status,
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    notes: '',
  });
  const { toast } = useToast();

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.stitcherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesStitcher = filterStitcher === 'all' || assignment.stitcherId === filterStitcher;
    return matchesSearch && matchesStatus && matchesStitcher;
  });

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        customerId: assignment.customerId,
        stitcherId: assignment.stitcherId,
        item: assignment.item,
        status: assignment.status,
        priority: assignment.priority,
        dueDate: assignment.dueDate,
        notes: assignment.notes,
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        customerId: '',
        stitcherId: '',
        item: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAssignment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId || !formData.stitcherId || !formData.item || !formData.dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const customer = customers.find((c) => c.id === formData.customerId);
    const stitcher = stitchers.find((s) => s.id === formData.stitcherId);
    const today = new Date().toISOString().split('T')[0];

    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id
            ? {
                ...a,
                ...formData,
                customerName: customer?.name || '',
                stitcherName: stitcher?.name || '',
              }
            : a
        )
      );
      toast({
        title: 'Assignment Updated',
        description: 'The assignment has been updated successfully.',
      });
    } else {
      const newAssignment: Assignment = {
        id: String(Date.now()),
        orderId: `ORD-${String(assignments.length + 1).padStart(3, '0')}`,
        customerId: formData.customerId,
        customerName: customer?.name || '',
        stitcherId: formData.stitcherId,
        stitcherName: stitcher?.name || '',
        item: formData.item,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assignedDate: today,
        notes: formData.notes,
      };
      setAssignments([newAssignment, ...assignments]);
      toast({
        title: 'Assignment Created',
        description: `Order ${newAssignment.orderId} has been assigned.`,
      });
    }

    handleCloseDialog();
  };

  const handleStatusChange = (assignmentId: string, newStatus: Status) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId ? { ...a, status: newStatus } : a
      )
    );
    toast({
      title: 'Status Updated',
      description: `Assignment status changed to ${newStatus}.`,
    });
  };

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-destructive/10 text-destructive',
  };

  const columns: Column<Assignment>[] = [
    {
      key: 'orderId',
      header: 'Order ID',
      render: (a) => <span className="font-mono text-sm">{a.orderId}</span>,
    },
    { key: 'customerName', header: 'Customer' },
    { key: 'item', header: 'Item' },
    { key: 'stitcherName', header: 'Stitcher' },
    {
      key: 'priority',
      header: 'Priority',
      render: (a) => (
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium capitalize', priorityColors[a.priority])}>
          {a.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (a) => {
        const isOverdue = new Date(a.dueDate) < new Date() && a.status !== 'completed';
        return (
          <span className={cn('text-sm', isOverdue && 'text-destructive font-medium')}>
            {new Date(a.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (a) => (
        <div className="flex gap-1">
          <Select
            value={a.status}
            onValueChange={(value) => handleStatusChange(a.id, value as Status)}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  // Stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === 'pending').length,
    inProgress: assignments.filter((a) => a.status === 'in-progress').length,
    completed: assignments.filter((a) => a.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assignments"
        description="Track and manage order assignments to stitchers."
      >
        <Button onClick={() => handleOpenDialog()} className="gradient-gold text-accent-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-muted' },
          { label: 'Pending', value: stats.pending, color: 'bg-warning/10' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-info/10' },
          { label: 'Completed', value: stats.completed, color: 'bg-success/10' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-lg p-4 text-center animate-scale-in',
              stat.color
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by customer, stitcher, or order..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStitcher} onValueChange={setFilterStitcher}>
          <SelectTrigger className="w-full sm:w-48 h-11 bg-muted/50">
            <SelectValue placeholder="All Stitchers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stitchers</SelectItem>
            {stitchers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="animate-slide-up">
        <DataTable
          data={filteredAssignments}
          columns={columns}
          onRowClick={(assignment) => handleOpenDialog(assignment)}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </DialogTitle>
            <DialogDescription>
              Assign an order to a stitcher for tailoring.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stitcher *</Label>
                <Select
                  value={formData.stitcherId}
                  onValueChange={(value) => setFormData({ ...formData, stitcherId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {stitchers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Item *</Label>
              <Select
                value={formData.item}
                onValueChange={(value) => setFormData({ ...formData, item: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select garment type" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })
                  }
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
            </div>

            {editingAssignment && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Special instructions..."
                className="bg-muted/50"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-gold text-accent-foreground">
                {editingAssignment ? 'Update' : 'Create Assignment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Assignments;
