// Authentication functionality

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authCallbacks = [];
        this.init();
    }

    init() {
        // Check for existing user session
        this.currentUser = firebase.auth.getCurrentUser();
        this.updateUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login/Logout buttons
        const loginBtn = document.getElementById('login-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

        if (loginBtn) loginBtn.addEventListener('click', () => this.showAuthModal());
        if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => this.showAuthModal());
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', () => this.logout());

        // Modal functionality
        const authModal = document.getElementById('auth-modal');
        const closeModal = document.getElementById('close-modal');
        const authForm = document.getElementById('auth-form');
        const toggleAuth = document.getElementById('toggle-auth');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.hideAuthModal());
        }

        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) this.hideAuthModal();
            });
        }

        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        }

        if (toggleAuth) {
            toggleAuth.addEventListener('click', () => this.toggleAuthMode());
        }

        // Upgrade button
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => this.handleUpgrade());
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    showAuthModal(mode = 'login') {
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('auth-title');
        const submitText = document.getElementById('auth-submit-text');
        const toggleText = document.getElementById('toggle-text');
        const nameField = document.getElementById('name-field');

        if (mode === 'login') {
            title.textContent = 'Login';
            submitText.textContent = 'Login';
            toggleText.textContent = "Don't have an account? Sign up";
            nameField.classList.add('hidden');
        } else {
            title.textContent = 'Sign Up';
            submitText.textContent = 'Sign Up';
            toggleText.textContent = 'Already have an account? Login';
            nameField.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
        this.authMode = mode;
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('hidden');
        
        // Reset form
        const form = document.getElementById('auth-form');
        if (form) form.reset();
    }

    toggleAuthMode() {
        const newMode = this.authMode === 'login' ? 'signup' : 'login';
        this.showAuthModal(newMode);
    }

    async handleAuthSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        try {
            let result;
            if (this.authMode === 'login') {
                result = await firebase.auth.signInWithEmailAndPassword(email, password);
            } else {
                result = await firebase.auth.createUserWithEmailAndPassword(email, password);
                if (name) {
                    await firebase.database.ref('users').child(result.user.id).update({ name });
                    result.user.name = name;
                }
            }

            this.currentUser = result.user;
            this.updateUI();
            this.hideAuthModal();
            this.showNotification(`Welcome ${this.currentUser.name || this.currentUser.email}!`, 'success');
            
            // Trigger callbacks
            this.authCallbacks.forEach(callback => callback(this.currentUser));
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async logout() {
        try {
            await firebase.auth.signOut();
            this.currentUser = null;
            this.updateUI();
            this.showNotification('Logged out successfully', 'success');
            
            // Trigger callbacks
            this.authCallbacks.forEach(callback => callback(null));
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleUpgrade() {
        if (!this.currentUser) {
            this.showAuthModal();
            return;
        }

        if (this.currentUser.isPremium) {
            window.location.href = 'tips-premium.html';
            return;
        }

        try {
            // Simulate premium upgrade
            await firebase.database.ref('users').child(this.currentUser.id).update({ isPremium: true });
            this.currentUser.isPremium = true;
            this.updateUI();
            this.showNotification('Upgraded to Premium! 🎉', 'success');
            
            // Trigger callbacks
            this.authCallbacks.forEach(callback => callback(this.currentUser));
            
        } catch (error) {
            this.showNotification('Upgrade failed. Please try again.', 'error');
        }
    }

    updateUI() {
        // Update navigation
        const loginBtn = document.getElementById('login-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const userInfo = document.getElementById('user-info');
        const mobileUserInfo = document.getElementById('mobile-user-info');
        const upgradeBtn = document.getElementById('upgrade-btn');
        const upgradeText = document.getElementById('upgrade-text');

        if (this.currentUser) {
            // Hide login buttons
            if (loginBtn) loginBtn.classList.add('hidden');
            if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
            
            // Show user info
            if (userInfo) userInfo.classList.remove('hidden');
            if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');

            // Update user name
            const userName = document.getElementById('user-name');
            const mobileUserName = document.getElementById('mobile-user-name');
            if (userName) userName.textContent = this.currentUser.name || this.currentUser.email.split('@')[0];
            if (mobileUserName) mobileUserName.textContent = this.currentUser.name || this.currentUser.email.split('@')[0];

            // Update premium status
            const premiumCrown = document.getElementById('premium-crown');
            const mobilePremiumCrown = document.getElementById('mobile-premium-crown');
            
            if (this.currentUser.isPremium) {
                if (premiumCrown) premiumCrown.classList.remove('hidden');
                if (mobilePremiumCrown) mobilePremiumCrown.classList.remove('hidden');
                if (upgradeText) upgradeText.textContent = "You're Premium!";
            } else {
                if (premiumCrown) premiumCrown.classList.add('hidden');
                if (mobilePremiumCrown) mobilePremiumCrown.classList.add('hidden');
                if (upgradeText) upgradeText.textContent = "Upgrade to Premium";
            }

            // Show/hide admin link
            const adminLink = document.getElementById('admin-link');
            if (adminLink) {
                if (this.currentUser.isAdmin) {
                    adminLink.classList.remove('hidden');
                } else {
                    adminLink.classList.add('hidden');
                }
            }

            // Show history link
            const historyLink = document.getElementById('history-link');
            if (historyLink) historyLink.classList.remove('hidden');

        } else {
            // Show login buttons
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
            
            // Hide user info
            if (userInfo) userInfo.classList.add('hidden');
            if (mobileUserInfo) mobileUserInfo.classList.add('hidden');

            // Hide admin and history links
            const adminLink = document.getElementById('admin-link');
            const historyLink = document.getElementById('history-link');
            if (adminLink) adminLink.classList.add('hidden');
            if (historyLink) historyLink.classList.add('hidden');

            // Reset upgrade button
            if (upgradeText) upgradeText.textContent = "Upgrade to Premium";
        }

        // Update CTA buttons
        this.updateCTAButtons();
    }

    updateCTAButtons() {
        const ctaButtons = document.getElementById('cta-buttons');
        if (!ctaButtons) return;

        let html = '';
        
        if (!this.currentUser) {
            html = `
                <button onclick="authManager.showAuthModal()" class="btn-premium btn-lg">
                    Get Started Free
                </button>
                <a href="tips-free.html" class="btn-outline btn-lg">
                    Browse Free Tips
                </a>
            `;
        } else if (!this.currentUser.isPremium) {
            html = `
                <button onclick="authManager.handleUpgrade()" class="btn-premium btn-lg glow-premium">
                    <i data-lucide="crown" class="w-5 h-5 mr-2"></i>
                    Upgrade to Premium
                </button>
                <a href="tips-free.html" class="btn-outline btn-lg">
                    Browse Free Tips
                </a>
            `;
        } else {
            html = `
                <a href="tips-premium.html" class="btn-premium btn-lg">
                    <i data-lucide="crown" class="w-5 h-5 mr-2"></i>
                    View Premium Tips
                </a>
                <a href="tips-free.html" class="btn-outline btn-lg">
                    Browse Free Tips
                </a>
            `;
        }

        ctaButtons.innerHTML = html;
        lucide.createIcons();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-success text-success-foreground' :
            type === 'error' ? 'bg-destructive text-destructive-foreground' :
            'bg-card text-card-foreground border border-border'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public method to register auth state change callbacks
    onAuthStateChange(callback) {
        this.authCallbacks.push(callback);
    }

    // Public method to get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();