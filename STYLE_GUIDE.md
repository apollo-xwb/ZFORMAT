# LUTHO OS Style & Brand Design Guide

This document defines the styling and development conventions for the **LUTHO OS** white-label hospitality platform. Lutho is a fully re-themeable operating system: every venue can match the app to its own colours from the in-app **Theme Studio**, but these are the defaults that ship with the product.

---

## 1. Core Brand Colours

Lutho's default identity is a calm, premium, enterprise palette: creamy light beige, light navy blue, and silver/chrome.

| Token Name | Hex Code | Usage Context |
| :--- | :--- | :--- |
| **Primary Navy** | `#3E5E93` | Primary CTAs, active states, highlights, focus rings, links, key icons. |
| **Silver / Chrome** | `#9AA6B8` | Secondary accents, dividers, muted controls, metadata chips. |
| **Champagne / Beige** | `#C7A468` | Tertiary accents, awards, celebratory highlights. |
| **Canvas Beige** | `#F4EEE1` | Core application canvas background. |
| **Card White** | `#FFFFFF` | Card panels and modals. |
| **Ink Navy** | `#20293A` | Body copy and headings on light surfaces. |

The accent trio (primary / secondary / tertiary) is exposed as CSS variables — `--lutho-primary`, `--lutho-secondary`, `--lutho-tertiary` — so the Theme Studio can retheme the entire app live.

---

## 2. Accessibility & Typography Rules

* **Primary CTA Contrast:** Buttons using **Primary Navy (`#3E5E93`)** MUST display label text in **white (`#FFFFFF`)**. This is enforced automatically for any element carrying the `bg-[#3E5E93]` token.
* **Main Canvas (Beige Background):** Standard text and body copy must use high-contrast **Ink Navy (`#20293A`)** or dark slate.
* **Deep Surfaces:** Header, footer, and drawer surfaces render as deep beige with Ink Navy text and silver borders for a clean, high-legibility look in bright venues.

---

## 3. Brand Naming & Logos

* **Brand Name:** Always refer to the system as **Lutho** or **Lutho OS**. No legacy or third-party brand references should remain anywhere in the product.
* **Logo Asset:** Use the local combined logo asset: `/lutho-logo.png`.
* **Stamp / Emblem:** Loyalty stamps and the favicon use `/lutho-stamp-logo.png`.

---

## 4. Component Architecture & UI Elements

### Background Structure
* **Main Container:** Predominantly beige `#F4EEE1` canvas combined with the subtle `.grunge-pattern` texture.
* **Headers & Footers:** Deep-beige surfaces with silver borders.
* **Modals & Overlays:** Clean white cards with navy/silver accents and soft shadows (`shadow-2xl`).

### Inputs, Buttons & Interactive States
* **Standard Input Fields:** White backgrounds, ink-navy text, silver borders, transitioning to a **Primary Navy** focus ring on focus.
* **Primary Buttons:** Background `#3E5E93` with white text; hover deepens to `#2F4A73`.
* **Pills & Tabs:** Unselected pills use light backgrounds with dark text; the selected/active state switches to Primary Navy with white text.
