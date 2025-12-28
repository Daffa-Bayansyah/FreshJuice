// ===== CHECKOUT PAGE FUNCTIONALITY =====

let checkoutData = {
    cart: [],
    subtotal: 0,
    shippingCost: 15000,
    discount: 0,
    finalTotal: 0,
    freeShipping: false
};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    setupCheckoutEventListeners();
    calculateTotals();
    setMinimumDate();
});

function loadCartData() {
    const cart = JSON.parse(localStorage.getItem('freshJuiceCart')) || [];
    
    if (cart.length === 0) {
        // Redirect to menu if cart is empty
        showNotification('Keranjang Anda kosong. Silakan pilih menu terlebih dahulu.', 'info');
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
        return;
    }
    
    checkoutData.cart = cart;
    displayCartItems();
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (checkoutData.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = checkoutData.cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.productImage}" alt="${item.productName}">
            </div>
            <div class="item-details">
                <h4>${item.productName}</h4>
                <div class="item-specs">
                    <span class="spec">${getSizeLabel(item.size)}</span>
                    <span class="spec">${getIceLabel(item.ice)}</span>
                    <span class="spec">${getSugarLabel(item.sugar)}</span>
                </div>
                ${item.addons.length > 0 ? `
                    <div class="item-addons">
                        <strong>Tambahan:</strong> ${item.addons.map(addon => getAddonLabel(addon.name)).join(', ')}
                    </div>
                ` : ''}
                ${item.notes ? `
                    <div class="item-notes">
                        <strong>Catatan:</strong> ${item.notes}
                    </div>
                ` : ''}
            </div>
            <div class="item-quantity">
                <span class="qty">${item.quantity}x</span>
            </div>
            <div class="item-price">
                <span class="price">${formatPrice(item.totalPrice)}</span>
            </div>
            <div class="item-actions">
                <button class="remove-btn" onclick="removeCartItem(${item.id})" title="Hapus item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function calculateTotals() {
    // Calculate subtotal
    checkoutData.subtotal = checkoutData.cart.reduce((total, item) => total + item.totalPrice, 0);
    
    // Check for free shipping (3 items or more, or total >= 75000)
    const totalItems = checkoutData.cart.reduce((total, item) => total + item.quantity, 0);
    checkoutData.freeShipping = totalItems >= 3 || checkoutData.subtotal >= 75000;
    
    // Calculate discount and final total
    if (checkoutData.freeShipping) {
        checkoutData.discount = checkoutData.shippingCost;
        checkoutData.finalTotal = checkoutData.subtotal;
    } else {
        checkoutData.discount = 0;
        checkoutData.finalTotal = checkoutData.subtotal + checkoutData.shippingCost;
    }
    
    // Update UI
    updateTotalsDisplay();
}

function updateTotalsDisplay() {
    document.getElementById('subtotal').textContent = formatPrice(checkoutData.subtotal);
    document.getElementById('shippingCost').textContent = formatPrice(checkoutData.shippingCost);
    document.getElementById('finalTotal').textContent = formatPrice(checkoutData.finalTotal);
    
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discount');
    
    if (checkoutData.freeShipping) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = '-' + formatPrice(checkoutData.discount);
    } else {
        discountRow.style.display = 'none';
    }
    
    // Update delivery note
    const deliveryNote = document.querySelector('.delivery-note');
    if (checkoutData.freeShipping) {
        deliveryNote.innerHTML = `
            <i class="fas fa-check-circle" style="color: #4caf50;"></i>
            <div>
                <strong>Selamat! Anda mendapat gratis ongkir!</strong>
                <p>Pesanan Anda memenuhi syarat untuk pengiriman gratis</p>
            </div>
        `;
        deliveryNote.style.background = '#e8f5e8';
        deliveryNote.style.borderColor = '#4caf50';
    }
}

function setupCheckoutEventListeners() {
    // Delivery time selection
    document.querySelectorAll('input[name="deliveryTime"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const scheduledTime = document.getElementById('scheduledTime');
            if (this.value === 'scheduled') {
                scheduledTime.style.display = 'block';
            } else {
                scheduledTime.style.display = 'none';
            }
        });
    });
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processCheckout();
    });
    
    // Phone number formatting
    document.getElementById('phone').addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.startsWith('0')) {
            value = '62' + value.substring(1);
        } else if (!value.startsWith('62')) {
            value = '62' + value;
        }
        this.value = value;
    });
}

function setMinimumDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('deliveryDate');
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
}

function removeCartItem(itemId) {
    checkoutData.cart = checkoutData.cart.filter(item => item.id !== itemId);
    localStorage.setItem('freshJuiceCart', JSON.stringify(checkoutData.cart));
    
    if (checkoutData.cart.length === 0) {
        showNotification('Keranjang kosong. Mengarahkan ke menu...', 'info');
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
        return;
    }
    
    displayCartItems();
    calculateTotals();
    updateCartDisplay();
    showNotification('Item berhasil dihapus', 'success');
}

function processCheckout() {
    // Validate form
    const formData = new FormData(document.getElementById('checkoutForm'));
    const data = Object.fromEntries(formData);
    
    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'district'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    // Phone validation
    if (!data.phone.match(/^62\d{9,12}$/)) {
        showNotification('Format nomor WhatsApp tidak valid', 'error');
        return;
    }
    
    // Terms validation
    if (!data.agreeTerms) {
        showNotification('Mohon setujui syarat dan ketentuan', 'error');
        return;
    }
    
    // Scheduled delivery validation
    if (data.deliveryTime === 'scheduled') {
        if (!data.deliveryDate || !data.deliveryHour) {
            showNotification('Mohon pilih tanggal dan jam pengiriman', 'error');
            return;
        }
    }
    
    // Process order
    const orderData = {
        orderId: generateOrderId(),
        customer: {
            name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            email: data.email || ''
        },
        delivery: {
            address: data.address,
            district: data.district,
            postalCode: data.postalCode || '',
            landmark: data.landmark || '',
            time: data.deliveryTime,
            scheduledDate: data.deliveryDate || '',
            scheduledHour: data.deliveryHour || ''
        },
        items: checkoutData.cart,
        pricing: {
            subtotal: checkoutData.subtotal,
            shippingCost: checkoutData.shippingCost,
            discount: checkoutData.discount,
            finalTotal: checkoutData.finalTotal,
            freeShipping: checkoutData.freeShipping
        },
        paymentMethod: data.paymentMethod,
        notes: data.orderNotes || '',
        timestamp: new Date().toISOString()
    };
    
    // Send order based on payment method
    if (data.paymentMethod === 'whatsapp') {
        sendWhatsAppOrder(orderData);
    } else {
        sendEmailOrder(orderData);
    }
}

function generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FJ${timestamp.slice(-6)}${random}`;
}

function sendWhatsAppOrder(orderData) {
    const phoneNumber = '6281373117657'; // Daffa Bayansyah WhatsApp number
    
    let message = `🍊 *PESANAN FRESHJUICE* 🍊\n\n`;
    message += `📋 *Order ID:* ${orderData.orderId}\n`;
    message += `👤 *Nama:* ${orderData.customer.name}\n`;
    message += `📱 *Phone:* ${orderData.customer.phone}\n`;
    if (orderData.customer.email) {
        message += `📧 *Email:* ${orderData.customer.email}\n`;
    }
    message += `\n📍 *ALAMAT PENGIRIMAN:*\n`;
    message += `${orderData.delivery.address}\n`;
    message += `${orderData.delivery.district}`;
    if (orderData.delivery.postalCode) {
        message += ` ${orderData.delivery.postalCode}`;
    }
    message += `\n`;
    if (orderData.delivery.landmark) {
        message += `Patokan: ${orderData.delivery.landmark}\n`;
    }
    
    message += `\n🕐 *WAKTU PENGIRIMAN:*\n`;
    if (orderData.delivery.time === 'asap') {
        message += `Secepatnya (30-60 menit)\n`;
    } else {
        message += `${orderData.delivery.scheduledDate} jam ${orderData.delivery.scheduledHour}\n`;
    }
    
    message += `\n🛒 *PESANAN:*\n`;
    orderData.items.forEach((item, index) => {
        message += `${index + 1}. *${item.productName}*\n`;
        message += `   • ${getSizeLabel(item.size)}\n`;
        message += `   • ${getIceLabel(item.ice)}\n`;
        message += `   • ${getSugarLabel(item.sugar)}\n`;
        if (item.addons.length > 0) {
            message += `   • Tambahan: ${item.addons.map(addon => getAddonLabel(addon.name)).join(', ')}\n`;
        }
        if (item.notes) {
            message += `   • Catatan: ${item.notes}\n`;
        }
        message += `   • Jumlah: ${item.quantity}x\n`;
        message += `   • Harga: ${formatPrice(item.totalPrice)}\n\n`;
    });
    
    message += `💰 *RINCIAN HARGA:*\n`;
    message += `Subtotal: ${formatPrice(orderData.pricing.subtotal)}\n`;
    message += `Ongkir: ${formatPrice(orderData.pricing.shippingCost)}\n`;
    if (orderData.pricing.freeShipping) {
        message += `Diskon Gratis Ongkir: -${formatPrice(orderData.pricing.discount)}\n`;
    }
    message += `*TOTAL: ${formatPrice(orderData.pricing.finalTotal)}*\n\n`;
    
    if (orderData.notes) {
        message += `📝 *Catatan:* ${orderData.notes}\n\n`;
    }
    
    message += `🙏 Terima kasih telah memesan di FreshJuice!\n`;
    message += `Kami akan segera memproses pesanan Anda.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Save order to localStorage
    saveOrder(orderData);
    
    // Show success message
    showOrderSuccess(orderData, 'whatsapp');
    
    // Open WhatsApp after delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 2000);
}

function sendEmailOrder(orderData) {
    const subject = `Pesanan FreshJuice - ${orderData.orderId}`;
    
    let body = `Pesanan Baru FreshJuice\n\n`;
    body += `Order ID: ${orderData.orderId}\n`;
    body += `Nama: ${orderData.customer.name}\n`;
    body += `Phone: ${orderData.customer.phone}\n`;
    if (orderData.customer.email) {
        body += `Email: ${orderData.customer.email}\n`;
    }
    body += `\nAlamat Pengiriman:\n${orderData.delivery.address}\n${orderData.delivery.district}`;
    if (orderData.delivery.postalCode) {
        body += ` ${orderData.delivery.postalCode}`;
    }
    body += `\n`;
    if (orderData.delivery.landmark) {
        body += `Patokan: ${orderData.delivery.landmark}\n`;
    }
    
    body += `\nWaktu Pengiriman: `;
    if (orderData.delivery.time === 'asap') {
        body += `Secepatnya (30-60 menit)\n`;
    } else {
        body += `${orderData.delivery.scheduledDate} jam ${orderData.delivery.scheduledHour}\n`;
    }
    
    body += `\nPesanan:\n`;
    orderData.items.forEach((item, index) => {
        body += `${index + 1}. ${item.productName}\n`;
        body += `   - ${getSizeLabel(item.size)}\n`;
        body += `   - ${getIceLabel(item.ice)}\n`;
        body += `   - ${getSugarLabel(item.sugar)}\n`;
        if (item.addons.length > 0) {
            body += `   - Tambahan: ${item.addons.map(addon => getAddonLabel(addon.name)).join(', ')}\n`;
        }
        if (item.notes) {
            body += `   - Catatan: ${item.notes}\n`;
        }
        body += `   - Jumlah: ${item.quantity}x\n`;
        body += `   - Harga: ${formatPrice(item.totalPrice)}\n\n`;
    });
    
    body += `Rincian Harga:\n`;
    body += `Subtotal: ${formatPrice(orderData.pricing.subtotal)}\n`;
    body += `Ongkir: ${formatPrice(orderData.pricing.shippingCost)}\n`;
    if (orderData.pricing.freeShipping) {
        body += `Diskon Gratis Ongkir: -${formatPrice(orderData.pricing.discount)}\n`;
    }
    body += `TOTAL: ${formatPrice(orderData.pricing.finalTotal)}\n\n`;
    
    if (orderData.notes) {
        body += `Catatan: ${orderData.notes}\n\n`;
    }
    
    body += `Terima kasih!`;
    
    const emailUrl = `mailto:daffa@freshjuice.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Save order to localStorage
    saveOrder(orderData);
    
    // Show success message
    showOrderSuccess(orderData, 'email');
    
    // Open email client after delay
    setTimeout(() => {
        window.location.href = emailUrl;
    }, 2000);
}

function saveOrder(orderData) {
    // Save to order history
    let orderHistory = JSON.parse(localStorage.getItem('freshJuiceOrders')) || [];
    orderHistory.unshift(orderData);
    
    // Keep only last 10 orders
    if (orderHistory.length > 10) {
        orderHistory = orderHistory.slice(0, 10);
    }
    
    localStorage.setItem('freshJuiceOrders', JSON.stringify(orderHistory));
    
    // Clear cart
    localStorage.removeItem('freshJuiceCart');
}

function showOrderSuccess(orderData, method) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Pesanan Berhasil Dibuat!</h2>
            <div class="order-info">
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Total:</strong> ${formatPrice(orderData.pricing.finalTotal)}</p>
                <p><strong>Metode:</strong> ${method === 'whatsapp' ? 'WhatsApp' : 'Email'}</p>
            </div>
            <p class="success-message">
                ${method === 'whatsapp' 
                    ? 'Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.' 
                    : 'Anda akan diarahkan ke email client untuk mengirim pesanan.'
                }
            </p>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeSuccessModal()">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal-content {
            background: white;
            border-radius: 20px;
            padding: 3rem 2rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: slideInUp 0.3s ease;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #4caf50;
            margin-bottom: 1rem;
            animation: bounce 0.6s ease;
        }
        
        .success-modal h2 {
            color: #333;
            margin-bottom: 1.5rem;
        }
        
        .order-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }
        
        .order-info p {
            margin: 0.5rem 0;
            color: #666;
        }
        
        .success-message {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
    
    // Redirect to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

function goBack() {
    window.history.back();
}

// Helper functions
function getSizeLabel(size) {
    const labels = {
        'small': 'Small (250ml)',
        'medium': 'Medium (400ml)',
        'large': 'Large (600ml)'
    };
    return labels[size] || size;
}

function getIceLabel(ice) {
    const labels = {
        'no-ice': 'Tanpa Es',
        'less-ice': 'Es Sedikit',
        'normal-ice': 'Es Normal',
        'extra-ice': 'Es Banyak'
    };
    return labels[ice] || ice;
}

function getSugarLabel(sugar) {
    const labels = {
        'no-sugar': 'Tanpa Gula',
        'less-sugar': 'Gula Sedikit',
        'normal-sugar': 'Gula Normal',
        'extra-sugar': 'Gula Banyak'
    };
    return labels[sugar] || sugar;
}

function getAddonLabel(addon) {
    const labels = {
        'chia-seeds': 'Chia Seeds',
        'honey': 'Madu Asli',
        'ginger': 'Jahe Segar',
        'lemon': 'Perasan Lemon'
    };
    return labels[addon] || addon;
}

function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = checkoutData.cart.length;
        cartCount.style.display = checkoutData.cart.length > 0 ? 'block' : 'none';
    }
}