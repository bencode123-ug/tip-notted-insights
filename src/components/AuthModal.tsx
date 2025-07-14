import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (loginForm.email && loginForm.password) {
      let user;
      
      // Demo accounts
      if (loginForm.email === "admin@nottedtips.com") {
        user = {
          id: "1",
          name: "Admin User",
          email: loginForm.email,
          isPremium: true,
          isAdmin: true
        };
      } else if (loginForm.email === "premium@example.com") {
        user = {
          id: "2",
          name: "Premium User",
          email: loginForm.email,
          isPremium: true,
          isAdmin: false
        };
      } else {
        user = {
          id: "3",
          name: "Free User",
          email: loginForm.email,
          isPremium: false,
          isAdmin: false
        };
      }
      
      onLogin(user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
      onClose();
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (registerForm.name && registerForm.email && registerForm.password) {
      const user = {
        id: Date.now().toString(),
        name: registerForm.name,
        email: registerForm.email,
        isPremium: false,
        isAdmin: false
      };
      
      onLogin(user);
      toast({
        title: "Welcome to NottedTips!",
        description: "Your account has been created successfully",
      });
      onClose();
    } else {
      toast({
        title: "Registration failed",
        description: "Please fill in all fields",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome to NottedTips
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-premium text-premium-foreground hover:bg-premium/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Demo accounts:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@nottedtips.com</p>
                <p><strong>Premium:</strong> premium@example.com</p>
                <p><strong>Free:</strong> any other email</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-premium text-premium-foreground hover:bg-premium/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-1">
                <Crown className="w-4 h-4 text-premium" />
                <span>Start with a free account, upgrade anytime!</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};