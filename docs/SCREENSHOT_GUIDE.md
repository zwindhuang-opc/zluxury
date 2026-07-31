# Screenshot Guide

This document explains the screenshot directory structure and naming conventions for the ZLuxury project.

---

## Directory Structure

```
screenshots/
└── v2.0.0/
    ├── home/
    ├── categories/
    ├── products/
    ├── about/
    ├── collections/
    ├── category-pages/
    ├── product-pages/
    ├── ai-assistant/
    └── header-footer/
```

### Directory Purpose

| Directory | Description |
|---|---|
| `home/` | Screenshots of the homepage, hero sections, featured products, and landing page layouts |
| `categories/` | Screenshots of category listing pages (e.g., jewelry, watches, fashion, home decor) |
| `products/` | Screenshots of product detail pages, product grids, and product card components |
| `about/` | Screenshots of the About Us page, brand story, mission, and team sections |
| `collections/` | Screenshots of curated collections, seasonal collections, and featured lookbooks |
| `category-pages/` | Screenshots of individual category landing pages with filters and product listings |
| `product-pages/` | Screenshots of individual product detail pages with images, descriptions, and purchase options |
| `ai-assistant/` | Screenshots of the AI assistant interface, chat interactions, and recommendation features |
| `header-footer/` | Screenshots of the site-wide header (navigation, search, cart) and footer (links, newsletter) |

---

## Naming Conventions

### File Names

Use the following format for screenshot file names:

```
{page-or-component}-{description}-{device}.{ext}
```

#### Examples

```
home-hero-section-desktop.png
home-featured-products-mobile.png
categories-jewelry-listings-desktop.png
product-detail-gallery-desktop.png
product-detail-add-to-cart-mobile.png
ai-assistant-chat-interface-desktop.png
header-navigation-open-desktop.png
footer-newsletter-section-desktop.png
```

### Device Suffixes

| Suffix | Description |
|---|---|
| `desktop` | Desktop view (1920x1080 or similar) |
| `tablet` | Tablet view (768x1024) |
| `mobile` | Mobile view (375x667) |

### File Format

- Use `.png` for screenshots (lossless, high quality)
- Use `.jpg` only when file size is a concern and quality loss is acceptable
- Recommended resolution: 2x (retina) for crisp display on all devices

---

## Versioning

Screenshots are organized by version number. When a new version is released:

1. Create a new version folder: `screenshots/v{version}/`
2. Follow the same subdirectory structure
3. Capture fresh screenshots reflecting the updated UI/UX

---

## Best Practices

1. **Be consistent:** Capture all screenshots at the same resolution and zoom level
2. **Clean captures:** Remove browser chrome, system notifications, and personal data before capturing
3. **Representative state:** Capture the most common/important state of each page or component (e.g., with data populated, not empty states)
4. **Annotate if needed:** If a screenshot requires annotation, use a separate annotated copy (e.g., `home-hero-section-annotated-desktop.png`)
5. **Keep screenshots current:** Update screenshots when UI changes to avoid stale references