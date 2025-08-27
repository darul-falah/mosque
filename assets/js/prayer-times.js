// Darul Falah Mosque - Prayer Times JavaScript

// Prayer Times Data (in a real implementation, this would come from an API or database)
// Default prayer times that will be used when specific date is not found
const defaultPrayerTimes = {
    "fajr": {"adhan": "05:06", "iqamah": "05:45"},
    "sunrise": {"time": "06:21"},
    "ishraq": {"time": "06:41"},
    "chasht": {"time": "09:31"},
    "zawal": {"time": "12:36"},
    "dhuhr": {"adhan": "12:41", "iqamah": "13:20"},
    "asr": {"adhan": "17:10", "iqamah": "17:30"},
    "maghrib": {"adhan": "19:04", "iqamah": "19:10"},
    "isha": {"adhan": "20:17", "iqamah": "21:00"},
    "jumuah": {"adhan": "12:41", "iqamah": "13:10"}
};

const prayerTimesData = {
    "2025-08-22": {
        "fajr": {"adhan": "05:06", "iqamah": "05:45"},
        "sunrise": {"time": "06:21"},
        "ishraq": {"time": "06:41"},
        "chasht": {"time": "09:31"},
        "zawal": {"time": "12:36"},
        "dhuhr": {"adhan": "12:41", "iqamah": "13:20"},
        "asr": {"adhan": "17:10", "iqamah": "17:30"},
        "maghrib": {"adhan": "19:04", "iqamah": "19:10"},
        "isha": {"adhan": "20:17", "iqamah": "21:00"},
        "jumuah": {"adhan": "12:41", "iqamah": "13:10"}
    },
    "2025-08-23": {
        "fajr": {"adhan": "05:07", "iqamah": "05:45"},
        "sunrise": {"time": "06:22"},
        "ishraq": {"time": "06:42"},
        "chasht": {"time": "09:32"},
        "zawal": {"time": "12:36"},
        "dhuhr": {"adhan": "12:41", "iqamah": "13:20"},
        "asr": {"adhan": "17:09", "iqamah": "17:30"},
        "maghrib": {"adhan": "19:02", "iqamah": "19:08"},
        "isha": {"adhan": "20:15", "iqamah": "21:00"},
        "jumuah": {"adhan": "12:41", "iqamah": "13:10"}
    },
    "2025-08-24": {
        "fajr": {"adhan": "05:08", "iqamah": "05:45"},
        "sunrise": {"time": "06:23"},
        "ishraq": {"time": "06:43"},
        "chasht": {"time": "09:33"},
        "zawal": {"time": "12:36"},
        "dhuhr": {"adhan": "12:41", "iqamah": "13:20"},
        "asr": {"adhan": "17:08", "iqamah": "17:30"},
        "maghrib": {"adhan": "19:00", "iqamah": "19:06"},
        "isha": {"adhan": "20:13", "iqamah": "21:00"},
        "jumuah": {"adhan": "12:41", "iqamah": "13:10"}
    },
    "2025-08-25": {
        "fajr": {"adhan": "05:09", "iqamah": "05:45"},
        "sunrise": {"time": "06:24"},
        "ishraq": {"time": "06:44"},
        "chasht": {"time": "09:34"},
        "zawal": {"time": "12:36"},
        "dhuhr": {"adhan": "12:41", "iqamah": "13:20"},
        "asr": {"adhan": "17:07", "iqamah": "17:30"},
        "maghrib": {"adhan": "18:58", "iqamah": "19:04"},
        "isha": {"adhan": "20:11", "iqamah": "21:00"},
        "jumuah": {"adhan": "12:41", "iqamah": "13:10"}
    }
};

// Prayer names in order
const prayerNames = ['fajr', 'sunrise', 'ishraq', 'chasht', 'zawal', 'dhuhr', 'asr', 'maghrib', 'isha'];
const obligatoryPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']; // For next prayer calculation
const prayerDisplayNames = {
    'fajr': 'Fajr',
    'sunrise': 'Sunrise (Shuruq)',
    'ishraq': 'Ishraq',
    'chasht': 'Chasht (Duha)',
    'zawal': 'Zawal',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Isha',
    'jumuah': 'Jumu\'ah (Friday)'
};

// Initialize prayer times when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage or prayer times page
    const isHomepage = document.getElementById('prayer-times-container') && !document.getElementById('fullscreen-prayer-times-container');
    
    if (isHomepage) {
        // Homepage: show only Fard prayers
        loadTodaysPrayerTimes(null, true);
    } else {
        // Other pages: show all prayers
        loadTodaysPrayerTimes();
    }
    
    // Update prayer times every minute
    setInterval(updateNextPrayerHighlight, 60000);
});

// Load today's prayer times
function loadTodaysPrayerTimes(customContainer = null, showOnlyFard = false) {
    const container = customContainer || document.getElementById('prayer-times-container');
    
    if (!container) return;
    
    const today = getCurrentDate();
    const prayerTimes = getPrayerTimesForDate(today);
    
    if (prayerTimes) {
        displayPrayerTimes(container, prayerTimes, today, showOnlyFard);
    } else {
        displayPrayerTimesError(container);
    }
}

// Get current date in YYYY-MM-DD format (Mumbai timezone)
function getCurrentDate() {
    const now = new Date();
    // Convert to Mumbai timezone (UTC+5:30)
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    return mumbaiTime.toISOString().split('T')[0];
}

// Get prayer times for a specific date
function getPrayerTimesForDate(date) {
    return prayerTimesData[date] || defaultPrayerTimes;
}

// Display prayer times in the container
function displayPrayerTimes(container, prayerTimes, date, showOnlyFard = false) {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const currentTime = getCurrentTimeString();
    const nextPrayerInfo = getNextPrayerInfo(prayerTimes);
    
    let html = `
        <div class="text-center mb-4">
            <h4 class="text-primary mb-2">Prayer Times</h4>
            <p class="text-muted mb-1">${formattedDate}</p>
            <div class="current-time mb-3">
                <i class="fas fa-clock me-2"></i>
                <span class="fw-bold">Current Time: <span id="current-time-display">${currentTime}</span></span>
            </div>
            ${nextPrayerInfo ? `
                <div class="next-prayer-countdown alert alert-info py-2 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <span><strong>Next Prayer: ${nextPrayerInfo.name}</strong></span>
                        <span class="countdown-timer" data-target="${nextPrayerInfo.timestamp}">
                            <i class="fas fa-hourglass-half me-1"></i>
                            <span id="countdown-display">${nextPrayerInfo.timeRemaining}</span>
                        </span>
                    </div>
                </div>
            ` : ''}
        </div>
        <div class="prayer-times-list">
    `;
    
    // Filter prayers based on display mode
    let prayersToShow;
    
    if (showOnlyFard) {
        // Homepage: Only show essential prayers for mobile-friendly experience
        // Exclude Ishraq, Chasht, and Zawal to reduce scrolling on mobile
        prayersToShow = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];
    } else {
        // Prayer times page: Show all prayers including Ishraq, Chasht, Zawal
        prayersToShow = prayerNames;
    }
    
    prayersToShow.forEach(prayer => {
        const prayerData = prayerTimes[prayer];
        if (!prayerData) return; // Skip if prayer data doesn't exist
        
        const timeToCheck = prayerData.adhan || prayerData.time;
        const isNext = nextPrayerInfo && nextPrayerInfo.prayer === prayer;
        const isPassed = isPrayerPassed(timeToCheck);
        
        // Determine prayer type and icon
        let prayerIcon = 'fas fa-mosque';
        if (prayer === 'sunrise') prayerIcon = 'fas fa-sun';
        else if (prayer === 'ishraq' || prayer === 'chasht') prayerIcon = 'fas fa-pray';
        else if (prayer === 'zawal') prayerIcon = 'fas fa-clock';
        else if (prayer === 'jumuah') prayerIcon = 'fas fa-users';
        
        html += `
            <div class="prayer-time-row ${isNext ? 'next-prayer' : ''} ${isPassed ? 'prayer-passed' : ''} ${!prayerData.adhan ? 'sunnah-prayer' : ''}">
                <div class="prayer-name">
                    <i class="${prayerIcon} me-2"></i>
                    ${prayerDisplayNames[prayer]}
                    ${isNext ? '<span class="ms-2 badge bg-success">Next</span>' : ''}
                    ${isPassed ? '<span class="ms-2 badge bg-secondary">Passed</span>' : ''}
                </div>
                <div class="prayer-times">
                    ${prayerData.adhan ? `
                        <div class="prayer-time">
                            <div class="prayer-time-label">Adhan</div>
                            <div class="prayer-time-value">${formatTime(prayerData.adhan)}</div>
                        </div>
                        <div class="prayer-time">
                            <div class="prayer-time-label">Iqamah</div>
                            <div class="prayer-time-value">${formatTime(prayerData.iqamah)}</div>
                        </div>
                    ` : `
                        <div class="prayer-time">
                            <div class="prayer-time-label">Time</div>
                            <div class="prayer-time-value">${formatTime(prayerData.time)}</div>
                        </div>
                    `}
                </div>
            </div>
        `;
    });
    
    // Add dedicated Jumu'ah card (always visible on prayer times page)
    if (!showOnlyFard) {
        const isJumuahNext = nextPrayerInfo && nextPrayerInfo.prayer === 'jumuah';
        
        html += `
            <div class="prayer-time-row jumuah-card ${isJumuahNext ? 'next-prayer' : ''}">
                <div class="prayer-name">
                    <i class="fas fa-users me-2"></i>
                    Jumu'ah
                    ${isJumuahNext ? '<span class="ms-2 badge bg-success">Next</span>' : ''}
                </div>
                <div class="prayer-times">
                    <div class="prayer-time">
                        <div class="prayer-time-label">Iqamah</div>
                        <div class="prayer-time-value">1:10 PM</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `
        </div>
        <div class="text-center mt-4">
            <a href="prayer-times.html" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-calendar-alt me-2"></i>View Full Schedule
            </a>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Start real-time updates
    startRealTimeUpdates();
}

// Display error message when prayer times can't be loaded
function displayPrayerTimesError(container) {
    container.innerHTML = `
        <div class="text-center">
            <div class="alert alert-warning" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Prayer times are currently unavailable. Please check back later.
            </div>
            <a href="contact.html" class="btn btn-outline-primary btn-sm">Contact Us</a>
        </div>
    `;
}

// Check if a prayer is the next upcoming prayer (Mumbai timezone)
function isNextPrayer(prayerName, adhanTime) {
    const now = new Date();
    // Get Mumbai time
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentTime = mumbaiTime.getHours() * 60 + mumbaiTime.getMinutes();
    
    // Convert prayer time to minutes
    const [hours, minutes] = adhanTime.split(':').map(Number);
    const prayerTimeMinutes = hours * 60 + minutes;
    
    // Check if this prayer is upcoming today
    if (prayerTimeMinutes > currentTime) {
        // Check if this is the next prayer (no earlier prayer is still upcoming)
        const prayerIndex = prayerNames.indexOf(prayerName);
        
        for (let i = 0; i < prayerIndex; i++) {
            const earlierPrayer = prayerNames[i];
            const today = getCurrentDate();
            const prayerTimes = getPrayerTimesForDate(today);
            
            if (prayerTimes) {
                const [earlierHours, earlierMinutes] = prayerTimes[earlierPrayer].adhan.split(':').map(Number);
                const earlierPrayerMinutes = earlierHours * 60 + earlierMinutes;
                
                if (earlierPrayerMinutes > currentTime) {
                    return false; // Earlier prayer is still upcoming
                }
            }
        }
        
        return true; // This is the next prayer
    }
    
    return false;
}

// Format time from 24-hour to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Update next prayer highlight (called every minute)
function updateNextPrayerHighlight() {
    const container = document.getElementById('prayer-times-container');
    
    if (container && container.querySelector('.prayer-times-list')) {
        // Reload prayer times to update highlighting
        loadTodaysPrayerTimes();
    }
}

// Get time until next prayer (Mumbai timezone)
function getTimeUntilNextPrayer() {
    const now = new Date();
    // Get Mumbai time
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentTime = mumbaiTime.getHours() * 60 + mumbaiTime.getMinutes();
    const today = getCurrentDate();
    const prayerTimes = getPrayerTimesForDate(today);
    
    if (!prayerTimes) return null;
    
    // Find next prayer today
    for (const prayer of prayerNames) {
        const [hours, minutes] = prayerTimes[prayer].adhan.split(':').map(Number);
        const prayerTimeMinutes = hours * 60 + minutes;
        
        if (prayerTimeMinutes > currentTime) {
            const minutesUntil = prayerTimeMinutes - currentTime;
            const hoursUntil = Math.floor(minutesUntil / 60);
            const remainingMinutes = minutesUntil % 60;
            
            return {
                prayer: prayerDisplayNames[prayer],
                hours: hoursUntil,
                minutes: remainingMinutes,
                totalMinutes: minutesUntil
            };
        }
    }
    
    // If no prayer today, get first prayer tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    const tomorrowPrayerTimes = getPrayerTimesForDate(tomorrowDate);
    
    if (tomorrowPrayerTimes) {
        const firstPrayer = prayerNames[0]; // Fajr
        const [hours, minutes] = tomorrowPrayerTimes[firstPrayer].adhan.split(':').map(Number);
        const prayerTimeMinutes = hours * 60 + minutes;
        const minutesUntilMidnight = (24 * 60) - currentTime;
        const totalMinutes = minutesUntilMidnight + prayerTimeMinutes;
        const hoursUntil = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        
        return {
            prayer: prayerDisplayNames[firstPrayer],
            hours: hoursUntil,
            minutes: remainingMinutes,
            totalMinutes: totalMinutes,
            tomorrow: true
        };
    }
    
    return null;
}

// Display countdown to next prayer
function displayPrayerCountdown(containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    const timeUntil = getTimeUntilNextPrayer();
    
    if (timeUntil) {
        const dayText = timeUntil.tomorrow ? ' (Tomorrow)' : '';
        container.innerHTML = `
            <div class="text-center">
                <h6 class="text-primary mb-2">Next Prayer: ${timeUntil.prayer}${dayText}</h6>
                <div class="countdown">
                    <span class="countdown-time">${timeUntil.hours}h ${timeUntil.minutes}m</span>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="text-center">
                <p class="text-muted">Prayer times unavailable</p>
            </div>
        `;
    }
}

// Get current time as formatted string (Mumbai timezone)
function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Check if a prayer time has passed (Mumbai timezone)
function isPrayerPassed(prayerTime) {
    const now = new Date();
    // Get Mumbai time
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentMinutes = mumbaiTime.getHours() * 60 + mumbaiTime.getMinutes();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    return currentMinutes > prayerMinutes;
}

// Get next prayer information with countdown (Mumbai timezone)
function getNextPrayerInfo(prayerTimes) {
    const now = new Date();
    // Get Mumbai time
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentMinutes = mumbaiTime.getHours() * 60 + mumbaiTime.getMinutes();
    
    // Find next obligatory prayer today
    for (const prayer of obligatoryPrayers) {
        const prayerData = prayerTimes[prayer];
        if (!prayerData || !prayerData.adhan) continue;
        
        const [hours, minutes] = prayerData.adhan.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        if (prayerMinutes > currentMinutes) {
            const minutesUntil = prayerMinutes - currentMinutes;
            const hoursUntil = Math.floor(minutesUntil / 60);
            const remainingMinutes = minutesUntil % 60;
            
            // Create timestamp for countdown
            const targetTime = new Date();
            targetTime.setHours(hours, minutes, 0, 0);
            
            return {
                prayer: prayer,
                name: prayerDisplayNames[prayer],
                timeRemaining: `${hoursUntil}h ${remainingMinutes}m`,
                timestamp: targetTime.getTime(),
                totalMinutes: minutesUntil
            };
        }
    }
    
    // If no prayer today, get Fajr tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    const tomorrowPrayerTimes = getPrayerTimesForDate(tomorrowDate);
    
    if (tomorrowPrayerTimes) {
        const fajrTime = tomorrowPrayerTimes.fajr.adhan;
        const [hours, minutes] = fajrTime.split(':').map(Number);
        const minutesUntilMidnight = (24 * 60) - currentMinutes;
        const totalMinutes = minutesUntilMidnight + (hours * 60 + minutes);
        const hoursUntil = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        
        const targetTime = new Date(tomorrow);
        targetTime.setHours(hours, minutes, 0, 0);
        
        return {
            prayer: 'fajr',
            name: 'Fajr (Tomorrow)',
            timeRemaining: `${hoursUntil}h ${remainingMinutes}m`,
            timestamp: targetTime.getTime(),
            totalMinutes: totalMinutes
        };
    }
    
    return null;
}

// Start real-time updates for current time and countdown
function startRealTimeUpdates() {
    // Update current time every second
    setInterval(() => {
        const currentTimeElement = document.getElementById('current-time-display');
        if (currentTimeElement) {
            currentTimeElement.textContent = getCurrentTimeString();
        }
    }, 1000);
    
    // Update countdown every minute
    setInterval(() => {
        const countdownElement = document.getElementById('countdown-display');
        if (countdownElement) {
            const today = getCurrentDate();
            const prayerTimes = getPrayerTimesForDate(today);
            const nextPrayerInfo = getNextPrayerInfo(prayerTimes);
            
            if (nextPrayerInfo) {
                countdownElement.textContent = nextPrayerInfo.timeRemaining;
            }
        }
    }, 60000);
    
    // Reload prayer times at midnight to get new day's data
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
        loadTodaysPrayerTimes();
        // Set up daily reload
        setInterval(loadTodaysPrayerTimes, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}

// Add more sample data for the coming days
function generateSamplePrayerTimes() {
    const baseDate = new Date('2025-08-22');
    
    for (let i = 0; i < 30; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Simulate gradual changes in prayer times (in minutes from midnight)
        const fajrMinutes = 306 + i; // 5:06 + i minutes
        const sunriseMinutes = 381 + i; // 6:21 + i minutes
        const ishraqMinutes = 401 + i; // 6:41 + i minutes
        const chashtMinutes = 571 + i; // 9:31 + i minutes
        const zawalMinutes = 756; // 12:36 (stays constant)
        const dhuhrMinutes = 761; // 12:41 (stays constant)
        const asrMinutes = 1030 - i; // 17:10 - i minutes
        const maghribMinutes = 1144 - (i * 2); // 19:04 - (i * 2) minutes
        const ishaMinutes = 1217 - i; // 20:17 - i minutes
        
        prayerTimesData[dateString] = {
            "fajr": {
                "adhan": minutesToTime(fajrMinutes),
                "iqamah": "05:45"
            },
            "sunrise": {
                "time": minutesToTime(sunriseMinutes)
            },
            "ishraq": {
                "time": minutesToTime(ishraqMinutes)
            },
            "chasht": {
                "time": minutesToTime(chashtMinutes)
            },
            "zawal": {
                "time": minutesToTime(zawalMinutes)
            },
            "dhuhr": {
                "adhan": minutesToTime(dhuhrMinutes),
                "iqamah": "13:20"
            },
            "asr": {
                "adhan": minutesToTime(asrMinutes),
                "iqamah": "17:30"
            },
            "maghrib": {
                "adhan": minutesToTime(maghribMinutes),
                "iqamah": minutesToTime(maghribMinutes + 6)
            },
            "isha": {
                "adhan": minutesToTime(ishaMinutes),
                "iqamah": "21:00"
            },
            "jumuah": {
                "adhan": "12:41",
                "iqamah": "13:10"
            }
        };
    }
}

// Helper function to convert minutes to HH:MM format
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Initialize sample data
generateSamplePrayerTimes();

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.PrayerTimes = {
        loadTodaysPrayerTimes,
        getPrayerTimesForDate,
        getTimeUntilNextPrayer,
        displayPrayerCountdown,
        formatTime,
        getCurrentTimeString,
        getNextPrayerInfo
    };
}
