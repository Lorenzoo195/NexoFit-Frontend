document.addEventListener('DOMContentLoaded', function() {
    initBikeReservationSystem();
    initSmoothScroll();
    initNavbarAnimation();
});

function initBikeReservationSystem() {
    const bikeSlots = document.querySelectorAll('.bike-slot');
    const confirmBtn = document.getElementById('confirmBtn');
    let selectedBike = null;
    
    if (!bikeSlots.length) return;
    
    bikeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('occupied')) {
                showNotification('Esta bici ya está ocupada', 'error');
                return;
            }
            
            bikeSlots.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            selectedBike = this.dataset.bike;
            
            updateReservationUI(selectedBike);
            
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (selectedBike) {
                confirmReservation(selectedBike);
            }
        });
    }
}

function updateReservationUI(bikeNumber) {
    const confirmBtn = document.getElementById('confirmBtn');
    const selectedBikeInfo = document.getElementById('selectedBikeInfo');
    
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<i class="bi bi-check-circle me-2"></i>CONFIRMAR BICI #${bikeNumber}`;
    }
    
    if (selectedBikeInfo) {
        selectedBikeInfo.innerHTML = `
            <i class="bi bi-bicycle me-2"></i>
            Has seleccionado la <strong>Bici #${bikeNumber}</strong>
        `;
        selectedBikeInfo.style.color = '#FF8A00';
    }
}

function confirmReservation(bikeNumber) {
    showNotification(`¡Reserva confirmada! Bici #${bikeNumber}`, 'success');
    
    setTimeout(() => {
        const slot = document.querySelector(`[data-bike="${bikeNumber}"]`);
        if (slot) {
            slot.classList.remove('available', 'active');
            slot.classList.add('occupied');
            
            const confirmBtn = document.getElementById('confirmBtn');
            const selectedBikeInfo = document.getElementById('selectedBikeInfo');
            
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>CONFIRMAR RESERVA';
            }
            
            if (selectedBikeInfo) {
                selectedBikeInfo.innerHTML = `
                    <i class="bi bi-check-circle-fill me-2"></i>
                    ¡Reserva confirmada! Nos vemos en la clase 🎉
                `;
                selectedBikeInfo.style.color = '#28a745';
            }
        }
    }, 500);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#FF8A00'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        max-width: 300px;
    `;

    
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
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
}

function initNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

if (document.querySelector('.class-card')) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.class-card').forEach(card => {
        observer.observe(card);
    });
}

if (document.querySelector('.hero-section')) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}