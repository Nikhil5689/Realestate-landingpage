document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            const isOpened = mainNav.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpened);
            document.body.style.overflow = isOpened ? 'hidden' : '';
        });
        
         // Close menu when clicking outside
         document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let headerOffset = 70; // Header height
                if (window.innerWidth <= 768) { headerOffset = 60; }
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                if (targetId === '#home') { offsetPosition = 0; }
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                if (mainNav.classList.contains('open')) {
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
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) { return; } 
            else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    
    
    // --- Counter-up Animation ---
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false; // Flag to ensure it runs only once

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // Total duration in ms
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

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counters.forEach(counter => {
                    startCounter(counter);
                });
                counterAnimated = true; // Set flag
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 }); // Trigger when 80% visible

    const highlightsSection = document.getElementById('highlights');
    if (highlightsSection) {
        counterObserver.observe(highlightsSection);
    }
    
    
    // --- Contact Form Mock Submission ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success-message');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 this.reset();
                 // Show success message
                 if(successMessage) successMessage.classList.add('visible');
                 // Hide success message after 3 seconds
                 setTimeout(() => {
                    if(successMessage) successMessage.classList.remove('visible');
                 }, 3000);
            }, 1500);
        });
    }

    // --- Contact Popup Modal Logic (NEW) ---
    const openBtn = document.getElementById('openContactPopup');
    const closeBtn = document.getElementById('closeContactPopup');
    const overlay = document.getElementById('contactPopupOverlay');
    const popup = document.getElementById('contactPopup');
    const popupForm = document.getElementById('popupContactForm');
    const formContent = document.getElementById('popupFormContent');
    const thankYouMessage = document.getElementById('popupThankYouMessage');

    if (openBtn && closeBtn && overlay && popup && popupForm && formContent && thankYouMessage) {
        
        const openPopup = () => {
            overlay.classList.add('visible');
            popup.classList.add('visible');
            // Ensure form is visible and thank you is hidden
            formContent.style.display = 'block';
            thankYouMessage.style.display = 'none';
        };

        const closePopup = () => {
            overlay.classList.remove('visible');
            popup.classList.remove('visible');
            // Reset form after transition
            setTimeout(() => {
                popupForm.reset();
                // Ensure form is visible again for next time
                formContent.style.display = 'block';
                thankYouMessage.style.display = 'none';
            }, 300); // Match CSS transition duration
        };

        openBtn.addEventListener('click', openPopup);
        closeBtn.addEventListener('click', closePopup);
        
        // Close by clicking outside the popup
        overlay.addEventListener('click', (e) => {
            // Check if the click is directly on the overlay
            if (e.target === overlay) {
                closePopup();
            }
        });

        // Handle popup form submission
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide form, show thank you
            formContent.style.display = 'none';
            thankYouMessage.style.display = 'block';
            console.log('Popup form submitted (mock).');

            // Automatically close popup after 3 seconds
            setTimeout(() => {
                closePopup();
            }, 3000);
        });
    } else {
        console.warn('Popup modal elements not found. Sticky contact button may not work.');
    }
});

