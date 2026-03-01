# Design System - Color & Style Variables

This file contains all the standardized design tokens used across the FormBuilder application.

## Usage

Import the variables file in your SCSS files:

```scss
@import '@repo/ui/src/styles/variables.scss';

// Use variables
.my-component {
  background: $bg-primary;
  color: $text-primary;
  padding: $spacing-md;
  border-radius: $radius-md;
}
```

## Color Palette

### Primary Colors
- `$primary` - Main brand color (#667eea)
- `$primary-dark` - Darker variant (#5568d3)
- `$primary-light` - Lighter variant (#8b9ef5)
- `$primary-lightest` - Very light variant (rgba)

### Secondary Colors
- `$secondary` - Secondary brand color (#764ba2)
- `$secondary-dark` - Darker variant (#5f3c82)
- `$secondary-light` - Lighter variant (#9264b8)

### Text Colors
- `$text-primary` - Primary text (#2c3e50)
- `$text-secondary` - Secondary text (#6c757d)
- `$text-muted` - Muted text (#95a5a6)
- `$text-light` - Light text (#adb5bd)

### Background Colors
- `$bg-primary` - Primary background (white)
- `$bg-secondary` - Secondary background (#f8f9fa)
- `$bg-tertiary` - Tertiary background (#f5f7fa)
- `$bg-gradient` - Gradient background

### Border Colors
- `$border-light` - Light border (#e9ecef)
- `$border-medium` - Medium border (#dee2e6)
- `$border-dark` - Dark border (#ccc)

### State Colors
- `$success` - Success state (#28a745)
- `$warning` - Warning state (#ffc107)
- `$error` - Error state (#dc3545)
- `$info` - Info state (#17a2b8)

## Shadows

- `$shadow-sm` - Small shadow
- `$shadow-md` - Medium shadow
- `$shadow-lg` - Large shadow
- `$shadow-xl` - Extra large shadow
- `$shadow-primary` - Primary colored shadow

## Gradients

- `$gradient-primary` - Main gradient (primary → secondary)
- `$gradient-primary-hover` - Hover state gradient
- `$gradient-subtle` - Subtle transparent gradient

## Spacing

- `$spacing-xs` - 4px
- `$spacing-sm` - 8px
- `$spacing-md` - 12px
- `$spacing-lg` - 16px
- `$spacing-xl` - 24px
- `$spacing-2xl` - 32px

## Border Radius

- `$radius-sm` - 4px
- `$radius-md` - 8px
- `$radius-lg` - 12px
- `$radius-pill` - 24px (for pill-shaped elements)

## Transitions

- `$transition-fast` - 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- `$transition-medium` - 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- `$transition-slow` - 0.5s cubic-bezier(0.4, 0, 0.2, 1)

## Typography

### Font Families
- `$font-family-base` - Default font family
- `$font-family-monospace` - Monospace font family

### Font Sizes
- `$font-size-xs` - 12px
- `$font-size-sm` - 13px
- `$font-size-base` - 14px
- `$font-size-md` - 15px
- `$font-size-lg` - 18px
- `$font-size-xl` - 24px
- `$font-size-2xl` - 28px

### Font Weights
- `$font-weight-normal` - 400
- `$font-weight-medium` - 500
- `$font-weight-semibold` - 600
- `$font-weight-bold` - 700

## Z-Index

- `$z-dropdown` - 1000
- `$z-sticky` - 1020
- `$z-fixed` - 1030
- `$z-modal` - 1040
- `$z-popover` - 1050
- `$z-tooltip` - 1060

## CSS Custom Properties

The design system also exports CSS custom properties (CSS variables) that can be used in JavaScript or runtime styling:

```css
var(--primary)
var(--text-primary)
var(--bg-primary)
var(--spacing-md)
var(--radius-md)
```

## Best Practices

1. **Always use variables** instead of hardcoded values
2. **Use semantic naming** - prefer `$text-primary` over `$color-gray-900`
3. **Be consistent** - use the same spacing/colors throughout
4. **Don't modify variables** in component files - they're global
5. **Extend, don't override** - if you need new colors, add them to this file

## Adding New Variables

When adding new variables:
1. Follow the existing naming convention
2. Add documentation in this README
3. Group similar variables together
4. Consider if it should be a CSS custom property too
5. Update all projects using the design system
