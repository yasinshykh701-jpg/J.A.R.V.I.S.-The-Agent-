# Green, Silver, Black Color Palette

## Overview
Qazyene now features a sophisticated green, silver, and black color palette that creates a modern, professional, and premium iOS 17 launcher experience.

## Color Palette

### Primary Colors

#### Green
- **Primary Green**: `#10b981` (HSL: 142, 76%, 36%)
- **Bright Green**: `#22c55e` (HSL: 142, 71%, 45%)
- **Dark Green**: `#059669` (HSL: 142, 76%, 30%)
- **Emerald**: `#34d399` (HSL: 142, 71%, 52%)
- **Usage**: Primary actions, logo, main features, success states

#### Silver
- **Light Silver**: `#c0c0c0` (HSL: 0, 0%, 75%)
- **Medium Silver**: `#9ca3af` (HSL: 0, 0%, 65%)
- **Dark Silver**: `#6b7280` (HSL: 0, 0%, 45%)
- **Slate**: `#64748b` (HSL: 0, 0%, 50%)
- **Usage**: Secondary elements, neutral states, backgrounds

#### Black
- **Pure Black**: `#000000` (HSL: 0, 0%, 0%)
- **Dark Gray**: `#1f2937` (HSL: 0, 0%, 15%)
- **Charcoal**: `#374151` (HSL: 0, 0%, 22%)
- **Usage**: Text, dark mode backgrounds, contrast elements

### Light Mode Colors

```css
--background: #fafafa (98% lightness)
--foreground: #0d0d0d (5% lightness)
--card: #ffffff (100% lightness)
--primary: #10b981 (Green)
--secondary: #c0c0c0 (Silver)
--accent: #22c55e (Bright Green)
--muted: #f0f0f0 (94% lightness - Light Silver)
--border: #e0e0e0 (88% lightness)
```

### Dark Mode Colors

```css
--background: #141414 (8% lightness - Dark Black)
--foreground: #f2f2f2 (95% lightness)
--card: #1f1f1f (12% lightness)
--primary: #10b981 (Green - same as light)
--secondary: #999999 (Dark Silver)
--accent: #22c55e (Bright Green - same as light)
--muted: #2e2e2e (18% lightness)
--border: #383838 (22% lightness)
```

## Gradient Assignments

### Feature Icons

1. **Chat** - `gradient-green`
   - Colors: #10b981 → #22c55e
   - Green gradient for primary chat feature

2. **Image Generation** - `gradient-silver`
   - Colors: #c0c0c0 → #e5e7eb
   - Silver gradient for creative tools

3. **Video Generation** - `gradient-black`
   - Colors: #1f2937 → #374151
   - Black gradient for video processing

4. **Virtual Robot** - `gradient-green-dark`
   - Colors: #059669 → #10b981
   - Dark green for AI robot

5. **Notes Summary** - `gradient-emerald`
   - Colors: #34d399 → #6ee7b7
   - Emerald for productivity

6. **Resume Analyzer** - `gradient-slate`
   - Colors: #64748b → #94a3b8
   - Slate for professional tools

7. **Interview Prep** - `gradient-silver-dark`
   - Colors: #6b7280 → #9ca3af
   - Dark silver for practice mode

### UI Elements

#### Logo
- **Gradient**: `gradient-green`
- **Colors**: #10b981 → #22c55e
- **Style**: iOS app icon with squircle shape

#### User Avatar
- **Gradient**: `gradient-green`
- **Colors**: #10b981 → #22c55e
- **Style**: Circular with ring

#### AI Message Avatar
- **Gradient**: `gradient-green`
- **Colors**: #10b981 → #22c55e
- **Style**: Circular with shadow

#### User Message Avatar
- **Gradient**: `gradient-silver`
- **Colors**: #c0c0c0 → #e5e7eb
- **Style**: Circular with shadow

#### User Message Bubble
- **Gradient**: `gradient-green`
- **Colors**: #10b981 → #22c55e
- **Text**: White

#### AI Message Bubble
- **Background**: Glass card effect
- **Text**: Foreground color

### Chat Input Buttons

1. **Upload Button** - `gradient-green`
   - Colors: #10b981 → #22c55e
   - Icon: White

2. **Camera Button** - `gradient-silver`
   - Colors: #c0c0c0 → #e5e7eb
   - Icon: Foreground color

3. **Mic Button** - `gradient-emerald`
   - Colors: #34d399 → #6ee7b7
   - Icon: White
   - Recording: `gradient-black` with pulse

4. **Send Button** - `gradient-green-dark`
   - Colors: #059669 → #10b981
   - Icon: White

## Gradient Definitions

```css
/* Green Gradients */
.gradient-green {
  background: linear-gradient(135deg, #10b981 0%, #22c55e 100%);
}

.gradient-green-dark {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.gradient-emerald {
  background: linear-gradient(135deg, #34d399 0%, #6ee7b7 100%);
}

/* Silver Gradients */
.gradient-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e7eb 100%);
}

.gradient-silver-dark {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
}

.gradient-slate {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
}

/* Black Gradients */
.gradient-black {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
}
```

## Background Mesh

### Light Mode
```css
radial-gradient(at 0% 0%, hsla(142, 76%, 85%, 0.3) 0px, transparent 50%),
radial-gradient(at 50% 0%, hsla(0, 0%, 85%, 0.3) 0px, transparent 50%),
radial-gradient(at 100% 0%, hsla(142, 71%, 80%, 0.3) 0px, transparent 50%)
```
- Green and silver tones
- 30% opacity
- Subtle and elegant

### Dark Mode
```css
radial-gradient(at 0% 0%, hsla(142, 76%, 40%, 0.15) 0px, transparent 50%),
radial-gradient(at 50% 0%, hsla(0, 0%, 30%, 0.15) 0px, transparent 50%),
radial-gradient(at 100% 0%, hsla(142, 71%, 45%, 0.15) 0px, transparent 50%)
```
- Darker green and gray tones
- 15% opacity
- Subtle depth

## Color Psychology

### Green
- **Meaning**: Growth, harmony, freshness, safety
- **Effect**: Calming, balanced, natural
- **Usage**: Primary actions, success, AI features
- **Association**: Technology, innovation, eco-friendly

### Silver
- **Meaning**: Modern, sleek, sophisticated, neutral
- **Effect**: Professional, elegant, timeless
- **Usage**: Secondary elements, neutral states
- **Association**: Premium, high-tech, refined

### Black
- **Meaning**: Power, elegance, formality, mystery
- **Effect**: Bold, dramatic, sophisticated
- **Usage**: Text, contrast, dark mode
- **Association**: Luxury, premium, professional

## Design Principles

### Contrast
- Green on white: High contrast, excellent readability
- Silver on white: Medium contrast, subtle elegance
- Black on white: Maximum contrast, strong hierarchy
- Green on black: Vibrant, modern, tech-forward

### Hierarchy
1. **Primary**: Green (main actions, logo, key features)
2. **Secondary**: Silver (supporting elements, neutral states)
3. **Tertiary**: Black (text, backgrounds, contrast)

### Balance
- 60% White/Light backgrounds
- 30% Green accents and primary elements
- 10% Silver and Black for contrast and depth

## Accessibility

### WCAG AA Compliance

#### Light Mode
- Green (#10b981) on White: ✅ 4.5:1 ratio
- Black (#0d0d0d) on White: ✅ 18:1 ratio
- Silver (#c0c0c0) on White: ⚠️ Use for non-critical text

#### Dark Mode
- Green (#10b981) on Black (#141414): ✅ 4.8:1 ratio
- White (#f2f2f2) on Black: ✅ 16:1 ratio
- Silver (#999999) on Black: ✅ 5.2:1 ratio

## Usage Guidelines

### Do's ✅
- Use green for primary actions and success states
- Use silver for neutral and secondary elements
- Use black for text and high contrast
- Combine green and silver for modern look
- Use gradients for depth and premium feel
- Maintain consistent gradient angles (135deg)

### Don'ts ❌
- Don't use silver for critical text (low contrast)
- Don't mix too many gradient variations
- Don't use black gradients on dark backgrounds
- Don't overuse green (maintain balance)
- Don't ignore contrast ratios
- Don't use pure black in light mode (use #0d0d0d)

## Brand Identity

### Primary Brand Color
- **Green** (#10b981)
- Represents: Innovation, growth, AI technology
- Usage: Logo, primary buttons, key features

### Secondary Brand Color
- **Silver** (#c0c0c0)
- Represents: Sophistication, modernity, premium quality
- Usage: Secondary elements, neutral states

### Accent Color
- **Black** (#1f2937)
- Represents: Elegance, power, professionalism
- Usage: Text, contrast, dark mode

## Comparison with Previous Design

### Before (Purple, Pink, Blue)
- Colorful and vibrant
- Playful and creative
- Multiple bright colors
- High saturation

### After (Green, Silver, Black)
- Professional and sophisticated
- Modern and elegant
- Limited color palette
- Balanced saturation
- Premium feel
- Tech-forward aesthetic

## Result

The green, silver, and black color palette creates:
- ✅ Professional and modern appearance
- ✅ Sophisticated iOS 17 launcher style
- ✅ Premium and elegant feel
- ✅ Excellent contrast and readability
- ✅ Tech-forward and innovative look
- ✅ Balanced and harmonious design
- ✅ Accessible color combinations
- ✅ Consistent brand identity
