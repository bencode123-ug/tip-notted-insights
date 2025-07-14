import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Edit, Trash2, Users, Crown, Trophy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

interface Tip {
  id: string;
  title: string;
  league: string;
  match: string;
  prediction: string;
  odds: string;
  confidence: number;
  date: string;
  time: string;
  status: "pending" | "won" | "lost";
  isPremium: boolean;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Admin User",
    email: "admin@nottedtips.com",
    isPremium: true,
    isAdmin: true
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddTipModalOpen, setIsAddTipModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const { toast } = useToast();

  // Mock data
  const [tips, setTips] = useState<Tip[]>([
    {
      id: "1",
      title: "Manchester United vs Arsenal",
      league: "Premier League",
      match: "Manchester United vs Arsenal",
      prediction: "Over 2.5 Goals",
      odds: "1.85",
      confidence: 85,
      date: "2024-01-15",
      time: "15:30",
      status: "pending",
      isPremium: false
    },
    {
      id: "2",
      title: "Barcelona vs Real Madrid",
      league: "La Liga",
      match: "Barcelona vs Real Madrid",
      prediction: "Barcelona Win",
      odds: "2.10",
      confidence: 92,
      date: "2024-01-16",
      time: "20:00",
      status: "pending",
      isPremium: true
    }
  ]);

  const [users] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", isPremium: true, joinDate: "2024-01-01" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", isPremium: false, joinDate: "2024-01-05" },
    { id: "3", name: "Premium User", email: "premium@example.com", isPremium: true, joinDate: "2024-01-10" }
  ]);

  const [newTip, setNewTip] = useState({
    title: "",
    league: "",
    match: "",
    prediction: "",
    odds: "",
    confidence: 50,
    date: "",
    time: "",
    isPremium: false
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddTip = () => {
    if (!newTip.match || !newTip.prediction || !newTip.odds) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const tip: Tip = {
      id: Date.now().toString(),
      title: newTip.match,
      league: newTip.league,
      match: newTip.match,
      prediction: newTip.prediction,
      odds: newTip.odds,
      confidence: newTip.confidence,
      date: newTip.date,
      time: newTip.time,
      status: "pending",
      isPremium: newTip.isPremium
    };

    setTips(prev => [tip, ...prev]);
    setNewTip({
      title: "",
      league: "",
      match: "",
      prediction: "",
      odds: "",
      confidence: 50,
      date: "",
      time: "",
      isPremium: false
    });
    setIsAddTipModalOpen(false);
    
    toast({
      title: "Success",
      description: `${newTip.isPremium ? "Premium" : "Free"} tip added successfully`
    });
  };

  const handleEditTip = (tip: Tip) => {
    setEditingTip(tip);
    setNewTip({
      title: tip.title,
      league: tip.league,
      match: tip.match,
      prediction: tip.prediction,
      odds: tip.odds,
      confidence: tip.confidence,
      date: tip.date,
      time: tip.time,
      isPremium: tip.isPremium
    });
  };

  const handleUpdateTip = () => {
    if (!editingTip) return;

    setTips(prev => prev.map(tip => 
      tip.id === editingTip.id 
        ? { ...tip, ...newTip, title: newTip.match }
        : tip
    ));
    
    setEditingTip(null);
    setNewTip({
      title: "",
      league: "",
      match: "",
      prediction: "",
      odds: "",
      confidence: 50,
      date: "",
      time: "",
      isPremium: false
    });
    
    toast({
      title: "Success",
      description: "Tip updated successfully"
    });
  };

  const handleDeleteTip = (tipId: string) => {
    setTips(prev => prev.filter(tip => tip.id !== tipId));
    toast({
      title: "Success",
      description: "Tip deleted successfully"
    });
  };

  const handleStatusUpdate = (tipId: string, status: "won" | "lost") => {
    setTips(prev => prev.map(tip => 
      tip.id === tipId ? { ...tip, status } : tip
    ));
    toast({
      title: "Success",
      description: `Tip marked as ${status}`
    });
  };

  // Redirect if not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => setIsAuthModalOpen(true)}>
            Login as Admin
          </Button>
        </div>
        
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  const TipFormModal = ({ isOpen, onClose, onSubmit, isEditing = false }: any) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tip" : "Add New Tip"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="league">League</Label>
              <Select value={newTip.league} onValueChange={(value) => setNewTip(prev => ({ ...prev, league: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select league" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premier League">Premier League</SelectItem>
                  <SelectItem value="La Liga">La Liga</SelectItem>
                  <SelectItem value="Serie A">Serie A</SelectItem>
                  <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                  <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="isPremium">Tip Type</Label>
              <Select value={newTip.isPremium ? "premium" : "free"} onValueChange={(value) => setNewTip(prev => ({ ...prev, isPremium: value === "premium" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Tip</SelectItem>
                  <SelectItem value="premium">Premium Tip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="match">Match</Label>
            <Input
              id="match"
              placeholder="Team A vs Team B"
              value={newTip.match}
              onChange={(e) => setNewTip(prev => ({ ...prev, match: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="prediction">Prediction</Label>
            <Textarea
              id="prediction"
              placeholder="Over 2.5 Goals, Team A Win, etc."
              value={newTip.prediction}
              onChange={(e) => setNewTip(prev => ({ ...prev, prediction: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="odds">Odds</Label>
              <Input
                id="odds"
                placeholder="2.50"
                value={newTip.odds}
                onChange={(e) => setNewTip(prev => ({ ...prev, odds: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newTip.date}
                onChange={(e) => setNewTip(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newTip.time}
                onChange={(e) => setNewTip(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="confidence">Confidence: {newTip.confidence}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={newTip.confidence}
              onChange={(e) => setNewTip(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onSubmit} className="flex-1">
              {isEditing ? "Update Tip" : "Add Tip"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Settings className="w-8 h-8 text-premium" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={() => setIsAddTipModalOpen(true)} className="bg-premium text-premium-foreground hover:bg-premium/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Tip
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-premium mx-auto mb-2" />
            <div className="text-2xl font-bold">{tips.length}</div>
            <div className="text-sm text-muted-foreground">Total Tips</div>
          </div>
          <div className="bg-card rounded-lg p-6 text-center">
            <Crown className="w-8 h-8 text-premium mx-auto mb-2" />
            <div className="text-2xl font-bold">{tips.filter(t => t.isPremium).length}</div>
            <div className="text-sm text-muted-foreground">Premium Tips</div>
          </div>
          <div className="bg-card rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-premium mx-auto mb-2" />
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="bg-card rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-premium mx-auto mb-2" />
            <div className="text-2xl font-bold">{users.filter(u => u.isPremium).length}</div>
            <div className="text-sm text-muted-foreground">Premium Users</div>
          </div>
        </div>

        <Tabs defaultValue="tips" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tips">Manage Tips</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tips" className="space-y-4">
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">All Tips</h3>
              </div>
              <div className="divide-y divide-border">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{tip.match}</h4>
                        {tip.isPremium && (
                          <Badge className="bg-premium text-premium-foreground">Premium</Badge>
                        )}
                        <Badge variant={tip.status === "won" ? "default" : tip.status === "lost" ? "destructive" : "secondary"}>
                          {tip.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.league} • {tip.prediction} • {tip.odds}</p>
                      <p className="text-xs text-muted-foreground">{tip.date} at {tip.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tip.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(tip.id, "won")}>
                            Mark Won
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(tip.id, "lost")}>
                            Mark Lost
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleEditTip(tip)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteTip(tip.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">User Management</h3>
              </div>
              <div className="divide-y divide-border">
                {users.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{user.name}</h4>
                        {user.isPremium && (
                          <Crown className="w-4 h-4 text-premium" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.isPremium ? "default" : "secondary"}>
                        {user.isPremium ? "Premium" : "Free"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TipFormModal 
        isOpen={isAddTipModalOpen}
        onClose={() => setIsAddTipModalOpen(false)}
        onSubmit={handleAddTip}
      />
      
      <TipFormModal 
        isOpen={!!editingTip}
        onClose={() => setEditingTip(null)}
        onSubmit={handleUpdateTip}
        isEditing={true}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default AdminDashboard;