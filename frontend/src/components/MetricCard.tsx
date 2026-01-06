import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'success' | 'danger' | 'info' | 'gold';
  subtitle?: string;
  onClick?: () => void;
  href?: string;
}

const variantStyles = {
  success: 'gradient-success',
  danger: 'gradient-danger',
  info: 'gradient-info',
  gold: 'gradient-gold',
};

export function MetricCard({ title, value, icon: Icon, variant, subtitle, onClick, href }: MetricCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  const isClickable = onClick || href;

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-luxury transition-luxury hover:shadow-luxury-hover hover:scale-[1.02]',
        variantStyles[variant],
        isClickable && 'cursor-pointer'
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-foreground/10" />
      <div className="absolute -right-2 -bottom-6 h-32 w-32 rounded-full bg-primary-foreground/5" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="mt-1 text-xs text-primary-foreground/70">{subtitle}</p>
            )}
          </div>
          <div className="rounded-xl bg-primary-foreground/20 p-3">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
