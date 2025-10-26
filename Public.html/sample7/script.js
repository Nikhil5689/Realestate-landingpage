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
        updateHeaderLayout(); // Re-check height on scroll
    });

    // --- Mobile Menu Toggle ---
    if (menuToggle && mainNav) {
        const navLinksContainer = mainNav.querySelector('.nav-links'); // Get ul
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
    const appearOnScroll = new IntersectionObserver(function( entries, observer ) { // Renamed observer
        entries.forEach(entry => {
            if (entry.isIntersecting) { 
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Use the correct observer name
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });
    
    // --- Tab Functionality ---
    function setupTabs(tabNavId) {
        const tabNav = document.getElementById(tabNavId);
        if (!tabNav) return;

        const tabButtons = tabNav.querySelectorAll('.tab-button');
        
        // Get all potential tab contents within the parent section
        const allContents = tabNav.parentElement.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update content
                allContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    setupTabs('spacesTabs');

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        const toggle = item.querySelector('.faq-toggle');

        if (header && content && toggle) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others first (optional, comment out if you want multiple open)
                faqItems.forEach(i => {
                    if (i !== item && i.classList.contains('active')) {
                        i.classList.remove('active');
                        i.querySelector('.faq-content').style.maxHeight = null;
                        i.querySelector('.faq-content').style.paddingTop = '0';
                        i.querySelector('.faq-toggle').textContent = '+';
                        i.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.paddingTop = '0.5rem'; 
                    toggle.textContent = '−'; 
                    header.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                    content.style.paddingTop = '0'; 
                    toggle.textContent = '+';
                    header.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    
    // --- Main Form Submission Mock ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success-message'); 
    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            if(submitButton.disabled) return; // Prevent multiple clicks

            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 this.reset();
                 // Show success message
                 successMessage.classList.add('visible');
                  // Hide success message after 3 seconds
                 setTimeout(() => {
                    successMessage.classList.remove('visible');
                 }, 3000);
                 console.log('Main form submitted (mock).'); // Log after timeout
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

