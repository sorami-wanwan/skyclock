# SkyClock

## Overview

SkyClock is a clock for people who work in rooms without windows.
It visually represents the flow of a day, from sunrise to sunset, and then to the starry night sky.

## File Structure

```
soramiclock/
├── index.html    # Main application
├── sky-clock-test.html        # 60-second test version (for development)
├── css/
│   ├── main.css                  # Main styles
│   ├── colors.css                # Color palette
│   └── background.css            # Background effects styles
├── js/
│   ├── clock.js                  # Clock functionality
│   ├── background.js             # Background effects module
│   ├── color-interpolation.js    # Color interpolation system
│   └── ambient-occlusion.js      # Ambient occlusion
└── doc/
    ├── SPECIFICATION.md          # Specifications
    └── task.md                   # Task management
```

## Usage

### Basic Usage

1. Open `index.html` in your browser
2. The background will automatically change according to the current time

### Test Version Usage

1. Open `sky-clock-test.html` in your browser
2. Click "Start Test" button to begin a 60-second simulation
3. Speed adjustment and manual time setting are also available

## Technical Specifications

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Technologies Used
- HTML5
- CSS3 (Custom properties, animations)
- JavaScript (ES6+)
- Canvas API (Particle effects)

## Development Environment

### Requirements
- Local server (recommended)

### Starting a Local Server
```bash
# For Python 3
python -m http.server 8000

# For Node.js
npx http-server

# For PHP
php -S localhost:8000
```

## Customization

### Changing Colors
You can modify the CSS variables in `css/colors.css` to change colors for different time periods.

### Adjusting Background
You can adjust parameters in `js/background.js` to change mountain shapes and cloud movements.

### Clock Display Format
You can edit `js/clock.js` to change the time display format.

