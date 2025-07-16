// Firebase Configuration File
// Add your Firebase configuration here

const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase (you would include Firebase CDN in production)
// For now, we'll simulate Firebase functionality

class MockFirebase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('nottedtips_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('nottedtips_current_user') || 'null');
        this.tips = JSON.parse(localStorage.getItem('nottedtips_tips') || '[]');
        
        // Initialize with sample data if empty
        if (this.tips.length === 0) {
            this.initializeSampleData();
        }
    }

    // Auth methods
    auth = {
        signInWithEmailAndPassword: (email, password) => {
            return new Promise((resolve, reject) => {
                const user = this.users.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = { ...user };
                    delete this.currentUser.password;
                    localStorage.setItem('nottedtips_current_user', JSON.stringify(this.currentUser));
                    resolve({ user: this.currentUser });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            });
        },

        createUserWithEmailAndPassword: (email, password) => {
            return new Promise((resolve, reject) => {
                if (this.users.find(u => u.email === email)) {
                    reject(new Error('User already exists'));
                    return;
                }

                const newUser = {
                    id: Date.now().toString(),
                    email,
                    password,
                    name: email.split('@')[0],
                    isPremium: false,
                    isAdmin: email === 'admin@nottedtips.com',
                    createdAt: new Date().toISOString()
                };

                this.users.push(newUser);
                localStorage.setItem('nottedtips_users', JSON.stringify(this.users));

                this.currentUser = { ...newUser };
                delete this.currentUser.password;
                localStorage.setItem('nottedtips_current_user', JSON.stringify(this.currentUser));

                resolve({ user: this.currentUser });
            });
        },

        signOut: () => {
            return new Promise((resolve) => {
                this.currentUser = null;
                localStorage.removeItem('nottedtips_current_user');
                resolve();
            });
        },

        getCurrentUser: () => {
            return this.currentUser;
        }
    };

    // Database methods
    database = {
        ref: (path) => ({
            once: (event) => {
                return new Promise((resolve) => {
                    if (path === 'tips') {
                        resolve({
                            val: () => this.tips.reduce((acc, tip) => {
                                acc[tip.id] = tip;
                                return acc;
                            }, {})
                        });
                    } else if (path === 'users') {
                        resolve({
                            val: () => this.users.reduce((acc, user) => {
                                const userCopy = { ...user };
                                delete userCopy.password;
                                acc[user.id] = userCopy;
                                return acc;
                            }, {})
                        });
                    }
                });
            },

            push: (data) => {
                return new Promise((resolve) => {
                    const id = Date.now().toString();
                    const newItem = { id, ...data };
                    
                    if (path === 'tips') {
                        this.tips.push(newItem);
                        localStorage.setItem('nottedtips_tips', JSON.stringify(this.tips));
                    }
                    
                    resolve({ key: id });
                });
            },

            child: (id) => ({
                update: (data) => {
                    return new Promise((resolve) => {
                        if (path === 'tips') {
                            const index = this.tips.findIndex(tip => tip.id === id);
                            if (index !== -1) {
                                this.tips[index] = { ...this.tips[index], ...data };
                                localStorage.setItem('nottedtips_tips', JSON.stringify(this.tips));
                            }
                        } else if (path === 'users') {
                            const index = this.users.findIndex(user => user.id === id);
                            if (index !== -1) {
                                this.users[index] = { ...this.users[index], ...data };
                                localStorage.setItem('nottedtips_users', JSON.stringify(this.users));
                                
                                // Update current user if it's the same user
                                if (this.currentUser && this.currentUser.id === id) {
                                    this.currentUser = { ...this.currentUser, ...data };
                                    localStorage.setItem('nottedtips_current_user', JSON.stringify(this.currentUser));
                                }
                            }
                        }
                        resolve();
                    });
                },

                remove: () => {
                    return new Promise((resolve) => {
                        if (path === 'tips') {
                            this.tips = this.tips.filter(tip => tip.id !== id);
                            localStorage.setItem('nottedtips_tips', JSON.stringify(this.tips));
                        }
                        resolve();
                    });
                }
            })
        })
    };

    initializeSampleData() {
        const sampleTips = [
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
                createdAt: new Date().toISOString()
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
                status: "pending",
                isPremium: true,
                createdAt: new Date().toISOString()
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
                status: "pending",
                isPremium: true,
                createdAt: new Date().toISOString()
            }
        ];

        this.tips = sampleTips;
        localStorage.setItem('nottedtips_tips', JSON.stringify(this.tips));
    }
}

// Export mock Firebase instance
window.firebase = new MockFirebase();