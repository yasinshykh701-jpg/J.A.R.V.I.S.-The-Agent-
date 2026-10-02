# Qazyene - Authentic iOS/macOS Design

## Overview
Qazyene now features an authentic iOS/macOS design system that mirrors the native Apple experience across iPhone, iPad, and Mac.

## Design System

### Colors
**Light Mode:**
- Background: `#f2f2f7` (iOS Light Gray)
- Card: `#ffffff` (Pure White)
- Primary: `#007aff` (iOS Blue)
- Destructive: `#ff3b30` (iOS Red)
- Text: `#000000` (Black)
- Secondary Text: `#8e8e93` (iOS Gray)

**Dark Mode:**
- Background: `#000000` (True Black)
- Card: `#1c1c1e` (iOS Dark Gray 1)
- Input: `#2c2c2e` (iOS Dark Gray 2)
- Primary: `#007aff` (iOS Blue - same in dark)
- Text: `#ffffff` (White)
- Secondary Text: `#98989d` (iOS Dark Gray Text)

### Typography
- Font Family: SF Pro Display/Text (Apple System Font)
- Fallback: -apple-system, BlinkMacSystemFont
- Font Smoothing: Antialiased for crisp rendering
- Weights: Regular (400), Semibold (600), Bold (700)

### Border Radius
- Small elements: `rounded-2xl` (16px)
- Cards: `rounded-3xl` (24px)
- Large cards: `rounded-[28px]` (28px - iOS widget style)
- Buttons: `rounded-full` (fully rounded)

### Shadows
- Subtle: `shadow-sm` for cards
- Elevated: `shadow-lg` for buttons
- Hover: `shadow-xl` for interactive states

## Components

### 1. Navigation Bar
- **Height**: 56px mobile, 64px desktop
- **Background**: White/80% with backdrop-blur-2xl
- **Border**: Hairline border (1px) with 10% opacity
- **Sticky**: Fixed to top with z-50
- **Content**: Logo + title on left, user menu on right

### 2. Feature Cards (iOS Widget Style)
- **Layout**: 2 columns mobile, 4 columns desktop
- **Background**: Pure white (light) / #1c1c1e (dark)
- **Padding**: 20px mobile, 24px desktop
- **Icon Container**: 56px mobile, 64px desktop with rounded-2xl
- **Selected State**: Ring-2 with iOS Blue
- **Hover**: Scale 1.02, shadow-xl
- **Active**: Scale 0.98 (touch feedback)

### 3. Messages Area (iOS Messages Style)
- **User Messages**: iOS Blue (#007aff) background
- **AI Messages**: Light gray (#f2f2f7) / Dark gray (#2c2c2e)
- **Bubble Radius**: rounded-3xl (24px) / rounded-[22px] (22px desktop)
- **Avatar Size**: 32px mobile, 40px desktop
- **Avatar Ring**: 2px with background color
- **Max Width**: 75% mobile, 70% desktop

### 4. Chat Input (iOS Keyboard Toolbar Style)
- **Background**: White (light) / #1c1c1e (dark)
- **Input Field**: #f2f2f7 (light) / #2c2c2e (dark)
- **Border Radius**: rounded-3xl (24px)
- **Button Size**: 40px mobile, 44px desktop
- **Button Background**: #f2f2f7 (light) / #2c2c2e (dark)
- **Send Button**: iOS Blue with white icon
- **Focus Ring**: 2px iOS Blue

## Responsive Design

### Mobile (< 1280px)
- Compact spacing (16px gaps)
- Smaller text sizes
- Touch-optimized buttons (44px minimum)
- Single column layouts where appropriate
- Hidden secondary information

### Desktop (≥ 1280px)
- Generous spacing (24px gaps)
- Larger text sizes
- Hover states enabled
- Multi-column layouts
- Full information display

## Interactions

### Hover States (Desktop)
- Scale: 1.02 for cards
- Shadow: Elevated to shadow-xl
- Background: Slightly darker (#e5e5ea light / #3a3a3c dark)

### Active States (Mobile)
- Scale: 0.98 for immediate feedback
- No hover effects on touch devices
- Tap highlight disabled

### Transitions
- Duration: 200ms for most interactions
- Easing: cubic-bezier(0.4, 0, 0.2, 1) - iOS standard
- Properties: transform, background-color, box-shadow

## Accessibility

### Touch Targets
- Minimum size: 44px × 44px (Apple HIG standard)
- Adequate spacing between interactive elements
- Clear visual feedback on interaction

### Typography
- Minimum font size: 16px to prevent zoom on iOS
- Proper contrast ratios (WCAG AA compliant)
- System font for optimal readability

### Focus States
- 2px ring with iOS Blue
- Visible keyboard navigation
- Proper tab order

## Platform-Specific Features

### iOS/Safari
- Viewport-fit: cover for notched devices
- Apple mobile web app capable
- Status bar style: black-translucent
- Theme color: iOS Blue
- No tap highlight color
- Prevented zoom on input focus

### macOS/Safari
- Backdrop-filter support for translucency
- System font rendering
- Smooth scrolling
- Native-feeling interactions

## Best Practices

1. **Use System Colors**: Always use iOS system colors for consistency
2. **Proper Spacing**: Follow 4px grid system (4, 8, 12, 16, 20, 24...)
3. **Rounded Corners**: Use appropriate radius for element size
4. **Shadows**: Subtle and purposeful, not decorative
5. **Typography**: System font with proper weights
6. **Interactions**: Smooth, responsive, with clear feedback
7. **Dark Mode**: Full support with proper color adaptation

## Testing Checklist

- [ ] Test on actual iOS device (iPhone/iPad)
- [ ] Test on macOS Safari
- [ ] Verify backdrop-blur rendering
- [ ] Check touch target sizes
- [ ] Validate dark mode colors
- [ ] Test smooth scrolling
- [ ] Verify font rendering
- [ ] Check responsive breakpoints
- [ ] Test keyboard navigation
- [ ] Validate color contrast ratios
