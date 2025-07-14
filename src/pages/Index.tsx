import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { TipCard } from "@/components/TipCard";
import { AuthModal } from "@/components/AuthModal";
import { Crown, Trophy, TrendingUp, Users, Target, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stadium.jpg";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Mock featured tips data
  const featuredTips = [
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
      title: "Barcelona vs Real Madrid",
      league: "La Liga",
      match: "Barcelona vs Real Madrid",
      prediction: "Barcelona Win",
      odds: "2.10",
      confidence: 75,
      date: "Tomorrow",
      time: "20:00",
      status: "pending" as const,
      isPremium: true
    },
    {
      id: "3",
      title: "Bayern Munich vs Dortmund",
      league: "Bundesliga",
      match: "Bayern Munich vs Dortmund",
      prediction: "Both Teams to Score",
      odds: "1.70",
      confidence: 90,
      date: "Tomorrow",
      time: "18:30",
      status: "pending" as const,
      isPremium: true
    }
  ];

  const stats = [
    { icon: Target, label: "Win Rate", value: "87%", color: "text-success" },
    { icon: Trophy, label: "Tips This Week", value: "24", color: "text-premium" },
    { icon: Users, label: "Active Users", value: "2.5K", color: "text-accent" },
    { icon: Star, label: "Premium Tips", value: "12", color: "text-premium" }
  ];

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
    
    // Simulate premium upgrade
    setUser(prev => prev ? { ...prev, isPremium: true } : null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Football
              <span className="text-premium block">Betting Tips</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get expert predictions from seasoned analysts. Join thousands of successful bettors 
              who trust NottedTips for their winning strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/tips-free">
                <Button size="lg" className="bg-premium text-premium-foreground hover:bg-premium/90 glow-premium">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Free Tips
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => !user ? setIsAuthModalOpen(true) : handleUpgrade()}
                className="border-premium text-premium hover:bg-premium hover:text-premium-foreground"
              >
                <Crown className="w-5 h-5 mr-2" />
                {user?.isPremium ? "You're Premium!" : "Upgrade to Premium"}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="tip-card text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Tips</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our top picks for today's matches. Premium tips offer higher odds and expert analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredTips.map((tip) => (
              <TipCard 
                key={tip.id} 
                tip={tip}
                isLocked={tip.isPremium && !user?.isPremium}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/tips-free">
              <Button variant="outline" size="lg">
                View All Free Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NottedTips?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional analysis, real-time updates, and proven track record make us the best choice for football betting tips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-premium/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-premium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">87% Win Rate</h3>
              <p className="text-muted-foreground">
                Our expert analysts maintain an industry-leading win rate across all leagues.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-premium/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-premium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All Major Leagues</h3>
              <p className="text-muted-foreground">
                Coverage of Premier League, La Liga, Serie A, Bundesliga, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-premium/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-premium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Analysis</h3>
              <p className="text-muted-foreground">
                In-depth statistical analysis and insider insights for premium members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Winning?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of successful bettors who trust our expert predictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Button 
                  size="lg" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-premium text-premium-foreground hover:bg-premium/90"
                >
                  Get Started Free
                </Button>
              ) : !user.isPremium ? (
                <Button 
                  size="lg" 
                  onClick={handleUpgrade}
                  className="bg-premium text-premium-foreground hover:bg-premium/90 glow-premium"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
              ) : (
                <Link to="/tips-premium">
                  <Button size="lg" className="bg-premium text-premium-foreground hover:bg-premium/90">
                    <Crown className="w-5 h-5 mr-2" />
                    View Premium Tips
                  </Button>
                </Link>
              )}
              <Link to="/tips-free">
                <Button size="lg" variant="outline">
                  Browse Free Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
