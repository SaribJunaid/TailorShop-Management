import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByUuid, Order } from '@/data/mockData';
import { Scissors, Calendar, Phone } from 'lucide-react';

export default function Receipt() {
  const { uuid } = useParams<{ uuid: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      getOrderByUuid(uuid).then((data) => {
        setOrder(data || null);
        setIsLoading(false);
      });
    }
  }, [uuid]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading receipt...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Receipt Not Found</h1>
          <p className="text-muted-foreground">This receipt link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-lg mx-auto bg-card rounded-2xl shadow-luxury overflow-hidden">
        {/* Header */}
        <div className="bg-sidebar p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scissors className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">StitchCraft Tailors</h1>
        </div>
        <p className="text-sm text-sidebar-muted">123, Anarkali Bazaar, Lahore</p>
        <div className="flex items-center justify-center gap-1 text-sm text-sidebar-muted mt-1">
          <Phone className="h-3 w-3" />
          +92 42 3567 8901
        </div>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-semibold text-foreground">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Customer</p>
            <p className="font-semibold text-foreground">{order.customerName}</p>
          </div>
        </div>

        {/* Garment Details */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">Order Details</h3>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">{order.garmentType}</span>
            <span className="font-medium text-foreground">Rs.{order.totalAmount.toLocaleString()}</span>
          </div>
          {order.fabricNotes && (
            <p className="text-xs text-muted-foreground mt-2 italic">"{order.fabricNotes}"</p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-foreground">Rs.{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span className="text-status-success">Rs.{order.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span className="text-foreground">Balance Due</span>
              <span className={order.balanceDue > 0 ? 'text-status-warning' : 'text-status-success'}>
                Rs.{order.balanceDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Expected Ready:</span>
            <span className="font-semibold text-foreground">
              {new Date(order.dueDate).toLocaleDateString('en-US', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground">Thank you for choosing StitchCraft!</p>
        </div>
      </div>
    </div>
  );
}
