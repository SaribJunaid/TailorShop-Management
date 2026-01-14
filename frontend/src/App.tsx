// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// // Pages
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Customers from "./pages/Customers";
// import CustomerProfile from "./pages/CustomerProfile";
// import Orders from "./pages/Orders";
// import NewOrder from "./pages/NewOrder";
// import Measurements from "./pages/Measurements";
// import Settings from "./pages/Settings";
// import Receipt from "./pages/Receipt";
// import Stitchers from "./pages/Stitchers";
// import NotFound from "./pages/NotFound";
// import Assignment from "./pages/Assignment";
// import StitcherProfile from "./pages/StitcherProfile";

// const queryClient = new QueryClient();

// // Protected Route wrapper
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="animate-pulse text-muted-foreground">Loading...</div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/receipt/:uuid" element={<Receipt />} />

//       {/* Protected routes */}
//       <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//       <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
//       <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
//       <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//       <Route path="/orders/new" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
//       <Route path="/orders/:id" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//       <Route path="/measurements" element={<ProtectedRoute><Measurements /></ProtectedRoute>} />
//       <Route path="/stitchers" element={<ProtectedRoute><Stitchers /></ProtectedRoute>} />
//       <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
//       <Route path="/assignment" element={<ProtectedRoute><Assignment /></ProtectedRoute>} />
//       <Route path="/stitchers/:id" element={<ProtectedRoute><StitcherProfile /></ProtectedRoute>} />

//       {/* Catch-all */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import Measurements from "./pages/Measurements";
import Settings from "./pages/Settings";
import Receipt from "./pages/Receipt";
import Stitchers from "./pages/Stitchers";
import NotFound from "./pages/NotFound";
import Assignment from "./pages/Assignment";
import StitcherProfile from "./pages/StitcherProfile";
import AdminPanel from "./pages/AdminPanel";

// New SaaS Pages (You will create these next)
// import AdminPanel from "./pages/AdminPanel"; 
// import PaymentRequired from "./pages/PaymentRequired";

const queryClient = new QueryClient();

/**
 * UPDATED PROTECTED ROUTE
 * Handles: Authentication, Admin Authorization, and Subscription Expiry
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
//   const { user, isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="animate-pulse text-muted-foreground">Checking Access...</div>
//       </div>
//     );
//   }

//   // 1. Check if logged in
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. ISP LOCK: Check Subscription (Admins are exempt)
//   const isExpired = user?.subscription_expires_at 
//     ? new Date(user.subscription_expires_at) < new Date() 
//     : false;

//   if (!user?.is_admin && (!user?.is_active || isExpired)) {
//     return <Navigate to="/payment-required" replace />;
//   }

//   // 3. ADMIN CHECK: If page requires admin but user is not admin
//   if (requireAdmin && !user?.is_admin) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// }
function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="animate-pulse flex items-center justify-center h-screen">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ADMINS bypass all subscription checks
  if (user?.is_admin) return <>{children}</>;

  // 1. MASTER ACTIVE CHECK
  if (!user?.is_active) return <Navigate to="/payment-required" replace />;

  // 2. TRIAL VS SUBSCRIPTION CHECK
  const registrationDate = user?.created_at ? new Date(user.created_at) : new Date();
  const trialExpiry = new Date(registrationDate);
  trialExpiry.setDate(trialExpiry.getDate() + 7); // Add 7 days

  const subscriptionExpiry = user?.subscription_expires_at ? new Date(user.subscription_expires_at) : null;
  const now = new Date();

  const isTrialActive = now <= trialExpiry;
  const isSubActive = subscriptionExpiry ? now <= subscriptionExpiry : false;

  // If both are expired, lock them out
  if (!isTrialActive && !isSubActive) {
    return <Navigate to="/payment-required" replace />;
  }

  // 3. ADMIN PAGE PROTECTION
  if (requireAdmin && !user?.is_admin) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/receipt/:uuid" element={<Receipt />} />
      
      {/* SaaS Lock Screen (Accessible to authenticated but expired users) */}
      <Route path="/payment-required" element={
        <div className="h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm border border-orange-100">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Account Locked</h1>
            <p className="text-slate-600 mb-6">Your monthly subscription has expired. Please pay via EasyPaisa/JazzCash to continue.</p>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left text-sm font-mono">
              <p>EasyPaisa: 0332-2477394</p>
              
            </div>
            <a 
              href="https://wa.me/923322477394" 
              className="block w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Send Screenshot to WhatsApp
            </a>
          </div>
        </div>
      } />

      

      {/* Standard Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/new" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/measurements" element={<ProtectedRoute><Measurements /></ProtectedRoute>} />
      <Route path="/stitchers" element={<ProtectedRoute><Stitchers /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/assignment" element={<ProtectedRoute><Assignment /></ProtectedRoute>} />
      <Route path="/stitchers/:id" element={<ProtectedRoute><StitcherProfile /></ProtectedRoute>} />
      <Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminPanel /> {/* Use the component here instead of the <div> */}
  </ProtectedRoute>
} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;