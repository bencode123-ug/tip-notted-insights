import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Menu, X, Home, Trophy, Lock, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  user?: {
    name: string;
    isPremium: boolean;
    isAdmin: boolean;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navigation = ({ user, onLogin, onLogout }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-premium rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-premium-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NottedTips</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/tips-free"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/tips-free") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Free Tips</span>
            </Link>
            
            <Link
              to="/tips-premium"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/tips-premium") ? "bg-premium text-premium-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Premium Tips</span>
              {user?.isPremium && (
                <div className="premium-badge text-xs px-2 py-0.5">PRO</div>
              )}
            </Link>

            {user && (
              <Link
                to="/history"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive("/history") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>History</span>
              </Link>
            )}

            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive("/admin") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Hello,</span>
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.isPremium && (
                    <Crown className="w-4 h-4 text-premium" />
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} className="bg-premium text-premium-foreground hover:bg-premium/90">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/tips-free" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted">
                <Trophy className="w-4 h-4" />
                <span>Free Tips</span>
              </Link>
              <Link to="/tips-premium" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted">
                <Crown className="w-4 h-4" />
                <span>Premium Tips</span>
              </Link>
              {user && (
                <Link to="/history" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted">
                  <Trophy className="w-4 h-4" />
                  <span>History</span>
                </Link>
              )}
              {user?.isAdmin && (
                <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted">
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Hello, {user.name}</span>
                        {user.isPremium && <Crown className="w-4 h-4 text-premium" />}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onLogout} className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={onLogin} className="w-full bg-premium text-premium-foreground hover:bg-premium/90">
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};