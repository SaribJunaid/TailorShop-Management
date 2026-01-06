// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Scissors, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';

// export default function Signup() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [formData, setFormData] = useState({
//     shopName: '',
//     ownerName: '',
//     phone: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.username.trim() || !formData.password.trim() || !formData.shopName.trim()) {
//       toast({
//         title: 'Validation Error',
//         description: 'Please fill in all required fields.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast({
//         title: 'Password Mismatch',
//         description: 'Passwords do not match. Please try again.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (formData.password.length < 6) {
//       toast({
//         title: 'Weak Password',
//         description: 'Password must be at least 6 characters long.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsLoading(true);
    
//     // Simulate API call - replace with actual endpoint
//     await new Promise((resolve) => setTimeout(resolve, 1500));
    
//     setIsLoading(false);
    
//     toast({
//       title: 'Account Created!',
//       description: 'Your account has been created successfully. Please log in.',
//     });
//     navigate('/login');
//   };
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/api/client'; // Added this import

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.password || !formData.shopName || !formData.ownerName) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mapping Frontend fields to match Backend UserCreate schema
      const payload = {
        username: formData.username,
        name: formData.ownerName, // ownerName -> name
        password: formData.password,
        phone: formData.phone,
        shop_name: formData.shopName, // shopName -> shop_name
      };

      await authClient.post('/auth/register', payload);
      
      toast({ title: 'Success!', description: 'Account created. Please log in.' });
      navigate('/login');
    } catch (error: any) {
      toast({ 
        title: 'Signup Failed', 
        description: error.response?.data?.detail || 'Something went wrong.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-primary">
              <Scissors className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground">StitchCraft</h1>
              <p className="text-sm text-sidebar-muted">Tailor Management</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-sidebar-foreground leading-tight">
            Start Your
            <br />
            Digital Journey
          </h2>
          <p className="text-lg text-sidebar-muted max-w-md">
            Join thousands of tailors who have modernized their business 
            with StitchCraft's powerful management tools.
          </p>
        </div>
        
        <p className="text-sm text-sidebar-muted">
          © 2024 StitchCraft. Crafted with precision.
        </p>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">StitchCraft</h1>
          </div>

          <div className="bg-card rounded-2xl shadow-luxury p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-card-foreground">Create Account</h2>
              <p className="text-muted-foreground mt-2">Start managing your tailor shop today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-sm font-medium">
                    Shop Name *
                  </Label>
                  <Input
                    id="shopName"
                    type="text"
                    placeholder="Your Tailors"
                    value={formData.shopName}
                    onChange={(e) => handleChange('shopName', e.target.value)}
                    className="h-11 rounded-xl"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-sm font-medium">
                    Owner Name
                  </Label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Your name"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    className="h-11 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-11 rounded-xl"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="h-11 rounded-xl"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="h-11 rounded-xl pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="h-11 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
