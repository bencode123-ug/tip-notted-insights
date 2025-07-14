// Main application initialization and utilities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Update navigation active states
    updateNavigation();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'tips-free':
            initializeFreeTipsPage();
            break;
        case 'tips-premium':
            initializePremiumTipsPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
    }
    
    // Add global event listeners
    setupGlobalEventListeners();
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

function updateNavigation() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPage === 'index' && href === 'index.html') ||
            href === `${currentPage}.html`) {
            link.classList.add('active');
        }
    });
}

function initializeHomePage() {
    // Load featured tips
    if (typeof tipsManager !== 'undefined') {
        tipsManager.renderTips('featuredTips', 'all');
    }
    
    // Setup pricing buttons
    const upgradeButtons = document.querySelectorAll('[onclick*="upgradeToPremium"]');
    upgradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!auth.isLoggedIn()) {
                auth.openModal('loginModal');
            } else {
                auth.upgradeToPremium();
            }
        });
    });
}

function initializeFreeTipsPage() {
    // Load free tips
    if (typeof tipsManager !== 'undefined') {
        tipsManager.renderTips('tipsContainer', 'free');
    }
    
    // Setup filters
    setupFilters();
}

function initializePremiumTipsPage() {
    // Check access
    if (!auth.isLoggedIn() || !auth.isPremium()) {
        showPaywall();
    } else {
        // Load premium tips
        if (typeof tipsManager !== 'undefined') {
            tipsManager.renderTips('tipsContainer', 'premium');
        }
    }
    
    // Setup filters
    setupFilters();
}

function initializeAdminPage() {
    // Check admin access
    if (!auth.isLoggedIn() || !auth.isAdmin()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize admin functionality
    setupAdminFunctionality();
}

function setupFilters() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchTips, 300));
    }
    
    // League filter
    const leagueFilter = document.getElementById('leagueFilter');
    if (leagueFilter && typeof tipsManager !== 'undefined') {
        // Populate league options
        const leagues = tipsManager.getLeagues();
        leagueFilter.innerHTML = '<option value="all">All Leagues</option>';
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueFilter.appendChild(option);
        });
        
        leagueFilter.addEventListener('change', searchTips);
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', searchTips);
    }
}

function setupAdminFunctionality() {
    // Load all tips for admin
    if (typeof tipsManager !== 'undefined') {
        loadAdminTips();
    }
    
    // Setup admin forms
    setupAdminForms();
    
    // Load user management
    loadUserManagement();
}

function loadAdminTips() {
    const container = document.getElementById('adminTipsContainer');
    if (!container) return;
    
    const tips = tipsManager.tips;
    container.innerHTML = tips.map(tip => createAdminTipCard(tip)).join('');
}

function createAdminTipCard(tip) {
    return `
        <div class="admin-tip-card" data-tip-id="${tip.id}">
            <div class="tip-info">
                <h4>${tip.title}</h4>
                <p>${tip.league} - ${tip.date}</p>
                <span class="status-badge status-${tip.status}">${tip.status}</span>
                ${tip.isPremium ? '<span class="premium-badge">Premium</span>' : ''}
            </div>
            <div class="tip-actions">
                <button class="btn btn-outline btn-sm" onclick="editTip('${tip.id}')">Edit</button>
                <button class="btn btn-outline btn-sm" onclick="updateTipStatus('${tip.id}')">Update Status</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTip('${tip.id}')">Delete</button>
            </div>
        </div>
    `;
}

function setupAdminForms() {
    // Add tip form
    const addTipForm = document.getElementById('addTipForm');
    if (addTipForm) {
        addTipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(addTipForm);
            const tipData = {
                title: formData.get('title'),
                league: formData.get('league'),
                match: formData.get('match'),
                prediction: formData.get('prediction'),
                odds: formData.get('odds'),
                confidence: parseInt(formData.get('confidence')),
                date: formData.get('date'),
                time: formData.get('time'),
                isPremium: formData.get('isPremium') === 'on',
                analysis: formData.get('analysis')
            };
            
            tipsManager.addTip(tipData);
            addTipForm.reset();
            loadAdminTips();
            auth.showToast('Tip added successfully!', 'success');
        });
    }
}

function loadUserManagement() {
    // Mock user data - replace with Firebase queries
    const users = [
        { id: '1', name: 'John Doe', email: 'john@example.com', isPremium: false, isAdmin: false },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', isPremium: true, isAdmin: false },
        { id: '3', name: 'Admin User', email: 'admin@nottedtips.com', isPremium: true, isAdmin: true }
    ];
    
    const container = document.getElementById('usersContainer');
    if (container) {
        container.innerHTML = users.map(user => createUserCard(user)).join('');
    }
}

function createUserCard(user) {
    return `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>${user.email}</p>
                <div class="user-badges">
                    ${user.isPremium ? '<span class="premium-badge">Premium</span>' : '<span class="free-badge">Free</span>'}
                    ${user.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                </div>
            </div>
            <div class="user-actions">
                <button class="btn btn-outline btn-sm" onclick="togglePremium('${user.id}')">
                    ${user.isPremium ? 'Remove Premium' : 'Make Premium'}
                </button>
                <button class="btn btn-outline btn-sm" onclick="toggleAdmin('${user.id}')">
                    ${user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
            </div>
        </div>
    `;
}

function showPaywall() {
    const container = document.getElementById('tipsContainer');
    if (container) {
        container.innerHTML = `
            <div class="paywall">
                <div class="paywall-content">
                    <h2>Premium Content</h2>
                    <p>Upgrade to premium to access exclusive tips with higher odds and detailed analysis.</p>
                    <div class="paywall-features">
                        <ul>
                            <li>✓ Exclusive premium tips</li>
                            <li>✓ Higher odds selections</li>
                            <li>✓ Detailed match analysis</li>
                            <li>✓ Real-time notifications</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary btn-large" onclick="upgradeToPremium()">
                        Upgrade to Premium - $29/month
                    </button>
                </div>
            </div>
        `;
    }
}

function setupGlobalEventListeners() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            auth.closeModal(modalId);
        }
    });
    
    // Handle keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const activeModals = document.querySelectorAll('.modal.active');
            activeModals.forEach(modal => {
                auth.closeModal(modal.id);
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Admin functions (called from HTML)
function editTip(id) {
    const tip = tipsManager.getTip(id);
    if (!tip) return;
    
    // Fill edit form with tip data
    const form = document.getElementById('editTipForm');
    if (form) {
        Object.keys(tip).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = tip[key];
                } else {
                    input.value = tip[key];
                }
            }
        });
        
        // Show edit modal
        auth.openModal('editTipModal');
        
        // Store tip ID for saving
        form.dataset.tipId = id;
    }
}

function deleteTip(id) {
    if (confirm('Are you sure you want to delete this tip?')) {
        tipsManager.deleteTip(id);
        loadAdminTips();
        auth.showToast('Tip deleted successfully!', 'success');
    }
}

function updateTipStatus(id) {
    const tip = tipsManager.getTip(id);
    if (!tip) return;
    
    const newStatus = prompt('Enter new status (won/lost/pending):', tip.status);
    if (newStatus && ['won', 'lost', 'pending'].includes(newStatus)) {
        tipsManager.updateTip(id, { status: newStatus });
        loadAdminTips();
        auth.showToast('Tip status updated!', 'success');
    }
}

function togglePremium(userId) {
    // Mock function - implement with Firebase
    auth.showToast('User premium status updated!', 'success');
    loadUserManagement();
}

function toggleAdmin(userId) {
    // Mock function - implement with Firebase
    auth.showToast('User admin status updated!', 'success');
    loadUserManagement();
}