// Authentication Management
class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // Check for saved user session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateUI();
        }

        // Setup form listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Modal close events
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Simulate Firebase login - replace with actual Firebase code
            const userData = await this.simulateLogin(email, password);
            
            this.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            
            this.updateUI();
            this.closeModal('loginModal');
            this.showToast('Login successful!', 'success');
            
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            // Simulate Firebase registration - replace with actual Firebase code
            const userData = await this.simulateRegister(name, email, password);
            
            this.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            
            this.updateUI();
            this.closeModal('registerModal');
            this.showToast('Account created successfully!', 'success');
            
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    // Simulate Firebase authentication - replace with actual Firebase calls
    async simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@nottedtips.com') {
                    resolve({
                        id: 'admin-123',
                        name: 'Admin User',
                        email: email,
                        isPremium: true,
                        isAdmin: true
                    });
                } else if (email && password) {
                    resolve({
                        id: 'user-' + Date.now(),
                        name: 'User',
                        email: email,
                        isPremium: false,
                        isAdmin: false
                    });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }

    async simulateRegister(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password) {
                    resolve({
                        id: 'user-' + Date.now(),
                        name: name,
                        email: email,
                        isPremium: false,
                        isAdmin: false
                    });
                } else {
                    reject(new Error('All fields are required'));
                }
            }, 1000);
        });
    }

    logout() {
        this.user = null;
        localStorage.removeItem('user');
        this.updateUI();
        this.showToast('Logged out successfully', 'info');
        
        // Redirect to home if on admin page
        if (window.location.pathname.includes('admin')) {
            window.location.href = 'index.html';
        }
    }

    upgradeToPremium() {
        if (!this.user) {
            this.openModal('loginModal');
            return;
        }

        // Simulate payment - replace with actual payment gateway
        this.user.isPremium = true;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateUI();
        this.showToast('Upgraded to Premium!', 'success');
    }

    updateUI() {
        const navAuth = document.getElementById('navAuth');
        
        if (this.user) {
            navAuth.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">Welcome, ${this.user.name}</span>
                    ${this.user.isPremium ? '<span class="premium-badge">Premium</span>' : ''}
                    ${this.user.isAdmin ? '<a href="admin.html" class="nav-link">Admin</a>' : ''}
                    <button class="btn btn-outline" onclick="auth.logout()">Logout</button>
                </div>
            `;
        } else {
            navAuth.innerHTML = `
                <button class="btn btn-outline" onclick="openLoginModal()">Login</button>
                <button class="btn btn-primary" onclick="openRegisterModal()">Sign Up</button>
            `;
        }

        // Update page-specific elements
        this.updatePageSpecificUI();
    }

    updatePageSpecificUI() {
        // Check if user can access premium content
        const premiumContent = document.querySelectorAll('.premium-only');
        const paywall = document.getElementById('paywall');

        if (this.user && this.user.isPremium) {
            premiumContent.forEach(el => el.style.display = 'block');
            if (paywall) paywall.style.display = 'none';
        } else {
            premiumContent.forEach(el => el.style.display = 'none');
            if (paywall) paywall.style.display = 'block';
        }

        // Admin access
        const adminContent = document.querySelectorAll('.admin-only');
        if (this.user && this.user.isAdmin) {
            adminContent.forEach(el => el.style.display = 'block');
        } else {
            adminContent.forEach(el => el.style.display = 'none');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add toast styles if not already defined
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
            `;
            document.body.appendChild(container);
        }

        const container = document.querySelector('.toast-container');
        container.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Public methods for global access
    getUser() {
        return this.user;
    }

    isLoggedIn() {
        return !!this.user;
    }

    isPremium() {
        return this.user && this.user.isPremium;
    }

    isAdmin() {
        return this.user && this.user.isAdmin;
    }
}

// Global auth instance
const auth = new AuthManager();

// Global helper functions
function openLoginModal() {
    auth.openModal('loginModal');
}

function openRegisterModal() {
    auth.openModal('registerModal');
}

function closeModal(modalId) {
    auth.closeModal(modalId);
}

function switchToRegister() {
    auth.closeModal('loginModal');
    auth.openModal('registerModal');
}

function switchToLogin() {
    auth.closeModal('registerModal');
    auth.openModal('loginModal');
}

function upgradeToPremium() {
    auth.upgradeToPremium();
}