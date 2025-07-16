/* ========================================
   SkyClock - 時計機能
   ======================================== */

class SkyClock {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.skyElement = document.getElementById('sky');
        this.sunElement = document.getElementById('sun');
        this.moonElement = document.getElementById('moon');
        this.starsElement = document.getElementById('stars');
        
        this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        this.init();
    }
    
    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    updateClock() {
        const now = new Date();
        this.updateTimeDisplay(now);
        this.updateDateDisplay(now);
        this.updateTimeOfDay(now);
    }
    
    updateTimeDisplay(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        this.timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateDateDisplay(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekday = this.weekdays[date.getDay()];
        this.dateElement.textContent = `${year}/${month}/${day} (${weekday})`;
    }
    
    updateTimeOfDay(date) {
        const hour = date.getHours();
        
        // 色補間システムが有効な場合は、空の背景色の更新をスキップ
        if (window.colorInterpolation) {
            // 色補間システムが空の背景色を管理するため、天体の表示/非表示のみ更新
            this.updateCelestialBodies(hour);
            this.updateCelestialPosition();
        } else {
            // フォールバック用の従来の処理
            this.updateSkyBackground(hour);
            this.updateCelestialBodies(hour);
            this.updateCelestialPosition();
        }
    }
    
    updateSkyBackground(hour) {
        let background;
        
        if (hour >= 5 && hour < 8) {
            // 朝焼け（5:00〜7:59）
            background = 'linear-gradient(to bottom, var(--morning-sky-start), var(--morning-sky-end))';
            this.showSun();
            this.hideMoon();
            this.hideStars();
        } else if (hour >= 8 && hour < 17) {
            // 青空（8:00〜16:59）
            background = 'linear-gradient(to bottom, var(--day-sky-start), var(--day-sky-end))';
            this.showSun();
            this.hideMoon();
            this.hideStars();
        } else if (hour >= 17 && hour < 19) {
            // 夕焼け（17:00〜18:59）- 太陽と月が重複表示
            background = 'linear-gradient(to bottom, var(--sunset-sky-start), var(--sunset-sky-end))';
            this.showSun();
            this.showMoon(); // 夕方は月も表示
            this.hideStars();
        } else {
            // 夜空（19:00〜翌4:59）
            background = 'linear-gradient(to bottom, var(--night-sky-start), var(--night-sky-end))';
            this.hideSun();
            this.showMoon();
            this.showStars();
        }
        
        this.skyElement.style.background = background;
    }
    
    updateCelestialBodies(hour) {
        // 天体の表示/非表示制御（夕方の重複表示対応）
        if (hour >= 5 && hour < 17) {
            // 朝〜夕方：太陽のみ表示
            this.showSun();
            this.hideMoon();
            this.hideStars();
        } else if (hour >= 17 && hour < 19) {
            // 夕方（17:00-19:00）：太陽と月が重複表示
            this.showSun();
            this.showMoon();
            this.hideStars();
        } else {
            // 夜（19:00-5:00）：月と星のみ表示
            this.hideSun();
            this.showMoon();
            this.showStars();
        }
    }
    
    updateCelestialPosition() {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        const t = hour + (minute / 60); // 時刻座標系（0〜24h）
        
        // --- 太陽の移動ロジック ---
        if (t >= 6 && t < 19) {
            this.showSun();
            
            // X座標 = (t – 6) / 12
            const sunX = (t - 6) / 12; // 0 → 1.08（左端 → 右端を少し超える）
            
            const sunY = 0.15 + (Math.sin(sunX * Math.PI) * 0.2); // 0.15〜0.35の範囲（空の上部）
            
            // 画面座標に変換（Yは0.75〜0.95の範囲で山の向こうを表現）
            const displayY = sunY;
            
            this.sunElement.style.left = `${sunX * 100}%`;
            this.sunElement.style.top = `${displayY * 100}%`;
            
            // 時間帯に応じた太陽の色調整
            if (t >= 6 && t < 8) {
                // 朝：より温かみのある色
                this.sunElement.style.filter = 'brightness(1.1) saturate(1.2)';
            } else if (t >= 8 && t < 17) {
                // 昼：明るい色
                this.sunElement.style.filter = 'brightness(1.0) saturate(1.0)';
            } else {
                // 夕方：温かみのある色（徐々に暗くなる）
                const sunsetProgress = (t - 17) / 2; // 17:00-19:00の進行度
                const brightness = 1.05 - (sunsetProgress * 0.3); // 1.05 → 0.75
                const saturation = 1.15 - (sunsetProgress * 0.3); // 1.15 → 0.85
                this.sunElement.style.filter = `brightness(${brightness}) saturate(${saturation})`;
            }
            
            console.log(`太陽: t=${t.toFixed(2)}, 位置=(${(sunX*100).toFixed(1)}%, ${(displayY*100).toFixed(1)}%)`);
        } else {
            // 夜：太陽を非表示
            this.hideSun();
        }
        
        // --- 月の移動ロジック ---
        const night = (t >= 18 || t < 6);
        if (night) {
            this.showMoon();
            
            // 月の軌道計算（18:00-翌6:00の12時間で左→右）
            let moonX;
            if (t >= 18) {
                // 18:00以降：左端から右へ
                moonX = (t - 18) / 12; // 0 → 1（左端 → 右端）
                console.log(`月（18時以降）: t=${t.toFixed(2)}, moonX=${moonX.toFixed(3)}`);
            } else {
                // 0:00-6:00：左端から右へ（18:00からの継続）
                moonX = t / 6; // 0 → 1（左端 → 右端）
                console.log(`月（0-6時）: t=${t.toFixed(2)}, moonX=${moonX.toFixed(3)}`);
            }
            
            // Y座標も同様に山の向こうから出てきて山の向こうに帰る軌道
            const moonY = 0.85 + (Math.sin(moonX * Math.PI) * 0.1); // 0.75〜0.95の範囲（画面下部）
            
            // 画面座標に変換（Yは0.75〜0.95の範囲で山の向こうを表現）
            const displayY = moonY;
            
            this.moonElement.style.left = `${moonX * 100}%`;
            this.moonElement.style.top = `${displayY * 100}%`;
            
            // 月の透明度調整（夕方の重なり時）
            if (t >= 17.5 && t <= 18.5) {
                // 日没前後のクロスフェード
                const fadeProgress = (t - 17.5) / 1; // 0 → 1
                const opacity = 0.8 + (fadeProgress * 0.2); // 0.8 → 1.0
                this.moonElement.style.opacity = opacity;
            } else {
                this.moonElement.style.opacity = '1.0';
            }
            
            // 月の色調整
            if (t >= 18 && t < 20) {
                // 夕方の月：温かみのある色から夜の色へ
                const eveningProgress = (t - 18) / 2; // 18:00-20:00の進行度
                const warmth = 1.0 - (eveningProgress * 0.3); // 1.0 → 0.7
                const saturation = 0.8 + (eveningProgress * 0.2); // 0.8 → 1.0
                this.moonElement.style.filter = `brightness(${warmth}) saturate(${saturation})`;
            } else {
                // 夜の月
                this.moonElement.style.filter = 'brightness(0.7) saturate(1.0)';
            }
            
            console.log(`月の最終位置: t=${t.toFixed(2)}, moonX=${moonX.toFixed(3)}, 位置=(${(moonX*100).toFixed(1)}%, ${(displayY*100).toFixed(1)}%)`);
        } else {
            // 朝〜夕方前：月を非表示
            this.hideMoon();
        }
    }
    
    showSun() {
        this.sunElement.style.display = 'block';
    }
    
    hideSun() {
        this.sunElement.style.display = 'none';
    }
    
    showMoon() {
        this.moonElement.style.display = 'block';
        console.log('月を表示しました');
    }
    
    hideMoon() {
        this.moonElement.style.display = 'none';
        console.log('月を非表示にしました');
    }
    
    showStars() {
        this.starsElement.style.display = 'block';
        this.updateStars();
    }
    
    hideStars() {
        this.starsElement.style.display = 'none';
    }
    
    updateStars() {
        this.starsElement.innerHTML = ''; // 既存の星をクリア
        
        // 50個の星をランダムに配置
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            this.starsElement.appendChild(star);
        }
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new SkyClock();
}); 
