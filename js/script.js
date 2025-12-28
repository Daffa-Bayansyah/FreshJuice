// ===== NAVIGATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== MENU FILTER FUNCTIONALITY =====
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            if (menuItems.length > 0) {
                menuItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
            
            // Filter gallery items
            if (galleryItems.length > 0) {
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Format email tidak valid!', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Mengirim pesan...', 'info');
            
            setTimeout(() => {
                showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Custom scroll animations for elements without AOS
    const animateElements = document.querySelectorAll('.feature-card, .menu-card, .gallery-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .page-header::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Add loading class to elements
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-image, .feature-card');
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ===== QUICK ORDER FUNCTIONALITY =====
function initQuickOrder() {
    const quickOrderButtons = document.querySelectorAll('.quick-order');
    
    quickOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuCard = this.closest('.menu-card-full') || this.closest('.menu-card');
            const menuName = menuCard.querySelector('h3').textContent;
            const menuPrice = menuCard.querySelector('.menu-price').textContent;
            
            showNotification(`${menuName} (${menuPrice}) ditambahkan ke keranjang!`, 'success');
            
            // Add to cart animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.querySelector('.fa-expand')) {
                // Expand functionality
                const galleryCard = this.closest('.gallery-card');
                const title = galleryCard.querySelector('h3').textContent;
                showNotification(`Membuka ${title} dalam tampilan penuh...`, 'info');
            } else if (this.querySelector('.fa-heart')) {
                // Like functionality
                const icon = this.querySelector('i');
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('Dihapus dari favorit', 'info');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('Ditambahkan ke favorit!', 'success');
                }
            }
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    // Add search functionality if search input exists
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item, .gallery-item');
            
            menuItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ===== CART FUNCTIONALITY =====
let cart = [];

function addToCart(item) {
    cart.push(item);
    updateCartDisplay();
    showNotification(`${item.name} ditambahkan ke keranjang!`, 'success');
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        
        if (cart.length > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            showNotification(`Tema ${isDark ? 'gelap' : 'terang'} diaktifkan`, 'info');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Scroll-dependent functions here
        }, 10);
    });
    
    // Preload critical resources
    const criticalImages = [
        'images/hero-juice.jpg',
        'images/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.menu-card, .gallery-card, .feature-card');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for mobile menu
    const mobileMenuToggle = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            setTimeout(() => {
                if (mobileMenu.classList.contains('active')) {
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            }, 100);
        });
    }
}

// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
    // Google Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    animateCounters();
    initMenuFilter();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initParallaxEffects();
    initLoadingAnimations();
    initQuickOrder();
    initGalleryLightbox();
    initSearch();
    initThemeToggle();
    initLazyLoading();
    initAccessibility();
    optimizePerformance();
    
    // Track page load
    trackEvent('Page', 'Load', window.location.pathname);
    
    console.log('FreshJuice website initialized successfully! 🍊');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// ===== CUSTOM CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// ===== PRODUCT DETAIL MODAL =====
function showProductDetail(productId) {
    // Product data for details
    const productDetails = {
        'orange-blast': {
            name: 'Orange Blast',
            price: 'Rp 25.000',
            image: 'https://i.pinimg.com/1200x/b5/15/19/b5151985c607f0f2c7695b46d5d95181.jpg',
            description: 'Jeruk segar pilihan dengan vitamin C tinggi, sempurna untuk meningkatkan imunitas tubuh',
            benefits: ['100% Organik', 'Tinggi Vitamin C', 'Tanpa Pengawet', 'Fresh Daily'],
            ingredients: ['Jeruk Segar', 'Air Mineral', 'Sedikit Madu Alami'],
            nutrition: {
                calories: '85 kal',
                vitamin_c: '92mg',
                sugar: '16g',
                fiber: '3g'
            }
        },
        'apple-fresh': {
            name: 'Apple Fresh',
            price: 'Rp 22.000',
            image: 'https://i.pinimg.com/1200x/cf/09/3a/cf093a1643884dc7923e28275dd7c40c.jpg',
            description: 'Apel merah segar yang kaya akan antioksidan dan serat, baik untuk pencernaan',
            benefits: ['Kaya Antioksidan', 'Tinggi Serat', 'Baik untuk Pencernaan', 'Rendah Kalori'],
            ingredients: ['Apel Merah Segar', 'Air Mineral'],
            nutrition: {
                calories: '95 kal',
                vitamin_c: '8mg',
                sugar: '19g',
                fiber: '4g'
            }
        },
        'watermelon-fresh': {
            name: 'Watermelon Fresh',
            price: 'Rp 24.000',
            image: 'https://i.pinimg.com/1200x/d6/75/0c/d6750c32bd6efadf1ad57b3750ce2c80.jpg',
            description: 'Semangka segar yang menyegarkan dan kaya akan air untuk hidrasi optimal',
            benefits: ['Hidrasi Optimal', 'Rendah Kalori', 'Kaya Vitamin A', 'Menyegarkan'],
            ingredients: ['Semangka Segar', 'Air Mineral', 'Perasan Lemon'],
            nutrition: {
                calories: '46 kal',
                vitamin_c: '12mg',
                sugar: '9g',
                fiber: '1g'
            }
        },
        'kiwi-delight': {
            name: 'Kiwi Delight',
            price: 'Rp 28.000',
            image: 'https://i.pinimg.com/736x/c6/87/b3/c687b3578dffebf7d02fbe13daf195bd.jpg',
            description: 'Kiwi segar dengan rasa asam manis yang kaya vitamin C dan serat',
            benefits: ['Super Vitamin C', 'Tinggi Serat', 'Antioksidan', 'Boost Imunitas'],
            ingredients: ['Kiwi Segar', 'Air Mineral', 'Madu Alami'],
            nutrition: {
                calories: '61 kal',
                vitamin_c: '154mg',
                sugar: '11g',
                fiber: '3g'
            }
        },
        'tropical-mango': {
            name: 'Tropical Mango',
            price: 'Rp 30.000',
            image: 'https://i.pinimg.com/736x/31/ae/26/31ae2626ed28de33253aa96f5763e3b7.jpg',
            description: 'Mangga matang sempurna dengan rasa manis alami yang menyegarkan',
            benefits: ['Kaya Vitamin A', 'Rasa Manis Alami', 'Energi Boost', 'Antioksidan'],
            ingredients: ['Mangga Matang', 'Air Mineral', 'Sedikit Jeruk Nipis'],
            nutrition: {
                calories: '107 kal',
                vitamin_c: '67mg',
                sugar: '22g',
                fiber: '3g'
            }
        },
        'green-power': {
            name: 'Green Power',
            price: 'Rp 32.000',
            image: 'https://i.pinimg.com/1200x/00/5e/8b/005e8b80b5ea724b15a58b21a8df0570.jpg',
            description: 'Kombinasi sayuran hijau segar: bayam, kale, dan seledri untuk detoksifikasi',
            benefits: ['Detox Alami', 'Tinggi Zat Besi', 'Boost Energi', 'Anti Inflamasi'],
            ingredients: ['Bayam Segar', 'Kale', 'Seledri', 'Mentimun', 'Lemon', 'Jahe'],
            nutrition: {
                calories: '45 kal',
                vitamin_c: '120mg',
                sugar: '6g',
                fiber: '4g'
            }
        },
        'berry-smoothie': {
            name: 'Mix Berry Smoothie',
            price: 'Rp 35.000',
            image: 'https://i.pinimg.com/1200x/5f/ef/21/5fef21821aee5d4c6cb0b89dcf6c75df.jpg',
            description: 'Campuran berbagai berry segar dengan rasa manis asam yang menyegarkan',
            benefits: ['Super Antioksidan', 'Anti Aging', 'Boost Imunitas', 'Kaya Vitamin C'],
            ingredients: ['Strawberry', 'Blueberry', 'Raspberry', 'Yogurt Alami', 'Madu'],
            nutrition: {
                calories: '128 kal',
                vitamin_c: '85mg',
                sugar: '18g',
                fiber: '5g'
            }
        },
        'strawberry-smoothie': {
            name: 'Strawberry Smoothie',
            price: 'Rp 33.000',
            image: 'https://i.pinimg.com/736x/17/98/08/17980899f632f84daa91b253a2fe6d52.jpg',
            description: 'Smoothie strawberry segar dengan tekstur creamy dan rasa manis alami',
            benefits: ['Kaya Antioksidan', 'Vitamin C Tinggi', 'Creamy Texture', 'Natural Sweet'],
            ingredients: ['Strawberry Segar', 'Yogurt Alami', 'Susu Almond', 'Madu'],
            nutrition: {
                calories: '115 kal',
                vitamin_c: '89mg',
                sugar: '15g',
                fiber: '3g'
            }
        },
        'grape-smoothie': {
            name: 'Grape Smoothie',
            price: 'Rp 32.000',
            image: 'https://tse4.mm.bing.net/th/id/OIP.mPW5n0yOcx6G4oX1WHmn-QHaLG?w=1067&h=1600&rs=1&pid=ImgDetMain&o=7&rm=3',
            description: 'Smoothie anggur dengan rasa manis dan tekstur yang lembut',
            benefits: ['Kaya Resveratrol', 'Antioksidan Tinggi', 'Heart Healthy', 'Anti Aging'],
            ingredients: ['Anggur Ungu', 'Yogurt Alami', 'Madu', 'Es Batu'],
            nutrition: {
                calories: '104 kal',
                vitamin_c: '16mg',
                sugar: '20g',
                fiber: '2g'
            }
        },
        'oreo-smoothie': {
            name: 'Oreo Smoothie',
            price: 'Rp 38.000',
            image: 'https://i.pinimg.com/736x/0b/79/7a/0b797af45c2fd371c8bf81625a5edfee.jpg',
            description: 'Smoothie oreo dengan rasa coklat yang creamy dan menyegarkan',
            benefits: ['Creamy Texture', 'Rasa Coklat', 'Energy Boost', 'Mood Booster'],
            ingredients: ['Oreo Cookies', 'Susu Segar', 'Es Krim Vanilla', 'Whipped Cream'],
            nutrition: {
                calories: '285 kal',
                vitamin_c: '2mg',
                sugar: '32g',
                fiber: '2g'
            }
        },
        'raspberry-smoothie': {
            name: 'Raspberry Smoothie',
            price: 'Rp 36.000',
            image: 'https://i.pinimg.com/1200x/6f/70/29/6f70293ea19b0126db50583a390454a7.jpg',
            description: 'Smoothie raspberry dengan rasa asam manis yang kaya antioksidan',
            benefits: ['Super Antioksidan', 'Anti Inflamasi', 'Kaya Serat', 'Low Sugar'],
            ingredients: ['Raspberry Segar', 'Yogurt Greek', 'Madu Organik', 'Chia Seeds'],
            nutrition: {
                calories: '98 kal',
                vitamin_c: '54mg',
                sugar: '12g',
                fiber: '6g'
            }
        }
    };

    const product = productDetails[productId];
    if (!product) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'product-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProductDetail()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeProductDetail()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body">
                <div class="product-image-section">
                    <img src="${product.image}" alt="${product.name}" class="product-detail-img">
                </div>
                <div class="product-info-section">
                    <div class="product-header">
                        <h2>${product.name}</h2>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-benefits">
                        <h3><i class="fas fa-star"></i> Manfaat</h3>
                        <div class="benefits-grid">
                            ${product.benefits.map(benefit => `
                                <span class="benefit-item">
                                    <i class="fas fa-check"></i> ${benefit}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-ingredients">
                        <h3><i class="fas fa-leaf"></i> Bahan</h3>
                        <div class="ingredients-list">
                            ${product.ingredients.map(ingredient => `
                                <span class="ingredient-item">${ingredient}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-nutrition">
                        <h3><i class="fas fa-chart-bar"></i> Informasi Nutrisi (per 400ml)</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-label">Kalori</span>
                                <span class="nutrition-value">${product.nutrition.calories}</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Vitamin C</span>
                                <span class="nutrition-value">${product.nutrition.vitamin_c}</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Gula</span>
                                <span class="nutrition-value">${product.nutrition.sugar}</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Serat</span>
                                <span class="nutrition-value">${product.nutrition.fiber}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <a href="order.html?product=${productId}" class="btn btn-primary btn-large">
                            <i class="fas fa-shopping-cart"></i> Pesan Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .product-detail-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow: hidden;
            animation: slideInUp 0.3s ease;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.1);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(0, 0, 0, 0.2);
        }
        
        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .product-image-section {
            padding: 2rem;
            background: #f8f9fa;
        }
        
        .product-detail-img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 15px;
        }
        
        .product-info-section {
            padding: 2rem;
        }
        
        .product-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .product-header h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            margin: 0;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ff6b35;
        }
        
        .product-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .product-benefits,
        .product-ingredients,
        .product-nutrition {
            margin-bottom: 2rem;
        }
        
        .product-benefits h3,
        .product-ingredients h3,
        .product-nutrition h3 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .product-benefits h3 i {
            color: #ffd700;
        }
        
        .product-ingredients h3 i {
            color: #4caf50;
        }
        
        .product-nutrition h3 i {
            color: #ff6b35;
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .benefit-item i {
            color: #4caf50;
            font-size: 0.8rem;
        }
        
        .ingredients-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .ingredient-item {
            background: #f0f8ff;
            color: #333;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
            border: 1px solid #e0e0e0;
        }
        
        .nutrition-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .nutrition-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .nutrition-label {
            font-weight: 500;
            color: #666;
        }
        
        .nutrition-value {
            font-weight: 600;
            color: #ff6b35;
        }
        
        .modal-actions {
            margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
            
            .product-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .benefits-grid,
            .nutrition-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

function closeProductDetail() {
    const modal = document.querySelector('.product-detail-modal');
    if (modal) {
        modal.remove();
    }
}
// ===== VIDEO CONTROL FUNCTIONALITY =====
let videoMuted = true;

function toggleVideoSound() {
    const video = document.querySelector('.about-video');
    const soundIcon = document.getElementById('soundIcon');
    
    if (video) {
        videoMuted = !videoMuted;
        video.muted = videoMuted;
        
        // Update icon
        if (videoMuted) {
            soundIcon.className = 'fas fa-volume-mute';
            showNotification('Video dimute', 'info');
        } else {
            soundIcon.className = 'fas fa-volume-up';
            showNotification('Suara video dinyalakan', 'info');
        }
    }
}

// Video error handling and fallback
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.about-video');
    
    if (video) {
        // Handle video load success
        video.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
            this.style.opacity = '1';
        });
        
        // Handle video load error
        video.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback');
            this.style.display = 'none';
            
            // Show fallback content
            const fallback = this.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
            
            showNotification('Video tidak dapat dimuat', 'error');
        });
        
        // Ensure video plays on mobile
        video.addEventListener('canplay', function() {
            this.play().catch(function(error) {
                console.log('Autoplay prevented:', error);
                // Fallback for browsers that don't allow autoplay
            });
        });
        
        // Handle video end (though it should loop)
        video.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });
        
        // Intersection Observer for performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(console.log);
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });
        
        videoObserver.observe(video);
    }
});

// Video quality optimization based on connection
function optimizeVideoQuality() {
    const video = document.querySelector('.about-video');
    
    if (video && 'connection' in navigator) {
        const connection = navigator.connection;
        
        // Adjust video quality based on connection speed
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            video.style.filter = 'blur(1px)'; // Reduce quality for slow connections
        }
    }
}

// Call optimization on load
document.addEventListener('DOMContentLoaded', optimizeVideoQuality);