# ROCO OS Style & Brand Design Guide

This document defines the strict styling and development conventions for the **ROCO OS** system. All future builds, component enhancements, and module layouts must adhere strictly to these guidelines to ensure consistency, high visual contrast, WCAG compliance, and brand alignment.

---

## 1. Core Brand Colors

The visual identity of ROCO OS is built on a high-octane, high-contrast urban palette.

| Token Name | Hex Code | Usage Context |
| :--- | :--- | :--- |
| **Primary Orange** | `#E78A3E` | Highlights, active states, hover backgrounds, borders, focus rings, select icons, primary CTA accents. |
| **Primary Black** | `#000000` | Dark sections (header, footers, drawer sidebars), background for deep containers, typography on white/orange. |
| **Primary White** | `#FFFFFF` | Core application canvas background, card panels, standard text on black sections. |

---

## 2. Accessibility & Typography Rules

To pass strict WCAG AA/AAA visual standards across different screen resolutions and ambient light scenarios in a pub or restaurant environment:

*   **Primary CTA Contrast:** Any button styled in **Primary Orange (`#E78A3E`)** MUST display label text in solid **Primary Black (`#000000`)** or heavy dark fonts. Never use white text over the primary orange.
*   **Header / Footer Sections (Black Background):** Text and structural icons in these areas must use high-purity **Primary White (`#FFFFFF`)** or high-vibrancy **Primary Orange (`#E78A3E`)**. Never use dark charcoal or dim gray over black.
*   **Main Canvas (White Background):** Standard text, body copy, and paragraph descriptions must utilize high-contrast black (`#000000`) or dark zinc (`#18181B`) text.

---

## 3. Brand Naming & Logos

*   **Brand Name:** Always refer to the system as **ROCO** or **ROCO OS**. Ensure all references to the legacy "Staffordshire" brand remain retired.
*   **Official Logo URL:** Use the combined logo asset exactly:
    `https://www.rocomamas.co.ke/images//logo-combined.png`

---

## 4. Component Architecture & UI Elements

### Background Structure
*   **Main Container:** Always use predominantly white `#FFFFFF` canvases combined with the `.grunge-pattern` class for urban texture.
*   **Headers & Footers:** Lock to full solid black `#000000` with top/bottom primary orange borders (`border-[#E78A3E]`).
*   **Modals & Overlays:** Standard modals must be clean white cards with solid orange borders and rich black shadows (`shadow-2xl`).

### Inputs, Buttons & Interactive States
*   **Standard Input Fields:** White backgrounds, black text, light borders, transitioning to a solid **Primary Orange** focus ring and border upon focus.
*   **Primary Buttons:** Styled with background `#E78A3E` and black text. On hover, apply a slightly deeper accent shade with smooth transition curves.
*   **Pills & Tabs:** Unselected pills use light backgrounds (`#F4F4F5`) with dark text; selected active state highlights immediately switch to Primary Orange or solid black with clear visual boundaries.
