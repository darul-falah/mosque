// Monthly Prayer Times JavaScript for Darul Falah Mosque

// Current month and year
let currentMonth = 8; // August (0-based)
let currentYear = 2025;

// Month names
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Generate prayer times for a full month
function generateMonthlyPrayerTimes(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthlyData = {};
    
    // Base prayer times (will vary slightly each day)
    const baseTimes = {
        fajr: { adhan: "05:06", iqamah: "05:45" },
        sunrise: { time: "06:21" },
        dhuhr: { adhan: "12:41", iqamah: "13:20" },
        asr: { adhan: "17:10", iqamah: "17:30" },
        maghrib: { adhan: "19:04", iqamah: "19:10" },
        isha: { adhan: "20:17", iqamah: "21:00" },
        jumuah: { adhan: "12:41", iqamah: "13:10" }
    };
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        
        // Simulate gradual changes in prayer times throughout the month
        const dayOffset = Math.floor((day - 1) / 3); // Change every 3 days
        
        monthlyData[dateString] = {
            fajr: {
                adhan: addMinutesToTime(baseTimes.fajr.adhan, dayOffset),
                iqamah: baseTimes.fajr.iqamah
            },
            sunrise: {
                time: addMinutesToTime(baseTimes.sunrise.time, dayOffset)
            },
            dhuhr: {
                adhan: baseTimes.dhuhr.adhan,
                iqamah: baseTimes.dhuhr.iqamah
            },
            asr: {
                adhan: addMinutesToTime(baseTimes.asr.adhan, -dayOffset),
                iqamah: baseTimes.asr.iqamah
            },
            maghrib: {
                adhan: addMinutesToTime(baseTimes.maghrib.adhan, -dayOffset),
                iqamah: addMinutesToTime(baseTimes.maghrib.iqamah, -dayOffset)
            },
            isha: {
                adhan: addMinutesToTime(baseTimes.isha.adhan, -dayOffset),
                iqamah: baseTimes.isha.iqamah
            },
            jumuah: {
                adhan: baseTimes.jumuah.adhan,
                iqamah: baseTimes.jumuah.iqamah
            }
        };
    }
    
    return monthlyData;
}

// Add minutes to a time string
function addMinutesToTime(timeString, minutes) {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

// Get current date in Mumbai timezone
function getCurrentDateMumbai() {
    const now = new Date();
    const mumbaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    return {
        date: mumbaiTime.getDate(),
        month: mumbaiTime.getMonth(),
        year: mumbaiTime.getFullYear(),
        dateString: mumbaiTime.toISOString().split('T')[0]
    };
}

// Display monthly prayer times table
function displayMonthlyPrayerTimes(year, month) {
    const monthlyData = generateMonthlyPrayerTimes(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const tbody = document.getElementById('prayer-times-tbody');
    const currentDate = getCurrentDateMumbai();
    
    if (!tbody) return;
    
    let html = '';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        const prayerTimes = monthlyData[dateString];
        
        // Determine row classes
        let rowClass = '';
        if (currentDate.dateString === dateString) {
            rowClass = 'today-row';
        } else if (date.getDay() === 5) { // Friday
            rowClass = 'friday-row';
        } else if (date.getDay() === 0 || date.getDay() === 6) { // Weekend
            rowClass = 'weekend-row';
        }
        
        // Use Jumu'ah times for Friday Dhuhr
        const dhuhrTimes = date.getDay() === 5 ? prayerTimes.jumuah : prayerTimes.dhuhr;
        const dhuhrLabel = date.getDay() === 5 ? 'Jumu\'ah' : 'Dhuhr';
        
        html += `
            <tr class="${rowClass}">
                <td class="date-column">${day}</td>
                <td class="day-column">${dayName}</td>
                <td class="prayer-column">
                    <div>${prayerTimes.fajr.adhan}</div>
                    <small>${prayerTimes.fajr.iqamah}</small>
                </td>
                <td class="prayer-column">
                    ${prayerTimes.sunrise.time}
                </td>
                <td class="prayer-column">
                    <div>${dhuhrTimes.adhan}</div>
                    <small>${dhuhrTimes.iqamah}</small>
                    ${date.getDay() === 5 ? '<br><span class="badge bg-primary">Jumu\'ah</span>' : ''}
                </td>
                <td class="prayer-column">
                    <div>${prayerTimes.asr.adhan}</div>
                    <small>${prayerTimes.asr.iqamah}</small>
                </td>
                <td class="prayer-column">
                    <div>${prayerTimes.maghrib.adhan}</div>
                    <small>${prayerTimes.maghrib.iqamah}</small>
                </td>
                <td class="prayer-column">
                    <div>${prayerTimes.isha.adhan}</div>
                    <small>${prayerTimes.isha.iqamah}</small>
                </td>
            </tr>
        `;
    }
    
    tbody.innerHTML = html;
    
    // Update month/year display
    const monthYearElement = document.getElementById('current-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
    }
}

// Navigate to previous month
function navigateToPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayMonthlyPrayerTimes(currentYear, currentMonth);
}

// Navigate to next month
function navigateToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayMonthlyPrayerTimes(currentYear, currentMonth);
}

// Update current time display (Mumbai timezone)
function updateCurrentTimeDisplay() {
    const currentTimeElement = document.getElementById('current-time-display');
    if (currentTimeElement) {
        const now = new Date();
        const mumbaiTime = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        currentTimeElement.textContent = mumbaiTime;
    }
}

// Initialize the monthly prayer times page
function initializeMonthlyPrayerTimes() {
    // Set current month and year to Mumbai timezone
    const currentDate = getCurrentDateMumbai();
    currentMonth = currentDate.month;
    currentYear = currentDate.year;
    
    // Display initial prayer times
    displayMonthlyPrayerTimes(currentYear, currentMonth);
    
    // Set up navigation buttons
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (prevButton) {
        prevButton.addEventListener('click', navigateToPreviousMonth);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', navigateToNextMonth);
    }
    
    // Update current time display
    updateCurrentTimeDisplay();
    
    // Update time every second
    setInterval(updateCurrentTimeDisplay, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the prayer times page
    if (document.getElementById('monthly-prayer-times')) {
        initializeMonthlyPrayerTimes();
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateMonthlyPrayerTimes,
        displayMonthlyPrayerTimes,
        navigateToPreviousMonth,
        navigateToNextMonth,
        getCurrentDateMumbai,
        initializeMonthlyPrayerTimes
    };
}
