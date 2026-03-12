// Nine Zero One Inspired Theme Tokens
// Light cream aesthetic — exactly like ninezeroonesalon.com
// Background: #fffefc cream | Text: #111111 | Accent: #fffb00 yellow

export const tokens = {
  vars: {
    // ── Backgrounds (light cream, like ninezeroonesalon.com) ──
    '--t-bg':        '#fffefc',   // Primary: cream white (exact match)
    '--t-bg-2':      '#f5f0e8',   // Alternate sections: warm cream
    '--t-bg-3':      '#ffffff',   // Cards, forms: pure white
    '--t-bg-dark':   '#111111',   // Dark panels (hero overlay bg etc.)

    // ── Text ──
    '--t-text':      '#111111',   // Primary text: near-black
    '--t-text-2':    '#555555',   // Secondary text
    '--t-text-3':    '#999999',   // Muted / placeholders

    // ── Accents ──
    '--t-accent':    '#fffb00',   // Neon yellow (ninezeroonesalon.com)
    '--t-accent-2':  '#CD9B77',   // Warm tan / gold (from ninezeroonesalon.com)

    // ── Borders ──
    '--t-border':    'rgba(0, 0, 0, 0.08)',
    '--t-border-2':  'rgba(0, 0, 0, 0.20)',

    // ── Shape: sharp everywhere ──
    '--t-radius':    '0px',

    // ── Typography ──
    '--t-font-display': 'var(--font-display), Georgia, "Times New Roman", serif',
    '--t-font-body':    'var(--font-body), "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  name: 'nine_zero_one' as const,
}
