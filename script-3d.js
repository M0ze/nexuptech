/* ================================================================
   NEXUPTECH 3D INTERACTIVE CONTROLLER
   High-performance mouse tracking, parallax, and depth effects
   All animations use requestAnimationFrame for 60fps smoothness
   ================================================================ */

/* ================================================================
   DARK MODE TOGGLE
   Persist theme preference in localStorage
   ================================================================ */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme on page load
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

// Listen for theme toggle clicks
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

/* ================================================================
   3D TILT MOUSE TRACKING ENGINE
   Uses requestAnimationFrame for smooth 60fps performance
   Applies to elements with data-tilt attribute (cards, pricing)
   ================================================================ */

class Tilt3D {
  constructor(element) {
    this.element = element;
    this.isTouching = false;
    
    // Mouse position tracking
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Rotation state
    this.rotateX = 0;
    this.rotateY = 0;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    
    // Smooth animation vars
    this.rotationSmoothing = 0.1; // Lower = smoother, higher = snappier
    
    // Bind events
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    this.element.addEventListener('touchstart', () => this.isTouching = true);
    this.element.addEventListener('touchend', () => this.isTouching = false);
    
    // Start animation loop
    this.animate();
  }
  
  /**
   * Calculate rotation based on mouse position within element
   * Returns values from -1 to 1 (normalized coordinates)
   */
  onMouseMove(event) {
    if (this.isTouching) return;
    
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate offset from center (-1 to 1)
    const offsetX = (event.clientX - centerX) / (rect.width / 2);
    const offsetY = (event.clientY - centerY) / (rect.height / 2);
    
    // Set target rotation (limited to ±15 degrees)
    this.targetRotateY = offsetX * 15;
    this.targetRotateX = -offsetY * 15;
  }
  
  /**
   * On mouse enter: prepare element for 3D transforms
   */
  onMouseEnter() {
    this.element.style.transformStyle = 'preserve-3d';
  }
  
  /**
   * On mouse leave: smoothly return to neutral position
   */
  onMouseLeave() {
    this.targetRotateX = 0;
    this.targetRotateY = 0;
  }
  
  /**
   * Animation loop using requestAnimationFrame
   * Smoothly interpolates rotation to target values
   */
  animate = () => {
    // Smooth interpolation toward target rotation
    this.rotateX += (this.targetRotateX - this.rotateX) * this.rotationSmoothing;
    this.rotateY += (this.targetRotateY - this.rotateY) * this.rotationSmoothing;
    
    // Apply 3D transform to element
    this.element.style.transform = `
      perspective(1000px)
      rotateX(${this.rotateX}deg)
      rotateY(${this.rotateY}deg)
      translateZ(15px)
    `;
    
    // Continue animation loop at 60fps
    requestAnimationFrame(this.animate);
  }
}

/* ================================================================
   PARALLAX SCROLL EFFECT
   Moves background orbs and elements based on scroll position
   Creates depth illusion as user scrolls
   ================================================================ */

class ParallaxController {
  constructor() {
    this.scrollY = 0;
    this.orbs = document.querySelectorAll('.bg-orb');
    this.demoPages = document.querySelectorAll('.demo-page');
    
    // Throttle scroll events for performance
    window.addEventListener('scroll', () => this.onScroll());
    
    // Initialize demo section observer
    this.setupIntersectionObserver();
  }
  
  /**
   * Handle scroll with throttling (runs on every frame via requestAnimationFrame)
   */
  onScroll() {
    this.scrollY = window.scrollY;
    this.updateParallax();
  }
  
  /**
   * Update parallax positions based on scroll
   */
  updateParallax() {
    // Move orbs at different speeds to create depth
    this.orbs.forEach((orb, index) => {
      const speed = 0.3 + index * 0.15; // Different speeds per orb
      const offset = this.scrollY * speed;
      orb.style.transform = `translateY(${offset}px) translateZ(${index * 20}px)`;
    });
  }
  
  /**
   * Setup IntersectionObserver for demo sections
   * Triggers fade-in animations when sections come into view
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class to trigger CSS animation
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of element is visible
      }
    );
    
    // Observe all demo pages
    this.demoPages.forEach((page) => observer.observe(page));
  }
}

/* ================================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   Replaces default jump behavior with smooth scroll animation
   ================================================================ */

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        // Use native smooth scroll behavior
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/* ================================================================
   CONTACT FORM HANDLER
   Captures form data and redirects to WhatsApp with pre-filled message
   ================================================================ */

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate inputs
    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // WhatsApp business number (replace with actual)
    const whatsappNumber = '+256764625700';
    
    // Construct message with user data
    const whatsappText = `Hi NexUpTech! 👋

I'm ${name} (${email})

Project: ${message}

Looking forward to your response!`;
    
    // Encode and create WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
    
    // Show confirmation and open WhatsApp
    alert('Thanks! We\'ll contact you soon. Opening WhatsApp...');
    window.open(whatsappLink, '_blank');
    
    // Reset form
    contactForm.reset();
  });
}

/* ================================================================
   MOUSE POSITION TRACKER (Optional: For Future Effects)
   Tracks global mouse position for potential global parallax
   ================================================================ */

class MouseTracker {
  constructor() {
    this.x = 0;
    this.y = 0;
    
    document.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    });
  }
  
  /**
   * Get normalized mouse position (-1 to 1)
   */
  getNormalized() {
    return {
      x: (this.x / window.innerWidth) * 2 - 1,
      y: (this.y / window.innerHeight) * 2 - 1,
    };
  }
}

/* ================================================================
   INITIALIZATION
   Run all controllers on DOM ready
   ================================================================ */

function init() {
  // Initialize theme toggle
  console.log('✓ Dark mode toggle ready');
  
  // Initialize parallax controller
  const parallax = new ParallaxController();
  console.log('✓ Parallax scroll effects ready');
  
  // Initialize 3D tilt on all [data-tilt] elements
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach((element) => new Tilt3D(element));
  console.log(`✓ 3D tilt tracking initialized on ${tiltElements.length} elements`);
  
  // Initialize smooth scroll
  setupSmoothScroll();
  console.log('✓ Smooth scroll navigation ready');
  
  // Initialize contact form
  setupContactForm();
  console.log('✓ Contact form handler ready');
  
  // Initialize global mouse tracker (optional)
  const mouseTracker = new MouseTracker();
  console.log('✓ Global mouse tracking active');
  
  console.log('\n🚀 NexUpTech 3D Engine Ready for Launch!\n');
}

/* ================================================================
   DOM READY & POLYFILLS
   Ensure all code runs after DOM is fully loaded
   ================================================================ */

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded, run immediately
  init();
}

/* ================================================================
   PERFORMANCE MONITORING (Optional: For Debugging)
   Logs FPS and performance metrics to console
   ================================================================ */

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    
    this.checkFPS();
  }
  
  checkFPS() {
    this.frameCount++;
    
    const currentTime = performance.now();
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      console.log(`FPS: ${this.fps}`);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame(() => this.checkFPS());
  }
}

// Uncomment to enable FPS monitoring:
// const perfMonitor = new PerformanceMonitor();

/* ================================================================
   MOBILE DETECTION & OPTIMIZATION
   Disable complex 3D effects on low-end devices
   ================================================================ */

const isMobile = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const hasLowPerformance = navigator.deviceMemory && navigator.deviceMemory <= 4;

if (isMobile || hasLowPerformance) {
  // Reduce parallax intensity on mobile
  document.querySelectorAll('.bg-orb').forEach((orb) => {
    orb.style.filter = 'blur(60px)';
    orb.style.opacity = '0.05';
  });
  
  console.log('📱 Mobile optimizations applied');
}
