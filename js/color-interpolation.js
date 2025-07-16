/* ========================================
   SkyClock - 色補間システム
   ======================================== */

class ColorInterpolation {
    constructor() {
        this.timeTransitions = {
            morning: { start: 5, end: 8 },
            day: { start: 8, end: 18 },
            sunset: { start: 18, end: 19 },
            night: { start: 19, end: 5 } 
        };
        
        this.init();
    }
    
    init() {
        
        this.updateColors();
        
        
        this.updateInterval = setInterval(() => {
            this.updateColors();
        }, 10000); 
        
    }
    
    
    forceUpdate() {
        this.updateColors();
    }
    
    
    updateColors() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;
        
        
        const { currentPeriod, nextPeriod, progress } = this.getCurrentPeriod(totalMinutes);
        
        
        const originalProgress = progress;
        const curvedProgress = this.applyProgressCurve(progress, currentPeriod);
        
        
        this.interpolateSkyColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateMountainColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateCloudColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateFogColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateAtmosphereColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateParticleColors(currentPeriod, nextPeriod, curvedProgress);
    }
    
    
    getCurrentPeriod(totalMinutes) {
        const periods = Object.keys(this.timeTransitions);
        let currentPeriod = null;
        let nextPeriod = null;
        let progress = 0;
        
        
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        
        for (let i = 0; i < periods.length; i++) {
            const period = periods[i];
            const transition = this.timeTransitions[period];
            
            let startMinutes, endMinutes;
            
            if (period === 'night') {
                
                startMinutes = transition.start * 60;
                endMinutes = transition.end * 60;
                
                
                if (totalMinutes >= startMinutes || totalMinutes < endMinutes) {
                    currentPeriod = period;
                    nextPeriod = periods[(i + 1) % periods.length];
                    
                    
                    if (totalMinutes >= startMinutes) {
                        
                        progress = (totalMinutes - startMinutes) / ((24 * 60 - startMinutes) + endMinutes);
                    } else {
                        
                        progress = (totalMinutes + (24 * 60 - startMinutes)) / ((24 * 60 - startMinutes) + endMinutes);
                    }
                    
                    break;
                }
            } else {
                
                startMinutes = transition.start * 60;
                endMinutes = transition.end * 60;
                
                if (totalMinutes >= startMinutes && totalMinutes < endMinutes) {
                    currentPeriod = period;
                    nextPeriod = periods[(i + 1) % periods.length];
                    progress = (totalMinutes - startMinutes) / (endMinutes - startMinutes);
                    
                    break;
                }
            }
        }
        
        
        if (!currentPeriod) {
            currentPeriod = 'day';
            nextPeriod = 'sunset';
            progress = 0;
        }
        
        return { currentPeriod, nextPeriod, progress };
    }
    
    
    applyProgressCurve(progress, currentPeriod) {
        switch (currentPeriod) {
            case 'day':
                
                if (progress < 0.7) {
                    return progress * 0.2; 
                } else {
                    return 0.14 + (progress - 0.7) * 2.87; 
                }
            case 'morning':
                
                return Math.pow(progress, 0.8);
            case 'sunset':
                
                return Math.pow(progress, 1.5);
            case 'night':
                
                return progress;
            default:
                return progress;
        }
    }
    
    
    interpolateSkyColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const skyStart = this.interpolateColor(currentColors.skyStart, nextColors.skyStart, progress);
        const skyEnd = this.interpolateColor(currentColors.skyEnd, nextColors.skyEnd, progress);
        
        
        document.documentElement.style.setProperty('--current-sky-start', skyStart);
        document.documentElement.style.setProperty('--current-sky-end', skyEnd);
        
        
        const skyElement = document.getElementById('sky');
        if (skyElement) {
            skyElement.style.background = `linear-gradient(to bottom, ${skyStart}, ${skyEnd})`;
        }
    }
    
    
    interpolateMountainColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const mountainColors = ['foreground', 'midground', 'far', 'background'];
        
        mountainColors.forEach(layer => {
            const currentColor = currentColors[`mountain${layer.charAt(0).toUpperCase() + layer.slice(1)}`];
            const nextColor = nextColors[`mountain${layer.charAt(0).toUpperCase() + layer.slice(1)}`];
            const interpolatedColor = this.interpolateColor(currentColor, nextColor, progress);
            
            document.documentElement.style.setProperty(`--current-mountain-${layer}`, interpolatedColor);
        });
    }
    
    
    interpolateCloudColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const cloudColor = this.interpolateColor(currentColors.cloud, nextColors.cloud, progress);
        document.documentElement.style.setProperty('--current-cloud-color', cloudColor);
    }
    
    
    interpolateFogColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const fogColor = this.interpolateColor(currentColors.fog, nextColors.fog, progress);
        document.documentElement.style.setProperty('--current-fog-light', fogColor);
    }
    
    
    interpolateAtmosphereColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const atmosphereColor = this.interpolateColor(currentColors.atmosphere, nextColors.atmosphere, progress);
        const atmosphereHeavy = this.interpolateColor(currentColors.atmosphereHeavy, nextColors.atmosphereHeavy, progress);
        
        document.documentElement.style.setProperty('--current-atmosphere-color', atmosphereColor);
        document.documentElement.style.setProperty('--current-atmosphere-heavy', atmosphereHeavy);
    }
    
    
    interpolateParticleColors(currentPeriod, nextPeriod, progress) {
        const currentColors = this.getPeriodColors(currentPeriod);
        const nextColors = this.getPeriodColors(nextPeriod);
        
        const particleColor = this.interpolateColor(currentColors.particle, nextColors.particle, progress);
        document.documentElement.style.setProperty('--current-particle-color', particleColor);
    }
    
    
    getPeriodColors(period) {
        const colors = {
            morning: {
                skyStart: '#4a3a2a',
                skyEnd: '#8a6a4a',
                mountainForeground: '#5d4a3a', 
                mountainMidground: '#7d6a5a', 
                mountainFar: '#9d8a7a', 
                mountainBackground: '#bd9a8a', 
                cloud: '#d4a574',
                fog: 'rgba(160, 82, 45, 0.4)',
                atmosphere: 'rgba(139, 69, 19, 0.3)',
                atmosphereHeavy: 'rgba(139, 69, 19, 0.5)',
                particle: 'rgba(255, 218, 185, 0.5)'
            },
            day: {
                skyStart: '#307070',
                skyEnd: '#80B8B0',
                mountainForeground: '#4d6a4a', 
                mountainMidground: '#5d7a5a', 
                mountainFar: '#6d8a6a', 
                mountainBackground: '#7d9a7a', 
                cloud: '#E8E4D9',
                fog: 'rgba(128, 184, 176, 0.4)',
                atmosphere: 'rgba(232, 228, 217, 0.3)',
                atmosphereHeavy: 'rgba(232, 228, 217, 0.5)',
                particle: 'rgba(232, 228, 217, 0.8)'
            },
            sunset: {
                skyStart: '#4a3a2a',
                skyEnd: '#8a6a4a',
                mountainForeground: '#5d4a3a', 
                mountainMidground: '#7d6a5a', 
                mountainFar: '#9d8a7a', 
                mountainBackground: '#bd9a8a', 
                cloud: '#d4a574',
                fog: 'rgba(160, 82, 45, 0.5)',
                atmosphere: 'rgba(139, 69, 19, 0.4)',
                atmosphereHeavy: 'rgba(139, 69, 19, 0.6)',
                particle: 'rgba(255, 218, 185, 0.6)'
            },
            night: {
                skyStart: '#374752',
                skyEnd: '#4A6A7A',
                mountainForeground: '#4A5A6A', 
                mountainMidground: '#5A6A7A', 
                mountainFar: '#6A7A8A', 
                mountainBackground: '#7A8A9A', 
                cloud: '#4A6A7A',
                fog: 'rgba(200, 200, 255, 0.08)',
                atmosphere: 'rgba(200, 200, 255, 0.08)',
                atmosphereHeavy: 'rgba(180, 180, 240, 0.15)',
                particle: 'rgba(255, 255, 255, 0.8)'
            }
        };
        
        return colors[period] || colors.morning;
    }
    
    
    interpolateColor(color1, color2, progress) {
        
        if (color1.includes('rgba') || color2.includes('rgba')) {
            return this.interpolateRGBA(color1, color2, progress);
        }
        
        
        return this.interpolateHEX(color1, color2, progress);
    }
    
    
    interpolateHEX(hex1, hex2, progress) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    
    interpolateRGBA(rgba1, rgba2, progress) {
        const rgba1Values = this.parseRGBA(rgba1);
        const rgba2Values = this.parseRGBA(rgba2);
        
        const r = Math.round(rgba1Values.r + (rgba2Values.r - rgba1Values.r) * progress);
        const g = Math.round(rgba1Values.g + (rgba2Values.g - rgba1Values.g) * progress);
        const b = Math.round(rgba1Values.b + (rgba2Values.b - rgba1Values.b) * progress);
        const a = rgba1Values.a + (rgba2Values.a - rgba1Values.a) * progress;
        
        return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
    }
    
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    
    parseRGBA(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parseFloat(match[4]) : 1
            };
        }
        return { r: 0, g: 0, b: 0, a: 1 };
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.colorInterpolation = new ColorInterpolation();
});


class TestColorInterpolation extends ColorInterpolation {
    constructor() {
        super();
        this.simulationTime = null;
        
        
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => {
            if (this.simulationTime) {
                this.updateColors();
            }
        }, 1000); 
    }
    
    
    setSimulationTime(date) {
        this.simulationTime = date;
        this.updateColors();
    }
    
    
    updateColors() {
        const now = this.simulationTime || new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;
        
        
        const { currentPeriod, nextPeriod, progress } = this.getCurrentPeriod(totalMinutes);
        
        
        const originalProgress = progress;
        const curvedProgress = this.applyProgressCurve(progress, currentPeriod);
        
        
        this.interpolateSkyColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateMountainColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateCloudColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateFogColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateAtmosphereColors(currentPeriod, nextPeriod, curvedProgress);
        this.interpolateParticleColors(currentPeriod, nextPeriod, curvedProgress);
    }
} 