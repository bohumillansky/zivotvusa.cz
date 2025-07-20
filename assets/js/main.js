// assets/js/main.js
document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (menuToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!menuToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('active');
                menuToggle.classList.remove('active');

                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Reading progress indicator
    const progressBar = createProgressBar();

    function createProgressBar() {
        const progress = document.createElement('div');
        progress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #1d4ed8);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progress);
        return progress;
    }

    // Update progress bar on scroll
    if (document.body.classList.contains('single')) {
        window.addEventListener('scroll', updateProgress);
    }

    function updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // Copy to clipboard for code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const button = document.createElement('button');
        button.textContent = 'Kopírovat';
        button.className = 'copy-code-btn';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;

        pre.style.position = 'relative';
        pre.appendChild(button);

        pre.addEventListener('mouseenter', () => button.style.opacity = '1');
        pre.addEventListener('mouseleave', () => button.style.opacity = '0');

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                button.textContent = 'Zkopírováno!';
                setTimeout(() => {
                    button.textContent = 'Kopírovat';
                }, 2000);
            });
        });
    });

    // Search functionality (pro budoucí rozšíření)
    function initSearch() {
        const searchInput = document.querySelector('#search-input');
        const searchResults = document.querySelector('#search-results');

        if (!searchInput || !searchResults) return;

        let searchIndex = [];

        // Load search index
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                searchIndex = data;
            });

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const results = searchIndex.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.toLowerCase().includes(query))
            ).slice(0, 5);

            displaySearchResults(results);
        });

        function displaySearchResults(results) {
            if (results.length === 0) {
                searchResults.innerHTML = '<p>Žádné výsledky</p>';
                return;
            }

            const html = results.map(result => `
                <div class="search-result">
                    <h4><a href="${result.permalink}">${result.title}</a></h4>
                    <p>${result.summary}</p>
                </div>
            `).join('');

            searchResults.innerHTML = html;
        }
    }

    // Dark mode toggle (připraveno pro budoucnost)
    function initDarkMode() {
        const darkModeToggle = document.querySelector('#dark-mode-toggle');
        if (!darkModeToggle) return;

        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        darkModeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Performance monitoring
    function trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function () {
                setTimeout(function () {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

                    // Log pro debug (v produkci můžete poslat do analytics)
                    console.log('Page load time:', loadTime + 'ms');
                }, 0);
            });
        }
    }

    // Animation on scroll (pro budoucí enhanced verzi)
    function initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');

            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    // Initialize all features
    initSearch();
    initDarkMode();
    trackPerformance();
    initScrollAnimations();

    // Service Worker registration (pro PWA v budoucnosti)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js')
                .then(function (registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function (registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Chart functionality for comparison shortcodes
    function initCharts() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const canvas = container.querySelector('canvas');
            if (!canvas) return;

            const chartType = canvas.dataset.chartType;
            const chartData = JSON.parse(canvas.dataset.chartData || '{}');

            // Implementace Chart.js nebo jiné knihovny pro grafy
            // Pro základní verzi zatím jen placeholder
            container.innerHTML = `
                <div class="chart-placeholder">
                    <p>Graf bude implementován v další verzi</p>
                    <small>Typ: ${chartType}</small>
                </div>
            `;
        });
    }

    // Table of contents generator
    function generateTOC() {
        const tocContainer = document.querySelector('#table-of-contents');
        const headings = document.querySelectorAll('.post-content h2, .post-content h3');

        if (!tocContainer || headings.length === 0) return;

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = 'toc-link';

            li.appendChild(link);
            tocList.appendChild(li);
        });

        tocContainer.appendChild(tocList);

        // Highlight current section
        const tocLinks = tocContainer.querySelectorAll('.toc-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = tocContainer.querySelector(`[href="#${id}"]`);

                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.classList.remove('active'));
                    if (tocLink) tocLink.classList.add('active');
                }
            });
        }, {
            rootMargin: '-20% 0% -80% 0%'
        });

        headings.forEach(heading => observer.observe(heading));
    }

    // Initialize additional features
    initCharts();
    generateTOC();

    // Console easter egg
    console.log(`
    ┌─────────────────────────────┐
    │     Život v USA Blog        │
    │   Vytvořeno s Hugo + ❤️      │
    │                             │
    │  Zajímá vás technická       │
    │  stránka? Napište na:       │
    │  kontakt@zivotvusa.cz       │
    └─────────────────────────────┘
    `);
});

// Global utility functions
window.ZivotVUSA = {
    // Utility pro formátování čísel
    formatNumber: function (num, currency = false) {
        const formatter = new Intl.NumberFormat('cs-CZ', {
            style: currency ? 'currency' : 'decimal',
            currency: currency === 'CZK' ? 'CZK' : 'USD'
        });
        return formatter.format(num);
    },

    // Utility pro sdílení článků
    shareArticle: function (platform, url, title) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        };

        if (shareUrls[platform]) {
            if (platform === 'email') {
                window.location.href = shareUrls[platform];
            } else {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            }
        }
    },

    // Debug informace
    debug: {
        theme: 'Život v USA Blog',
        version: '1.0.0',
        generator: 'Hugo',
        features: ['Mobile Responsive', 'SEO Optimized', 'Performance Focused']
    }
};