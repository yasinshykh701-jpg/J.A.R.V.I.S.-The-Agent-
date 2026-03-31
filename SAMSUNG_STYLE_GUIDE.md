# Samsung Galaxy Z Fold Visual Style Guide

## Design Philosophy
The Samsung Galaxy Z Fold layout combines modern foldable device aesthetics with premium One UI design language, featuring dark gradients, blue accents, and sophisticated depth effects.

## Color Palette

### Primary Colors
```
Background Dark:    rgba(10, 10, 10, 0.98)
Background Medium:  rgba(20, 20, 20, 0.98)
Background Light:   rgba(30, 30, 30, 0.9)
Card Background:    rgba(40, 40, 40, 0.9)
```

### Accent Colors
```
Primary Blue:       #007aff (iOS Blue)
Blue Hover:         #008cff
Blue Active:        #0064dc
Blue Glow:          rgba(0, 122, 255, 0.1-0.8)
```

### Text Colors
```
Primary Text:       #ffffff (white)
Secondary Text:     rgba(255, 255, 255, 0.8)
Tertiary Text:      rgba(255, 255, 255, 0.6)
Disabled Text:      rgba(255, 255, 255, 0.4)
```

### Border Colors
```
Default Border:     rgba(255, 255, 255, 0.1)
Accent Border:      rgba(0, 122, 255, 0.2)
Active Border:      rgba(0, 122, 255, 0.8)
```

## Typography

### Font Sizes
```
Heading 1:          text-2xl (24px)
Heading 2:          text-lg (18px)
Heading 3:          text-base (16px)
Body:               text-sm (14px)
Caption:            text-xs (12px)
```

### Font Weights
```
Bold:               font-bold (700)
Semibold:           font-semibold (600)
Medium:             font-medium (500)
Regular:            font-normal (400)
```

## Spacing

### Padding
```
Extra Small:        p-2 (8px)
Small:              p-3 (12px)
Medium:             p-4 (16px)
Large:              p-6 (24px)
Extra Large:        p-8 (32px)
```

### Gaps
```
Tight:              gap-2 (8px)
Normal:             gap-4 (16px)
Relaxed:            gap-6 (24px)
Loose:              gap-8 (32px)
```

## Border Radius

### Standard Sizes
```
Small:              rounded-xl (12px)
Medium:             rounded-2xl (16px)
Large:              rounded-3xl (24px)
Samsung Standard:   samsung-rounded (24px)
Samsung Large:      samsung-rounded-lg (32px)
Samsung XL:         samsung-rounded-xl (40px)
```

## Shadows

### Standard Shadows
```
Small:
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3)

Medium (samsung-shadow):
box-shadow: 
  0 4px 20px rgba(0, 0, 0, 0.3),
  0 0 40px rgba(0, 122, 255, 0.1)

Large (samsung-shadow-lg):
box-shadow: 
  0 8px 30px rgba(0, 0, 0, 0.4),
  0 0 60px rgba(0, 122, 255, 0.15)
```

### Glow Effects
```
Blue Glow:
box-shadow: 0 0 20px rgba(0, 122, 255, 0.3)

Strong Blue Glow:
box-shadow: 0 0 40px rgba(0, 122, 255, 0.5)
```

## Gradients

### Background Gradients
```css
/* Panel Background */
background: linear-gradient(135deg, 
  rgba(10, 10, 10, 0.98) 0%,
  rgba(20, 20, 20, 0.98) 100%
);

/* Card Background */
background: linear-gradient(135deg, 
  rgba(30, 30, 30, 0.9) 0%,
  rgba(40, 40, 40, 0.9) 100%
);

/* Feature Card Background */
background: linear-gradient(135deg, 
  rgba(40, 40, 40, 0.9) 0%,
  rgba(50, 50, 50, 0.9) 100%
);
```

### Button Gradients
```css
/* Primary Button */
background: linear-gradient(135deg, 
  rgba(0, 122, 255, 0.9) 0%,
  rgba(0, 100, 220, 0.9) 100%
);

/* Primary Button Hover */
background: linear-gradient(135deg, 
  rgba(0, 140, 255, 1) 0%,
  rgba(0, 120, 240, 1) 100%
);
```

### Active State Gradients
```css
/* Active Feature Card */
background: linear-gradient(135deg, 
  rgba(0, 122, 255, 0.2) 0%,
  rgba(0, 100, 220, 0.2) 100%
);
```

## Component Styles

### Samsung Card
```css
.samsung-card {
  background: linear-gradient(135deg, 
    rgba(30, 30, 30, 0.9) 0%,
    rgba(40, 40, 40, 0.9) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.samsung-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Samsung Button
```css
.samsung-button {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%,
    rgba(0, 100, 220, 0.9) 100%
  );
  border: none;
  border-radius: 20px;
  box-shadow: 
    0 4px 15px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.samsung-button:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 6px 20px rgba(0, 122, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.samsung-button:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 10px rgba(0, 122, 255, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### Samsung Input
```css
.samsung-input {
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 24px;
  padding: 16px 20px;
  color: white;
}

.samsung-input:focus {
  background: rgba(35, 35, 35, 0.95);
  border-color: rgba(0, 122, 255, 0.6);
  box-shadow: 
    0 0 20px rgba(0, 122, 255, 0.2),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
  outline: none;
}
```

### Samsung Feature Card
```css
.samsung-feature-card {
  aspect-ratio: 1;
  background: linear-gradient(135deg, 
    rgba(40, 40, 40, 0.9) 0%,
    rgba(50, 50, 50, 0.9) 100%
  );
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.samsung-feature-card:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(0, 122, 255, 0.5);
  box-shadow: 
    0 8px 30px rgba(0, 122, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.samsung-feature-card.active {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.2) 0%,
    rgba(0, 100, 220, 0.2) 100%
  );
  border-color: rgba(0, 122, 255, 0.8);
  box-shadow: 
    0 0 30px rgba(0, 122, 255, 0.4),
    inset 0 0 20px rgba(0, 122, 255, 0.1);
}
```

### Samsung Chat Bubble
```css
.samsung-chat-bubble {
  background: linear-gradient(135deg, 
    rgba(40, 40, 40, 0.95) 0%,
    rgba(50, 50, 50, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.samsung-chat-bubble.user {
  background: linear-gradient(135deg, 
    rgba(0, 122, 255, 0.9) 0%,
    rgba(0, 100, 220, 0.9) 100%
  );
  border-color: rgba(0, 122, 255, 0.3);
}
```

## Transitions

### Standard Transitions
```css
/* All properties */
transition: all 0.3s ease;

/* Transform only */
transition: transform 0.3s ease;

/* Opacity only */
transition: opacity 0.3s ease;

/* Multiple properties */
transition: 
  transform 0.3s ease,
  box-shadow 0.3s ease,
  border-color 0.3s ease;
```

### Cubic Bezier Easing
```css
/* Smooth ease */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Fold animation */
transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
```

## Hover Effects

### Standard Hover
```css
/* Elevation */
transform: translateY(-2px);
box-shadow: enhanced;

/* Scale */
transform: scale(1.05);

/* Combined */
transform: translateY(-2px) scale(1.02);
```

### Button Hover
```css
transform: translateY(-1px);
background: brighter gradient;
box-shadow: enhanced glow;
```

### Card Hover
```css
transform: translateY(-4px) scale(1.02);
border-color: brighter;
box-shadow: enhanced with glow;
```

## Active States

### Button Active
```css
transform: translateY(0);
box-shadow: reduced;
inset shadow;
```

### Card Active
```css
background: blue gradient;
border-color: bright blue;
box-shadow: strong glow;
```

## Layout Patterns

### Feature Grid
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 16px;
padding: 20px;
```

### Flex Container
```css
display: flex;
flex-direction: column;
gap: 16px;
padding: 24px;
```

### Centered Content
```css
display: flex;
align-items: center;
justify-content: center;
```

## Responsive Breakpoints

### Mobile First
```css
/* Base styles for mobile */
.element {
  /* mobile styles */
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    /* tablet styles */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    /* desktop styles */
  }
}
```

## Animation Keyframes

### Fold In
```css
@keyframes fold-in {
  from {
    transform: perspective(1000px) rotateY(-15deg);
    opacity: 0;
  }
  to {
    transform: perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
}
```

### Fold Out
```css
@keyframes fold-out {
  from {
    transform: perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
  to {
    transform: perspective(1000px) rotateY(-15deg);
    opacity: 0;
  }
}
```

## Best Practices

### Do's ✅
- Use Samsung design tokens consistently
- Apply gradients for depth
- Add subtle glows to interactive elements
- Use 24px border radius as standard
- Maintain consistent spacing (16px, 24px)
- Apply smooth transitions (0.3s)
- Use blue accent color (#007aff)
- Add hover elevation effects
- Include active state feedback

### Don'ts ❌
- Don't use flat colors without gradients
- Don't mix different border radius sizes
- Don't use harsh shadows
- Don't forget hover states
- Don't use colors outside the palette
- Don't skip transitions
- Don't use sharp corners
- Don't overuse animations
- Don't ignore accessibility

## Accessibility

### Color Contrast
- Text on dark background: 7:1 (AAA)
- Blue accent on dark: 4.5:1 (AA)
- White text on blue: 4.5:1 (AA)

### Focus States
- Clear blue outline
- Enhanced glow effect
- Visible on all interactive elements

### Motion
- Respects prefers-reduced-motion
- Smooth, non-jarring transitions
- No flashing or strobing

## Implementation Checklist

- [ ] Import Samsung CSS classes
- [ ] Add fold state management
- [ ] Implement fold toggle button
- [ ] Apply samsung-card to cards
- [ ] Apply samsung-button to buttons
- [ ] Apply samsung-input to inputs
- [ ] Apply samsung-chat-bubble to messages
- [ ] Add samsung-shadow to elevated elements
- [ ] Use samsung-rounded for border radius
- [ ] Test responsive behavior
- [ ] Verify accessibility
- [ ] Check browser compatibility

## Result

Following this style guide ensures a consistent, premium Samsung Galaxy Z Fold experience throughout the application with modern aesthetics, smooth interactions, and professional polish! 🎨✨
