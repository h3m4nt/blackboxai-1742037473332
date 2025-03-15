// Rewards System Management
class RewardsSystem {
    constructor() {
        this.user = this.loadUserData();
    }

    // Load user data from localStorage
    loadUserData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData);
        }
        return {
            coins: 0,
            rewardHistory: [],
            subscriptions: [],
            referralCode: this.generateReferralCode(),
            referrals: [],
            purchaseHistory: []
        };
    }

    // Save user data to localStorage
    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.user));
    }

    // Generate unique referral code
    generateReferralCode() {
        return 'FJA' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Add coins to user's balance
    addCoins(amount, reason) {
        this.user.coins += amount;
        this.user.rewardHistory.push({
            type: 'earn',
            amount: amount,
            reason: reason,
            timestamp: new Date().toISOString()
        });
        this.saveUserData();
        this.updateUI();
    }

    // Deduct coins from user's balance
    deductCoins(amount, reason) {
        if (this.user.coins >= amount) {
            this.user.coins -= amount;
            this.user.rewardHistory.push({
                type: 'spend',
                amount: amount,
                reason: reason,
                timestamp: new Date().toISOString()
            });
            this.saveUserData();
            this.updateUI();
            return true;
        }
        return false;
    }

    // Handle referral signup
    handleReferral(referralCode) {
        // Find referrer
        const referrer = this.findReferrer(referralCode);
        if (referrer) {
            // Add coins to referrer
            this.addCoins(200, 'Referral bonus - New user signup');
            // Add coins to new user
            this.addCoins(100, 'Welcome bonus - Referred by ' + referralCode);
            return true;
        }
        return false;
    }

    // Find referrer by code
    findReferrer(referralCode) {
        // In a real application, this would query a database
        // For now, we'll just return true if the code starts with 'FJA'
        return referralCode.startsWith('FJA');
    }

    // Add subscription
    addSubscription(type, duration) {
        const subscription = {
            type: type,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
        };
        this.user.subscriptions.push(subscription);
        this.saveUserData();
    }

    // Check if user has active subscription
    hasActiveSubscription(type) {
        const now = new Date();
        return this.user.subscriptions.some(sub => 
            sub.type === type && new Date(sub.endDate) > now
        );
    }

    // Add purchase to history
    addPurchase(item, cost) {
        const purchase = {
            item: item,
            cost: cost,
            timestamp: new Date().toISOString()
        };
        this.user.purchaseHistory.push(purchase);
        this.saveUserData();
    }

    // Get user's reward history
    getRewardHistory() {
        return this.user.rewardHistory;
    }

    // Get user's purchase history
    getPurchaseHistory() {
        return this.user.purchaseHistory;
    }

    // Get user's active subscriptions
    getActiveSubscriptions() {
        const now = new Date();
        return this.user.subscriptions.filter(sub => new Date(sub.endDate) > now);
    }

    // Update UI elements
    updateUI() {
        // Update coin balance display
        const coinBalance = document.getElementById('coinBalance');
        if (coinBalance) {
            coinBalance.textContent = this.user.coins;
        }

        // Update other UI elements as needed
        this.updateRewardHistory();
        this.updateSubscriptions();
    }

    // Update reward history display
    updateRewardHistory() {
        const historyContainer = document.getElementById('rewardHistory');
        if (historyContainer) {
            historyContainer.innerHTML = this.user.rewardHistory
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(record => `
                    <div class="flex justify-between items-center p-3 border-b">
                        <div>
                            <div class="font-semibold">${record.reason}</div>
                            <div class="text-sm text-gray-600">
                                ${new Date(record.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="${record.type === 'earn' ? 'text-green-500' : 'text-red-500'}">
                            ${record.type === 'earn' ? '+' : '-'}${record.amount} coins
                        </div>
                    </div>
                `).join('');
        }
    }

    // Update subscriptions display
    updateSubscriptions() {
        const subscriptionsContainer = document.getElementById('activeSubscriptions');
        if (subscriptionsContainer) {
            subscriptionsContainer.innerHTML = this.getActiveSubscriptions()
                .map(sub => `
                    <div class="p-3 border-b">
                        <div class="font-semibold">${sub.type}</div>
                        <div class="text-sm text-gray-600">
                            Expires: ${new Date(sub.endDate).toLocaleDateString()}
                        </div>
                    </div>
                `).join('');
        }
    }

    // Award coins for completing activities
    awardActivityCoins(activity) {
        const rewards = {
            'watch_ad': 10,
            'daily_login': 5,
            'complete_profile': 20,
            'join_telegram': 50,
            'share_job': 2,
            'complete_quiz': 15
        };

        if (rewards[activity]) {
            this.addCoins(rewards[activity], `Completed activity: ${activity}`);
            return true;
        }
        return false;
    }
}

// Initialize rewards system
const rewardsSystem = new RewardsSystem();

// Example usage:
// rewardsSystem.addCoins(100, 'Welcome bonus');
// rewardsSystem.awardActivityCoins('watch_ad');
// rewardsSystem.deductCoins(50, 'Purchased eBook');
