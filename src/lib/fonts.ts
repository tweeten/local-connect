export const fonts = {
  body: {
    family: "Source Sans 3",
    cssVar: "var(--font-sans)",
    weights: [400, 500, 600, 700] as const,
  },
  display: {
    family: "Fraunces",
    cssVar: "var(--font-serif)",
    weights: [400, 500, 600, 700] as const,
    // Optical size ranges:
    //   opsz 9–12  → body-adjacent use (captions, small labels)
    //   opsz 72+   → wordmark, hero headings
    opticalSizeBody: "9 12",
    opticalSizeDisplay: "72 144",
  },
} as const;

// Preload URL — already injected via @import in styles.css.
// Export for any runtime head-injection needs (e.g. SSR <link> tags).
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap";

// Tailwind utility class names for convenience
export const fontClass = {
  display: "font-display",
  body: "font-body",
} as const;
