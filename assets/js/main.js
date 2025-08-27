// Darul Falah Mosque - Main JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeNewsletterForm();
    initializeSmoothScrolling();
    initializeLoadingStates();
    
    // Load dynamic content
    loadFeaturedNews();
});

// Navigation Enhancement
function initializeNavigation() {
    // Highlight active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile menu auto-close on link click
    const navbarCollapse = document.getElementById('navbarNav');
    const navLinks2 = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks2.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Newsletter Form Handler
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription process (replace with actual implementation)
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading States Management
function initializeLoadingStates() {
    // Add loading class to elements that need it
    const loadingElements = document.querySelectorAll('[data-loading]');
    
    loadingElements.forEach(element => {
        element.classList.add('loading');
    });
}

// Featured News Loader
function loadFeaturedNews() {
    const container = document.getElementById('featured-news-container');
    
    if (!container) return;
    
    // Sample news data (replace with actual data source)
    const featuredNews = [
        {
            id: 1,
            title: "Ramadan 2025 Schedule Announced",
            excerpt: "Join us for a blessed month of Ramadan with special programs and community iftars.",
            date: "2025-08-20",
            featured: true,
            image: "assets/images/mosque-exterior.webp"
        },
        {
            id: 2,
            title: "Youth Program Registration Open",
            excerpt: "Enroll your children in our comprehensive Islamic education and youth development programs.",
            date: "2025-08-18",
            featured: false,
            image: "assets/images/community-photo.webp"
        },
        {
            id: 3,
            title: "Community Fundraiser Success",
            excerpt: "Alhamdulillah! Our recent fundraiser exceeded expectations. Thank you to all contributors.",
            date: "2025-08-15",
            featured: false,
            image: "assets/images/mosque-exterior.webp"
        }
    ];
    
    // Clear loading state
    container.innerHTML = '';
    
    // Generate news cards
    featuredNews.forEach(news => {
        const newsCard = createNewsCard(news);
        container.appendChild(newsCard);
    });
}

// Create News Card Element
function createNewsCard(news) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const cardHTML = `
        <div class="card news-card h-100 border-0 shadow-sm">
            <div class="news-image-container">
                <img src="${news.image}" class="card-img-top news-image" alt="${news.title}" onerror="this.src='assets/images/placeholder.svg'">
                ${news.featured ? '<div class="featured-overlay"><i class="fas fa-star"></i> Featured</div>' : ''}
            </div>
            <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <small class="news-date text-muted">
                        <i class="fas fa-calendar-alt me-1"></i>
                        ${formatDate(news.date)}
                    </small>
                </div>
                <h5 class="card-title text-primary mb-3">${news.title}</h5>
                <p class="card-text flex-grow-1 text-muted">${news.excerpt}</p>
                <a href="news.html#article-${news.id}" class="btn btn-outline-primary btn-sm mt-auto">
                    <i class="fas fa-arrow-right me-2"></i>Read More
                </a>
            </div>
        </div>
    `;
    
    col.innerHTML = cardHTML;
    return col;
}

// Date Formatting
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
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

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Log page load time for performance monitoring
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Accessibility Enhancements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Alt+S
    if (e.altKey && e.key === 's') {
        const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        formatDate,
        showNotification
    };
}
