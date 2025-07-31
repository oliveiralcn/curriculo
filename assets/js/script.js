/**
 * JavaScript do Site de Currículo
 * Autor: Luan Carlos Nunes de Oliveira
 * Descrição: Funcionalidades interativas para o site de currículo
 */

// ===== CONSTANTES E CONFIGURAÇÃO =====
const CONFIG = {
  animationDelay: 100,
  scrollOffset: 100,
  fadeInThreshold: 0.1
};

// ===== ELEMENTOS DOM =====
const elements = {
  animatable: null,
  contactLinks: null,
  cards: null
};

// ===== FUNÇÕES UTILITÁRIAS =====
/**
 * Função Debounce para limitar a taxa de execução de uma função
 * @param {Function} func - Função para aplicar o debounce
 * @param {number} wait - Tempo de espera em milissegundos
 * @returns {Function} Função com debounce
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
 * Verifica se o elemento está parcialmente visível
 * @param {Element} element - Elemento DOM para verificar
 * @param {number} threshold - Limiar de visibilidade (0-1)
 * @returns {boolean} Verdadeiro se o elemento estiver parcialmente visível
 */
function isPartiallyVisible(element, threshold = CONFIG.fadeInThreshold) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const elementHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  
  return visibleHeight / elementHeight >= threshold;
}

// ===== FUNÇÕES DE ANIMAÇÃO =====
/**
 * Adiciona animação de fade-in aos elementos quando se tornam visíveis
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

// ===== MANIPULADORES DE INTERAÇÃO =====
/**
 * Manipula as interações dos links de contato
 */
function setupContactLinks() {
  elements.contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const linkType = link.getAttribute('data-type') || 'unknown';
      console.log(`Link de contato clicado: ${linkType}`);
    });
  });
}

/**
 * Configura os efeitos de hover e interações dos cards
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

// ===== OTIMIZAÇÕES DE PERFORMANCE =====
/**
 * Otimiza a performance do scroll com requestAnimationFrame
 */
const optimizedScrollHandler = debounce(() => {
  requestAnimationFrame(handleScrollAnimations);
}, 16); // ~60fps

// ===== MELHORIAS DE ACESSIBILIDADE =====
/**
 * Configura a navegação por teclado
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
 * Configura o gerenciamento de foco
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
 * Configura as preferências de movimento reduzido
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

// ===== TRATAMENTO DE ERROS =====
/**
 * Manipulador de erro global
 */
function setupErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Erro de JavaScript:', e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Rejeição de promise não tratada:', e.reason);
  });
}

// ===== INICIALIZAÇÃO =====
/**
 * Inicializa todas as funcionalidades quando o DOM está pronto
 */
function init() {
  try {
    // Armazena em cache os elementos DOM
    elements.animatable = document.querySelectorAll('.section, .skill-card, .timeline-item, .certification-card');
    elements.contactLinks = document.querySelectorAll('.contact-link');
    elements.cards = document.querySelectorAll('.skill-card, .timeline-item, .certification-card');
    
    // Configura as funcionalidades
    setupContactLinks();
    setupCardInteractions();
    setupKeyboardNavigation();
    setupFocusManagement();
    setupReducedMotion();
    setupErrorHandling();
    
    // Configura as animações de scroll
    handleScrollAnimations(); // Verificação inicial
    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', debounce(handleScrollAnimations, 250));
    
    // Adiciona a classe 'loaded' ao body para transições CSS
    document.body.classList.add('loaded');
    
    console.log('Site de currículo inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar o site de currículo:', error);
  }
}

// ===== OUVINTES DE EVENTOS =====
// Inicializa quando o DOM está pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Manipula mudanças na visibilidade da página
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Reativa as animações quando a página se torna visível
    handleScrollAnimations();
  }
});