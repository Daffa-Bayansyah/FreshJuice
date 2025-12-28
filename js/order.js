// ===== ORDER PAGE FUNCTIONALITY =====

// Product data with real juice images
const productData = {
    'orange-blast': {
        name: 'Orange Blast',
        description: 'Jeruk segar pilihan dengan vitamin C tinggi, sempurna untuk meningkatkan imunitas tubuh',
        basePrice: 25000,
        image: 'https://i.pinimg.com/1200x/b5/15/19/b5151985c607f0f2c7695b46d5d95181.jpg',
        benefits: ['Organik', 'Vitamin C', 'Fresh']
    },
    'apple-fresh': {
        name: 'Apple Fresh',
        description: 'Apel merah segar yang kaya akan antioksidan dan serat, baik untuk pencernaan',
        basePrice: 22000,
        image: 'https://i.pinimg.com/1200x/cf/09/3a/cf093a1643884dc7923e28275dd7c40c.jpg',
        benefits: ['Organik', 'Antioksidan', 'Fresh']
    },
    'watermelon-fresh': {
        name: 'Watermelon Fresh',
        description: 'Semangka segar yang menyegarkan dan kaya akan air untuk hidrasi optimal',
        basePrice: 24000,
        image: 'https://i.pinimg.com/1200x/d6/75/0c/d6750c32bd6efadf1ad57b3750ce2c80.jpg',
        benefits: ['Hidrasi', 'Vitamin A', 'Fresh']
    },
    'kiwi-delight': {
        name: 'Kiwi Delight',
        description: 'Kiwi segar dengan rasa asam manis yang kaya vitamin C dan serat',
        basePrice: 28000,
        image: 'https://i.pinimg.com/736x/c6/87/b3/c687b3578dffebf7d02fbe13daf195bd.jpg',
        benefits: ['Vitamin C', 'Serat', 'Fresh']
    },
    'tropical-mango': {
        name: 'Tropical Mango',
        description: 'Mangga matang sempurna dengan rasa manis alami yang menyegarkan',
        basePrice: 30000,
        image: 'https://i.pinimg.com/736x/31/ae/26/31ae2626ed28de33253aa96f5763e3b7.jpg',
        benefits: ['Vitamin A', 'Alami', 'Fresh']
    },
    'green-power': {
        name: 'Green Power',
        description: 'Kombinasi sayuran hijau segar: bayam, kale, dan seledri untuk detoksifikasi',
        basePrice: 32000,
        image: 'https://i.pinimg.com/1200x/00/5e/8b/005e8b80b5ea724b15a58b21a8df0570.jpg',
        benefits: ['Detox', 'Energi', 'Fresh']
    },
    'berry-smoothie': {
        name: 'Mix Berry Smoothie',
        description: 'Campuran berbagai berry segar dengan rasa manis asam yang menyegarkan',
        basePrice: 35000,
        image: 'https://i.pinimg.com/1200x/5f/ef/21/5fef21821aee5d4c6cb0b89dcf6c75df.jpg',
        benefits: ['Antioksidan', 'Vitamin C', 'Fresh']
    },
    'strawberry-smoothie': {
        name: 'Strawberry Smoothie',
        description: 'Smoothie strawberry segar dengan tekstur creamy dan rasa manis alami',
        basePrice: 33000,
        image: 'https://i.pinimg.com/736x/17/98/08/17980899f632f84daa91b253a2fe6d52.jpg',
        benefits: ['Antioksidan', 'Vitamin C', 'Fresh']
    },
    'grape-smoothie': {
        name: 'Grape Smoothie',
        description: 'Smoothie anggur dengan rasa manis dan tekstur yang lembut',
        basePrice: 32000,
        image: 'https://tse4.mm.bing.net/th/id/OIP.mPW5n0yOcx6G4oX1WHmn-QHaLG?w=1067&h=1600&rs=1&pid=ImgDetMain&o=7&rm=3',
        benefits: ['Resveratrol', 'Antioksidan', 'Fresh']
    },
    'oreo-smoothie': {
        name: 'Oreo Smoothie',
        description: 'Smoothie oreo dengan rasa coklat yang creamy dan menyegarkan',
        basePrice: 38000,
        image: 'https://i.pinimg.com/736x/0b/79/7a/0b797af45c2fd371c8bf81625a5edfee.jpg',
        benefits: ['Creamy', 'Coklat', 'Fresh']
    },
    'raspberry-smoothie': {
        name: 'Raspberry Smoothie',
        description: 'Smoothie raspberry dengan rasa asam manis yang kaya antioksidan',
        basePrice: 36000,
        image: 'https://i.pinimg.com/1200x/6f/70/29/6f70293ea19b0126db50583a390454a7.jpg',
        benefits: ['Antioksidan', 'Vitamin C', 'Fresh']
    }
};

// Current order state
let currentOrder = {
    product: null,
    size: 'medium',
    ice: 'normal-ice',
    sugar: 'normal-sugar',
    addons: [],
    notes: '',
    quantity: 1,
    basePrice: 0,
    sizePrice: 5000,
    addonPrice: 0,
    totalPrice: 0
};

// Initialize order page
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderPage();
    setupEventListeners();
    updateCartDisplay();
});

function initializeOrderPage() {
    // Get product from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || 'orange-blast';
    
    // Load product data
    loadProduct(productId);
    
    // Set initial values
    updatePriceCalculation();
}

function loadProduct(productId) {
    const product = productData[productId];
    if (!product) return;
    
    currentOrder.product = productId;
    currentOrder.basePrice = product.basePrice;
    
    // Update UI
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDesc').textContent = product.description;
    document.getElementById('basePrice').textContent = formatPrice(product.basePrice);
    document.getElementById('productImg').src = product.image;
    document.getElementById('productImg').alt = product.name;
    
    // Update benefits
    const benefitsContainer = document.querySelector('.product-benefits');
    benefitsContainer.innerHTML = '';
    product.benefits.forEach(benefit => {
        const tag = document.createElement('span');
        tag.className = 'benefit-tag';
        tag.innerHTML = `<i class="fas fa-${getBenefitIcon(benefit)}"></i> ${benefit}`;
        benefitsContainer.appendChild(tag);
    });
}

function getBenefitIcon(benefit) {
    const icons = {
        'Organik': 'leaf',
        'Vitamin C': 'heart',
        'Fresh': 'clock',
        'Antioksidan': 'shield-alt',
        'Detox': 'leaf',
        'Energi': 'dumbbell',
        'Mata Sehat': 'eye',
        'Beta Karoten': 'star',
        'Probiotik': 'bone',
        'Vitamin A': 'sun',
        'Alami': 'leaf',
        'Metabolisme': 'fire',
        'Hidrasi': 'tint',
        'Menyegarkan': 'snowflake',
        'Resveratrol': 'heart'
    };
    return icons[benefit] || 'check';
}

function setupEventListeners() {
    // Size selection
    document.querySelectorAll('input[name="size"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentOrder.size = this.value;
            currentOrder.sizePrice = parseInt(this.dataset.price);
            updatePriceCalculation();
        });
    });
    
    // Ice level
    document.querySelectorAll('input[name="ice"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentOrder.ice = this.value;
        });
    });
    
    // Sugar level
    document.querySelectorAll('input[name="sugar"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentOrder.sugar = this.value;
        });
    });
    
    // Add-ons
    document.querySelectorAll('input[name="addons"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentOrder.addons.push({
                    name: this.value,
                    price: parseInt(this.dataset.price)
                });
            } else {
                currentOrder.addons = currentOrder.addons.filter(addon => addon.name !== this.value);
            }
            updatePriceCalculation();
        });
    });
    
    // Notes
    document.querySelector('textarea[name="notes"]').addEventListener('input', function() {
        currentOrder.notes = this.value;
    });
    
    // Quantity
    document.getElementById('quantity').addEventListener('change', function() {
        currentOrder.quantity = parseInt(this.value);
        updatePriceCalculation();
    });
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = parseInt(quantityInput.value) + delta;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 20) newQuantity = 20;
    
    quantityInput.value = newQuantity;
    currentOrder.quantity = newQuantity;
    updatePriceCalculation();
}

function updatePriceCalculation() {
    // Calculate addon price
    currentOrder.addonPrice = currentOrder.addons.reduce((total, addon) => total + addon.price, 0);
    
    // Calculate total per item
    const pricePerItem = currentOrder.basePrice + currentOrder.sizePrice + currentOrder.addonPrice;
    
    // Calculate total price
    currentOrder.totalPrice = pricePerItem * currentOrder.quantity;
    
    // Update UI
    document.getElementById('basePriceDisplay').textContent = formatPrice(currentOrder.basePrice);
    document.getElementById('sizePriceDisplay').textContent = currentOrder.sizePrice > 0 ? '+' + formatPrice(currentOrder.sizePrice) : 'Rp 0';
    document.getElementById('addonPriceDisplay').textContent = currentOrder.addonPrice > 0 ? '+' + formatPrice(currentOrder.addonPrice) : 'Rp 0';
    document.getElementById('quantityDisplay').textContent = currentOrder.quantity + 'x';
    document.getElementById('totalPrice').textContent = formatPrice(currentOrder.totalPrice);
}

function addToCart() {
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('freshJuiceCart')) || [];
    
    // Create order item
    const orderItem = {
        id: Date.now(),
        product: currentOrder.product,
        productName: productData[currentOrder.product].name,
        productImage: productData[currentOrder.product].image,
        size: currentOrder.size,
        ice: currentOrder.ice,
        sugar: currentOrder.sugar,
        addons: [...currentOrder.addons],
        notes: currentOrder.notes,
        quantity: currentOrder.quantity,
        basePrice: currentOrder.basePrice,
        sizePrice: currentOrder.sizePrice,
        addonPrice: currentOrder.addonPrice,
        totalPrice: currentOrder.totalPrice
    };
    
    // Add to cart
    cart.push(orderItem);
    
    // Save to localStorage
    localStorage.setItem('freshJuiceCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show notification
    showNotification(`${orderItem.productName} berhasil ditambahkan ke keranjang!`, 'success');
    
    // Reset form to default
    resetOrderForm();
}

function orderNow() {
    // Add to cart first
    addToCart();
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

function resetOrderForm() {
    // Reset to default values
    document.querySelector('input[name="size"][value="medium"]').checked = true;
    document.querySelector('input[name="ice"][value="normal-ice"]').checked = true;
    document.querySelector('input[name="sugar"][value="normal-sugar"]').checked = true;
    
    // Uncheck all addons
    document.querySelectorAll('input[name="addons"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear notes
    document.querySelector('textarea[name="notes"]').value = '';
    
    // Reset quantity
    document.getElementById('quantity').value = 1;
    
    // Reset order state
    currentOrder.size = 'medium';
    currentOrder.ice = 'normal-ice';
    currentOrder.sugar = 'normal-sugar';
    currentOrder.addons = [];
    currentOrder.notes = '';
    currentOrder.quantity = 1;
    currentOrder.sizePrice = 5000;
    currentOrder.addonPrice = 0;
    
    // Update price
    updatePriceCalculation();
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('freshJuiceCart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

// Cart functionality for navigation
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }
});

function showCartModal() {
    const cart = JSON.parse(localStorage.getItem('freshJuiceCart')) || [];
    
    if (cart.length === 0) {
        showNotification('Keranjang Anda masih kosong', 'info');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Keranjang Belanja</h3>
                <button class="close-modal" onclick="closeCartModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-modal-body">
                ${cart.map(item => `
                    <div class="cart-item-mini">
                        <img src="${item.productImage}" alt="${item.productName}">
                        <div class="cart-item-info">
                            <h4>${item.productName}</h4>
                            <p>${getSizeLabel(item.size)} • ${item.quantity}x</p>
                            <span class="price">${formatPrice(item.totalPrice)}</span>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-modal-footer">
                <div class="cart-total">
                    Total: ${formatPrice(cart.reduce((total, item) => total + item.totalPrice, 0))}
                </div>
                <div class="cart-actions">
                    <button class="btn btn-secondary" onclick="clearCart()">Kosongkan</button>
                    <button class="btn btn-primary" onclick="goToCheckout()">Checkout</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .cart-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            animation: slideInUp 0.3s ease;
        }
        
        .cart-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .cart-modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #666;
            padding: 5px;
        }
        
        .cart-modal-body {
            max-height: 400px;
            overflow-y: auto;
            padding: 1rem;
        }
        
        .cart-item-mini {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .cart-item-mini img {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            object-fit: cover;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-info h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            color: #333;
        }
        
        .cart-item-info p {
            margin: 0 0 0.5rem 0;
            font-size: 0.9rem;
            color: #666;
        }
        
        .cart-item-info .price {
            font-weight: 600;
            color: #ff6b35;
        }
        
        .remove-item {
            background: #ff4757;
            border: none;
            color: white;
            padding: 8px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .remove-item:hover {
            background: #ff3742;
        }
        
        .cart-modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #eee;
        }
        
        .cart-total {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .cart-actions {
            display: flex;
            gap: 1rem;
        }
        
        .cart-actions .btn {
            flex: 1;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function closeCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('freshJuiceCart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('freshJuiceCart', JSON.stringify(cart));
    
    updateCartDisplay();
    closeCartModal();
    
    if (cart.length > 0) {
        showCartModal();
    }
    
    showNotification('Item berhasil dihapus dari keranjang', 'success');
}

function clearCart() {
    localStorage.removeItem('freshJuiceCart');
    updateCartDisplay();
    closeCartModal();
    showNotification('Keranjang berhasil dikosongkan', 'success');
}

function goToCheckout() {
    closeCartModal();
    window.location.href = 'checkout.html';
}

function getSizeLabel(size) {
    const labels = {
        'small': 'Small (250ml)',
        'medium': 'Medium (400ml)',
        'large': 'Large (600ml)'
    };
    return labels[size] || size;
}