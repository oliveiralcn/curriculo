/**
 * Resume Website JavaScript
 * Author: Luan Carlos Nunes de Oliveira
 * Description: Interactive functionality for the resume website
 */

// ===== CONSTANTS & CONFIGURATION =====
const CONFIG = {
  animationDelay: 100,
  scrollOffset: 100,
  fadeInThreshold: 0.1
};

// ===== DOM ELEMENTS =====
const elements = {
  animatable: null,
  contactLinks: null,
  cards: null
};

// ===== UTILITY FUNCTIONS =====
/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Check if element is partially visible
 * @param {Element} element - DOM element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} True if element is partially visible
 */
function isPartiallyVisible(element, threshold = CONFIG.fadeInThreshold) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const elementHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  
  return visibleHeight / elementHeight >= threshold;
}

// ===== ANIMATION FUNCTIONS =====
/**
 * Add fade-in animation to elements when they become visible
 */
function handleScrollAnimations() {
  elements.animatable.forEach((element, index) => {
    if (isPartiallyVisible(element) && !element.classList.contains('fade-in-up')) {
      setTimeout(() => {
        element.classList.add('fade-in-up');
      }, index * CONFIG.animationDelay);
    }
  });
}

// ===== INTERACTION HANDLERS =====
/**
 * Handle contact link interactions
 */
function setupContactLinks() {
  elements.contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const linkType = link.getAttribute('data-type') || 'unknown';
      console.log(`Contact link clicked: ${linkType}`);
    });
  });
}

/**
 * Setup card hover effects and interactions
 */
function setupCardInteractions() {
  elements.cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            card.click();
        }
    });
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
/**
 * Optimize scroll performance with requestAnimationFrame
 */
const optimizedScrollHandler = debounce(() => {
  requestAnimationFrame(handleScrollAnimations);
}, 16); // ~60fps

// ===== ACCESSIBILITY ENHANCEMENTS =====
/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
}

/**
 * Setup reduced motion preferences
 */
function setupReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  function handleReducedMotion(e) {
    if (e.matches) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }
  
  handleReducedMotion(prefersReducedMotion);
  prefersReducedMotion.addEventListener('change', handleReducedMotion);
}

// ===== ERROR HANDLING =====
/**
 * Global error handler
 */
function setupErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// ===== INITIALIZATION =====
/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  try {
    // Cache DOM elements
    elements.animatable = document.querySelectorAll('.section, .skill-card, .timeline-item, .certification-card');
    elements.contactLinks = document.querySelectorAll('.contact-link');
    elements.cards = document.querySelectorAll('.skill-card, .timeline-item, .certification-card');
    
    // Setup functionality
    setupContactLinks();
    setupCardInteractions();
    setupKeyboardNavigation();
    setupFocusManagement();
    setupReducedMotion();
    setupErrorHandling();
    
    // Setup scroll animations
    handleScrollAnimations(); // Initial check
    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', debounce(handleScrollAnimations, 250));
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    console.log('Resume website initialized successfully');
  } catch (error) {
    console.error('Error initializing resume website:', error);
  }
}

// ===== EVENT LISTENERS =====
// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Re-trigger animations when page becomes visible
    handleScrollAnimations();
  }
});