// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Page-specific initialization
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initHomePage();
            break;
        case 'tips-free':
            initFreeTipsPage();
            break;
        case 'tips-premium':
            initPremiumTipsPage();
            break;
        case 'admin':
            initAdminPage();
            break;
        case 'history':
            initHistoryPage();
            break;
    }
    
    // Global event listeners
    setupGlobalEventListeners();
});

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    return filename || 'index';
}

function initHomePage() {
    // Home page is already initialized via tipsManager
    console.log('Home page initialized');
}

function initFreeTipsPage() {
    if (typeof renderFreeTips === 'function') {
        renderFreeTips();
    }
}

function initPremiumTipsPage() {
    if (typeof renderPremiumTips === 'function') {
        renderPremiumTips();
    }
}

function initAdminPage() {
    // Check if user is admin
    const user = authManager.getCurrentUser();
    if (!user || !user.isAdmin) {
        showAccessDenied();
        return;
    }
    
    if (typeof initializeAdminDashboard === 'function') {
        initializeAdminDashboard();
    }
}

function initHistoryPage() {
    // Check if user is logged in
    const user = authManager.getCurrentUser();
    if (!user) {
        showLoginRequired();
        return;
    }
    
    if (typeof renderTipsHistory === 'function') {
        renderTipsHistory();
    }
}

function setupGlobalEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            if (icon) {
                const isOpen = !mobileMenu.classList.contains('hidden');
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('[data-lucide]');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    }
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        // Close modal on Escape
        if (e.key === 'Escape') {
            const modal = document.getElementById('auth-modal');
            if (modal && !modal.classList.contains('hidden')) {
                authManager.hideAuthModal();
            }
        }
    });
    
    // Handle link navigation
    setupNavigation();
}

function setupNavigation() {
    // Add active class to current page navigation
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('.')[0];
        
        if ((currentPage === 'index' && href === 'index.html') ||
            (currentPage !== 'index' && href.includes(currentPage))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function showAccessDenied() {
    const content = document.querySelector('main') || document.body;
    content.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <i data-lucide="shield-x" class="w-16 h-16 mx-auto mb-4 text-destructive"></i>
                <h1 class="text-2xl font-bold mb-2">Access Denied</h1>
                <p class="text-muted-foreground mb-6">You don't have permission to access this page.</p>
                <a href="index.html" class="btn-premium">
                    <i data-lucide="home" class="w-4 h-4 mr-2"></i>
                    Go Home
                </a>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function showLoginRequired() {
    const content = document.querySelector('main') || document.body;
    content.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <i data-lucide="lock" class="w-16 h-16 mx-auto mb-4 text-accent"></i>
                <h1 class="text-2xl font-bold mb-2">Login Required</h1>
                <p class="text-muted-foreground mb-6">Please log in to access this page.</p>
                <div class="flex gap-4 justify-center">
                    <button onclick="authManager.showAuthModal()" class="btn-premium">
                        <i data-lucide="log-in" class="w-4 h-4 mr-2"></i>
                        Login
                    </button>
                    <a href="index.html" class="btn-outline">
                        <i data-lucide="home" class="w-4 h-4 mr-2"></i>
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return timeString; // Assuming time is already formatted
}

function showNotification(message, type = 'info') {
    authManager.showNotification(message, type);
}

// Export for use in other files
window.mainApp = {
    getCurrentPage,
    showNotification,
    formatDate,
    formatTime
};