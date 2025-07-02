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
  sections: null,
  skillCards: null,
  timelineItems: null,
  certificationCards: null,
  contactLinks: null
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
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
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
  const animatableElements = document.querySelectorAll('.section, .skill-card, .timeline-item, .certification-card');
  
  animatableElements.forEach((element, index) => {
    if (isPartiallyVisible(element) && !element.classList.contains('fade-in-up')) {
      setTimeout(() => {
        element.classList.add('fade-in-up');
      }, index * CONFIG.animationDelay);
    }
  });
}

/**
 * Smooth scroll to section
 * @param {string} targetId - ID of target element
 */
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    const targetPosition = target.offsetTop - CONFIG.scrollOffset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ===== INTERACTION HANDLERS =====
/**
 * Handle contact link interactions
 */
function setupContactLinks() {
  elements.contactLinks = document.querySelectorAll('.contact-link');
  
  elements.contactLinks.forEach(link => {
    // Add click tracking for analytics (if needed)
    link.addEventListener('click', (e) => {
      const linkType = link.getAttribute('data-type') || 'unknown';
      console.log(`Contact link clicked: ${linkType}`);
      
      // Add any analytics tracking here
      // Example: gtag('event', 'contact_click', { link_type: linkType });
    });
    
    // Add keyboard navigation support
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

/**
 * Setup card hover effects and interactions
 */
function setupCardInteractions() {
  const cards = document.querySelectorAll('.skill-card, .timeline-item, .certification-card');
  
  cards.forEach(card => {
    // Add focus support for keyboard navigation
    card.setAttribute('tabindex', '0');
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
    
    // Keyboard navigation support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        card.click();
      }
    });
  });
}

/**
 * Setup skill progress animations (if needed for future enhancements)
 */
function setupSkillAnimations() {
  const skillItems = document.querySelectorAll('.skill-list li');
  
  skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
/**
 * Lazy load images when they come into viewport
 */
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

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
    // Skip to main content with 'S' key
    if (e.key === 's' || e.key === 'S') {
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
  // Ensure focus is visible for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
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
    // Could send to analytics or error reporting service
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to analytics or error reporting service
  });
}

// ===== INITIALIZATION =====
/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  try {
    // Cache DOM elements
    elements.sections = document.querySelectorAll('.section');
    elements.skillCards = document.querySelectorAll('.skill-card');
    elements.timelineItems = document.querySelectorAll('.timeline-item');
    elements.certificationCards = document.querySelectorAll('.certification-card');
    
    // Setup functionality
    setupContactLinks();
    setupCardInteractions();
    setupSkillAnimations();
    setupLazyLoading();
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

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    debounce,
    isInViewport,
    isPartiallyVisible,
    smoothScrollTo
  };
}
