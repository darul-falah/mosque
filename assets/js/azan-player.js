// Azan Player for Darul Falah Mosque

class AzanPlayer {
    constructor() {
        this.azanAudio = null;
        this.isEnabled = localStorage.getItem('azanEnabled') !== 'false'; // Default enabled
        this.volume = parseFloat(localStorage.getItem('azanVolume')) || 0.7;
        this.lastPlayedPrayer = localStorage.getItem('lastPlayedPrayer') || '';
        this.checkInterval = null;
        
        this.initializeAudio();
        this.createControls();
        this.startMonitoring();
    }
    
    initializeAudio() {
        // Using your custom Azan audio file
        // Try the actual file first: azaan.m4a
        this.azanAudio = new Audio('assets/audio/azaan.m4a');
        this.azanAudio.volume = this.volume;
        this.azanAudio.preload = 'auto';
        
        // Fallback: Try different audio formats if the first one fails
        this.azanAudio.onerror = () => {
            console.log('Primary Azan audio failed, trying alternative formats');
            this.tryAlternativeFormats();
        };
        
        this.azanAudio.oncanplaythrough = () => {
            console.log('Azan audio loaded successfully: azaan.m4a');
        };
    }
    
    tryAlternativeFormats() {
        const formats = ['azan.mp3', 'azan.wav', 'azan.ogg', 'azan.m4a'];
        let formatIndex = 0;
        
        const tryNextFormat = () => {
            if (formatIndex < formats.length) {
                this.azanAudio = new Audio(`assets/audio/${formats[formatIndex]}`);
                this.azanAudio.volume = this.volume;
                this.azanAudio.preload = 'auto';
                
                this.azanAudio.onerror = () => {
                    formatIndex++;
                    tryNextFormat();
                };
                
                this.azanAudio.oncanplaythrough = () => {
                    console.log(`Azan audio loaded: ${formats[formatIndex]}`);
                };
            } else {
                console.log('All Azan audio formats failed, using fallback tone');
                this.createFallbackTone();
            }
        };
        
        tryNextFormat();
    }
    
    createFallbackTone() {
        // Create a simple Islamic-style tone using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 3);
    }
    
    createControls() {
        // Create mobile toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'azan-toggle-btn';
        toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        toggleButton.id = 'azan-toggle-btn';
        document.body.appendChild(toggleButton);
        
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'azan-modal-backdrop';
        backdrop.id = 'azan-modal-backdrop';
        document.body.appendChild(backdrop);
        
        // Create Azan control panel
        const controlPanel = document.createElement('div');
        controlPanel.className = 'azan-controls';
        controlPanel.innerHTML = `
            <div class="azan-control-panel">
                <div class="azan-header">
                    <i class="fas fa-volume-up me-2"></i>
                    <span>Azan Settings</span>
                    <button class="btn btn-sm btn-outline-secondary ms-auto" id="toggle-azan-panel">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                <div class="azan-settings" id="azan-settings" style="display: none;">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="azan-enabled" ${this.isEnabled ? 'checked' : ''}>
                        <label class="form-check-label" for="azan-enabled">
                            Enable Azan Audio
                        </label>
                    </div>
                    <div class="mb-2">
                        <label for="azan-volume" class="form-label">Volume</label>
                        <input type="range" class="form-range" id="azan-volume" min="0" max="1" step="0.1" value="${this.volume}">
                    </div>
                    <div class="mb-2">
                        <button class="btn btn-sm btn-primary" id="test-azan">Test Azan</button>
                        <small class="text-muted d-block">Note: Browser may require user interaction before playing audio</small>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(controlPanel);
        
        // Add event listeners
        this.setupControlListeners();
    }
    
    setupControlListeners() {
        // Mobile toggle button
        document.getElementById('azan-toggle-btn').addEventListener('click', () => {
            this.toggleMobileModal();
        });
        
        // Modal backdrop click to close
        document.getElementById('azan-modal-backdrop').addEventListener('click', () => {
            this.closeMobileModal();
        });
        
        // Toggle panel
        document.getElementById('toggle-azan-panel').addEventListener('click', () => {
            const settings = document.getElementById('azan-settings');
            settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        });
        
        // Enable/disable toggle
        document.getElementById('azan-enabled').addEventListener('change', (e) => {
            this.isEnabled = e.target.checked;
            localStorage.setItem('azanEnabled', this.isEnabled);
            this.showNotification(this.isEnabled ? 'Azan enabled' : 'Azan disabled');
        });
        
        // Volume control
        document.getElementById('azan-volume').addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
            this.azanAudio.volume = this.volume;
            localStorage.setItem('azanVolume', this.volume);
        });
        
        // Test button
        document.getElementById('test-azan').addEventListener('click', () => {
            this.playAzan('Test', true);
        });
    }
    
    startMonitoring() {
        // Check every 30 seconds for prayer times
        this.checkInterval = setInterval(() => {
            this.checkPrayerTime();
        }, 30000);
        
        // Initial check
        this.checkPrayerTime();
    }
    
    checkPrayerTime() {
        if (!this.isEnabled) return;
        
        const now = new Date();
        const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const currentTime = `${mumbaiTime.getHours().toString().padStart(2, '0')}:${mumbaiTime.getMinutes().toString().padStart(2, '0')}`;
        const today = mumbaiTime.toISOString().split('T')[0];
        
        // Get today's prayer times
        const prayerTimes = getPrayerTimesForDate(today);
        if (!prayerTimes) return;
        
        // Check obligatory prayers for Azan
        const obligatoryPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        // Add Jumu'ah on Fridays
        if (mumbaiTime.getDay() === 5) {
            obligatoryPrayers.push('jumuah');
        }
        
        for (const prayer of obligatoryPrayers) {
            const prayerData = prayerTimes[prayer];
            if (!prayerData || !prayerData.adhan) continue;
            
            const prayerTime = prayerData.adhan;
            const prayerKey = `${today}-${prayer}-${prayerTime}`;
            
            // Check if it's time for this prayer and we haven't played it yet
            if (currentTime === prayerTime && this.lastPlayedPrayer !== prayerKey) {
                this.playAzan(prayer);
                this.lastPlayedPrayer = prayerKey;
                localStorage.setItem('lastPlayedPrayer', prayerKey);
                break;
            }
        }
    }
    
    playAzan(prayerName, isTest = false) {
        if (!this.isEnabled) return;
        
        // Show notification - only show stop control for test mode
        this.showNotification(
            isTest ? 'Testing Azan Audio' : `Azan for ${this.getPrayerDisplayName(prayerName)}`, 
            'prayer', 
            isTest
        );
        
        // Play audio
        this.azanAudio.currentTime = 0;
        const playPromise = this.azanAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(isTest ? 'Azan test played' : `Azan played for ${prayerName}`);
            }).catch(error => {
                console.log('Azan autoplay prevented by browser:', error);
                this.showNotification('Click to enable Azan audio', 'warning');
            });
        }
    }
    
    stopAzan() {
        if (this.azanAudio) {
            this.azanAudio.pause();
            this.azanAudio.currentTime = 0;
            console.log('Azan stopped by user');
        }
    }
    
    getPrayerDisplayName(prayer) {
        const names = {
            'fajr': 'Fajr',
            'dhuhr': 'Dhuhr',
            'asr': 'Asr',
            'maghrib': 'Maghrib',
            'isha': 'Isha',
            'jumuah': 'Jumu\'ah'
        };
        return names[prayer] || prayer;
    }
    
    showNotification(message, type = 'info', isTestMode = false) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `azan-notification azan-notification-${type}`;
        
        // Only show stop controls for test mode
        const stopButton = isTestMode ? `
            <button class="btn btn-sm btn-light me-2" onclick="window.azanPlayer.stopAzan(); this.parentElement.parentElement.remove();">
                <i class="fas fa-stop me-1"></i>Stop Test
            </button>
        ` : '';
        
        // For actual prayer time, show a respectful message
        const closeButtonAction = isTestMode ? 
            `if(window.azanPlayer) window.azanPlayer.stopAzan(); this.parentElement.parentElement.remove()` :
            `this.parentElement.parentElement.remove()`;
            
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'prayer' ? 'mosque' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <span class="flex-grow-1">${message}</span>
                ${stopButton}
                ${!isTestMode ? '<small class="text-light me-2">🕌 Let the complete Azan play</small>' : ''}
                <button class="btn-close ms-2" onclick="${closeButtonAction}"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Different auto-remove behavior for test vs actual prayer
        if (isTestMode) {
            // Test mode: Auto-stop after 15 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    if (this.azanAudio && !this.azanAudio.paused) {
                        this.stopAzan();
                    }
                    notification.remove();
                }
            }, 15000);
        } else {
            // Actual prayer time: Let it play completely, remove notification when audio ends
            if (this.azanAudio) {
                const onAudioEnd = () => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                    this.azanAudio.removeEventListener('ended', onAudioEnd);
                };
                this.azanAudio.addEventListener('ended', onAudioEnd);
                
                // Fallback: remove after 10 minutes if something goes wrong
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 600000);
            }
        }
    }
    
    toggleMobileModal() {
        const controls = document.querySelector('.azan-controls');
        const backdrop = document.getElementById('azan-modal-backdrop');
        const toggleBtn = document.getElementById('azan-toggle-btn');
        
        if (controls.classList.contains('mobile-modal')) {
            this.closeMobileModal();
        } else {
            controls.classList.add('mobile-modal');
            backdrop.style.display = 'block';
            toggleBtn.classList.add('active');
            // Auto-expand settings on mobile
            const settings = document.getElementById('azan-settings');
            settings.style.display = 'block';
        }
    }
    
    closeMobileModal() {
        const controls = document.querySelector('.azan-controls');
        const backdrop = document.getElementById('azan-modal-backdrop');
        const toggleBtn = document.getElementById('azan-toggle-btn');
        
        controls.classList.remove('mobile-modal');
        backdrop.style.display = 'none';
        toggleBtn.classList.remove('active');
    }
    
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        
        const controlPanel = document.querySelector('.azan-controls');
        if (controlPanel) {
            controlPanel.remove();
        }
        
        const toggleBtn = document.getElementById('azan-toggle-btn');
        if (toggleBtn) {
            toggleBtn.remove();
        }
        
        const backdrop = document.getElementById('azan-modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
}

// Initialize Azan Player when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on pages that have prayer times
    if (typeof getPrayerTimesForDate === 'function') {
        window.azanPlayer = new AzanPlayer();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AzanPlayer;
}
