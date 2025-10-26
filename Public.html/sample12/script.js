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
            document.body.style.overflow = isOpened ? 'hidden' : ''; // Prevent scrolling when menu is open
        });
        
         // Close menu when clicking outside
         document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Allow scrolling again
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
                let headerOffset = 75; // Adjusted header height
                if (window.innerWidth <= 768) { headerOffset = 65; }
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                if (targetId === '#home') { offsetPosition = 0; }
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = ''; // Allow scrolling again
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
    
    // --- Counter-up Animation for Developer Stats ---
    const statCounters = document.querySelectorAll('#about-developer .counter');
    let statCounterAnimated = false; 

    const startStatCounter = (counter) => {
        const targetRaw = counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const target = parseInt(targetRaw, 10);
        
        if (isNaN(target)) return; // Skip if target is not a number

        const duration = 2000; // Total duration in ms
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const currentVal = Math.floor(progress * target);
            
            // Format the suffix correctly within the <sup> tag if needed
            const supElement = counter.querySelector('sup');
            if(supElement) {
                counter.childNodes[0].nodeValue = currentVal; // Update the number part
                supElement.textContent = suffix; // Keep the suffix in sup
            } else {
                 counter.textContent = currentVal + suffix; // Simple case without sup
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                 // Ensure final value is displayed accurately with suffix
                 if(supElement) {
                    counter.childNodes[0].nodeValue = target;
                 } else {
                    counter.textContent = target + suffix;
                 }
            }
        };
        window.requestAnimationFrame(step);
    };

    const statCounterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statCounterAnimated) {
                statCounters.forEach(counter => {
                    startStatCounter(counter);
                });
                statCounterAnimated = true; // Set flag
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    const developerSection = document.getElementById('about-developer');
    if (developerSection) {
        statCounterObserver.observe(developerSection);
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
            
            // Simulate network request
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

    // --- NEW: Sticky Popup Form Logic ---
    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupFormContainer = document.getElementById('popupFormContainer');
    const popupContactForm = document.getElementById('popupContactForm');
    const body = document.body; // Already defined, but good to be sure

    if (openPopupBtn && closePopupBtn && popupOverlay && popupContactForm) {
        
        // Open popup
        openPopupBtn.addEventListener('click', () => {
            popupOverlay.classList.add('open');
            body.style.overflow = 'hidden'; // Prevent background scroll
        });

        // Close popup function
        const closePopup = () => {
            popupOverlay.classList.remove('open');
            body.style.overflow = ''; // Re-enable background scroll
            
            // Reset form if it was submitted
            if (popupFormContainer.classList.contains('submitted')) {
                setTimeout(() => {
                    popupFormContainer.classList.remove('submitted');
                    popupContactForm.reset();
                }, 300); // Wait for fade-out
            }
        };

        // Close popup via 'X' button
        closePopupBtn.addEventListener('click', closePopup);

        // Close popup by clicking overlay
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                closePopup(); // Trigger close logic
            }
        });

        // Handle popup form submission
        popupContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show thank you message
            popupFormContainer.classList.add('submitted');
            console.log('Popup form submitted (mock).');

            // Automatically close popup after 3 seconds
            setTimeout(() => {
                closePopup();
            }, 3000);
        });
    }

    /* REMOVED DYNAMIC IMAGE REPLACEMENT FUNCTION
       Images are now set statically in index.html and style.css
       using the /Public.html/sample12/assets/ path.
    */

});

