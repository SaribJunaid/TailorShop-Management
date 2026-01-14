// import { useState } from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   Ruler,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Scissors,
//   UserCog,
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: LayoutDashboard },
//   { name: 'Customers', href: '/customers', icon: Users },
//   { name: 'Orders', href: '/orders', icon: ClipboardList },
//   { name: 'Stitchers', href: '/stitchers', icon: UserCog },
//   { name: 'Measurements', href: '/measurements', icon: Ruler },
//   { name: 'Assignment', href: '/assignment', icon: Scissors },
//   { name: 'Settings', href: '/settings', icon: Settings },
// ];

// export function AppSidebar() {
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const SidebarContent = () => (
//     <>
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
//           <Scissors className="h-5 w-5 text-sidebar-primary-foreground" />
//         </div>
//         <div>
//           <h1 className="text-lg font-semibold text-sidebar-foreground">StitchCraft</h1>
//           <p className="text-xs text-sidebar-muted">Tailor Management</p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-6 space-y-1">
//         {navigation.map((item) => {
//           const isActive = location.pathname === item.href;
//           return (
//             <NavLink
//               key={item.name}
//               to={item.href}
//               onClick={() => setMobileMenuOpen(false)}
//               className={cn(
//                 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-luxury',
//                 isActive
//                   ? 'bg-sidebar-primary text-sidebar-primary-foreground'
//                   : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {item.name}
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* User section */}
//       <div className="px-4 py-4 border-t border-sidebar-border">
//         <div className="flex items-center gap-3 px-4 py-3">
//           <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
//             <span className="text-sm font-medium text-sidebar-accent-foreground">
//               {user?.username?.charAt(0).toUpperCase() || 'U'}
//             </span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-sidebar-foreground truncate">
//               {user?.username || 'User'}
//             </p>
//             <p className="text-xs text-sidebar-muted">Shop Owner</p>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={logout}
//             className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
//           >
//             <LogOut className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile hamburger button */}
//       <button
//         onClick={() => setMobileMenuOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-luxury"
//       >
//         <Menu className="h-6 w-6 text-foreground" />
//       </button>

//       {/* Mobile overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Mobile sidebar */}
//       <aside
//         className={cn(
//           'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col transform transition-transform duration-300',
//           mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
//         )}
//       >
//         <button
//           onClick={() => setMobileMenuOpen(false)}
//           className="absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent"
//         >
//           <X className="h-5 w-5 text-sidebar-foreground" />
//         </button>
//         <SidebarContent />
//       </aside>

//       {/* Desktop sidebar - always visible */}
//       <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-sidebar">
//         <SidebarContent />
//       </aside>
//     </>
//   );
// }
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Ruler,
  Settings,
  LogOut,
  Menu,
  X,
  Scissors,
  UserCog,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define base navigation
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Orders', href: '/orders', icon: ClipboardList },
    { name: 'Stitchers', href: '/stitchers', icon: UserCog },
    { name: 'Measurements', href: '/measurements', icon: Ruler },
    { name: 'Assignment', href: '/assignment', icon: Scissors },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Add Admin Panel to navigation if user is a Super Admin
  if (user?.is_admin) {
    navigation.push({ name: 'Admin Panel', href: '/Admin', icon: ShieldCheck });
  }

  const SidebarContent = () => {
    // Calculate trial status for the UI
    const isTrial = !user?.is_admin && !user?.subscription_expires_at && user?.is_active;

    return (
      <>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <Scissors className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">StitchCraft</h1>
            <p className="text-xs text-sidebar-muted">Tailor Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-muted")} />
                <span className="flex-1">{item.name}</span>
                {item.href === '/admin' && (
                  <Badge className="bg-orange-500 text-[10px] h-4 px-1">PRO</Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-sidebar-border bg-sidebar-accent/30">
          {isTrial && (
            <div className="mb-4 px-4 py-2 bg-primary/10 rounded-lg flex items-center gap-2 border border-primary/20">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Free Trial Active</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground shadow-md">
              <span className="text-sm font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-[10px] font-medium text-sidebar-muted uppercase tracking-tighter">
                {user?.is_admin ? 'Super Admin' : 'Shop Owner'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-sidebar-muted hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-luxury border border-border"
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col transform transition-transform duration-300 ease-in-out border-r border-sidebar-border',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent"
        >
          <X className="h-5 w-5 text-sidebar-foreground" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar - always visible */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  );
}