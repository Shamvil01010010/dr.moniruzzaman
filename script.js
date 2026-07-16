document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Dynamic Scrolling Visibility Behaviours
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isMenuOpen = header.classList.contains('nav-open');

        // Toggle scrolled state classes
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Animated hide and show interactions
        if (currentScrollY > lastScrollY && currentScrollY > 150 && !isMenuOpen) {
            header.style.transform = 'translateY(-110%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });

    // 2. Responsive Mobile Navbar Control Trigger
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const menuLinks = document.querySelectorAll('.nav-link, .phone-btn');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            siteHeader.classList.toggle('nav-open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    // Safely collapse mobile overlay navigation
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (siteHeader.classList.contains('nav-open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                siteHeader.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    });

    // 3. Cinematic Direct Scroll Parallax Engine (Optimized via RAF)
    const parallaxTargets = document.querySelectorAll(".parallax-target");
    let animationFrameId = null;

    const performParallax = () => {
        const scrollPos = window.scrollY;
        
        parallaxTargets.forEach(target => {
            const speed = parseFloat(target.getAttribute('data-speed')) || 0.1;
            // Prevent execution on elements out of view boundaries
            if (scrollPos < window.innerHeight * 2.5) {
                target.style.transform = `translate3d(0, ${scrollPos * speed}px, 0)`;
            }
        });
        animationFrameId = null;
    };

    window.addEventListener("scroll", () => {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(performParallax);
        }
    }, { passive: true });

    // 4. Spatial Element Reveal Animations (Intersection Observer Core)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Dynamic Interactive Before / After Dual Image Slider
    const comparisonSlider = document.getElementById('comparisonSlider');
    const afterImgWrapper = document.getElementById('afterImgWrapper');
    const sliderHandle = document.getElementById('sliderHandle');

    if (comparisonSlider && afterImgWrapper && sliderHandle) {
        const calculateSlidePercent = (clientX) => {
            const sliderRect = comparisonSlider.getBoundingClientRect();
            const relativeX = clientX - sliderRect.left;
            let percentage = (relativeX / sliderRect.width) * 100;
            return Math.max(0, Math.min(100, percentage));
        };

        const updateSliderPosition = (percentage) => {
            afterImgWrapper.style.clipPath = `inset(0 0 0 ${percentage}%)`;
            sliderHandle.style.left = `${percentage}%`;
        };

        // Desktop interaction handlers
        comparisonSlider.addEventListener('mousemove', (e) => {
            updateSliderPosition(calculateSlidePercent(e.clientX));
        });

        // Responsive touch interface bindings
        comparisonSlider.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                updateSliderPosition(calculateSlidePercent(e.touches[0].clientX));
            }
        }, { passive: true });
    }

    // 6. Interactive Medical FAQ Accordion Mechanics
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentItem = trigger.closest('.faq-item');
            const isActive = currentItem.classList.contains('active');

            // Collapse other active FAQ elements
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                currentItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 7. Navigation Scroll Highlighting (Active Section Triggers)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-left .nav-link, .nav-right .nav-link');

    const activeNavigationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-15% 0px -60% 0px'
    });

    sections.forEach(section => {
        activeNavigationObserver.observe(section);
    });

    // 8. Back To Top Mechanics
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});