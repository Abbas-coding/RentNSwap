# 🎨 Design & Theme Guide — Rent & Swap

## 1. Theme Direction

**Design Identity:**  
- **Mood:** Friendly, sustainable, and trustworthy.  
- **Style:** Clean, minimal, and lively — emphasizing usability and approachability.  
- **Core Concept:** “Community-driven circular economy” encouraging sharing and reuse.

**Keywords:** Community • Sustainability • Flexibility • Trust • Modern Simplicity

---

## 2. Color Palette

| Purpose | Color | Hex | Notes |
|----------|--------|------|------|
| **Primary** | Mint Green | `#00C48C` | Clean, energetic, eco-friendly |
| **Secondary** | Sky Blue | `#38BDF8` | Calm and trustworthy |
| **Accent** | Soft Yellow | `#FACC15` | Highlight color for CTAs |
| **Background** | Off-White | `#F9FAFB` | Bright but not harsh |
| **Text Primary** | Charcoal | `#111827` | High readability |
| **Text Secondary** | Cool Gray | `#6B7280` | Secondary content |
| **Error** | Red-500 | `#EF4444` | Validation errors |
| **Success** | Green-600 | `#16A34A` | Success messages |

> Use subtle gradients (e.g., Mint → Sky Blue) for hero banners or CTAs.

---

## 3. Typography

| Use Case | Font | Notes |
|-----------|-------|-------|
| **Primary Font** | **Poppins** or **Inter** | Modern, rounded, readable |
| **Headings Font** | **Nunito Sans** | Friendly yet professional |
| **Fallbacks** | system-ui, Helvetica, Arial | For performance |

**Recommended Sizing:**  
- H1: 2.5rem  
- H2: 1.8rem  
- Body: 1rem (16px)  
- Caption: 0.875rem (14px)

**Line Height:** 1.5–1.7 for readability

---

## 4. UI Components & Layout

### Global Layout
- Sticky **Header** with logo, search bar, and profile icon  
- Minimal **Footer** with navigation and social links  
- Container width: `max-w-screen-xl`  
- Use Tailwind spacing scale (multiples of 8px)

### Buttons
- **Primary:** `bg-[#00C48C] text-white` with shadow and hover elevation  
- **Secondary:** Transparent with mint border  
- **Hover:** Slight lift + darker tint (`#00A97B`)

### Cards
- White background, `rounded-2xl`, `shadow-md`  
- Use image overlays for readability

### Inputs
- Rounded (`rounded-lg`), light gray borders  
- Focus ring: Mint or Sky Blue (`focus:ring-[#00C48C]`)

---

## 5. Component Design Notes

| Component | Design Notes |
|------------|--------------|
| **Search Bar** | Rounded pill shape with icon |
| **Listing Card** | Image top, info below, “Swap Available” badges |
| **User Profile** | Circular avatar, mint highlights |
| **Chat UI** | Alternating bubbles, green/gray tones |
| **Admin Panel** | Neutral gray background with side nav |

---

## 6. Responsive Design

- **Mobile:** Vertical stacking, bottom navbar  
- **Tablet:** Two-column grid  
- **Desktop:** Three or four-column grid  

Use Tailwind responsive utilities (`md:`, `lg:`).

---

## 7. Visual Enhancements

- **Microanimations:** Button hover, card lift, modal fade  
- **Icons:** Lucide or Heroicons v2  
- **Illustrations:** Minimal (Storyset / Undraw)  
- **Images:** High-contrast with rounded edges

---

## 8. Tailwind Config (Suggested)

```js
theme: {
  extend: {
    colors: {
      primary: '#00C48C',
      secondary: '#38BDF8',
      accent: '#FACC15',
      background: '#F9FAFB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
    },
    fontFamily: {
      sans: ['Inter', 'Poppins', 'system-ui'],
      heading: ['Nunito Sans', 'Inter'],
    },
    borderRadius: {
      xl: '1rem',
      '2xl': '1.5rem',
    },
  },
}
```

---

## 9. Branding Tone & Feel

- **Voice:** Warm, inclusive, and responsible  
- **Tagline:** *“Share more. Spend less. Swap smarter.”*  
- **Logo Style:** Wordmark with swap symbol ♻️ in mint/blue gradient  
- **Illustration Style:** Flat, eco-friendly with soft edges

---
