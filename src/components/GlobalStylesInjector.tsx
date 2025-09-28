'use client';

import { type GlobalStyles } from './GlobalStylesPanel';

export default function GlobalStylesInjector({ styles }: { styles: GlobalStyles }) {
  return (
    <style jsx global>{`
      :root {
        --primary-color: ${styles.primaryColor || '#4A90E2'};
        --heading-font: ${styles.headingFont || 'system-ui, sans-serif'};
      }
      h1, h2, h3, .prose h1, .prose h2, .prose h3, .prose h4 {
        font-family: var(--heading-font);
      }
    `}</style>
  );
}