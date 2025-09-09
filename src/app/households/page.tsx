"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserHouseholds,
  createHousehold,
  getInvites,
  acceptInvite,
  declineInvite,
} from "@/services/households";
import type { Household, InviteWithId, Invite } from "@/lib/types";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Home, Plus, Check, X } from "lucide-react";

export default function HouseholdsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [households, setHouseholds] = React.useState<Household[]>([]);
  const [invites, setInvites] = React.useState<InviteWithId[]>([]);
  const [newHouseholdName, setNewHouseholdName] = React.useState("");
  const [dataLoading, setDataLoading] = React.useState(true);

  const fetchData = React.useCallback(async (userId: string) => {
    setDataLoading(true);
    try {
      const [userHouseholds, userInvites] = await Promise.all([
        getUserHouseholds(userId),
        getInvites(userId),
      ]);
      setHouseholds(userHouseholds);
      setInvites(userInvites);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your household information.",
      });
    } finally {
      setDataLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else {
      fetchData(user.uid);
    }
  }, [user, loading, router, fetchData]);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newHouseholdName.trim()) return;
    try {
      const newHouseholdId = await createHousehold(
        user.uid,
        newHouseholdName.trim()
      );
      setNewHouseholdName("");
      toast({
        title: "Success!",
        description: "New household created.",
      });
      router.push(`/dashboard/${newHouseholdId}`);
    } catch (error) {
      console.error("Error creating household:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create new household.",
      });
    }
  };
  
  const handleAcceptInvite = async (inviteId: string, householdId: string) => {
    if (!user) return;
    try {
        await acceptInvite(user.uid, inviteId, householdId);
        toast({ title: "Success", description: "You have joined the household." });
        fetchData(user.uid);
    } catch (error) {
        console.error("Error accepting invite:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to join household." });
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    if (!user) return;
     try {
        await declineInvite(user.uid, inviteId);
        toast({ title: "Invite Declined", description: "You have declined the invitation." });
        fetchData(user.uid);
    } catch (error) {
        console.error("Error declining invite:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to decline invite." });
    }
  };

  if (loading || dataLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Households List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Households</CardTitle>
            <CardDescription>Select a household to view its dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {households.length > 0 ? (
              <ul className="space-y-2">
                {households.map((h) => (
                  <li key={h.id}>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/dashboard/${h.id}`)}>
                       <Home className="mr-2 h-4 w-4" /> {h.name}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">You are not a member of any household yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>You have been invited to join these households.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {invites.map((invite) => (
                  <li key={invite.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">Invited by: {invite.invitedBy}</p>
                      <p className="text-sm text-muted-foreground">Household ID: {invite.householdId}</p>
                    </div>
                    <div className="flex gap-2">
                       <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAcceptInvite(invite.id, invite.householdId)}>
                           <Check className="h-4 w-4" />
                       </Button>
                       <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeclineInvite(invite.id)}>
                           <X className="h-4 w-4" />
                       </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Create Household */}
        <Card>
          <CardHeader>
            <CardTitle>Create a New Household</CardTitle>
            <CardDescription>Start a new project or home to manage.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateHousehold}>
            <CardContent>
              <Label htmlFor="householdName">Household Name</Label>
              <Input
                id="householdName"
                type="text"
                placeholder="e.g., Smith Family Home"
                required
                value={newHouseholdName}
                onChange={(e) => setNewHouseholdName(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create Household
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}
