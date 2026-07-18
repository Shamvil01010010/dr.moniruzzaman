document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Play the large hero asset only while it contributes to the page.
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        if (reducedMotion) {
            heroVideo.pause();
        } else {
            const heroVideoObserver = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => {});
                } else {
                    heroVideo.pause();
                }
            }, { threshold: 0.1 });
            heroVideoObserver.observe(heroVideo);
        }
    }

    // Decorative particles add depth without requiring another image asset.
    const particleLayer = document.getElementById('heroParticles');
    if (particleLayer && !reducedMotion) {
        Array.from({ length: 24 }, (_, index) => {
            const particle = document.createElement('span');
            particle.className = 'hero-particle';
            particle.style.left = `${(index * 37) % 100}%`;
            particle.style.top = `${12 + ((index * 23) % 78)}%`;
            particle.style.setProperty('--particle-size', `${3 + (index % 4) * 2}px`);
            particle.style.setProperty('--particle-duration', `${7 + (index % 6)}s`);
            particle.style.setProperty('--particle-delay', `${-(index % 7)}s`);
            particle.style.setProperty('--particle-x', `${-35 + (index % 6) * 14}px`);
            particleLayer.appendChild(particle);
        });
    }
    
    // 1. Dynamic Header Navigation scrolling transitions
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    const updateHeaderClasses = () => {
        const currentScrollY = window.scrollY;
        const isMenuOpen = header.classList.contains('nav-open');

        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Animated viewport entrance / exits
        if (window.innerWidth > 1024 && currentScrollY > lastScrollY && currentScrollY > 150 && !isMenuOpen) {
            header.style.transform = 'translateY(-110%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = Math.max(0, currentScrollY);
    };

    window.addEventListener('scroll', updateHeaderClasses, { passive: true });

    // 2. Mobile Nav Toggle Handling
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const mainNav = document.getElementById('mainNav');
    const menuLinks = document.querySelectorAll('.nav-link, .phone-btn');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            siteHeader.classList.toggle('nav-open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && siteHeader.classList.contains('nav-open')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            siteHeader.classList.remove('nav-open');
            document.body.style.overflow = '';
            menuToggle.focus();
        }

        if (event.key === 'Tab' && siteHeader.classList.contains('nav-open') && mainNav) {
            const focusable = Array.from(mainNav.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (siteHeader.classList.contains('nav-open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                siteHeader.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    });

    // 3. Cinematic Frame Parallax Engine
    const parallaxTargets = document.querySelectorAll(".parallax-target");
    let parallaxFrameId = null;

    const getAbsoluteOffsetTop = (element) => {
        let offsetTop = 0;
        while (element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return offsetTop;
    };

    const handleParallax = () => {
        if (reducedMotion) return;
        const scrollPos = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        parallaxTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            // Prevent execution on elements out of viewport coordinates
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const speed = parseFloat(target.getAttribute('data-speed')) || 0.1;
                const absoluteOffset = getAbsoluteOffsetTop(target);
                const offset = (scrollPos - (absoluteOffset - viewportHeight)) * speed;
                target.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        parallaxFrameId = null;
    };

    window.addEventListener("scroll", () => {
        if (!parallaxFrameId) {
            parallaxFrameId = requestAnimationFrame(handleParallax);
        }
    }, { passive: true });

    // 4. Dynamic Counter (Odometer effect)
    const runOdometerAnimation = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimal')) || 0;
        const duration = 2000; // Total count duration in ms
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out function
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = easeProgress * target;

            element.textContent = currentVal.toFixed(decimals);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toFixed(decimals);
            }
        };

        requestAnimationFrame(updateCount);
    };

    // 5. Bidirectional Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            if (entry.isIntersecting) {
                element.classList.add('active');
                
                // Trigger counts if target contains odometer class
                const odometers = element.querySelectorAll('.odometer');
                odometers.forEach(odometer => {
                    if (!odometer.classList.contains('counted')) {
                        odometer.classList.add('counted');
                        runOdometerAnimation(odometer);
                    }
                });
            } else {
                // Remove class on exit to trigger replay animations (Up & Down scroll loop)
                element.classList.remove('active');
                const odometers = element.querySelectorAll('.odometer');
                odometers.forEach(odometer => {
                    odometer.classList.remove('counted');
                    // Reset to 0 baseline on exit so next scroll-in animations play cleanly
                    odometer.textContent = "0";
                });
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 6. Dynamic Responsive Desktop Scroll-Driven & Mobile Draggable Before/After Slider
    const initBeforeAfterComparison = () => {
        const section = document.getElementById('smile-transformation');
        const comparisonSlider = document.getElementById('comparisonSlider');
        const afterImgWrapper = document.getElementById('afterImgWrapper');
        const sliderHandle = document.getElementById('sliderHandle');
        const comparisonRange = document.getElementById('comparisonRange');
        
        if (!section || !comparisonSlider || !afterImgWrapper || !sliderHandle) return;

        let dragActive = false;

        // Unified Left-to-Right reveal function
        const updatePosition = (percentage) => {
            const clipPercentage = 100 - percentage;
            afterImgWrapper.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
            sliderHandle.style.left = `${percentage}%`;
            if (comparisonRange) comparisonRange.value = percentage;
        };

        const calculatePercent = (clientX) => {
            const rect = comparisonSlider.getBoundingClientRect();
            const posX = clientX - rect.left;
            return Math.max(0, Math.min(100, (posX / rect.width) * 100));
        };

        const onPointerDown = (e) => {
            if (window.innerWidth >= 992) return; 
            dragActive = true;
            comparisonSlider.setPointerCapture(e.pointerId);
            updatePosition(calculatePercent(e.clientX));
        };

        const onPointerMove = (e) => {
            if (window.innerWidth >= 992 || !dragActive) return; 
            requestAnimationFrame(() => {
                updatePosition(calculatePercent(e.clientX));
            });
        };

        const onPointerUp = () => {
            dragActive = false;
        };

        comparisonSlider.addEventListener('pointerdown', onPointerDown);
        comparisonSlider.addEventListener('pointermove', onPointerMove);
        comparisonSlider.addEventListener('pointerup', onPointerUp);
        comparisonSlider.addEventListener('pointercancel', onPointerUp);

        if (comparisonRange) {
            comparisonRange.addEventListener('input', () => updatePosition(Number(comparisonRange.value)));
        }

        // Precise Scroll Locking/Reveal transition handling
        const handleScrollTransition = () => {
            if (window.innerWidth < 992 || reducedMotion) return; 

            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;
            const viewHeight = window.innerHeight;
            
            const scrollOffset = -rect.top;
            const scrollMaxRange = sectionHeight - viewHeight;
            
            if (scrollOffset >= 0 && scrollOffset <= scrollMaxRange) {
                const progress = (scrollOffset / scrollMaxRange) * 100;
                
                requestAnimationFrame(() => {
                    updatePosition(progress);
                    section.classList.add('active-scroll');
                });
            } else if (scrollOffset < 0) {
                requestAnimationFrame(() => {
                    updatePosition(0);
                    section.classList.remove('active-scroll');
                });
            } else if (scrollOffset > scrollMaxRange) {
                requestAnimationFrame(() => {
                    updatePosition(100);
                    section.classList.remove('active-scroll');
                });
            }
        };

        window.addEventListener('scroll', handleScrollTransition, { passive: true });

        const handleLayoutState = () => {
            if (window.innerWidth < 992 || reducedMotion) {
                comparisonSlider.style.cursor = 'ew-resize';
                updatePosition(50); 
                section.classList.remove('active-scroll');
            } else {
                comparisonSlider.style.cursor = 'default';
                handleScrollTransition();
            }
        };

        window.addEventListener('resize', handleLayoutState);
        handleLayoutState();
    };

    initBeforeAfterComparison();

    // 7. Micro-Interactive Cards (3D Tilt Mouse tracking)
    const tiltCards = document.querySelectorAll('.interactive-hover-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            
            const rotX = ((y - midY) / midY) * 5; // degrees tilt limits
            const rotY = ((midX - x) / midX) * 5;
            
            // Bypass CSS delay curves momentarily during live cursor tracking
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = '';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 8. FAQ Accordion Handler
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        const content = trigger.nextElementSibling;
        if (content) {
            const contentId = `faq-answer-${Array.from(faqTriggers).indexOf(trigger) + 1}`;
            content.id = contentId;
            trigger.setAttribute('aria-controls', contentId);
            content.setAttribute('aria-hidden', 'true');
        }
        trigger.addEventListener('click', () => {
            const currentItem = trigger.closest('.faq-item');
            const isActive = currentItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                item.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
            });

            if (!isActive) {
                currentItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                currentItem.querySelector('.faq-content').setAttribute('aria-hidden', 'false');
            }
        });
    });

    // 9. Active Navigation Underline Scroll Mapping
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-left .nav-link, .nav-right .nav-link');

    const activeNavigationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section').toLowerCase() === id.toLowerCase()) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-15% 0px -55% 0px'
    });

    sections.forEach(section => {
        activeNavigationObserver.observe(section);
    });

    // 10. Back To Top Dynamics
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
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

    // No server is configured yet: compose a real request in the visitor's email app.
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentStatus = document.getElementById('appointmentStatus');
    if (appointmentForm && appointmentStatus) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!appointmentForm.checkValidity()) {
                appointmentForm.reportValidity();
                return;
            }
            const data = new FormData(appointmentForm);
            const subject = encodeURIComponent('Appointment request from website');
            const body = encodeURIComponent(`Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nTreatment: ${data.get('treatment')}\n\nPlease contact me to arrange an appointment.`);
            appointmentStatus.textContent = 'Opening your email app to send the request to the clinic.';
            window.location.href = `mailto:info@drmoniruzzaman.com?subject=${subject}&body=${body}`;
        });
    }
});
