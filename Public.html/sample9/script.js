document.addEventListener('DOMContentLoaded', function() {
    const topNav = document.getElementById('topNav');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    let headerHeight = 70; // Initial default

     // --- Adjust Header & Body Padding ---
    function updateHeaderLayout() {
        if (topNav) {
            headerHeight = topNav.offsetHeight;
            body.style.paddingTop = headerHeight + 'px';
        }
    }
    updateHeaderLayout(); // Initial check
    window.addEventListener('resize', updateHeaderLayout);

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
        updateHeaderLayout(); // Update height as padding changes
    });

    // --- Mobile Menu Toggle ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : ''; // Prevent body scroll
        });

        // Close menu when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = ''; // Re-enable scroll
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
                let elementPosition = targetElement.getBoundingClientRect().top;
                // Use the dynamically updated headerHeight
                let offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                // Special case for #home to scroll to top
                if (targetId === '#home') { offsetPosition = 0; }

                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                // Close mobile nav if open
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = ''; // Re-enable scroll
                }
            }
        });
    });

    // --- Fade-in on Scroll (IntersectionObserver) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });
    
    // --- Animated Counter Function ---
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let start = 0;
        const startTime = performance.now();
        
        // Determine suffix based on target value
        let suffix = '';
        if (el.dataset.target === "35") suffix = '+';
        else if (el.dataset.target === "25") suffix = '+';
        else if (el.dataset.target === "1800") suffix = '+';

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            let currentValue = Math.floor(progress * target);
            
            // Format number (though not strictly needed for these values)
            let displayValue = currentValue;
            
            el.textContent = displayValue; // Update number without suffix during animation
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                 el.textContent = Math.floor(target) + suffix; // Set final value with suffix
            }
        }
        requestAnimationFrame(update);
    }

    // --- Trigger Counter on Scroll ---
    const highlightsBar = document.getElementById('highlightsBar');
    if (highlightsBar) {
         const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    highlightsBar.querySelectorAll('.value[data-target]').forEach(animateCounter);
                    observer.unobserve(highlightsBar); // Run only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible
        counterObserver.observe(highlightsBar);
    }

    // --- Floor Plan Tabs ---
    const tabContainer = document.getElementById('floorPlanTabs');
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        // Find content containers relative to the section, not just next sibling
        const contentContainer = document.getElementById('floor-plans'); 
        const tabContents = contentContainer.querySelectorAll('.tab-content'); 
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                tabContents.forEach(content => {
                    if (content.id === tabId) { content.classList.add('active'); } 
                    else { content.classList.remove('active'); }
                });
            });
        });
    }

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    
    // --- Main Contact Form Mock Submission (NEW) ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success-message');
    const formWrapper = document.getElementById('main-contact-wrapper');

    if (contactForm && successMessage && formWrapper) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton.disabled) return; // Prevent multiple clicks

            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 
                 // Hide form, show success
                 contactForm.style.display = 'none';
                 successMessage.classList.add('visible');
                 
                 // Reset after 3 seconds
                 setTimeout(() => {
                    contactForm.style.display = 'flex';
                    successMessage.classList.remove('visible');
                    this.reset(); // Reset form fields
                 }, 3000);
                 
                 console.log('Main form submitted (mock).');
            }, 1500);
        });
    }

    // --- NEW: Sticky Popup Form Logic ---
    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupFormContainer = document.getElementById('popupFormContainer');
    const popupContactForm = document.getElementById('popupContactForm');

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

});

