/**
 * ParkEase - Background Paths Animation
 * Vanilla JS animated background with flowing paths
 */

class BackgroundPaths {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.paths = [];
        this.animationFrameId = null;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.createSVG();
        this.generatePaths(1);
        this.generatePaths(-1);
        this.animate();
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'background-paths-svg');
        svg.setAttribute('viewBox', '0 0 696 316');
        svg.setAttribute('fill', 'none');
        svg.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.4;
        `;
        
        this.svg = svg;
        this.container.appendChild(svg);
    }

    generatePaths(position) {
        for (let i = 0; i < 36; i++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
            
            path.setAttribute('d', d);
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', (0.5 + i * 0.03).toString());
            path.setAttribute('stroke-opacity', (0.1 + i * 0.03).toString());
            path.setAttribute('fill', 'none');
            path.style.color = getComputedStyle(document.body).getPropertyValue('--color-slate-800') || '#1E293B';
            
            const pathData = {
                element: path,
                speed: 0.0005 + Math.random() * 0.0003,
                baseOpacity: 0.1 + i * 0.03,
                phase: Math.random() * Math.PI * 2
            };
            
            this.paths.push(pathData);
            this.svg.appendChild(path);
        }
    }

    animate() {
        const time = Date.now() * 0.001;

        this.paths.forEach((pathData) => {
            const opacityVariation = Math.sin(time * 0.5 + pathData.phase) * 0.3;
            const currentOpacity = Math.max(0.1, Math.min(1, pathData.baseOpacity + opacityVariation));
            pathData.element.setAttribute('stroke-opacity', currentOpacity.toString());

            const dashLength = 1000;
            const dashOffset = ((time * 20 * pathData.speed) % dashLength);
            pathData.element.setAttribute('stroke-dasharray', `${dashLength}`);
            pathData.element.setAttribute('stroke-dashoffset', dashOffset.toString());
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.svg && this.svg.parentNode) {
            this.svg.parentNode.removeChild(this.svg);
        }
        this.paths = [];
    }
}

// Text Animation Utility
class TextAnimator {
    static animateText(element, text, delay = 0) {
        element.innerHTML = '';
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'animated-word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '1rem';
            
            word.split('').forEach((letter, letterIndex) => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                letterSpan.className = 'animated-letter';
                letterSpan.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(100px);
                    animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: ${delay + wordIndex * 100 + letterIndex * 30}ms;
                `;
                wordSpan.appendChild(letterSpan);
            });
            
            element.appendChild(wordSpan);
        });
    }

    static fadeIn(element, duration = 2000) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    }
}

// Enhanced Button with Hover Effects
class AnimatedButton {
    constructor(buttonElement) {
        this.button = buttonElement;
        this.init();
    }

    init() {
        if (!this.button) return;
        this.button.addEventListener('click', (e) => this.createRipple(e));
        this.addShineEffect();
    }

    createRipple(event) {
        const ripple = document.createElement('span');
        const rect = this.button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.button.style.position = 'relative';
        this.button.style.overflow = 'hidden';
        this.button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    addShineEffect() {
        const shine = document.createElement('div');
        shine.className = 'button-shine';
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
            pointer-events: none;
        `;

        this.button.style.position = 'relative';
        this.button.style.overflow = 'hidden';
        this.button.appendChild(shine);

        this.button.addEventListener('mouseenter', () => {
            shine.style.left = '100%';
        });

        this.button.addEventListener('mouseleave', () => {
            shine.style.left = '-100%';
        });
    }
}

// Export to global scope
window.BackgroundPaths = BackgroundPaths;
window.TextAnimator = TextAnimator;
window.AnimatedButton = AnimatedButton;
