import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TipCard } from "@/components/TipCard";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Lock, Search, Filter, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

const PremiumTips = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("all");

  // Mock premium tips data
  const premiumTips = [
    {
      id: "1",
      title: "Barcelona vs Real Madrid",
      league: "La Liga",
      match: "Barcelona vs Real Madrid",
      prediction: "Barcelona Win",
      odds: "2.10",
      confidence: 92,
      date: "Tomorrow",
      time: "20:00",
      status: "pending" as const,
      isPremium: true
    },
    {
      id: "2",
      title: "Bayern Munich vs Dortmund",
      league: "Bundesliga",
      match: "Bayern Munich vs Dortmund",
      prediction: "Both Teams to Score",
      odds: "1.70",
      confidence: 89,
      date: "Tomorrow",
      time: "18:30",
      status: "pending" as const,
      isPremium: true
    },
    {
      id: "3",
      title: "Juventus vs Roma",
      league: "Serie A",
      match: "Juventus vs Roma",
      prediction: "Over 2.5 Goals",
      odds: "2.30",
      confidence: 85,
      date: "Today",
      time: "19:45",
      status: "pending" as const,
      isPremium: true
    },
    {
      id: "4",
      title: "Manchester City vs Tottenham",
      league: "Premier League",
      match: "Manchester City vs Tottenham",
      prediction: "Man City Win & Over 2.5",
      odds: "2.80",
      confidence: 87,
      date: "Sunday",
      time: "16:00",
      status: "pending" as const,
      isPremium: true
    },
    {
      id: "5",
      title: "PSG vs Monaco",
      league: "Ligue 1",
      match: "PSG vs Monaco",
      prediction: "PSG Win -1 Handicap",
      odds: "2.45",
      confidence: 83,
      date: "Yesterday",
      time: "21:00",
      status: "won" as const,
      isPremium: true
    },
    {
      id: "6",
      title: "Sevilla vs Villarreal",
      league: "La Liga",
      match: "Sevilla vs Villarreal",
      prediction: "Draw No Bet - Sevilla",
      odds: "1.95",
      confidence: 81,
      date: "Yesterday",
      time: "18:30",
      status: "won" as const,
      isPremium: true
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

  const filteredTips = premiumTips.filter(tip => {
    const matchesSearch = tip.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.league.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLeague = selectedLeague === "all" || tip.league === selectedLeague;
    return matchesSearch && matchesLeague;
  });

  // Paywall for non-premium users
  if (!user?.isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          user={user} 
          onLogin={() => setIsAuthModalOpen(true)} 
          onLogout={handleLogout} 
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-premium/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock className="w-12 h-12 text-premium" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Premium Tips</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Unlock exclusive premium football betting tips with higher odds, detailed analysis, 
              and insider insights from our expert analysts.
            </p>

            {/* Premium Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card rounded-lg p-6">
                <TrendingUp className="w-8 h-8 text-premium mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Higher Odds</h3>
                <p className="text-sm text-muted-foreground">
                  Access tips with better odds and higher potential returns
                </p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <Star className="w-8 h-8 text-premium mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Expert Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  In-depth statistical analysis and match insights
                </p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <Crown className="w-8 h-8 text-premium mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Exclusive Access</h3>
                <p className="text-sm text-muted-foreground">
                  Premium-only tips from our top-rated analysts
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-premium" />
                <h3 className="text-2xl font-bold">Premium Membership</h3>
              </div>
              <div className="text-4xl font-bold text-premium mb-2">£29.99</div>
              <div className="text-muted-foreground mb-6">per month</div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-premium rounded-full"></div>
                  <span>Access to all premium tips</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-premium rounded-full"></div>
                  <span>Detailed match analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-premium rounded-full"></div>
                  <span>Higher odds and better returns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-premium rounded-full"></div>
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleUpgrade}
                size="lg"
                className="bg-premium text-premium-foreground hover:bg-premium/90 glow-premium"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
              <Link to="/tips-free">
                <Button size="lg" variant="outline">
                  View Free Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

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
            <Crown className="w-8 h-8 text-premium" />
            <h1 className="text-4xl font-bold">Premium Tips</h1>
            <div className="premium-badge">PRO</div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exclusive premium football betting tips with higher odds, detailed analysis, 
            and insider insights from our expert analysts.
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

        {/* Premium Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-premium">94%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-premium">2.8x</div>
            <div className="text-sm text-muted-foreground">Avg Odds</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-premium">12</div>
            <div className="text-sm text-muted-foreground">Tips Today</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-premium">+47%</div>
            <div className="text-sm text-muted-foreground">ROI</div>
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
            <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No premium tips found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find more tips.
            </p>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default PremiumTips;