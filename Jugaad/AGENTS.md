# AMNESIA Pattern Library & Technical Constraints

## Philosophy
- **Identity**: Midnight Sanctuary - warm darkness, candlelight feel.
- **Mantra**: "Does this lower the user's heart rate, or raise it?"
- **Core**: Ephemeral, Shareable, Accessible, Cinematic.

## Design System

### Colors
- **Backgrounds**: Void (#0A0D10), Surface (#12161B), Elevated (#1A1F26), Hover (#222830)
- **Accents**: Primary (#A8C4A2 - Sage), Secondary (#E8C4A0 - Sand), Tertiary (#8FB4C4), Danger (#C47070)
- **Text**: Primary (#F0EDE8), Secondary (#B8B4AE), Muted (#7A766F), Ghost (#4A4640)

### Typography
- **UI**: DM Sans
- **Display**: Fraunces
- **Scale**: Fluid clamp() based.

### Spacing
- Base: 4px
- Scale: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem.

### Animations
- **Spring**: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Expo**: cubic-bezier(0.16, 1, 0.3, 1)
- **Friction**: cubic-bezier(0.4, 0, 0.2, 1)

## Technical Stack
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Vanilla CSS (NO Tailwind)
- **Storage**: IndexedDB (Dexie.js), Local-first, Max 7 days retention.
- **Deps**: react, react-dom, dexie, d3-force, simplex-noise, html2canvas, lucide-react.
- **Mobile**: Mobile-first, 44px min touch targets.

## Lessons Learned
(Append lessons here)
- Manual scaffolding ensures cleaner dependencies than generic generators.
- Variable-first design enables rapid theming without touching components.
- Atmosphere layers (grain/vignette) effectively mask the void without expensive 3D renders.
- Vanilla CSS allows for precise textual control without unexpected framework overrides.
- Time-based opacity is a simple, high-impact metaphor for impermanence.
- Phase labels give users emotional touchpoints for the decay timeline.
- Dexie Table auto-increment IDs return IndexableType, cast to number for TS safety.
- html2canvas requires offscreen DOM element for high-res export.
- Lerp factor 0.08 creates buttery-smooth spotlight lag without jank.
- Simplex noise + rAF creates organic particle behavior without heavy physics libraries.
- Keyword lists per emotion scale well without ML overhead.
- d3-force simulation renders well on canvas with minimal setup.
- Canvas toDataURL enables gallery-quality exports without server-side rendering.
