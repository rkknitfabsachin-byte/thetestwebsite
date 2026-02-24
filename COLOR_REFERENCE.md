# 🎨 Quick Color Reference Guide

## Primary Color Palette

### Background Colors
```css
--bg-primary: #0f172a;      /* Deep Slate - Main background */
--bg-secondary: #1e293b;    /* Slate - Cards, containers */
--bg-tertiary: #334155;     /* Light Slate - Inputs, sliders */
```

### Text Colors
```css
--text-primary: #f1f5f9;    /* Off-white - Main text */
--text-secondary: #cbd5e1;  /* Light Slate - Secondary text */
--text-muted: #94a3b8;      /* Muted Slate - Labels, hints */
```

### Accent Colors
```css
--accent-primary: #0ea5e9;  /* Electric Cyan - Primary actions */
--accent-light: #22d3ee;    /* Light Cyan - Highlights */
--accent-gradient: linear-gradient(135deg, #0ea5e9, #22d3ee);
```

---

## Category Color System

### Sportswear/Active Wear
```css
Color: #0ea5e9 (Electric Cyan)
Usage: Tags, accents, hover states
Shadow: 0 0 15px rgba(14, 165, 233, 0.4)
```

### Uniform Fabrics
```css
Color: #fbbf24 (Gold/Amber)
Usage: Tags, accents
Shadow: 0 0 15px rgba(251, 191, 36, 0.4)
Text: #111827 (Dark - for contrast)
```

### Winter Wear Fabrics
```css
Color: #a855f7 (Purple)
Usage: Tags, accents
Shadow: 0 0 15px rgba(168, 85, 247, 0.4)
```

### Casual Wear Fabrics
```css
Color: #22c55e (Green)
Usage: Tags, accents
Shadow: 0 0 15px rgba(34, 197, 94, 0.4)
```

---

## Typography Scale

### Font Families
```css
--font-heading: 'Outfit', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Space Grotesk', monospace;
```

### Font Sizes
```css
--text-xs: 11px;    /* Tags, labels */
--text-sm: 13px;    /* Descriptions */
--text-base: 16px;  /* Body text */
--text-lg: 18px;    /* Hero paragraph */
--text-xl: 24px;    /* Product names */
--text-2xl: 36px;   /* Mobile headings */
--text-3xl: 48px;   /* Statistics */
--text-4xl: 52px;   /* Hero heading */
```

---

## Spacing System

### Padding/Margin
```css
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 60px;
```

### Border Radius
```css
--radius-sm: 6px;    /* Tags */
--radius-md: 12px;   /* Buttons */
--radius-lg: 20px;   /* Cards */
--radius-full: 50%;  /* Circular buttons */
```

---

## Shadow System

### Elevation Levels
```css
/* Level 1 - Subtle */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

/* Level 2 - Medium */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

/* Level 3 - High */
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

/* Glow Effect */
box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
```

---

## Animation Timing

### Durations
```css
--duration-fast: 0.2s;    /* Micro-interactions */
--duration-base: 0.3s;    /* Hover states */
--duration-slow: 0.5s;    /* Image transforms */
--duration-slower: 0.8s;  /* Page entrance */
```

### Easing Functions
```css
--ease-standard: ease;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

---

## Glassmorphism Effect

### Standard Glass
```css
background: rgba(30, 41, 59, 0.5);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Navigation Glass
```css
background: rgba(15, 23, 42, 0.85);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(255, 255, 255, 0.08);
```

---

## Button Styles

### Primary Button
```css
background: linear-gradient(135deg, #0ea5e9, #22d3ee);
color: #fff;
padding: 16px 32px;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);

/* Hover */
transform: translateY(-3px);
box-shadow: 0 15px 40px rgba(14, 165, 233, 0.5);
```

### Secondary Button (Ghost)
```css
background: transparent;
color: #22d3ee;
border: 2px solid #22d3ee;
padding: 16px 32px;
border-radius: 12px;

/* Hover */
background: rgba(34, 211, 238, 0.1);
transform: translateY(-3px);
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 600px)  { /* Small phones */ }
@media (max-width: 768px)  { /* Tablets */ }
@media (max-width: 900px)  { /* Small laptops */ }
@media (max-width: 1200px) { /* Desktops */ }
```

---

## Quick Copy-Paste Snippets

### Add Category Color to New Product
```html
<a href="PRODUCT.html" class="product-card" data-category="Sportswear">
  <span class="tag">Sportswear/Active Wear</span>
  <!-- ... -->
</a>
```

### Add Statistic to Hero
```html
<div class="stat-item">
  <div class="stat-number number" data-target="100">0</div>
  <div class="stat-label">Your Label</div>
</div>
```

### Add Scroll Progress to New Page
```html
<!-- After </nav> -->
<div class="scroll-progress" id="scrollProgress"></div>
```

---

## Browser Support

✅ Chrome/Edge (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)
✅ Mobile Safari (iOS 12+)
✅ Chrome Mobile (Android 8+)

⚠️ IE11 - Not supported (uses modern CSS features)

---

**Last Updated**: February 4, 2026
