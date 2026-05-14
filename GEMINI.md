# Hexa Relation Project Guidelines

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
    *   This applies even in development to prevent accidental token consumption.
    *   The wording should remain within the "Minimal/Chic" aesthetic (e.g., "Confirm Resonance", "Deepen Connection", "Authorize Finality").
*   **Input Validation:** ALL API endpoints MUST use `zod` for schema validation. Never trust raw input from `req.json()` or `searchParams`.
*   **Transaction Integrity:** Financial or RT-related operations must use Prisma transactions (`$transaction`) with explicit balance checks to prevent negative values.
*   **NFC Smart Routing:** The entry point `/api/card/[uid]` must intelligently route users:
    *   `Owner` -> `/hub` (Dashboard)
    *   `Others` -> `/p/[slug]` (Public Profile)
    *   `Unregistered` -> `/activate` (Registration)
*   **UID Normalization:** All NFC UIDs must be normalized to "Uppercase, No Colons" (e.g., `04A23B...`) before database storage or lookup.

## Workspace Integrity
*   **Professional Cleanliness:** Do not leave temporary files, logs, or "junk" files (e.g., `.txt`, `.html`) in the root directory. Use `.gitignore` for local-only files.
*   **Brand Consistency:** Use `grep` or similar tools to ensure forbidden words (聖域, 深淵, etc.) are not introduced in copy or mock data.
