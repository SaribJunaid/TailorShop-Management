import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import apiClient from '@/api/client';
import { 
  UserCog, 
  Phone, 
  Award, 
  ChevronLeft, 
  Loader2, 
  ClipboardList,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
 // Add this line

interface Stitcher {
  id: number;
  name: string;
  phone: string;
  specialty: string;
}

interface OrderItem {
  id: number;
  garment_type: string;
  status: string;
  order_id: number;
}

export default function StitcherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stitcher, setStitcher] = useState<Stitcher | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStitcherData = async () => {
      try {
        // Fetch stitcher details
        const res = await apiClient.get(`/stitchers/${id}`);
        setStitcher(res.data);
        
        // Fetch items assigned to this stitcher
        // Note: Filtering logic depends on your backend list endpoint
        const itemsRes = await apiClient.get('/orders/items/');
        const assignedItems = itemsRes.data.filter(
          (item: any) => item.stitcher_id === parseInt(id || '0')
        );
        setItems(assignedItems);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load stitcher profile",
          variant: "destructive"
        });
        navigate('/stitchers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStitcherData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeTasks = items.filter(i => !['completed', 'delivered'].includes(i.status));
  const completedTasks = items.filter(i => i.status === 'completed');

  return (
    <Layout title="Stitcher Profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/stitchers')}
          className="gap-2 hover:bg-transparent p-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Team
        </Button>

        {/* Profile Header Card */}
        <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-luxury flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <UserCog className="h-12 w-12 text-primary" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{stitcher?.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span>{stitcher?.specialty || 'Master Tailor'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                <span>{stitcher?.phone || 'No Contact'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-muted/30 p-4 rounded-2xl text-center">
              <p className="text-2xl font-bold text-primary">{activeTasks.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Active</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-2xl text-center">
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Done</p>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-3xl border-border/50 shadow-luxury">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Assigned Garments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.length > 0 ? items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/20 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{item.garment_type}</p>
                      <p className="text-xs text-muted-foreground font-mono">Order ID: #{item.order_id}</p>
                    </div>
                    <Badge className={cn(
                      "rounded-lg px-3 py-1 capitalize shadow-sm",
                      item.status === 'completed' ? "bg-green-500/10 text-green-600 border-green-200" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {item.status}
                    </Badge>
                  </div>
                )) : (
                  <div className="text-center py-10 text-muted-foreground italic">
                    No items assigned to this stitcher yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-border/50 shadow-luxury">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                  <span className="text-xl font-bold">
                    {items.length > 0 ? Math.round((completedTasks.length / items.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${items.length > 0 ? (completedTasks.length / items.length) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}