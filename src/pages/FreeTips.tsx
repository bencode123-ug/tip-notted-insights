import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TipCard } from "@/components/TipCard";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Trophy } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

const FreeTips = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("all");

  // Mock free tips data
  const freeTips = [
    {
      id: "1",
      title: "Manchester United vs Arsenal",
      league: "Premier League",
      match: "Manchester United vs Arsenal",
      prediction: "Over 2.5 Goals",
      odds: "1.85",
      confidence: 85,
      date: "Today",
      time: "15:30",
      status: "pending" as const,
      isPremium: false
    },
    {
      id: "2",
      title: "Liverpool vs Chelsea",
      league: "Premier League",
      match: "Liverpool vs Chelsea",
      prediction: "Both Teams to Score",
      odds: "1.70",
      confidence: 78,
      date: "Today",
      time: "17:45",
      status: "pending" as const,
      isPremium: false
    },
    {
      id: "3",
      title: "AC Milan vs Inter",
      league: "Serie A",
      match: "AC Milan vs Inter",
      prediction: "Under 2.5 Goals",
      odds: "2.10",
      confidence: 72,
      date: "Tomorrow",
      time: "19:00",
      status: "pending" as const,
      isPremium: false
    },
    {
      id: "4",
      title: "Atletico Madrid vs Valencia",
      league: "La Liga",
      match: "Atletico Madrid vs Valencia",
      prediction: "Atletico Win",
      odds: "1.60",
      confidence: 80,
      date: "Tomorrow",
      time: "21:00",
      status: "won" as const,
      isPremium: false
    },
    {
      id: "5",
      title: "PSG vs Lyon",
      league: "Ligue 1",
      match: "PSG vs Lyon",
      prediction: "Over 1.5 Goals",
      odds: "1.45",
      confidence: 88,
      date: "Yesterday",
      time: "20:00",
      status: "won" as const,
      isPremium: false
    },
    {
      id: "6",
      title: "RB Leipzig vs Frankfurt",
      league: "Bundesliga",
      match: "RB Leipzig vs Frankfurt",
      prediction: "Draw",
      odds: "3.20",
      confidence: 65,
      date: "Yesterday",
      time: "15:30",
      status: "lost" as const,
      isPremium: false
    }
  ];

  const leagues = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpgrade = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setUser(prev => prev ? { ...prev, isPremium: true } : null);
  };

  const filteredTips = freeTips.filter(tip => {
    const matchesSearch = tip.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.league.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLeague = selectedLeague === "all" || tip.league === selectedLeague;
    return matchesSearch && matchesLeague;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold">Free Tips</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access our selection of free football betting tips. These tips are available to all users 
            and provide solid value for your betting strategy.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by team or league..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select league" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  {leagues.map(league => (
                    <SelectItem key={league} value={league}>{league}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tips found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find more tips.
            </p>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want More Premium Tips?</h3>
          <p className="text-muted-foreground mb-6">
            Upgrade to premium for access to higher odds, detailed analysis, and exclusive insider tips.
          </p>
          <Button 
            onClick={handleUpgrade}
            className="bg-premium text-premium-foreground hover:bg-premium/90 glow-premium"
            size="lg"
          >
            Upgrade to Premium
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default FreeTips;