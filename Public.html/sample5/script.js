document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let headerOffset = 77; // Approximate height of the fixed header
                if (window.innerWidth <= 768) {
                    headerOffset = 61;
                }
                
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Special case for #home to scroll to top
                if (targetId === '#home') {
                    offsetPosition = 0;
                }

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile nav if open
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                }
            }
        });
    });

    // --- Fade-in on Scroll (IntersectionObserver) ---
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    },
    appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    
    // --- Floor Plan Tabs ---
    const tabContainer = document.getElementById('floorPlanTabs');
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update content
                tabContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- Main Form Submission (from original file) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a mockup, so we just show a custom message.
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton.disabled) return;

            submitButton.textContent = 'Submitted!';
            submitButton.disabled = true;
            
            console.log('Main form submitted (mock).');
            
            setTimeout(() => {
                 submitButton.textContent = 'Submit';
                 submitButton.disabled = false;
                 this.reset(); // Reset form fields
            }, 3000);
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

