// Confetti class
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#4B9CD3', '#13294B', '#fff', '#7BAFD4']; // Carolina colors
    }

    createParticles(x, y) {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.7) * 15,
                size: Math.random() * 8 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }
    }

    animate() {
        if (this.particles.length === 0) {
            this.canvas.remove();
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.01;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            
            // Draw star shape
            this.ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const angle = (j * 4 * Math.PI) / 5;
                const x = Math.cos(angle) * p.size;
                const y = Math.sin(angle) * p.size;
                j === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();

            if (p.opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    start(x, y) {
        this.createParticles(x, y);
        this.animate();
    }
}

let targetX = 50;
let targetY = 50;
let currentX = 50;
let currentY = 50;
let mouseInfluence = false;

// Random movement
function updateRandomPosition() {
    if (!mouseInfluence) {
        // Combine multiple sine waves for more organic motion
        const time = Date.now() / 1000;
        const fastWave = Math.sin(time * 2) * 10;
        const slowWave = Math.sin(time * 0.5) * 15;
        const mediumWave = Math.cos(time * 1.3) * 12;
        
        targetX = 50 + fastWave + (slowWave * 0.5);
        targetY = 50 + mediumWave + (slowWave * 0.7);
    }
    
    // Smooth interpolation
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;
    
    document.documentElement.style.setProperty('--mouse-x', currentX);
    document.documentElement.style.setProperty('--mouse-y', currentY);
    
    requestAnimationFrame(updateRandomPosition);
}

// Mouse movement influence
document.addEventListener('mousemove', (e) => {
    mouseInfluence = true;
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
    
    // Reset to random movement after 1 second of no mouse movement
    clearTimeout(window.mouseTimeout);
    window.mouseTimeout = setTimeout(() => {
        mouseInfluence = false;
    }, 1000);
});

// Theme switching with confetti
document.getElementById('goheels')?.addEventListener('click', function(e) {
    const body = document.documentElement;
    const isCarolina = body.getAttribute('data-theme') === 'carolina';
    
    if (!isCarolina) {
        // Create canvas for confetti
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        // Start confetti animation
        const confetti = new Confetti(canvas);
        confetti.start(e.clientX, e.clientY);
    }
    
    // Toggle theme
    if (isCarolina) {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'carolina');
    }
});

// Start the animation
updateRandomPosition();
