document.addEventListener('DOMContentLoaded', function() {
    const topNav = document.getElementById('topNav');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    let headerHeight = 70; // Initial header height

    // --- Adjust Header Height on Scroll ---
    function updateHeaderHeight() {
        if (topNav) {
            headerHeight = topNav.offsetHeight;
        }
    }
    updateHeaderHeight(); // Initial check

    window.addEventListener('scroll', () => {
        if (!topNav) return;
        if (window.scrollY > 50) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
        updateHeaderHeight(); // Update height on scroll if padding changes
    });
    window.addEventListener('resize', updateHeaderHeight); // Update height on resize

    // --- Mobile Menu Toggle ---
    if (menuToggle && mainNav) {
        const navLinksContainer = mainNav.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : ''; // Prevent body scroll when menu open
            
            // This handles the display: flex vs display: none for animation
            if (isOpen) {
                // Instantly make it flex to animate in
                navLinksContainer.style.display = 'flex';
            } else {
                // Wait for animation to finish before setting display: none
                // The transition is on the `transform` property in CSS
                // We just need to remove the 'open' class
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Check for popup trigger
            if (targetId === '#contact' && this.closest('.main-nav .btn')) {
                 // Find the main contact section
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                     let elementPosition = targetElement.getBoundingClientRect().top;
                     let offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                     window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            } else if (targetId === '#home') {
                 window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    let elementPosition = targetElement.getBoundingClientRect().top;
                    let offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
            
            // Close mobile nav if open and click was on a nav link
            if (mainNav.classList.contains('open') && this.closest('.nav-links')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = ''; // Re-enable scroll
            }
        });
    });

    // --- Fade-in on Scroll (IntersectionObserver) ---
    const faders = document.querySelectorAll('.fade-in');
    
    if (faders.length > 0) {
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
    }
    
    // --- Tab Functionality ---
    function setupTabs(tabNavId) {
        const tabNav = document.getElementById(tabNavId);
        if (!tabNav) return;

        const tabButtons = tabNav.querySelectorAll('.tab-button');
        
        // Find all content tabs associated with this nav
        let tabContents = [];
        tabButtons.forEach(button => {
            const contentId = button.getAttribute('data-tab');
            const contentElement = document.getElementById(contentId);
            if (contentElement) {
                tabContents.push(contentElement);
            }
        });

        if (tabContents.length === 0) {
            console.warn(`No tab content found for tab nav #${tabNavId}`);
            return;
        }

        tabNav.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.tab-button');
            if (!clickedButton) return;

            // Get target content ID
            const targetId = clickedButton.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');
            
            // Update content
            tabContents.forEach(content => content.classList.remove('active'));
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    }
    
    setupTabs('galleryTabs');
    setupTabs('plansTabs');

    // --- FAQ Accordion ---
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
         faqContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.faq-header');
            if (!header) return;

            const item = header.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            const toggle = item.querySelector('.faq-toggle');
            const isActive = item.classList.contains('active');

            // Optional: Close other items
            faqContainer.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-content').style.maxHeight = null;
                    openItem.querySelector('.faq-toggle').textContent = '+';
                    openItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
                }
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                toggle.textContent = '−'; // Minus sign
                header.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
                toggle.textContent = '+';
                header.setAttribute('aria-expanded', 'false');
            }
        });
    }


    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- Main Contact Form Submission (Mock) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
             if (submitButton.disabled) return; // Prevent multiple submissions

            console.log('Main form submitted (mock).');
            submitButton.textContent = 'Submitted!';
            submitButton.disabled = true;
            
            setTimeout(() => {
                 submitButton.textContent = 'Submit Enquiry';
                 submitButton.disabled = false;
                 this.reset();
            }, 3000);
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

