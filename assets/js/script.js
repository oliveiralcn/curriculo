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

// ===== SUPORTE A MÚLTIPLOS IDIOMAS =====
/**
 * Alterna entre os estilos de idiomas
 */
function toggleLanguageStyles() {
  const englishStyles = document.getElementById('english-styles');
  const currentLang = document.documentElement.lang;
  
  if (currentLang === 'pt-BR') {
    document.documentElement.lang = 'en';
    englishStyles.disabled = false;
  } else {
    document.documentElement.lang = 'pt-BR';
    englishStyles.disabled = true;
  }
}

/**
 * Adiciona botão de troca de idioma
 */
function addLanguageToggle() {
  const header = document.querySelector('.header');
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'EN/PT';
  toggleButton.setAttribute('aria-label', 'Alternar idioma');
  toggleButton.classList.add('language-toggle');
  toggleButton.addEventListener('click', toggleLanguageStyles);
  
  header.appendChild(toggleButton);
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
    elements.animatable = document.querySelectorAll('.section, .skill-card, .timeline-item, .certification-card, .article-card');
    elements.contactLinks = document.querySelectorAll('.contact-link');
    elements.cards = document.querySelectorAll('.skill-card, .timeline-item, .certification-card, .article-card');
    
    // Configura as funcionalidades
    setupContactLinks();
    setupCardInteractions();
    setupKeyboardNavigation();
    setupFocusManagement();
    setupReducedMotion();
    setupErrorHandling();
    addLanguageToggle();
    
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
