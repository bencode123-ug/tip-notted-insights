// Tips Management
class TipsManager {
    constructor() {
        this.tips = [];
        this.init();
    }

    init() {
        this.loadMockData();
        this.renderTips();
    }

    // Mock data - replace with Firebase queries
    loadMockData() {
        this.tips = [
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
                status: "pending",
                isPremium: false,
                analysis: "Both teams have strong attacking records this season..."
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
                status: "pending",
                isPremium: false,
                analysis: "High-scoring match expected with both teams' attacking prowess..."
            },
            {
                id: "3",
                title: "Real Madrid vs Barcelona",
                league: "La Liga",
                match: "Real Madrid vs Barcelona",
                prediction: "Real Madrid Win",
                odds: "2.10",
                confidence: 90,
                date: "Tomorrow",
                time: "21:00",
                status: "pending",
                isPremium: true,
                analysis: "El Clasico premium analysis with detailed statistical breakdown..."
            },
            {
                id: "4",
                title: "Bayern Munich vs Dortmund",
                league: "Bundesliga",
                match: "Bayern Munich vs Dortmund",
                prediction: "Over 3.5 Goals",
                odds: "2.40",
                confidence: 88,
                date: "Tomorrow",
                time: "18:30",
                status: "pending",
                isPremium: true,
                analysis: "Der Klassiker premium tip with insider information..."
            },
            {
                id: "5",
                title: "AC Milan vs Inter",
                league: "Serie A",
                match: "AC Milan vs Inter",
                prediction: "Under 2.5 Goals",
                odds: "2.10",
                confidence: 72,
                date: "Yesterday",
                time: "19:00",
                status: "won",
                isPremium: false,
                analysis: "Milan Derby tactical analysis..."
            },
            {
                id: "6",
                title: "PSG vs Lyon",
                league: "Ligue 1",
                match: "PSG vs Lyon",
                prediction: "PSG Win & Over 2.5",
                odds: "1.95",
                confidence: 85,
                date: "Yesterday",
                time: "20:00",
                status: "won",
                isPremium: true,
                analysis: "Premium combo bet with detailed reasoning..."
            }
        ];
    }

    renderTips(container = 'featuredTips', filterType = 'all') {
        const tipsContainer = document.getElementById(container);
        if (!tipsContainer) return;

        let filteredTips = this.tips;

        // Apply filters
        if (filterType === 'free') {
            filteredTips = this.tips.filter(tip => !tip.isPremium);
        } else if (filterType === 'premium') {
            filteredTips = this.tips.filter(tip => tip.isPremium);
        }

        // Limit to 6 tips for featured section
        if (container === 'featuredTips') {
            filteredTips = filteredTips.slice(0, 6);
        }

        tipsContainer.innerHTML = filteredTips.map(tip => this.createTipCard(tip)).join('');
    }

    createTipCard(tip) {
        const canViewPremium = !tip.isPremium || (auth.isLoggedIn() && auth.isPremium());
        
        return `
            <div class="tip-card ${tip.isPremium ? 'premium' : ''}" data-tip-id="${tip.id}">
                ${tip.isPremium ? '<div class="premium-badge">Premium</div>' : ''}
                
                <div class="tip-header">
                    <div>
                        <h3 class="tip-title">${tip.title}</h3>
                        <p class="tip-league">${tip.league}</p>
                    </div>
                    <div class="status-badge status-${tip.status}">
                        ${tip.status.charAt(0).toUpperCase() + tip.status.slice(1)}
                    </div>
                </div>

                <div class="tip-match">
                    <strong>${tip.match}</strong>
                </div>

                <div class="tip-prediction">
                    <strong>Prediction:</strong> ${canViewPremium ? tip.prediction : 'Premium Content - Upgrade to View'}
                </div>

                <div class="tip-analysis">
                    ${canViewPremium ? tip.analysis : 'Detailed analysis available for premium members only.'}
                </div>

                <div class="tip-odds">
                    <div class="odds-value">
                        ${canViewPremium ? tip.odds : 'X.XX'}
                    </div>
                    <div class="confidence">
                        Confidence: ${canViewPremium ? tip.confidence + '%' : 'Premium'}
                    </div>
                </div>

                <div class="tip-time">
                    ${tip.date} at ${tip.time}
                </div>

                ${!canViewPremium ? `
                    <div class="tip-upgrade">
                        <button class="btn btn-primary btn-full" onclick="upgradeToPremium()">
                            Upgrade for Full Access
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Admin functions
    addTip(tipData) {
        const newTip = {
            id: Date.now().toString(),
            ...tipData,
            status: 'pending'
        };
        
        this.tips.unshift(newTip);
        this.renderTips();
        
        // In real app, save to Firebase
        console.log('Tip added:', newTip);
    }

    updateTip(id, updates) {
        const tipIndex = this.tips.findIndex(tip => tip.id === id);
        if (tipIndex !== -1) {
            this.tips[tipIndex] = { ...this.tips[tipIndex], ...updates };
            this.renderTips();
            
            // In real app, update Firebase
            console.log('Tip updated:', this.tips[tipIndex]);
        }
    }

    deleteTip(id) {
        this.tips = this.tips.filter(tip => tip.id !== id);
        this.renderTips();
        
        // In real app, delete from Firebase
        console.log('Tip deleted:', id);
    }

    getTip(id) {
        return this.tips.find(tip => tip.id === id);
    }

    searchTips(query, filters = {}) {
        let results = this.tips;

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(tip => 
                tip.title.toLowerCase().includes(searchTerm) ||
                tip.league.toLowerCase().includes(searchTerm) ||
                tip.match.toLowerCase().includes(searchTerm)
            );
        }

        // League filter
        if (filters.league && filters.league !== 'all') {
            results = results.filter(tip => tip.league === filters.league);
        }

        // Status filter
        if (filters.status && filters.status !== 'all') {
            results = results.filter(tip => tip.status === filters.status);
        }

        // Date filter
        if (filters.date) {
            results = results.filter(tip => tip.date === filters.date);
        }

        return results;
    }

    getLeagues() {
        const leagues = [...new Set(this.tips.map(tip => tip.league))];
        return leagues.sort();
    }

    getStats() {
        const total = this.tips.length;
        const won = this.tips.filter(tip => tip.status === 'won').length;
        const lost = this.tips.filter(tip => tip.status === 'lost').length;
        const pending = this.tips.filter(tip => tip.status === 'pending').length;
        
        return {
            total,
            won,
            lost,
            pending,
            winRate: total > 0 ? Math.round((won / (won + lost)) * 100) : 0
        };
    }
}

// Global tips instance
const tipsManager = new TipsManager();

// Filter functions
function filterTips(type) {
    tipsManager.renderTips('tipsContainer', type);
}

function searchTips() {
    const searchInput = document.getElementById('searchInput');
    const leagueSelect = document.getElementById('leagueFilter');
    
    if (!searchInput) return;
    
    const query = searchInput.value;
    const filters = {
        league: leagueSelect ? leagueSelect.value : 'all'
    };

    const results = tipsManager.searchTips(query, filters);
    
    const container = document.getElementById('tipsContainer');
    if (container) {
        container.innerHTML = results.map(tip => tipsManager.createTipCard(tip)).join('');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No tips found</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>
            `;
        }
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchTips);
    }
    
    const leagueFilter = document.getElementById('leagueFilter');
    if (leagueFilter) {
        leagueFilter.addEventListener('change', searchTips);
        
        // Populate league options
        const leagues = tipsManager.getLeagues();
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueFilter.appendChild(option);
        });
    }
});