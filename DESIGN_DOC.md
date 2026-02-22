# JakeCars — Design Document & TODO

## Overview
JakeCars is a free, single-page car comparison tool that lets users compare up to 4 vehicles side by side with CarGurus-level detail across 10 spec categories.

**Live URL (pending):** `https://jakecars.com`

---

## Architecture

### Stack
- **Frontend:** Vanilla HTML/CSS/JS (single `index.html` file)
- **Fonts:** Outfit (UI), JetBrains Mono (data)
- **Hosting:** Static — GitHub Pages, Vercel, or Netlify
- **Data:** Embedded JSON object (`carDatabase`) with 605 vehicles across 47 brands

### Data Model
Each vehicle entry:
```
key: "{year}-{brand}-{model}-{trim}" (slugified)
value: {
  name, year, trim, msrp, brand, category,
  specs: {
    engine        — type, hp, torque, displacement, drivetrain, transmission, fuel, bodyType
    performance   — 0-60, top speed, range
    dimensions    — length, width, height, wheelbase, ground clearance, drag coefficient
    weight        — curb, gross, distribution, towing capacity, payload (trucks)
    capacity      — seating, cargo, fuel, seating layout, turning radius
    wheels        — front/rear tires, wheel size, brakes
    fuelEconomy   — city, highway, combined, estimated range, fuel type, charging time (EVs)
    safety        — NHTSA, IIHS, airbags, driver assist, ABS, stability control
    features      — infotainment, interior, exterior, drive modes
    warranty      — basic, powertrain, corrosion, roadside assistance
  }
}
```

### UI Flow
```
Make → Model → Year → Trim (4 cascading dropdowns × up to 4 vehicles)
        ↓
  [Compare Vehicles]
        ↓
  Side-by-side spec cards with 10 collapsible categories
```

---

## SEO Strategy

### Implemented
- [x] `<title>` with primary keywords
- [x] `<meta name="description">` — 155 chars, keyword-rich
- [x] `<meta name="keywords">` — long-tail car comparison terms
- [x] `<meta name="robots" content="index, follow">`
- [x] `<link rel="canonical">` — placeholder for `jakecars.com`
- [x] Open Graph tags (Facebook, LinkedIn sharing)
- [x] Twitter Card tags (large image summary)
- [x] JSON-LD structured data — `WebApplication` + `WebSite` with `SearchAction`
- [x] `robots.txt` — allow all, block temp files
- [x] `sitemap.xml` — single page for now
- [x] `<html lang="en">`
- [x] Semantic heading hierarchy (`h1` → `h2` → `h3`)
- [x] `preconnect` hints for Google Fonts
- [x] Inline SVG favicon (🚗)

### TODO — Once Domain Is Live
- [ ] Replace all `https://jakecars.com` placeholders with actual domain
- [ ] Create and upload `og-image.png` (1200×630px recommended)
- [ ] Create and upload `apple-touch-icon.png` (180×180px)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics (GA4) or Plausible
- [ ] Register with Google Business Profile (if applicable)
- [ ] Add `<meta name="google-site-verification">` tag
- [ ] Set up HTTPS redirect (handled by host)
- [ ] Test with Google Rich Results Test
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator

---

## TODO — Features & Improvements

### High Priority
- [ ] **Domain setup** — Point `jakecars.com` to hosting provider
- [ ] **Dark mode toggle** — Add light/dark theme switcher
- [ ] **Mobile responsive polish** — Test and fix all breakpoints (320px–1440px)
- [ ] **Print / export comparison** — PDF or image export of comparison results
- [ ] **URL-based sharing** — Encode selected vehicles in URL params so comparisons are shareable
- [ ] **Lazy load data** — Move `carDatabase` to external JSON, fetch on demand

### Medium Priority
- [ ] **Search / filter** — Quick search bar to find vehicles by name, brand, or category
- [ ] **Category filters** — Filter by SUV, Sedan, Truck, EV, Hybrid, etc.
- [ ] **Price range filter** — Slider to filter by MSRP range
- [ ] **Highlight differences** — Color-code specs that differ between compared vehicles
- [ ] **"Best in class" badges** — Auto-tag highest HP, best MPG, lowest price, etc.
- [ ] **Spec tooltips** — Hover explanations for technical terms (e.g., "Cd" = drag coefficient)
- [ ] **Sticky comparison header** — Keep vehicle names visible while scrolling specs
- [ ] **Collapsible spec sections** — Allow users to expand/collapse each spec category
- [ ] **Image placeholders** — Add vehicle silhouette or stock images per model

### Low Priority
- [ ] **User accounts** — Save favorite comparisons
- [ ] **Admin panel** — CRUD interface for adding/editing vehicles
- [ ] **API endpoint** — Expose vehicle data as a REST API
- [ ] **Multi-language support** — i18n for Spanish, French, etc.
- [ ] **Accessibility audit** — WCAG 2.1 AA compliance
- [ ] **Performance audit** — Lighthouse score optimization (target 90+)
- [ ] **PWA support** — Service worker for offline access
- [ ] **Blog / content pages** — "Best SUVs of 2024", "EV Buying Guide", etc. (SEO content)

### Data Expansion
- [ ] **More trims per model** — Many models currently have 1 trim; add 3-5 trims each
- [ ] **Historical years** — Add 2020-2023 model years for popular vehicles
- [ ] **Real-time pricing** — Scrape or API-integrate live dealer pricing
- [ ] **Recall data** — NHTSA recall integration
- [ ] **Owner reviews** — Aggregate ratings from Edmunds/KBB/Cars.com
- [ ] **Depreciation data** — Estimated 3-year and 5-year depreciation curves
- [ ] **Insurance estimates** — Average annual insurance cost per model

---

## Brand Coverage (47 brands, 605 vehicles)

| Brand | Models | Brand | Models |
|-------|--------|-------|--------|
| Toyota | 25 | BMW | 21 |
| Audi | 19 | Mercedes-Benz | 18 |
| Hyundai | 17 | Honda | 16 |
| Chevrolet | 16 | Volkswagen | 15 |
| Kia | 14 | Volvo | 14 |
| Ford | 13 | Jeep | 12 |
| Cadillac | 12 | Lexus | 12 |
| Genesis | 11 | GMC | 11 |
| Land Rover | 11 | Nissan | 11 |
| Dodge | 11 | Porsche | 11 |
| Acura | 10 | Mazda | 10 |
| Subaru | 10 | Tesla | 9 |
| + 23 more brands | 3-9 each | | |

---

## File Structure
```
jakecars/
├── index.html          # Main app (HTML + CSS + JS + data)
├── robots.txt          # Search engine crawl rules
├── sitemap.xml         # Sitemap for search engines
├── vercel.json         # Vercel deployment config
├── DESIGN_DOC.md       # This file
├── README.md           # Project readme
└── (future)
    ├── og-image.png    # Social sharing image
    ├── favicon.ico     # Favicon
    ├── data/           # External JSON data files
    └── assets/         # Images, icons
```

---

## Deployment Checklist
1. [ ] Push to GitHub
2. [ ] Connect domain to hosting (Vercel/Netlify/GitHub Pages)
3. [ ] Configure DNS (A record or CNAME)
4. [ ] Verify HTTPS is working
5. [ ] Submit to Google Search Console
6. [ ] Submit to Bing Webmaster Tools
7. [ ] Test all social sharing previews
8. [ ] Run Lighthouse audit
9. [ ] Monitor Core Web Vitals

---

*Last updated: February 22, 2025*
