document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header on Scroll ---
    const topNav = document.getElementById('topNav');
    if (topNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                topNav.classList.add('scrolled');
            } else {
                topNav.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpened = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpened);
            document.body.style.overflow = isOpened ? 'hidden' : '';
        });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Exclude popup trigger button from smooth scroll handling
            if (this.id === 'openPopupBtn') return; 
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let headerOffset = 70; // Default header height
                if (topNav && topNav.classList.contains('scrolled')) {
                    headerOffset = 60; // Scrolled header height
                }
                if (window.innerWidth <= 768) headerOffset = 60; // Mobile header height
                
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                if (targetId === '#home') offsetPosition = 0; // Scroll to top for home

                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                // Close mobile menu if open and a nav link was clicked
                if (mainNav && mainNav.classList.contains('open') && this.closest('.nav-links')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
    
    // --- Tab Functionality ---
    function setupTabs(tabContainerId) {
        const container = document.getElementById(tabContainerId);
        if (!container) return;
        
        const buttons = container.querySelectorAll('.tab-button');
        const contents = [];
        buttons.forEach(btn => {
            const content = document.getElementById(btn.getAttribute('data-tab'));
            if (content) contents.push(content);
        });

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const targetId = button.getAttribute('data-tab');
                contents.forEach(content => {
                    if (content) content.classList.toggle('active', content.id === targetId);
                });
            });
        });
    }
    setupTabs('galleryTabs');
    setupTabs('plansTabs');

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // --- Counter-up Animation ---
    const counters = document.querySelectorAll('.counter');
    const highlightsSection = document.querySelector('.hero-highlights');
    let counterAnimated = false;

    const startCounter = (counter) => {
         const target = +counter.getAttribute('data-target');
         const duration = 1500; // Animation duration in ms
         let start = null;
         
         const step = (timestamp) => {
             if (!start) start = timestamp;
             const progress = Math.min((timestamp - start) / duration, 1);
             counter.innerText = Math.floor(progress * target);
             if (progress < 1) {
                 window.requestAnimationFrame(step);
             }
         };
         window.requestAnimationFrame(step);
    };

    if (counters.length > 0 && highlightsSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counters.forEach(startCounter);
                    counterAnimated = true; // Ensure it only runs once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        
        counterObserver.observe(highlightsSection);
    }
    
    // --- On-Page Form Submission Mock ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success-message');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) { 
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 this.reset();
                 if(successMessage) successMessage.classList.add('visible');
                 // Hide success message after 3 seconds
                 setTimeout(() => { 
                     if(successMessage) successMessage.classList.remove('visible'); 
                }, 3000);
            }, 1500);
        });
    }

    // --- 2️⃣ START: Popup Functionality ---
    const popupOverlay = document.getElementById('contactPopup');
    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupForm = document.getElementById('popupContactForm');
    const popupSuccessMessage = document.getElementById('popupSuccessMessage');

    function showPopup() {
        if(popupOverlay) popupOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function hidePopup() {
        if(popupOverlay) popupOverlay.classList.remove('visible');
        document.body.style.overflow = ''; // Restore background scroll
         
         // Reset form state if success message was shown
         if (popupForm && popupSuccessMessage) {
             setTimeout(() => { // Delay reset to allow fade out
                 popupForm.style.display = 'flex';
                 popupSuccessMessage.style.display = 'none';
                 popupForm.reset();
             }, 300); // Match CSS transition duration
         }
    }

    if(openPopupBtn) {
        openPopupBtn.addEventListener('click', showPopup);
    }
    if(closePopupBtn) {
        closePopupBtn.addEventListener('click', hidePopup);
    }
    if(popupOverlay) {
         // Close popup if clicking on the overlay itself (but not the content)
         popupOverlay.addEventListener('click', function(e) {
              if (e.target === popupOverlay) {
                   hidePopup();
              }
         });
    }

    if (popupForm) {
        popupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Simulate submission
            setTimeout(() => {
                // Hide form, show success message
                popupForm.style.display = 'none';
                if (popupSuccessMessage) popupSuccessMessage.style.display = 'block';

                // Optional: Auto-close after a few seconds
                // setTimeout(hidePopup, 3000); 
                
                // Reset button for next time (though form is hidden now)
                submitButton.textContent = 'Submit'; 
                submitButton.disabled = false; 

            }, 1000); 
        });
    }
    // --- 2️⃣ END: Popup Functionality ---
});
