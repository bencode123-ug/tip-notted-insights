// Tips functionality

class TipsManager {
    constructor() {
        this.tips = [];
        this.init();
    }

    async init() {
        await this.loadTips();
        this.renderFeaturedTips();
    }

    async loadTips() {
        try {
            const snapshot = await firebase.database.ref('tips').once('value');
            const tipsData = snapshot.val();
            
            if (tipsData) {
                this.tips = Object.values(tipsData);
            } else {
                this.tips = [];
            }
        } catch (error) {
            console.error('Error loading tips:', error);
            this.tips = [];
        }
    }

    renderFeaturedTips() {
        const container = document.getElementById('featured-tips');
        if (!container) return;

        // Show first 3 tips as featured
        const featuredTips = this.tips.slice(0, 3);
        
        container.innerHTML = featuredTips.map(tip => this.createTipCard(tip)).join('');
        lucide.createIcons();
    }

    createTipCard(tip, isLocked = false) {
        const user = authManager.getCurrentUser();
        const shouldLock = tip.isPremium && (!user || !user.isPremium);
        
        if (shouldLock) {
            return this.createLockedTipCard(tip);
        }

        const confidenceColor = this.getConfidenceColor(tip.confidence);
        const statusBadge = this.getStatusBadge(tip.status);

        return `
            <div class="tip-card ${tip.isPremium ? 'tip-card-premium' : ''} fade-in">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-semibold text-lg mb-1">${tip.title}</h3>
                        <p class="text-muted-foreground text-sm">${tip.league}</p>
                    </div>
                    <div class="flex gap-2">
                        ${statusBadge}
                        ${tip.isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-muted-foreground">Match</p>
                        <p class="font-medium">${tip.match}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm text-muted-foreground">Prediction</p>
                        <p class="font-medium text-accent">${tip.prediction}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-muted-foreground">Odds</p>
                            <p class="font-bold text-lg">${tip.odds}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Confidence</p>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold ${confidenceColor}">${tip.confidence}%</span>
                                <div class="confidence-bar flex-1">
                                    <div class="confidence-fill ${confidenceColor.replace('text-', '')}" style="width: ${tip.confidence}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                        <span>${tip.date}</span>
                        <span>${tip.time}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createLockedTipCard(tip) {
        return `
            <div class="tip-card tip-card-premium tip-card-locked fade-in">
                <div class="flex justify-between items-start mb-4 opacity-30">
                    <div>
                        <h3 class="font-semibold text-lg mb-1">${tip.title}</h3>
                        <p class="text-muted-foreground text-sm">${tip.league}</p>
                    </div>
                    <span class="premium-badge">PREMIUM</span>
                </div>
                
                <div class="space-y-3 opacity-30">
                    <div>
                        <p class="text-sm text-muted-foreground">Match</p>
                        <p class="font-medium">${tip.match}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm text-muted-foreground">Prediction</p>
                        <p class="font-medium">••••••••</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-muted-foreground">Odds</p>
                            <p class="font-bold text-lg">•.••</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Confidence</p>
                            <p class="font-semibold">••%</p>
                        </div>
                    </div>
                </div>
                
                <div class="unlock-content">
                    <i data-lucide="lock" class="w-12 h-12 text-premium mb-4"></i>
                    <h4 class="font-semibold text-lg mb-2">Premium Content</h4>
                    <p class="text-muted-foreground text-center mb-4">
                        Unlock this premium tip with expert analysis and higher winning odds.
                    </p>
                    <button onclick="authManager.handleUpgrade()" class="btn-premium">
                        <i data-lucide="crown" class="w-4 h-4 mr-2"></i>
                        Upgrade Now
                    </button>
                </div>
            </div>
        `;
    }

    getStatusBadge(status) {
        const badges = {
            won: '<span class="status-badge status-won">Won</span>',
            lost: '<span class="status-badge status-lost">Lost</span>',
            pending: '<span class="status-badge status-pending">Pending</span>'
        };
        return badges[status] || badges.pending;
    }

    getConfidenceColor(confidence) {
        if (confidence >= 80) return 'text-success confidence-high';
        if (confidence >= 60) return 'text-accent confidence-medium';
        return 'text-destructive confidence-low';
    }

    // Filter tips by category
    getFreeTips() {
        return this.tips.filter(tip => !tip.isPremium);
    }

    getPremiumTips() {
        return this.tips.filter(tip => tip.isPremium);
    }

    // Search and filter functionality
    searchTips(query, league = '', status = '') {
        return this.tips.filter(tip => {
            const matchesQuery = !query || 
                tip.title.toLowerCase().includes(query.toLowerCase()) ||
                tip.match.toLowerCase().includes(query.toLowerCase()) ||
                tip.prediction.toLowerCase().includes(query.toLowerCase());
            
            const matchesLeague = !league || tip.league === league;
            const matchesStatus = !status || tip.status === status;
            
            return matchesQuery && matchesLeague && matchesStatus;
        });
    }

    // Get unique leagues for filter dropdown
    getLeagues() {
        const leagues = [...new Set(this.tips.map(tip => tip.league))];
        return leagues.sort();
    }

    // Admin methods
    async addTip(tipData) {
        try {
            const result = await firebase.database.ref('tips').push(tipData);
            await this.loadTips(); // Reload tips
            return result;
        } catch (error) {
            console.error('Error adding tip:', error);
            throw error;
        }
    }

    async updateTip(tipId, tipData) {
        try {
            await firebase.database.ref('tips').child(tipId).update(tipData);
            await this.loadTips(); // Reload tips
        } catch (error) {
            console.error('Error updating tip:', error);
            throw error;
        }
    }

    async deleteTip(tipId) {
        try {
            await firebase.database.ref('tips').child(tipId).remove();
            await this.loadTips(); // Reload tips
        } catch (error) {
            console.error('Error deleting tip:', error);
            throw error;
        }
    }

    // Utility method to refresh tips when auth state changes
    async refreshTips() {
        await this.loadTips();
        this.renderFeaturedTips();
    }
}

// Initialize tips manager
const tipsManager = new TipsManager();

// Listen for auth state changes to refresh tip visibility
authManager.onAuthStateChange(() => {
    tipsManager.refreshTips();
});