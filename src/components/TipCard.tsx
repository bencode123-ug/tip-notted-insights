import { Crown, Calendar, Clock, TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TipCardProps {
  tip: {
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
  };
  isLocked?: boolean;
  onUpgrade?: () => void;
}

export const TipCard = ({ tip, isLocked = false, onUpgrade }: TipCardProps) => {
  const getStatusBadge = () => {
    switch (tip.status) {
      case "won":
        return <Badge className="status-won">Won</Badge>;
      case "lost":
        return <Badge className="status-lost">Lost</Badge>;
      case "pending":
        return <Badge className="status-pending">Pending</Badge>;
      default:
        return <Badge className="status-pending">Pending</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-premium";
    return "text-muted-foreground";
  };

  if (isLocked) {
    return (
      <div className="tip-card relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-12 h-12 text-premium mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Content</h3>
            <p className="text-muted-foreground mb-4">Upgrade to access premium tips</p>
            <Button
              onClick={onUpgrade}
              className="bg-premium text-premium-foreground hover:bg-premium/90 glow-premium"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
        
        <div className="blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="secondary" className="mb-2">{tip.league}</Badge>
              <h3 className="text-lg font-semibold">{tip.match}</h3>
            </div>
            {tip.isPremium && (
              <div className="premium-badge">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Prediction</h4>
              <p className="text-muted-foreground">{tip.prediction}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-muted-foreground">Odds</h5>
                <p className="text-lg font-bold text-premium">{tip.odds}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-muted-foreground">Confidence</h5>
                <p className={`text-lg font-bold ${getConfidenceColor(tip.confidence)}`}>
                  {tip.confidence}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{tip.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tip.time}</span>
                </div>
              </div>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tip-card ${tip.isPremium ? 'tip-card-premium' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Badge variant="secondary" className="mb-2">{tip.league}</Badge>
          <h3 className="text-lg font-semibold">{tip.match}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {tip.isPremium && (
            <div className="premium-badge">
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </div>
          )}
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-foreground mb-1">Prediction</h4>
          <p className="text-muted-foreground">{tip.prediction}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-muted-foreground mb-1">Odds</h5>
            <p className="text-lg font-bold text-premium">{tip.odds}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-muted-foreground mb-1">Confidence</h5>
            <div className="flex items-center space-x-2">
              <p className={`text-lg font-bold ${getConfidenceColor(tip.confidence)}`}>
                {tip.confidence}%
              </p>
              <TrendingUp className={`w-4 h-4 ${getConfidenceColor(tip.confidence)}`} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{tip.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{tip.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};