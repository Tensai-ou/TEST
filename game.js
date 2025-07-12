class GalacticClicker {
    constructor() {
        this.gameState = {
            cosmicEnergy: 0,
            energyPerSecond: 0,
            clickPower: 1,
            criticalChance: 0.05,
            criticalMultiplier: 2,
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            currentPlanet: 0,
            totalClicks: 0,
            totalEnergyEarned: 0,
            gameStartTime: Date.now(),
            alienBoosts: {
                greenAlien: { active: false, endTime: 0 },
                blueAlien: { active: false, endTime: 0 }
            }
        };

        this.planets = [
            { name: "Mars Kolonisi", target: 5000, reward: "Otomatik Madenci", emoji: "🔴" },
            { name: "Jüpiter İstasyonu", target: 25000, reward: "Kritik Hasar x3", emoji: "🟠" },
            { name: "Satürn Halkası", target: 75000, reward: "Enerji Çoğaltıcı", emoji: "🪐" },
            { name: "Andromeda Galaksisi", target: 200000, reward: "Tüm Gelir x2", emoji: "🌌" },
            { name: "Kuasar Merkezi", target: 500000, reward: "Kuantum Sıçrama", emoji: "⭐" }
        ];

        this.upgrades = [
            {
                id: 'advanced_cursor',
                name: 'Gelişmiş İmleç',
                description: 'Tıklama başına +2 KE',
                baseCost: 50,
                cost: 50,
                effect: () => this.gameState.clickPower += 2,
                purchased: false,
                emoji: '🖱️'
            },
            {
                id: 'laser_cursor',
                name: 'Lazer İmleç',
                description: 'Kritik şans %10',
                baseCost: 200,
                cost: 200,
                effect: () => this.gameState.criticalChance += 0.05,
                purchased: false,
                emoji: '🔫'
            },
            {
                id: 'quantum_chip',
                name: 'Kuantum Çipi',
                description: 'Tüm pasif gelir x1.5',
                baseCost: 1000,
                cost: 1000,
                effect: () => this.updateEnergyPerSecond(),
                purchased: false,
                emoji: '💎'
            },
            {
                id: 'cosmic_amplifier',
                name: 'Kozmik Yükselteç',
                description: 'Tıklama gücü x2',
                baseCost: 5000,
                cost: 5000,
                effect: () => this.gameState.clickPower *= 2,
                purchased: false,
                emoji: '⚡'
            },
            {
                id: 'stellar_core',
                name: 'Yıldız Çekirdeği',
                description: 'Kritik hasar x3',
                baseCost: 15000,
                cost: 15000,
                effect: () => this.gameState.criticalMultiplier += 1,
                purchased: false,
                emoji: '🌟'
            },
            {
                id: 'galactic_network',
                name: 'Galaktik Ağ',
                description: 'Tüm üreticiler %50 daha hızlı',
                baseCost: 50000,
                cost: 50000,
                effect: () => this.updateEnergyPerSecond(),
                purchased: false,
                emoji: '🌐'
            }
        ];

        this.generators = [
            {
                id: 'robotic_miners',
                name: 'Robotik Madenciler',
                description: 'Saniyede 1 KE üretir',
                baseCost: 100,
                cost: 100,
                baseProduction: 1,
                count: 0,
                emoji: '🤖'
            },
            {
                id: 'satellite_farms',
                name: 'Uydu Çiftlikleri',
                description: 'Saniyede 5 KE üretir',
                baseCost: 500,
                cost: 500,
                baseProduction: 5,
                count: 0,
                emoji: '🛰️'
            },
            {
                id: 'star_reactors',
                name: 'Yıldız Reaktörleri',
                description: 'Saniyede 25 KE üretir',
                baseCost: 2500,
                cost: 2500,
                baseProduction: 25,
                count: 0,
                emoji: '⚛️'
            },
            {
                id: 'quantum_factories',
                name: 'Kuantum Fabrikaları',
                description: 'Saniyede 100 KE üretir',
                baseCost: 10000,
                cost: 10000,
                baseProduction: 100,
                count: 0,
                emoji: '🏭'
            },
            {
                id: 'dimensional_portals',
                name: 'Boyutsal Portallar',
                description: 'Saniyede 500 KE üretir',
                baseCost: 50000,
                cost: 50000,
                baseProduction: 500,
                count: 0,
                emoji: '🌀'
            },
            {
                id: 'cosmic_engines',
                name: 'Kozmik Motorlar',
                description: 'Saniyede 2000 KE üretir',
                baseCost: 200000,
                cost: 200000,
                baseProduction: 2000,
                count: 0,
                emoji: '🚀'
            }
        ];

        this.achievements = [
            { id: 'first_click', name: 'İlk Tıklama', description: '1 kez tıkla', condition: () => this.gameState.totalClicks >= 1, unlocked: false, emoji: '👆' },
            { id: 'hundred_clicks', name: 'Tıklama Ustası', description: '100 kez tıkla', condition: () => this.gameState.totalClicks >= 100, unlocked: false, emoji: '💪' },
            { id: 'first_thousand', name: 'İlk Bin', description: '1,000 KE kazan', condition: () => this.gameState.totalEnergyEarned >= 1000, unlocked: false, emoji: '💰' },
            { id: 'first_generator', name: 'Otomasyon Başlangıcı', description: 'İlk üreticiyi satın al', condition: () => this.generators.some(g => g.count > 0), unlocked: false, emoji: '⚙️' },
            { id: 'ten_generators', name: 'Üretim Hattı', description: '10 üretici satın al', condition: () => this.generators.reduce((sum, g) => sum + g.count, 0) >= 10, unlocked: false, emoji: '🏗️' },
            { id: 'first_upgrade', name: 'Teknoloji Meraklısı', description: 'İlk yükseltmeyi satın al', condition: () => this.upgrades.some(u => u.purchased), unlocked: false, emoji: '🔬' },
            { id: 'mars_complete', name: 'Mars Fatihi', description: 'Mars görevini tamamla', condition: () => this.gameState.currentPlanet >= 1, unlocked: false, emoji: '🔴' },
            { id: 'jupiter_complete', name: 'Jüpiter Kaşifi', description: 'Jüpiter görevini tamamla', condition: () => this.gameState.currentPlanet >= 2, unlocked: false, emoji: '🟠' },
            { id: 'first_prestige', name: 'Galaktik Yeniden Doğuş', description: 'İlk prestij yap', condition: () => this.gameState.prestigeLevel >= 1, unlocked: false, emoji: '🌟' }
        ];

        this.init();
    }

    init() {
        this.loadGame();
        this.bindEvents();
        this.renderUpgrades();
        this.renderGenerators();
        this.renderAchievements();
        this.updateDisplay();
        this.startGameLoop();
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
    }

    bindEvents() {
        // Main clicker
        document.getElementById('main-clicker').addEventListener('click', (e) => this.handleClick(e));
        
        // Alien friends
        document.getElementById('green-alien').addEventListener('click', () => this.activateGreenAlien());
        document.getElementById('blue-alien').addEventListener('click', () => this.activateBlueAlien());
        
        // Prestige
        document.getElementById('prestige-btn').addEventListener('click', () => this.showPrestigeModal());
        document.getElementById('confirm-prestige').addEventListener('click', () => this.doPrestige());
        document.getElementById('cancel-prestige').addEventListener('click', () => this.hidePrestigeModal());
        
        // Close modal on outside click
        document.getElementById('prestige-modal').addEventListener('click', (e) => {
            if (e.target.id === 'prestige-modal') {
                this.hidePrestigeModal();
            }
        });
    }

    handleClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        let energyGained = this.gameState.clickPower;
        let isCritical = false;
        
        // Apply green alien boost
        if (this.gameState.alienBoosts.greenAlien.active) {
            energyGained *= 2;
        }
        
        // Critical hit check
        if (Math.random() < this.gameState.criticalChance) {
            energyGained *= this.gameState.criticalMultiplier;
            isCritical = true;
        }
        
        this.gameState.cosmicEnergy += energyGained;
        this.gameState.totalClicks++;
        this.gameState.totalEnergyEarned += energyGained;
        
        // Visual effects
        this.createClickEffect();
        this.createFloatingNumber(energyGained, event.clientX, event.clientY, isCritical);
        
        this.updateDisplay();
        this.checkAchievements();
        this.checkPlanetProgress();
    }

    createClickEffect() {
        const effect = document.getElementById('click-effect');
        effect.classList.remove('active');
        setTimeout(() => effect.classList.add('active'), 10);
    }

    createFloatingNumber(value, x, y, isCritical = false) {
        const floatingNumber = document.createElement('div');
        floatingNumber.className = `floating-number ${isCritical ? 'critical' : ''}`;
        floatingNumber.textContent = `+${this.formatNumber(value)} KE`;
        floatingNumber.style.left = x + 'px';
        floatingNumber.style.top = y + 'px';
        
        document.getElementById('floating-numbers').appendChild(floatingNumber);
        
        setTimeout(() => {
            floatingNumber.remove();
        }, 2000);
    }

    activateGreenAlien() {
        const button = document.getElementById('green-alien');
        if (this.gameState.alienBoosts.greenAlien.active) return;
        
        this.gameState.alienBoosts.greenAlien.active = true;
        this.gameState.alienBoosts.greenAlien.endTime = Date.now() + 30000; // 30 seconds
        
        button.disabled = true;
        button.innerHTML = '👽 Aktif<br><small id="green-timer">30s</small>';
        
        this.startAlienTimer('green');
    }

    activateBlueAlien() {
        const button = document.getElementById('blue-alien');
        if (this.gameState.alienBoosts.blueAlien.active) return;
        
        this.gameState.alienBoosts.blueAlien.active = true;
        this.gameState.alienBoosts.blueAlien.endTime = Date.now() + 3600000; // 1 hour
        
        button.disabled = true;
        button.innerHTML = '🛸 Aktif<br><small id="blue-timer">60:00</small>';
        
        this.startAlienTimer('blue');
        this.updateEnergyPerSecond();
    }

    startAlienTimer(alienType) {
        const timer = setInterval(() => {
            const boost = this.gameState.alienBoosts[alienType + 'Alien'];
            const remaining = Math.max(0, boost.endTime - Date.now());
            
            if (remaining <= 0) {
                boost.active = false;
                clearInterval(timer);
                
                const button = document.getElementById(alienType + '-alien');
                button.disabled = false;
                
                if (alienType === 'green') {
                    button.innerHTML = '👽 Yeşil Uzaylı<br><small>x2 KE (30s)</small>';
                } else {
                    button.innerHTML = '🛸 Mavi Uzaylı<br><small>+50% Pasif (1h)</small>';
                    this.updateEnergyPerSecond();
                }
                return;
            }
            
            const timerElement = document.getElementById(alienType + '-timer');
            if (timerElement) {
                if (alienType === 'green') {
                    timerElement.textContent = Math.ceil(remaining / 1000) + 's';
                } else {
                    const minutes = Math.floor(remaining / 60000);
                    const seconds = Math.floor((remaining % 60000) / 1000);
                    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);
    }

    renderUpgrades() {
        const container = document.getElementById('upgrades-container');
        container.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-item ${this.gameState.cosmicEnergy >= upgrade.cost && !upgrade.purchased ? 'affordable' : ''} ${upgrade.purchased ? 'purchased' : ''}`;
            
            upgradeElement.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${upgrade.emoji} ${upgrade.name}</span>
                    <span class="item-price">${upgrade.purchased ? 'SATIN ALINDI' : this.formatNumber(upgrade.cost) + ' KE'}</span>
                </div>
                <div class="item-description">${upgrade.description}</div>
            `;
            
            if (!upgrade.purchased) {
                upgradeElement.addEventListener('click', () => this.buyUpgrade(upgrade.id));
            }
            
            container.appendChild(upgradeElement);
        });
    }

    renderGenerators() {
        const container = document.getElementById('generators-container');
        container.innerHTML = '';
        
        this.generators.forEach(generator => {
            const generatorElement = document.createElement('div');
            generatorElement.className = `generator-item ${this.gameState.cosmicEnergy >= generator.cost ? 'affordable' : ''}`;
            
            generatorElement.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${generator.emoji} ${generator.name}</span>
                    <span class="item-price">${this.formatNumber(generator.cost)} KE</span>
                </div>
                <div class="item-description">${generator.description}</div>
                <div class="generator-count">Sahip olunan: ${generator.count}</div>
            `;
            
            generatorElement.addEventListener('click', () => this.buyGenerator(generator.id));
            container.appendChild(generatorElement);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.textContent = achievement.emoji;
            achievementElement.title = `${achievement.name}: ${achievement.description}`;
            
            container.appendChild(achievementElement);
        });
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.purchased || this.gameState.cosmicEnergy < upgrade.cost) return;
        
        this.gameState.cosmicEnergy -= upgrade.cost;
        upgrade.purchased = true;
        upgrade.effect();
        
        this.renderUpgrades();
        this.updateDisplay();
        this.checkAchievements();
    }

    buyGenerator(generatorId) {
        const generator = this.generators.find(g => g.id === generatorId);
        if (!generator || this.gameState.cosmicEnergy < generator.cost) return;
        
        this.gameState.cosmicEnergy -= generator.cost;
        generator.count++;
        generator.cost = Math.floor(generator.baseCost * Math.pow(1.15, generator.count));
        
        this.updateEnergyPerSecond();
        this.renderGenerators();
        this.updateDisplay();
        this.checkAchievements();
    }

    updateEnergyPerSecond() {
        let totalProduction = 0;
        
        this.generators.forEach(generator => {
            totalProduction += generator.count * generator.baseProduction;
        });
        
        // Apply upgrade multipliers
        if (this.upgrades.find(u => u.id === 'quantum_chip' && u.purchased)) {
            totalProduction *= 1.5;
        }
        
        if (this.upgrades.find(u => u.id === 'galactic_network' && u.purchased)) {
            totalProduction *= 1.5;
        }
        
        // Apply prestige multiplier
        totalProduction *= this.gameState.prestigeMultiplier;
        
        // Apply blue alien boost
        if (this.gameState.alienBoosts.blueAlien.active) {
            totalProduction *= 1.5;
        }
        
        this.gameState.energyPerSecond = totalProduction;
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition()) {
                achievement.unlocked = true;
                this.showAchievementNotification(achievement);
            }
        });
        this.renderAchievements();
    }

    showAchievementNotification(achievement) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700, #ffaa00);
            color: #000;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 3000;
            animation: slideIn 0.5s ease-out;
        `;
        notification.innerHTML = `🏆 Başarım Açıldı: ${achievement.name}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    checkPlanetProgress() {
        const currentPlanet = this.planets[this.gameState.currentPlanet];
        if (currentPlanet && this.gameState.cosmicEnergy >= currentPlanet.target) {
            this.completePlanet();
        }
    }

    completePlanet() {
        const planet = this.planets[this.gameState.currentPlanet];
        
        // Apply planet reward
        switch (this.gameState.currentPlanet) {
            case 0: // Mars - Otomatik Madenci
                this.generators[0].count += 1;
                break;
            case 1: // Jupiter - Kritik Hasar x3
                this.gameState.criticalMultiplier += 2;
                break;
            case 2: // Saturn - Enerji Çoğaltıcı
                this.gameState.prestigeMultiplier *= 1.2;
                break;
            case 3: // Andromeda - Tüm Gelir x2
                this.gameState.prestigeMultiplier *= 2;
                break;
        }
        
        this.gameState.currentPlanet++;
        this.updateEnergyPerSecond();
        this.updateDisplay();
        this.checkAchievements();
        
        // Show planet completion notification
        this.showPlanetNotification(planet);
    }

    showPlanetNotification(planet) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            z-index: 3000;
            border: 2px solid #ffd700;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        `;
        notification.innerHTML = `
            <h2 style="color: #ffd700; margin-bottom: 15px;">${planet.emoji} ${planet.name} Tamamlandı!</h2>
            <p style="font-size: 1.2rem;">Ödül: ${planet.reward}</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 10px 20px; background: #ffd700; color: #000; border: none; border-radius: 5px; cursor: pointer;">Devam Et</button>
        `;
        
        document.body.appendChild(notification);
    }

    showPrestigeModal() {
        if (this.gameState.cosmicEnergy < 10000) return;
        document.getElementById('prestige-modal').classList.add('active');
    }

    hidePrestigeModal() {
        document.getElementById('prestige-modal').classList.remove('active');
    }

    doPrestige() {
        if (this.gameState.cosmicEnergy < 10000) return;
        
        // Reset game state but keep prestige bonuses
        this.gameState.cosmicEnergy = 0;
        this.gameState.totalClicks = 0;
        this.gameState.totalEnergyEarned = 0;
        this.gameState.clickPower = 1;
        this.gameState.criticalChance = 0.05;
        this.gameState.criticalMultiplier = 2;
        this.gameState.currentPlanet = 0;
        this.gameState.energyPerSecond = 0;
        
        // Increase prestige level and multiplier
        this.gameState.prestigeLevel++;
        this.gameState.prestigeMultiplier *= 1.1; // +10% permanent boost
        
        // Reset upgrades and generators
        this.upgrades.forEach(upgrade => {
            upgrade.purchased = false;
            upgrade.cost = upgrade.baseCost;
        });
        
        this.generators.forEach(generator => {
            generator.count = 0;
            generator.cost = generator.baseCost;
        });
        
        // Reset alien boosts
        this.gameState.alienBoosts.greenAlien.active = false;
        this.gameState.alienBoosts.blueAlien.active = false;
        
        this.hidePrestigeModal();
        this.renderUpgrades();
        this.renderGenerators();
        this.updateDisplay();
        this.checkAchievements();
    }

    updateDisplay() {
        // Update main stats
        document.getElementById('cosmic-energy').textContent = this.formatNumber(this.gameState.cosmicEnergy);
        document.getElementById('energy-per-second').textContent = this.formatNumber(this.gameState.energyPerSecond);
        document.getElementById('prestige-level').textContent = this.gameState.prestigeLevel;
        
        // Update click value
        let clickValue = this.gameState.clickPower;
        if (this.gameState.alienBoosts.greenAlien.active) {
            clickValue *= 2;
        }
        document.getElementById('click-value').textContent = `+${this.formatNumber(clickValue)} KE`;
        
        // Update planet progress
        const currentPlanet = this.planets[this.gameState.currentPlanet];
        if (currentPlanet) {
            document.querySelector('.planet-name').textContent = currentPlanet.name;
            const progress = Math.min(100, (this.gameState.cosmicEnergy / currentPlanet.target) * 100);
            document.getElementById('planet-progress').style.width = progress + '%';
            document.getElementById('planet-progress-text').textContent = 
                `${this.formatNumber(this.gameState.cosmicEnergy)} / ${this.formatNumber(currentPlanet.target)} KE`;
        } else {
            document.querySelector('.planet-name').textContent = 'Tüm Gezegenler Tamamlandı!';
            document.getElementById('planet-progress').style.width = '100%';
            document.getElementById('planet-progress-text').textContent = 'Galaksi Fatihi!';
        }
        
        // Update prestige button
        const prestigeBtn = document.getElementById('prestige-btn');
        if (this.gameState.cosmicEnergy >= 10000) {
            prestigeBtn.disabled = false;
            prestigeBtn.innerHTML = '🌟 Galaktik Reset<small>Hazır!</small>';
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.innerHTML = `🌟 Galaktik Reset<small>${this.formatNumber(10000 - this.gameState.cosmicEnergy)} KE daha gerekli</small>`;
        }
        
        // Update alien buttons
        const greenBtn = document.getElementById('green-alien');
        const blueBtn = document.getElementById('blue-alien');
        
        if (!this.gameState.alienBoosts.greenAlien.active) {
            greenBtn.disabled = false;
            greenBtn.innerHTML = '👽 Yeşil Uzaylı<br><small>x2 KE (30s)</small>';
        }
        
        if (!this.gameState.alienBoosts.blueAlien.active) {
            blueBtn.disabled = false;
            blueBtn.innerHTML = '🛸 Mavi Uzaylı<br><small>+50% Pasif (1h)</small>';
        }
    }

    startGameLoop() {
        setInterval(() => {
            // Passive energy generation
            if (this.gameState.energyPerSecond > 0) {
                const energyGained = this.gameState.energyPerSecond / 10; // 10 times per second for smooth animation
                this.gameState.cosmicEnergy += energyGained;
                this.gameState.totalEnergyEarned += energyGained;
            }
            
            this.updateDisplay();
            this.checkAchievements();
            this.checkPlanetProgress();
        }, 100);
    }

    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }

    saveGame() {
        localStorage.setItem('galacticClickerSave', JSON.stringify({
            gameState: this.gameState,
            upgrades: this.upgrades,
            generators: this.generators,
            achievements: this.achievements
        }));
    }

    loadGame() {
        const saveData = localStorage.getItem('galacticClickerSave');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                
                // Merge saved data with current state
                Object.assign(this.gameState, data.gameState);
                
                // Update upgrades
                if (data.upgrades) {
                    data.upgrades.forEach((savedUpgrade, index) => {
                        if (this.upgrades[index]) {
                            Object.assign(this.upgrades[index], savedUpgrade);
                        }
                    });
                }
                
                // Update generators
                if (data.generators) {
                    data.generators.forEach((savedGenerator, index) => {
                        if (this.generators[index]) {
                            Object.assign(this.generators[index], savedGenerator);
                        }
                    });
                }
                
                // Update achievements
                if (data.achievements) {
                    data.achievements.forEach((savedAchievement, index) => {
                        if (this.achievements[index]) {
                            Object.assign(this.achievements[index], savedAchievement);
                        }
                    });
                }
                
                this.updateEnergyPerSecond();
            } catch (error) {
                console.error('Save dosyası yüklenirken hata:', error);
            }
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GalacticClicker();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);