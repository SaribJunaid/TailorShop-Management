import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-info/10 text-info border-info/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'pending' && "bg-warning",
        status === 'in-progress' && "bg-info",
        status === 'completed' && "bg-success",
        status === 'cancelled' && "bg-destructive",
        status === 'active' && "bg-success",
        status === 'inactive' && "bg-muted-foreground",
      )} />
      {config.label}
    </span>
  );
};

export { StatusBadge };
export type { Status };
