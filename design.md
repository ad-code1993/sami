SAMI Auto Service — Complete UI/UX Design Specification

Version: 2.0 (Ecosystem Standardized)

Platform: Mobile-First Responsive Web (Next.js / Tailwind CSS / shadcn)

Core Objective: High-efficiency lead conversion (Calls & Telegram messages) through absolute trust-building and frictionless navigation.

1. Global UI System & Tokens

These global parameters apply across all pages to guarantee absolute visual continuity, matching the mockups generated in the Figma workspace specification (watermarked_img_3196121707268205056.png).

🎨 Color Palette & Variables

Charcoal Black (#1A1A1A): Used for dark-themed headers, deep CTA footer blocks, and primary text elements to emphasize an industrial, clean workspace feel.

Safety Orange (#E65F19): Primary action callout color. Used for direct phone call CTAs, highlight badges, and critical interactive nodes. High visibility and clear industrial standard.

Telegram Blue (#26A5E4 / #229ED9): Secondary CTA color. Reserved exclusively for "Chat on Telegram" routes to align with the branding of the target messaging app.

Clean White (#FFFFFF): Background layer for all body scroll containers and interactive cards to optimize text legibility.

Neutral Gray (#F4F4F6): Canvas backdrop to separate modular visual grids and add depth to layered components.

📐 Typography Scale

Primary Font Family: Clean, highly legible Sans-Serif (e.g., Inter or Geist).

Heading 1 (H1 - Hero Title): 24px to 28px | Bold | Tight Tracking (tracking-tight)

Heading 2 (H2 - Sections): 20px to 22px | Semi-bold | mt-8 mb-4

Body Copy: 14px to 16px | Regular | Line height leading-relaxed | Deep charcoal or dark slate text.

Micro Text / Badges: 11px to 12px | Medium / Semi-bold | Uppercase for trust tags.

📱 Layout Rules & Hitboxes

Core Margin (Mobile): 16px (px-4) default layout padding.

Standard Corner Radius: 12px to 16px for all card structures and modal containers.

Button Height Target: Exactly 48px to 56px to comply with the standard mobile thumb-tap zone, preventing user misclicks during high-intent scroll speeds.

Sticky Conversion Tray: A fixed-position global bottom bar displaying quick links for Call, Telegram, and Directions. Locked to z-index 50 so content slides smoothly underneath it.

2. Page-by-Page Specifications

🏠 Page 1: Home Page (Core Conversion Entry Point)

Optimized for the 5-second customer scan. Instantly demonstrates credibility, outlines services, resolves standard logistical friction points, and drives direct inquiries.

Section-by-Section Wireframe Structure:

Hero Fold (80vh Viewport Height - Dark Theme):

Visuals: Dark charcoal overlay (bg-black/60) on top of a gritty, real-world garage photo showing a mechanic performing a precise engine diagnosis. Left-aligned globe icon with "GLOBAL UX SYSTEM" and right-aligned hamburger menu.

Headline: "Reliable Auto Repair You Can Trust" (H1, White).

Subtitle: "Fast, honest, and affordable mechanical repair for all vehicles."

Primary Action Stack: Full-width stacked button layout. Top Button is Safety Orange (#E65F19) with a phone icon: Call Now. Bottom Button is Telegram Blue with Telegram icon: Chat on Telegram.

Trust Chips: Flat, dark gray rounded pill badges containing micro green/orange status dots reading: Honest Service, Fair Pricing, Skilled Mechanic.

Trust Snapshot (Instant Credibility Banner):

Layout: 3 equal horizontal columns featuring a minimalist card design with a 1px soft border.

Items:

Experienced Mechanic (Spanner/Wrench line-art icon)

Affordable Pricing (Tag/Coins icon)

Quality Repairs (Gear checklist icon)

Services Preview (Horizontal Slider):

Layout: Swipeable carousel framework. On desktop, this transforms into a fixed 3-column row.

Preview Cards: Rounded card shells displaying realistic car subsystem images:

Engine Repair

Transmission Repair

Suspension Service

Action Trigger: A clean, full-width outline button underneath the slider reading: View All Services →.

Why Choose Us (Value Matrix Grid):

Layout: A highly organized 2×3 grid.

Items: Honest Diagnosis, Fair Pricing, Skilled Work, Fast Service, Reliable Repairs, Customer Focus. Each features a clear, centered line-art icon over a white container backdrop.

Workflow Timeline (Transparency & Trust Loop):

Layout: A clean, linear step-by-step indicator diagram using vertical or horizontal linked bullet nodes.

The Process:

Step 1: Inspection: "We check your vehicle carefully."

Step 2: Diagnosis: "We explain the issue clearly."

Step 3: Repair: "We fix the problem professionally."

Step 4: Final Check: "We ensure safety before delivery."

Real Work Grid (Proof of Authenticity):

Layout: 2-column masonry grid containing real, raw workshop environment images. Absolutely no glossy corporate stock photography is permitted. Includes close-up photos of an open engine block, professional toolkit setups, and finished vehicles.

Mini-FAQ Section (Doubt Interception):

UX Rationale: Directly tackles logistical anxiety right after the user reviews your proof of work.

Structure: Two simple accordion dropdown cards:

Q1 (Shown Expanded in Mockup): "Do I need to make an appointment?" -> "No appointment is required. You can call or visit our workshop directly..."

Q2 (Collapsed): "How long do typical repairs take?"

Text Link: Centered underneath the list is a sleek inline anchor reading "See More Questions →" routing to the main FAQ page.

Final CTA & Minimal Footer:

Layout: Charcoal gray full-bleed block. Includes direct call-out line: "Need Car Repair Today? Call or message us instantly." Replicates the Call/Telegram primary CTA buttons.

📖 Page 2: About Page (The Credibility Anchor)

Humanizes the garage. Solves the core user fear of being overcharged by a faceless brand by emphasizing traditional craftsmanship and hands-on dedication.

Section-by-Section Wireframe Structure:

Hero Section (Dark Theme):

Visuals: Real photo of the head mechanic looking confidently at the camera.

Headline: "About SAMI Auto Service" (H1, White).

Subtitle: "Honest mechanical repair built on experience and care."

Who We Are Story Block:

Layout: Dynamic text layout wrapped beside a warm workshop photo.

UX Copy: Describes SAMI Auto Service as a locally owned traditional workshop specializing in honest repair work without the corporate overhead and inflated prices of national service chains. Emphasizes one-on-one accountability.

Mission & Vision (Modular Split):

Layout: Two vertically stacked clean cards.

Mission Card: "To deliver direct, high-quality, and transparent auto mechanical services."

Vision Card: "To remain the most trusted local reference point for reliable, stress-free vehicle maintenance."

Traditional Values (Icon Array):

Layout: A 4-column row or 2x2 grid featuring minimal vector iconography mapping out: Integrity First, Reliable Diagnosis, Workmanship Guarantee, and Customer Care.

🔧 Page 3: Services Page (The Directory)

Designed to prevent cognitive load. Users are looking to quickly confirm if you can repair their specific mechanical symptoms. Highly scannable, minimal copy.

Section-by-Section Wireframe Structure:

Hero Section:

Headline: "Our Mechanical Repair Services"

Subtitle: "Fast, reliable, and affordable car repair and maintenance."

Categorized Problem-Solver Cards (1-Column Mobile, 2-Column Desktop):

Layout: Highly structured section panels divided by auto system groupings.

Categories:

Engine Services: Engine Repair, Engine Overhaul, Engine Maintenance.

Transmission Services: Automatic Transmission Repair, Differential Repair.

Steering & Suspension: Power Steering Repair, Shock Absorber Repair, Suspension Repair.

General Maintenance: Brake Repair, Oil & Filter Change, Cooling System Service, General Inspection.

Card Copy Specification: Each individual card contains a bold, 2-3 word service title followed by a functional 1-sentence diagnostic description explaining what is fixed (max 15 words).

"Not Sure?" Fallback Module (Highly Visual Conversion Trap):

Layout: Highlighted container card with soft border styling.

Headline: "Not sure what's wrong with your car?"

Description: "Our experienced technician can run a hands-on diagnostic inspection to isolate the precise issue quickly."

Direct CTA: Integrated call-to-action stack consisting of "Call Mechanic Now" and "Chat on Telegram".

🖼️ Page 4: Gallery Page (The Evidence Ledger)

A visual portfolio confirming you perform the real, complex mechanical tasks described on your services page. Eliminates the "scam garage" anxiety.

Section-by-Section Wireframe Structure:

Header Intro:

Headline: "Our Workshop & Repair Work"

Subtitle: "Real repairs. Real results. Honest mechanical work you can trust."

Filter Carousel Row:

Layout: Horizontal swipable pills/chips running along the top of the grid view.

Pills: All (Highlighted in orange active state), Engine Repair, Transmission, Suspension, Brakes, Workshop.

Masonry Portfolio Grid:

Layout: 2-column image layout built with progressive load structures (lazy-loading setup) to minimize browser layout shifts.

Visuals: Closeups of clean mechanics' handiwork, internal gear component layouts, and diagnostic testing processes. Selecting any item opens a seamless light-box modal with full zoom and a tiny descriptive label.

Trust Message Callout:

Layout: Minimal, clean card banner separating the grid from the CTA.

Copy: "Every vehicle we work on is handled with care, experience, and attention to detail."

❓ Page 5: FAQ Page (Friction Removal Module)

A dedicated repository resolving secondary objections. Promotes trust through absolute pricing and workflow transparency.

Section-by-Section Wireframe Structure:

Header Fold:

Headline: "Frequently Asked Questions"

Subtitle: "Quick answers about our services, pricing, and repair process."

Accordion Array Framework (Grouped Categories):

Layout: Segmented, clean dropdown cards. Active query is highlighted with a slight border shift.

Categories & Core Questions:

Service Scope: "What vehicles do you work on?", "Do I need to book in advance?"

Pricing Clarity: "How are diagnostic fees calculated?", "Do you provide transparent quotes?"

Parts & Guarantees: "Can I bring my own replacement parts?", "Do you guarantee repair durability?"

Support Escalation CTA:

Layout: Deep charcoal accent block.

Headline: "Still have questions?"

Copy: "We're ready to help you directly. Reach out via call or Telegram for immediate assistance."

Action: Clear orange and blue contact button elements.

📞 Page 6: Contact Page (The Terminal Action Point)

Provides effortless conversion paths. Displays immediate action cards alongside geographic and operational details.

Section-by-Section Wireframe Structure:

Header Section:

Headline: "Get in Touch"

Stacked Action Cards:

Card 1 (Phone): Includes telephone icon, text "Call us directly for fast service", and a full-bleed safety orange CTA: Call Now.

Card 2 (Telegram): Includes Telegram logo, text "Send a message anytime for a quick response", and a Telegram blue CTA: Open Telegram.

Card 3 (Address): Includes map pin vector, text "Visit our workshop directly for inspections", and a dark gray CTA: Open Maps.

Operational Metrics (Schedule Info):

Layout: Clean, bordered listing design block.

Data:

Monday – Saturday: 8:00 AM – 6:00 PM

Sunday: Closed

Embedded Interactive Map:

Layout: 16:9 responsive aspect ratio frame. Fully interactive, high-contrast map rendering pinning the exact workshop garage coordinate.

3. Essential Mobile-First Interaction Rules

Rule 1: Fixed Global Sticky Navigation Tray

The bottom navigation container stays locked dynamically at the bottom edge of the mobile screen.

It contains three clean tap targets with simple layout vectors: Call, Telegram, and Directions.

Ensures that no matter how deep a customer scrolls to consume information, they are never more than 1 tap away from direct contact.

Rule 2: Responsive Loading Guard rails

All high-resolution workshop photos on the Home and Gallery pages must incorporate proper next/image layout properties to support modern image formats and prevent page jumps.

All non-essential layout decorations (e.g., parallax components, sliding visual effects) are omitted to optimize loading speeds over cellular mobile connections.


***

### Summary of Design Artifacts & Visual Specifications
1. **Homepage:** Follows the layout specifications of `watermarked_img_11351610330569777037.png` and `watermarked_img_3196121707268205056.png` with the integrated Mini-FAQ component located right above the bottom conversion zone.
2. **About Page:** Implements the clean layout architecture from `watermarked_img_8123197994414579957.png`.
3. **Services Page:** Follows the structured service classifications detailed in `watermarked_img_11532459456747935182.png`.
4. **Gallery Page:** Follows the filter and masonry format shown in `watermarked_img_10419484485592760554.png`.
5. **FAQ Page:** Built upon the accordion framework of `watermarked_img_12067593786207221429.png` and `watermarked_img_10896073187851295020.png`.

Would you like to start code-scaffolding these specifications into a **Next.js + Tailwind CSS + shadcn/ui** layout skeleton?
