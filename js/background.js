/* ========================================
   SkyClock - 背景演出モジュール
   ======================================== */

class BackgroundManager {
    constructor() {
        this.mountainsContainer = document.querySelector('.mountains');
        this.cloudsContainer = document.querySelector('.clouds');
        this.fogContainer = document.querySelector('.fog');
        this.particlesContainer = document.querySelector('.particles');
        
        this.currentTimeOfDay = 'day';
        this.mouseX = 0;
        this.mouseY = 0;
        this.isVisible = true;
        this.animationId = null;
        
        
        this.mountainSeed = Math.floor(Math.random() * 1000000);
        this.lastUpdateTime = Date.now();
        
        
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.aspectRatio = this.viewportWidth / this.viewportHeight;
        
        this.init();
    }
    
    
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    
    generateMountainParameters(layer) {
        const timeSeed = Math.floor(Date.now() / 60000); 
        const layerSeed = this.mountainSeed + timeSeed;
        
        const params = {
            foreground: {
                baseHeight: 600 - (70 + this.seededRandom(layerSeed * 1) * 20), // 70-90px
                centralDip: 60 + this.seededRandom(layerSeed * 2) * 40, // 60-100px
                sidePeaks: 40 + this.seededRandom(layerSeed * 3) * 40, // 40-80px
                primaryFreq: 2.5 + this.seededRandom(layerSeed * 4) * 1.5, // 2.5-4.0
                secondaryFreq: 1.5 + this.seededRandom(layerSeed * 5) * 1.0, // 1.5-2.5
                tertiaryFreq: 0.8 + this.seededRandom(layerSeed * 6) * 0.4, // 0.8-1.2
                primaryAmp: 40 + this.seededRandom(layerSeed * 7) * 20, // 40-60px
                secondaryAmp: 20 + this.seededRandom(layerSeed * 8) * 15, // 20-35px
                tertiaryAmp: 10 + this.seededRandom(layerSeed * 9) * 10, // 10-20px
                randomAmp: 10 + this.seededRandom(layerSeed * 10) * 10 // 10-20px
            },
            midground: {
                baseHeight: 600 - (130 + this.seededRandom(layerSeed * 11) * 20), // 130-150px
                centralDip: 45 + this.seededRandom(layerSeed * 12) * 30, // 45-75px
                sidePeaks: 35 + this.seededRandom(layerSeed * 13) * 20, // 35-55px
                primaryFreq: 2.0 + this.seededRandom(layerSeed * 14) * 1.0, // 2.0-3.0
                secondaryFreq: 1.2 + this.seededRandom(layerSeed * 15) * 0.6, // 1.2-1.8
                primaryAmp: 30 + this.seededRandom(layerSeed * 16) * 20, // 30-50px
                secondaryAmp: 15 + this.seededRandom(layerSeed * 17) * 10, // 15-25px
                randomAmp: 8 + this.seededRandom(layerSeed * 18) * 4 // 8-12px
            },
            far: {
                baseHeight: 600 - (170 + this.seededRandom(layerSeed * 19) * 20), // 170-190px
                centralDip: 30 + this.seededRandom(layerSeed * 20) * 20, // 30-50px
                sidePeaks: 25 + this.seededRandom(layerSeed * 21) * 10, // 25-35px
                primaryFreq: 1.8 + this.seededRandom(layerSeed * 22) * 0.4, // 1.8-2.2
                secondaryFreq: 1.0 + this.seededRandom(layerSeed * 23) * 0.2, // 1.0-1.2
                primaryAmp: 20 + this.seededRandom(layerSeed * 24) * 10, // 20-30px
                secondaryAmp: 10 + this.seededRandom(layerSeed * 25) * 5, // 10-15px
                randomAmp: 6 + this.seededRandom(layerSeed * 26) * 4 // 6-10px
            },
            background: {
                baseHeight: 600 - (210 + this.seededRandom(layerSeed * 27) * 20), // 210-230px
                centralDip: 20 + this.seededRandom(layerSeed * 28) * 10, // 20-30px
                sidePeaks: 15 + this.seededRandom(layerSeed * 29) * 10, // 15-25px
                primaryFreq: 1.4 + this.seededRandom(layerSeed * 30) * 0.2, // 1.4-1.6
                primaryAmp: 12 + this.seededRandom(layerSeed * 31) * 6, // 12-18px
                randomAmp: 3 + this.seededRandom(layerSeed * 32) * 4 // 3-7px
            }
        };
        
        return params[layer] || params.background;
    }
    
    generateMountainPath(layer, segments) {
        const points = [];
        const params = this.generateMountainParameters(layer);
        
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * 1000;
            let y;
            
            
            const centerDipFactor = Math.sin((i / segments) * Math.PI); 
            const sidePeakFactor = Math.pow(Math.sin((i / segments) * Math.PI), 0.3); 
            
            if (layer === 'foreground') {
                
                const centralDip = centerDipFactor * params.centralDip;
                const sidePeaks = (1 - sidePeakFactor) * params.sidePeaks;
                
                
                const primaryVariation = Math.sin((i / segments) * Math.PI * params.primaryFreq) * params.primaryAmp;
                const secondaryVariation = Math.sin((i / segments) * Math.PI * params.secondaryFreq) * params.secondaryAmp;
                const tertiaryVariation = Math.sin((i / segments) * Math.PI * params.tertiaryFreq) * params.tertiaryAmp;
                const randomVariation = (this.seededRandom(this.mountainSeed + i * 100) - 0.5) * params.randomAmp;
                
                y = params.baseHeight + centralDip - sidePeaks + primaryVariation + secondaryVariation + tertiaryVariation + randomVariation;
                
            } else if (layer === 'midground') {
                
                const centralDip = centerDipFactor * params.centralDip;
                const sidePeaks = (1 - sidePeakFactor) * params.sidePeaks;
                
                const primaryVariation = Math.sin((i / segments) * Math.PI * params.primaryFreq) * params.primaryAmp;
                const secondaryVariation = Math.sin((i / segments) * Math.PI * params.secondaryFreq) * params.secondaryAmp;
                const randomVariation = (this.seededRandom(this.mountainSeed + i * 200) - 0.5) * params.randomAmp;
                
                y = params.baseHeight + centralDip - sidePeaks + primaryVariation + secondaryVariation + randomVariation;
                
            } else if (layer === 'far') {
                
                const centralDip = centerDipFactor * params.centralDip;
                const sidePeaks = (1 - sidePeakFactor) * params.sidePeaks;
                
                const primaryVariation = Math.sin((i / segments) * Math.PI * params.primaryFreq) * params.primaryAmp;
                const secondaryVariation = Math.sin((i / segments) * Math.PI * params.secondaryFreq) * params.secondaryAmp;
                const randomVariation = (this.seededRandom(this.mountainSeed + i * 300) - 0.5) * params.randomAmp;
                
                y = params.baseHeight + centralDip - sidePeaks + primaryVariation + secondaryVariation + randomVariation;
                
            } else {
                
                const centralDip = centerDipFactor * params.centralDip;
                const sidePeaks = (1 - sidePeakFactor) * params.sidePeaks;
                
                const primaryVariation = Math.sin((i / segments) * Math.PI * params.primaryFreq) * params.primaryAmp;
                const randomVariation = (this.seededRandom(this.mountainSeed + i * 400) - 0.5) * params.randomAmp;
                
                y = params.baseHeight + centralDip - sidePeaks + primaryVariation + randomVariation;
            }
            
            points.push({x, y});
        }
        
        
        let pathData = `M 0,600 L 0,${points[0].y}`;
        
        
        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            
            const controlX1 = current.x + (next.x - current.x) * 0.3;
            const controlY1 = current.y;
            const controlX2 = current.x + (next.x - current.x) * 0.7;
            const controlY2 = next.y;
            
            pathData += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
        }
        
        
        pathData += ` L 1000,${points[points.length - 1].y} L 1000,600 Z`;
        
        return pathData;
    }
    
    getMountainColor(layer) {
        
        const colors = {
            foreground: 'var(--current-mountain-foreground)',
            midground: 'var(--current-mountain-midground)',
            far: 'var(--current-mountain-far)',
            background: 'var(--current-mountain-background)'
        };
        return colors[layer] || '#2d1810';
    }
    
    getMountainOpacity(layer) {
        const opacities = {
            foreground: 1.0,
            midground: 1.0,
            far: 1.0,
            background: 1.0
        };
        return opacities[layer] || 1.0;
    }
    
    createTrees() {
        
        const treeLayers = ['foreground', 'midground'];
        
        treeLayers.forEach(layer => {
            const layerElement = document.querySelector(`.mountain-layer.${layer}`);
            if (!layerElement) return;
            
            
            const treeCount = layer === 'foreground' ? 12 : 8;
            
            for (let i = 0; i < treeCount; i++) {
                const tree = this.createTree(layer);
                layerElement.appendChild(tree);
            }
        });
    }
    
    createTree(layer) {
        const tree = document.createElement('div');
        tree.className = `tree ${layer}-tree`;
        
        
        tree.style.left = Math.random() * 100 + '%';
        tree.style.bottom = Math.random() * 20 + '%';
        
        
        let size;
        if (this.aspectRatio < 0.6) {
            
            size = layer === 'foreground' ? 
                Math.random() * 10 + 15 : // 15-25px
                Math.random() * 8 + 12;   // 12-20px
        } else if (this.aspectRatio < 1.0) {
            
            size = layer === 'foreground' ? 
                Math.random() * 15 + 20 : // 20-35px
                Math.random() * 10 + 15;  // 15-25px
        } else if (this.aspectRatio > 2.0) {
            
            size = layer === 'foreground' ? 
                Math.random() * 25 + 35 : // 35-60px
                Math.random() * 20 + 25;  // 25-45px
        } else {
            
            size = layer === 'foreground' ? 
                Math.random() * 20 + 30 : // 30-50px
                Math.random() * 15 + 20;  // 20-35px
        }
        
        tree.style.width = size + 'px';
        tree.style.height = size * 1.5 + 'px';
        
        
        tree.style.willChange = 'transform';
        tree.style.transform = 'translateZ(0)';
        
        return tree;
    }
    
    createFogLayers() {
        
        
    }
    
    createClouds() {
        if (!this.cloudsContainer) return;
        
        
        let cloudCount;
        if (this.aspectRatio < 0.6) {
            
            cloudCount = 3;
        } else if (this.aspectRatio < 1.0) {
            
            cloudCount = 4;
        } else if (this.aspectRatio > 2.0) {
            
            cloudCount = 10;
        } else if (this.aspectRatio > 1.5) {
            
            cloudCount = 8;
        } else {
            
            cloudCount = 6;
        }
        
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = this.createCloud();
            this.cloudsContainer.appendChild(cloud);
        }
    }
    
    createCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.left = Math.random() * 100 + '%';
        cloud.style.top = Math.random() * 50 + '%';
        cloud.style.animationDuration = (Math.random() * 40 + 60) + 's'; 
        cloud.style.animationDelay = Math.random() * 20 + 's';
        
        
        cloud.style.willChange = 'transform';
        cloud.style.transform = 'translateZ(0)';
        cloud.style.backfaceVisibility = 'hidden';
        
        
        cloud.setAttribute('data-depth', 0.05);
        
        return cloud;
    }
    
    createFog() {
        if (!this.fogContainer) return;
        
        const fog = document.createElement('div');
        fog.className = 'fog-layer';
        fog.style.background = 'linear-gradient(to bottom, transparent, var(--current-fog-color), transparent)';
        fog.style.height = '100%';
        fog.style.width = '100%';
        fog.style.animation = 'fogMove 40s infinite linear';
        
        
        fog.setAttribute('data-depth', 0.03);
        
        this.fogContainer.appendChild(fog);
    }
    
    createParticles() {
        if (!this.particlesContainer) return;
        
        
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        this.particlesContainer.appendChild(canvas);
        
        
        this.initParticleSystem(canvas, 80); 
    }
    
    initParticleSystem(canvas, particleCount) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5, 
                vy: Math.random() * 0.3 + 0.1, 
                size: Math.random() * 1.2 + 0.3, 
                opacity: Math.random() * 0.3 + 0.1, 
                wind: Math.random() * 0.2 - 0.1, 
                sway: Math.random() * 0.1 - 0.05 
            });
        }
        
        
        const animate = () => {
            if (!this.isVisible) {
                
                this.animationId = setTimeout(() => requestAnimationFrame(animate), 1000 / 15);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                
                particle.x += particle.vx + particle.wind;
                particle.y += particle.vy;
                
                
                particle.x += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * particle.sway;
                
                
                if (particle.x < -10) particle.x = canvas.width + 10;
                if (particle.x > canvas.width + 10) particle.x = -10;
                if (particle.y > canvas.height + 10) {
                    particle.y = -10;
                    particle.x = Math.random() * canvas.width;
                }
                
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `var(--current-particle-color)`;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
                
                
                if (Math.random() > 0.95) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fill();
                }
            });
            
            ctx.globalAlpha = 1; 
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    setupParallax() {
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX / window.innerWidth;
            this.mouseY = e.clientY / window.innerHeight;
            this.updateParallax();
        });
        
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouseX = touch.clientX / window.innerWidth;
            this.mouseY = touch.clientY / window.innerHeight;
            this.updateParallax();
        });
    }
    
    updateParallax() {
        
        const layers = document.querySelectorAll('.mountain-layer, .cloud, .fog-layer, .atmosphere-layer, .particles, #sun, #moon');
        layers.forEach((layer) => {
            let depth = parseFloat(layer.getAttribute('data-depth'));
            
            
            if (!depth) {
                if (layer.classList.contains('mountain-layer')) {
                    if (layer.classList.contains('foreground')) depth = 0.15;
                    else if (layer.classList.contains('midground')) depth = 0.08;
                    else if (layer.classList.contains('far')) depth = 0.04;
                    else depth = 0.02; // background
                } else if (layer.id === 'sun') {
                    depth = 0.12;
                } else if (layer.id === 'moon') {
                    depth = 0.12;
                } else if (layer.classList.contains('cloud')) {
                    depth = 0.05;
                } else if (layer.classList.contains('fog-layer')) {
                    depth = 0.03;
                } else if (layer.classList.contains('atmosphere-layer')) {
                    depth = 0.02;
                } else if (layer.classList.contains('particles')) {
                    depth = 0.1;
                } else {
                    depth = 0.02;
                }
            }
            
            const translateX = (this.mouseX - 0.5) * depth * 100;
            const translateY = (this.mouseY - 0.5) * depth * 50;
            
            layer.style.transform = `translate(${translateX}px, ${translateY}px) translateZ(0)`;
        });
    }
    
    setupVisibilityHandling() {
        
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
    }
    
    updateTimeOfDay() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 8) {
            this.currentTimeOfDay = 'morning';
        } else if (hour >= 8 && hour < 17) {
            this.currentTimeOfDay = 'day';
        } else if (hour >= 17 && hour < 19) {
            this.currentTimeOfDay = 'sunset';
        } else {
            this.currentTimeOfDay = 'night';
        }
        
        
        if (window.colorInterpolation) {
            
            return;
        }
        
        this.updateBackgroundEffects();
    }
    
    updateBackgroundEffects() {
        
        if (window.colorInterpolation) {
            
            return;
        }
        
        
        document.body.className = `time-${this.currentTimeOfDay}`;
        
        
        this.updateMountainColors();
        
        
        this.updateFogColors();
        
        
        this.updateCloudColors();
    }
    
    updateMountainColors() {
        const mountainLayers = document.querySelectorAll('.mountain-layer path');
        mountainLayers.forEach((path, index) => {
            const layer = index === 0 ? 'background' : index === 1 ? 'far' : index === 2 ? 'midground' : 'foreground';
            path.setAttribute('fill', this.getMountainColor(layer));
        });
    }
    
    updateFogColors() {
        const fogLayers = document.querySelectorAll('.fog-layer');
        fogLayers.forEach((fog) => {
            fog.style.background = 'linear-gradient(to bottom, transparent 0%, var(--current-fog-light) 50%, transparent 100%)';
        });
    }
    
    updateCloudColors() {
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud) => {
            cloud.style.background = 'var(--current-cloud-color)';
        });
        
        const cloudsBefore = document.querySelectorAll('.cloud::before');
        const cloudsAfter = document.querySelectorAll('.cloud::after');
        
    }
    
    
    handleResize() {
        const canvas = document.querySelector('.particles canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        
        const mountainSvgs = document.querySelectorAll('.mountain-layer svg');
        mountainSvgs.forEach(svg => {
            if (window.innerHeight > window.innerWidth) {
                
                svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            } else {
                
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            }
        });
    }

    init() {
        this.createMountains();
        this.createClouds();
        this.createFog();
        this.createParticles();
        this.setupParallax();
        this.updateTimeOfDay();
        this.setupVisibilityHandling();
        
        
        setInterval(() => {
            this.regenerateMountains();
        }, 300000); 
        
        
        this.setupResizeHandling();
    }
    
    
    setupResizeHandling() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 300);
        });
    }
    
    createMountains() {
        if (!this.mountainsContainer) return;
        
        
        
        const backgroundMountains = this.createMountainLayer('background', 1, 3);
        
        const farMountains = this.createMountainLayer('far', 2, 4);
        
        const midgroundMountains = this.createMountainLayer('midground', 3, 6);
        
        const foregroundMountains = this.createMountainLayer('foreground', 4, 8);
        
        this.mountainsContainer.appendChild(backgroundMountains);
        this.mountainsContainer.appendChild(farMountains);
        this.mountainsContainer.appendChild(midgroundMountains);
        this.mountainsContainer.appendChild(foregroundMountains);
        
        
        this.createTrees();
        
        
        this.createFogLayers();
    }
    
    
    regenerateMountains() {
        if (!this.mountainsContainer) return;
        
        
        this.mountainSeed = Math.floor(Math.random() * 1000000);
        
        
        const existingLayers = this.mountainsContainer.querySelectorAll('.mountain-layer');
        existingLayers.forEach(layer => layer.remove());
        
        
        this.createMountains();
        
    }
    
    createMountainLayer(layer, depth, segments) {
        const layerElement = document.createElement('div');
        layerElement.className = `mountain-layer ${layer}`;
        layerElement.style.zIndex = depth;
        
        
        const parallaxDepth = layer === 'foreground' ? 0.15 : 
                             layer === 'midground' ? 0.08 : 
                             layer === 'far' ? 0.04 : 0.02;
        layerElement.setAttribute('data-depth', parallaxDepth);
        
        
        layerElement.style.willChange = 'transform';
        layerElement.style.transform = 'translateZ(0)';
        
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1000 600');
        
        
        if (window.innerHeight > window.innerWidth) {
            
            svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        } else {
            
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
        
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.overflow = 'visible'; 
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.generateMountainPath(layer, segments));
        path.setAttribute('fill', this.getMountainColor(layer));
        path.setAttribute('opacity', this.getMountainOpacity(layer));
        
        svg.appendChild(path);
        layerElement.appendChild(svg);
        
        return layerElement;
    }
    
    
    updateViewportInfo() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.aspectRatio = this.viewportWidth / this.viewportHeight;
    }
    
    
    getScreenType() {
        if (this.aspectRatio < 0.6) return 'スマートフォン縦向き';
        if (this.aspectRatio < 1.0) return 'タブレット縦向き';
        if (this.aspectRatio > 2.0) return 'ウルトラワイド';
        if (this.aspectRatio > 1.5) return 'デスクトップ横長';
        return '標準';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const backgroundManager = new BackgroundManager();
    
    
    window.addEventListener('resize', () => {
        backgroundManager.handleResize();
    });
}); 