# Minimal Modern SaaS Education Blue - Design System

## Design Philosophy

This design system represents a **Minimal Modern SaaS Education Blue** aesthetic specifically optimized for educational quiz/exam applications. The system prioritizes clarity, accessibility, and focus while maintaining a professional, contemporary appearance.

## Color Palette

### Primary Colors (Blue Spectrum)
```
primary-50:  #eff6ff  (Lightest - backgrounds, subtle highlights)
primary-100: #dbeafe  (Light - selected states, hover backgrounds)
primary-200: #bfdbfe  (Soft - decorative elements)
primary-300: #93c5fd  (Medium-light - borders, icons)
primary-400: #60a5fa  (Medium - interactive elements)
primary-500: #3b82f6  (Base - primary actions, links)
primary-600: #2563eb  (Strong - main CTAs, important buttons)
primary-700: #1d4ed8  (Deep - active states, emphasis)
primary-800: #1e40af  (Deeper - text on light backgrounds)
primary-900: #1e3a8a  (Darkest - headings, important text)
primary-950: #172554  (Ultra dark - body text, maximum contrast)
```

### Success Colors (Green Spectrum)
```
success-50:  #f0fdf4  (Light background for correct answers)
success-100: #dcfce7  (Badges, tags for correct states)
success-500: #22c55e  (Success indicators, checkmarks)
success-600: #16a34a  (Strong success emphasis)
```

### Danger Colors (Red Spectrum)
```
danger-50:  #fef2f2  (Light background for incorrect answers)
danger-100: #fee2e2  (Badges, tags for error states)
danger-500: #ef4444  (Error indicators, alerts)
danger-600: #dc2626  (Strong error emphasis)
```

### Neutral/System Colors
```
white:       #ffffff  (Cards, panels, backgrounds)
black:       #000000  (Base for opacity overlays)
black/60:    rgba(0,0,0,0.6)   (Modal overlays)
white/30:    rgba(255,255,255,0.3)  (Spinner borders)
white/20:    rgba(255,255,255,0.2)  (Progress bar tracks)
white/80:    rgba(255,255,255,0.8)  (Secondary text on dark)
white/95:    rgba(255,255,255,0.95) (Logo/brand containers)
```

## Background Gradients

### Primary Application Background
```css
bg-gradient-to-br from-primary-600 to-primary-900
```
This creates a diagonal gradient (bottom-right direction) from `#2563eb` to `#1e3a8a`, providing visual depth while maintaining the blue education theme.

## Typography

### Font Stack
```css
font-sans  /* System default sans-serif */
```

### Text Colors by Context
- **Primary body text**: `text-primary-950` (#172554)
- **Secondary text**: `text-primary-900` (#1e3a8a)
- **Tertiary/muted text**: `text-primary-800` (#1e40af)
- **Labels/metadata**: `text-primary-700` (#1d4ed8)
- **Light backgrounds**: `text-primary-600` (#2563eb)
- **Very light contexts**: `text-primary-500` (#3b82f6)
- **On white for readability**: `text-primary-800` or `text-primary-900`

### Font Sizes
- **Ultra large (404 errors)**: `text-7xl` (4.5rem)
- **Large headings**: `text-6xl` (3.75rem)
- **Section headings**: `text-3xl` (1.875rem) on desktop, `text-2xl` (1.5rem) on mobile
- **Subsection headings**: `text-2xl` (1.5rem)
- **Card titles**: `text-lg` (1.125rem)
- **Body text**: `text-base` (1rem - default)
- **Small text/labels**: `text-sm` (0.875rem)
- **Extra small (metadata)**: `text-xs` (0.75rem)

### Font Weights
- **Regular**: `font-normal` (400) - default body text
- **Semi-bold**: `font-semibold` (600) - labels, emphasis
- **Bold**: `font-bold` (700) - headings, CTAs

### Text Styling
- **Uppercase labels**: `uppercase tracking-wide` for metadata labels
- **Line height**: `leading-relaxed` for paragraphs
- **Text alignment**: `text-center` for modals/error screens, `text-left` for content

## Spacing System

### Padding
- **Extra small**: `p-2` (0.5rem)
- **Small**: `p-3` (0.75rem), `p-4` (1rem)
- **Medium**: `p-5` (1.25rem), `p-6` (1.5rem)
- **Large**: `p-8` (2rem), `p-10` (2.5rem)
- **Extra large**: `p-12` (3rem), `p-14` (3.5rem)

### Margins
- **Small gaps**: `mb-2` (0.5rem), `mb-3` (0.75rem), `mb-4` (1rem)
- **Medium gaps**: `mb-6` (1.5rem), `mb-8` (2rem)
- **Component spacing**: `space-y-2`, `space-y-4` for vertical stacks
- **Grid gaps**: `gap-1`, `gap-2`, `gap-3`, `gap-4`

### Responsive Padding
Mobile-first approach with `sm:` breakpoint for larger screens:
```
p-8 sm:p-12  (2rem mobile, 3rem desktop)
p-10 sm:p-14 (2.5rem mobile, 3.5rem desktop)
```

## Border Radius

### Rounding Scale
- **Small**: `rounded-lg` (0.5rem) - buttons, inputs, small cards
- **Medium**: `rounded-xl` (0.75rem) - cards, modals, containers
- **Large**: `rounded-2xl` (1rem) - major panels, screens
- **Full**: `rounded-full` - badges, pills, circular elements

## Shadows

### Shadow Hierarchy
- **Medium**: `shadow-lg` - elevated elements, dropdowns
- **Large**: `shadow-2xl` - modals, major cards, important panels
- **Hover enhancement**: `hover:shadow-lg` - interactive elements on hover

## Borders

### Border Widths
- **Thin**: `border` (1px) - default separators
- **Medium**: `border-2` (2px) - emphasized elements, selected states
- **Accent**: `border-l-4` (4px left) - result cards, status indicators

### Border Colors
- **Subtle**: `border-primary-100` (#dbeafe) - default borders
- **Medium**: `border-primary-300` (#93c5fd) - visible separators
- **Strong**: `border-primary-500` (#3b82f6) - selected/active states
- **Success**: `border-success-300` - correct answers
- **Danger**: `border-danger-300` - incorrect answers

## Interactive States

### Buttons

#### Primary Button (Main CTA)
```css
bg-primary-600 text-white py-4 px-6 rounded-xl font-bold text-lg
hover:bg-primary-700 
hover:shadow-lg 
active:scale-[0.98]
transition-all
```

#### Secondary/Ghost Buttons
```css
bg-white/10 text-white backdrop-blur-sm
hover:bg-white/20
transition-colors
```

#### Small Buttons
```css
px-4 py-2 rounded-lg
```

### Selection States

#### Radio/Checkbox Containers (`:has()` pseudo-class)
```css
/* Default state */
bg-white border-2 border-primary-200 rounded-lg

/* Selected state (when input:checked) */
.choice-item:has(input:checked) {
    border-color: #3b82f6;    /* primary-500 */
    background: #eff6ff;       /* primary-50 */
}
```

#### True/False Buttons
```css
/* Default */
bg-white border-2 border-primary-200

/* Selected */
.tf-btn:has(input:checked) {
    border-color: #3b82f6;    /* primary-500 */
    background: #eff6ff;       /* primary-50 */
    color: #1d4ed8;           /* primary-700 */
}
```

### Hover States
- Links: `hover:bg-primary-700` (darken by one shade)
- Light backgrounds: `hover:bg-white/20` (increase opacity)
- Scale on active: `active:scale-[0.98]` (subtle press effect)

### Transition Properties
```css
transition-all          /* For comprehensive changes (size, shadow, color) */
transition-colors       /* For color-only changes (faster) */
transition duration     /* 200ms default, 300ms for progress bars */
```

## Component Patterns

### Cards
```css
bg-white p-6 rounded-xl shadow-2xl
/* OR */
bg-white p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full
```

### Modals
```css
/* Overlay */
fixed inset-0 bg-black/60 z-[9999] items-center justify-center p-4

/* Modal Content */
bg-white rounded-xl shadow-2xl max-w-md w-full p-6
transform scale-95 opacity-0 transition-all duration-200
```

### Progress Bars
```css
/* Container */
bg-white/20 rounded-full h-3 overflow-hidden

/* Fill */
bg-white h-full rounded-full progress-bar
/* transition: width 0.3s ease; */
```

### Badges/Pills
```css
/* Success badge */
bg-success-100 text-success-600 px-4 py-1.5 rounded-full text-sm font-semibold

/* Danger badge */
bg-danger-100 text-danger-600 px-4 py-1.5 rounded-full text-sm font-semibold

/* Info badge */
bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs
```

### Loading Spinner
```css
/* Spinner element */
w-12 h-12 border-4 border-white/30 border-t-white rounded-full spinner

/* Animation */
@keyframes spin {
    to { transform: rotate(360deg); }
}
.spinner {
    animation: spin 1s linear infinite;
}
```

### Result Cards
```css
/* Correct answer */
bg-success-50 border-success-300 border-2 rounded-lg p-3

/* Incorrect answer */
bg-danger-50 border-danger-300 border-2 rounded-lg p-3

/* Neutral/default */
bg-white border-primary-100 border-2 rounded-lg p-3

/* Question container */
bg-primary-50 p-5 rounded-xl border-l-4 border-primary-500
```

### Information Grids
```css
/* Responsive 2-column grid */
grid grid-cols-1 sm:grid-cols-2 gap-4

/* Info item structure */
<div class="flex flex-col gap-1">
    <span class="text-xs font-semibold text-primary-500 uppercase tracking-wide">
        Label
    </span>
    <span class="text-lg text-primary-900">
        Value
    </span>
</div>
```

### Navigation/Tabs
```css
/* Container (horizontal scroll on mobile) */
flex gap-2 overflow-x-auto hide-scrollbar

/* Tab button */
px-4 py-2 rounded-lg transition-colors whitespace-nowrap

/* Active tab */
bg-white/20 text-white

/* Inactive tab */
bg-white/10 text-white/80 hover:bg-white/15
```

## Layout Patterns

### Full-Screen Centered Container
```css
flex flex-col items-center justify-center min-h-screen p-4
```

### Screen Container (Hidden by default)
```css
hidden items-center justify-center min-h-screen p-4
/* Toggle with .remove('hidden') and .add('flex') */
```

### Content Constraints
- **Small content**: `max-w-md` (28rem)
- **Medium content**: `max-w-2xl` (42rem)
- **Wide content**: `max-w-4xl` (56rem)
- **Full width with padding**: `w-full px-4`

### Responsive Grid
```css
grid grid-cols-1 sm:grid-cols-2 gap-4
/* OR */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

### Fixed Positioning
```css
/* Logo/branding (top-left) */
fixed top-4 left-4 z-50

/* Modal overlay */
fixed inset-0 z-[9999]

/* Sticky header */
sticky top-0 z-40
```

## Animations

### Pulse Warning (for timer)
```css
@keyframes pulse-warning {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}
.timer-warning {
    animation: pulse-warning 1s infinite;
}
```

### Smooth Scrolling
```css
html {
    scroll-behavior: smooth;
}
```

### Progress Bar Transition
```css
.progress-bar {
    transition: width 0.3s ease;
}
```

## Scrollbar Styling

### Hide Scrollbars
```css
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
```

## Responsive Breakpoints

### Mobile-First Approach
- **Default**: < 640px (mobile)
- **sm**: ≥ 640px (tablet)
- **md**: ≥ 768px (small laptop)
- **lg**: ≥ 1024px (desktop)

### Common Responsive Patterns
```css
/* Font size scaling */
text-2xl sm:text-3xl

/* Padding scaling */
p-8 sm:p-12

/* Grid columns */
grid-cols-1 sm:grid-cols-2

/* Column spanning */
sm:col-span-2
```

## Accessibility Considerations

### Contrast Ratios
- Primary text on white: `text-primary-950` or `text-primary-900` (AAA compliant)
- White text on `primary-600`: Sufficient contrast for WCAG AA
- Success/Danger colors: Designed for clear differentiation

### Focus States
- Use Tailwind's default focus rings
- Ensure keyboard navigation is logical (tab order follows visual order)

### Text Readability
- `leading-relaxed` for paragraph content
- Minimum font size: `text-sm` (0.875rem / 14px)
- Adequate spacing between interactive elements (minimum 44x44px touch targets)

## Special Visual Effects

### Backdrop Blur
```css
backdrop-blur-sm  /* Used for glassmorphism effects on overlays */
```

### Gradient Overlays
```css
bg-gradient-to-br from-primary-600 to-primary-900
```

### Opacity Layers
- Modal overlays: `bg-black/60`
- Loading screens: `bg-white/10`, `bg-white/20`
- Text dimming: `text-white/80`

## Design Tokens Summary

### Spacing Scale
```
0.5rem (2), 0.75rem (3), 1rem (4), 1.25rem (5), 1.5rem (6), 
2rem (8), 2.5rem (10), 3rem (12), 3.5rem (14)
```

### Z-Index Layers
```
z-40: Sticky headers
z-50: Fixed branding/navigation
z-[9999]: Modal overlays
```

### Max Width Constraints
```
max-w-md:  28rem (small modals, narrow content)
max-w-2xl: 42rem (main content, forms)
max-w-4xl: 56rem (wide content)
max-w-xs:  20rem (progress bars, compact elements)
```

## Usage Guidelines for AI

When generating code using this design system:

1. **Always use the primary blue color palette** for educational/SaaS contexts
2. **Default to rounded corners**: prefer `rounded-xl` or `rounded-2xl` for cards
3. **Use shadow-2xl for important panels** (modals, main cards)
4. **Apply transitions to interactive elements** for polish
5. **Use the `:has()` pattern for radio/checkbox states** when creating forms
6. **Maintain mobile-first responsive design** with `sm:` breakpoints
7. **Use semantic color naming**: success for correct, danger for errors
8. **Apply the gradient background** (`bg-gradient-to-br from-primary-600 to-primary-900`) for full-page layouts
9. **Ensure text contrast**: use `text-primary-950` or `text-primary-900` on white backgrounds
10. **Keep animations subtle**: 200-300ms transitions, scale-[0.98] for active states

## Component Composition Example

```html
<!-- Card with consistent styling -->
<div class="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full">
    <h1 class="text-2xl sm:text-3xl font-bold text-primary-900 mb-8 text-center">
        Heading
    </h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                Label
            </span>
            <span class="text-lg text-primary-900">
                Value
            </span>
        </div>
    </div>
    
    <button class="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all hover:shadow-lg active:scale-[0.98]">
        Action Button
    </button>
</div>
```

This design system ensures visual consistency, accessibility, and a professional minimal modern aesthetic optimized for educational SaaS applications.
