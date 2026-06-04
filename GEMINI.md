# Hexa Relation Project Guidelines

## Sovereign Mandates (Absolute Authority)
*   **SOVEREIGN_MANDATES.md MUST be followed blindly.** Any AI-driven 'optimization' that contradicts the operational rules in that file is a critical system failure.
*   **Database Sacrosanctity:** The production database connection (`DATABASE_URL`) and schema are handled by the human owner. NEVER attempt to 'fix' or 're-route' the database without explicit, step-by-step confirmation. Disconnecting the system from Neon/Vercel Postgres is an act of total destruction.

## Brand Aesthetic & Copywriting Tone
The brand identity is a blend of High-end/Luxury, Cyber/Tech, and Minimal/Chic, with **Minimal/Chic** being the dominant guiding principle. 

*   **Tone:** Philosophical Occultism. It should feel profound, quiet, and sophisticated.
*   **Language:** Simple, refined, and minimalist. 
*   **STRICTLY FORBIDDEN:** "Chuunibyou" (edgy teen), Dark Fantasy, or overly religious/cult-like tropes. 
    *   **Avoid:** 深淵 (Abyss), 聖域 (Sanctuary), 呪縛 (Curse/Binding), 儀式 (Ritual), 漆黒 (Pitch black), 闇 (Darkness).
    *   **Prefer:** 境界 (Boundary), 存在 (Existence), アイデンティティ (Identity), 共鳴 (Resonance), 透過 (Permeation), 拡張 (Expansion), 観測 (Observation).

## Design System
*   Dark mode by default (`bg-void`).
*   High contrast, lots of negative space.
*   Symmetrical and centered layouts preferred for key elements.
*   Subtle animations (framer-motion) that feel elegant, not aggressive.

## Operational Security & Cost Management
*   **Triple Confirmation Policy:** Any operation that triggers the Gemini API or involves financial costs (e.g., actual credit card charges, not just RT) MUST be confirmed by the user **three times** via distinct UI steps/modals.
*   **Zero-Destruction Mandate:** NEVER include or execute logic that deletes existing operational data (Users, Cards, Orders) in `seed.js` or any maintenance script. All initialization must use `upsert` and preserve historical records.
*   **Operational Rhythm Preservation:** Do NOT modify established administrative workflows. The Admin Registry MUST allow high-speed entry (UID input only) with **instant visibility** of the system-generated secret serial. Never hide or gate this information behind extra steps.
*   **Direct Registration Protocol:** Hardware activation must lead directly from tap to the registration form. Do NOT implement intermediate "authenticating" screens, timers, or provisional tokens that create a risk of user lockout.

## Input Validation & Integrity
*   **Input Validation:** ALL API endpoints MUST use `zod` for schema validation. Never trust raw input from `req.json()` or `searchParams`.
*   **Full-Fidelity Notifications:** Purchase and RT notifications to Discord/Mail MUST include all actionable data (Shipping Address, Contact Info, Amount) required for human fulfillment.
*   **Transaction Integrity:** Financial or RT-related operations must use Prisma transactions (`$transaction`) with explicit balance checks to prevent negative values.
*   **UID Normalization:** All NFC UIDs must be normalized to "Uppercase, No Colons" (e.g., `04A23B...`) before database storage or lookup.

## Workspace Integrity
*   **Professional Cleanliness:** Do not leave temporary files, logs, or "junk" files (e.g., `.txt`, `.html`) in the root directory. Use `.gitignore` for local-only files.
*   **Brand Consistency:** Use `grep` or similar tools to ensure forbidden words (聖域, 深淵, etc.) are not introduced in copy or mock data.
*   **Absolute iOS Compatibility:** NEVER implement features that only work on Android (e.g., WebNFC). The primary user and target audience use iPhones. Any feature that cannot be executed on iOS/Safari must be discarded or replaced with a cross-platform solution.

## Rendering Stability & Safari Enforcement
*   **Zero-Canvas Layout Policy:** NEVER use full-screen `<canvas>` elements for background or layout-level interactions. They cause GPU stalls and "ghosting" artifacts on Safari iOS.
*   **CSS-First Aesthetics:** Use pure CSS (`radial-gradient`, `linear-gradient`) and DOM-based animations (Framer Motion) for layout visuals. These are GPU-optimized and stable on WebKit.
*   **Filter Restriction:** Avoid `backdrop-filter: blur()` and `drop-shadow` on high-frequency moving parts or fixed layout layers. They are the primary causes of rendering crashes on iPhone.
*   **Cache Hygiene:** Do not implement Service Workers (PWA) unless explicitly requested. They create a "cache trap" that prevents security patches and Safari bug fixes from reaching the user.

