import React, { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Layout } from '@/components/Layout'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, CalendarPlus, UserCheck, Loader2, Ban, RefreshCw } from 'lucide-react';
import { format, isAfter, addDays } from 'date-fns';

interface UserAdminView {
  id: number;
  username: string;
  name: string;
  is_active: boolean;
  is_admin: boolean;
  subscription_expires_at: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserAdminView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<UserAdminView[]>('/admin/users');
      // Filter out admins so you don't accidentally suspend yourself
      setUsers(response.data.filter(user => !user.is_admin));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data. Is the backend running?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRenewSubscription = async (userId: number) => {
    setIsUpdatingId(userId);
    try {
      await apiClient.post(`/admin/renew/${userId}`);
      toast({
        title: "Success",
        description: "Subscription extended by 30 days.",
      });
      fetchUsers();
    } catch (error) {
      toast({ title: "Failed", description: "Could not renew.", variant: "destructive" });
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleToggleActiveStatus = async (userId: number, currentStatus: boolean) => {
    setIsUpdatingId(userId);
    try {
      await apiClient.patch(`/admin/users/${userId}`, { is_active: !currentStatus });
      toast({
        title: "Status Updated",
        description: `Shop is now ${!currentStatus ? 'Active' : 'Suspended'}.`,
      });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: "Toggle failed.", variant: "destructive" });
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <Layout title="SaaS Administration">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" /> Shop Control Center
            </h2>
            <p className="text-muted-foreground">Manage subscriptions and access for all tailor shops.</p>
          </div>
          <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Fetching shop registry...</p>
          </div>
        ) : (
          <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Shop Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription Expiry</TableHead>
                  <TableHead className="text-right">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const trialExpiry = addDays(new Date(user.created_at), 7);
                  const isTrialActive = isAfter(trialExpiry, new Date());
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-bold text-base">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">@{user.username}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.is_active ? "default" : "destructive"} className="w-fit">
                            {user.is_active ? "Account Active" : "Suspended"}
                          </Badge>
                          {isTrialActive && (
                            <Badge variant="secondary" className="w-fit text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100">
                              7-DAY TRIAL
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.subscription_expires_at 
                            ? format(new Date(user.subscription_expires_at), 'PPP') 
                            : isTrialActive ? "Trial Phase" : "Expired"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Joined: {format(new Date(user.created_at), 'MMM yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full border-green-200 hover:bg-green-50 text-green-700"
                          onClick={() => handleRenewSubscription(user.id)}
                          disabled={isUpdatingId === user.id}
                        >
                          <CalendarPlus className="h-4 w-4 mr-1" /> Renew
                        </Button>
                        <Button 
                          variant={user.is_active ? "destructive" : "default"} 
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleToggleActiveStatus(user.id, user.is_active)}
                          disabled={isUpdatingId === user.id}
                        >
                          {user.is_active ? <Ban className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
}