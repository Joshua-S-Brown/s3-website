/* S³ - Second Self Studios
   Interactive Enhancements
   ======================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================
    // READING PROGRESS BAR
    // ==================
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.prepend(progressBar);
    
    const updateReadingProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    };
    
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();
    
    
    // ==================
    // BACK TO TOP BUTTON
    // ==================
    
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(backToTop);
    
    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    
    // ==================
    // FADE IN ON SCROLL
    // ==================
    
    // Elements to animate on scroll
    const animateOnScroll = document.querySelectorAll(
        'section:not(.hero):not(.roadmap-hero):not(.setting-hero):not(.product-hero):not(.about-hero):not(.devlog-hero), ' +
        '.status-card, .future-card, .timeline-item, .sample-card, .creator-content, ' +
        '.concept-card, .continent-card, .zone-preview, .principle-card, .value-card, ' +
        '.product-card, .featured-product, .zone-card, .how-it-works-item, .quick-summary-item'
    );
    
    // Add initial hidden state
    animateOnScroll.forEach(el => {
        el.classList.add('scroll-hidden');
    });
    
    // Intersection Observer for scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                entry.target.classList.remove('scroll-hidden');
                // Optionally unobserve after animation (better performance)
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateOnScroll.forEach(el => {
        scrollObserver.observe(el);
    });
    
    
    // ==================
    // CURRENT PAGE NAV HIGHLIGHT
    // ==================
    
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if current path matches or starts with link path
        // Handle both /page/ and /page formats
        if (currentPath === linkPath || 
            currentPath === linkPath.replace(/\/$/, '') ||
            (linkPath !== '/' && currentPath.startsWith(linkPath.replace(/\/$/, '')))) {
            link.classList.add('nav-active');
        }
    });
    
    
    // ==================
    // ROADMAP PROGRESS INDICATOR
    // ==================
    
    const timeline = document.querySelector('.timeline');
    const timelineLine = document.querySelector('.timeline::before');
    
    if (timeline) {
        // Create progress fill element
        const progressFill = document.createElement('div');
        progressFill.className = 'timeline-progress-fill';
        timeline.appendChild(progressFill);
        
        // Update progress on scroll
        const updateTimelineProgress = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the timeline is visible/passed
            const scrollProgress = Math.max(0, Math.min(1, 
                (windowHeight * 0.5 - timelineTop) / timelineHeight
            ));
            
            progressFill.style.height = (scrollProgress * 100) + '%';
        };
        
        window.addEventListener('scroll', updateTimelineProgress, { passive: true });
        updateTimelineProgress(); // Initial call
    }
    
    
    // ==================
    // SMOOTH CARD INTERACTIONS
    // ==================
    
    // Add hover sound/haptic class for cards (CSS handles the visual)
    const interactiveCards = document.querySelectorAll(
        '.value-card, .zone-card, .product-card, .status-card, .future-card, ' +
        '.principle-card, .sample-card, .concept-card, .quick-summary-item'
    );
    
    interactiveCards.forEach(card => {
        card.classList.add('interactive-card');
    });
    
    
    // ==================
    // STAGGER ANIMATIONS FOR GRIDS
    // ==================
    
    const staggerContainers = document.querySelectorAll(
        '.status-grid, .future-grid, .how-it-works-grid, .quick-summary-content, ' +
        '.principles-grid, .zones-grid, .product-grid'
    );
    
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = (index * 0.1) + 's';
        });
    });
    
});

// ==================
// REDUCED MOTION SUPPORT
// ==================

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.classList.add('reduce-motion');
}