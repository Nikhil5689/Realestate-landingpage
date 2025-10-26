
document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        const navLinks = mainNav.querySelectorAll('a'); // Get links inside nav

        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('nav-open');
            menuToggle.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            // Toggle body scroll to prevent scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    mainNav.classList.remove('nav-open');
                    menuToggle.classList.remove('nav-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = ''; // Restore scroll
                }
            });
        });
    }
    
    // --- Smooth Scroll with Header Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Check if it's one of the popup links
            if (href === '#contact-popup') {
                e.preventDefault();
                openContactPopup();
                return; // Stop further execution
            }

            // Check if it's an actual on-page anchor
            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80; // From :root --header-height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            } catch (error) {
                // Catches invalid selectors, like href="#"
                console.warn('Could not find element for anchor:', href);
            }
        });
    });

    // --- NEW: Contact Popup Modal Logic ---
    const contactPopup = document.getElementById('contactPopup');
    const popupCloseBtn = document.getElementById('popupCloseBtn');
    const contactForm = document.getElementById('contactForm');
    const popupFormContainer = document.getElementById('popupFormContainer');
    const popupThanksContainer = document.getElementById('popupThanksContainer');
    
    // Buttons that open the popup
    const stickyContactBtn = document.getElementById('stickyContactBtn');
    const headerEnquireBtn = document.getElementById('headerEnquireBtn');
    const heroEnquireBtn = document.getElementById('heroEnquireBtn');
    const aboutEnquireBtn = document.getElementById('aboutEnquireBtn');

    function openContactPopup() {
        if (contactPopup) {
            contactPopup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        }
    }

    function closeContactPopup() {
        if (contactPopup) {
            contactPopup.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scroll

            // Reset form visibility after a short delay
            setTimeout(() => {
                if (popupFormContainer && popupThanksContainer) {
                    popupFormContainer.style.display = 'block';
                    popupThanksContainer.style.display = 'none';
                }
            }, 300); // Match CSS transition time
        }
    }

    // Event Listeners for opening
    if (stickyContactBtn) stickyContactBtn.addEventListener('click', openContactPopup);
    // These are handled by the smooth scroll logic above, but we keep this as a fallback
    if (headerEnquireBtn) headerEnquireBtn.addEventListener('click', (e) => { e.preventDefault(); openContactPopup(); });
    if (heroEnquireBtn) heroEnquireBtn.addEventListener('click', (e) => { e.preventDefault(); openContactPopup(); });
    if (aboutEnquireBtn) aboutEnquireBtn.addEventListener('click', (e) => { e.preventDefault(); openContactPopup(); });


    // Event Listeners for closing
    if (popupCloseBtn) popupCloseBtn.addEventListener('click', closeContactPopup);
    if (contactPopup) {
        contactPopup.addEventListener('click', (e) => {
            // Close if clicking on the overlay itself, not the modal content
            if (e.target === contactPopup) {
                closeContactPopup();
            }
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission

            // Here you would typically send the form data to a server
            // For this demo, we just show the thank you message.
            console.log('Form submitted (demo)');

            // Hide form, show thanks
            if (popupFormContainer && popupThanksContainer) {
                popupFormContainer.style.display = 'none';
                popupThanksContainer.style.display = 'block';
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        const toggle = item.querySelector('.faq-toggle');

        if (header && content && toggle) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Optional: Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-content').style.maxHeight = null;
                        otherItem.querySelector('.faq-toggle').textContent = '+';
                        otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    toggle.textContent = '–'; // Use en-dash or minus
                    header.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                    toggle.textContent = '+';
                    header.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Start loading 50px before it enters viewport
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
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    
    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- NEW: Randomize Image Placeholders ---
    function randomizeImages() {
        const images = document.querySelectorAll('.random-img');
        const totalImages = 20; // Use photo1.avif to photo20.avif
        
        images.forEach(img => {
            const randomNum = Math.floor(Math.random() * totalImages) + 1;
            const newSrc = `/Public.html/sample1/assets/photo${randomNum}.avif`;
            img.src = newSrc;

            // Add an error handler for broken image links
            img.onerror = function() {
                // Use a placeholder service if the image fails
                const w = this.width > 0 ? this.width : 400;
                const h = this.height > 0 ? this.height : 300;
                this.src = `https://placehold.co/${w}x${h}/002D62/F9F6F1?text=Image+Not+Available`;
                this.alt = 'Image placeholder';
                console.warn(`Failed to load image: ${newSrc}`);
            };
        });
    }

    // Run the image randomizer
    randomizeImages();

});
