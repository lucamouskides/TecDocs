'use client';

export interface GlobalStyles {
  primaryColor: string;
  headingFont: string;
}

interface GlobalStylesPanelProps {
  styles: GlobalStyles;
  onUpdate: (newStyles: GlobalStyles) => void;
}

export default function GlobalStylesPanel({ styles, onUpdate }: GlobalStylesPanelProps) {
  const handleStyleChange = (key: keyof GlobalStyles, value: string) => {
    onUpdate({ ...styles, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Primary Color */}
      <div>
        <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
          Primary Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            id="primaryColor"
            value={styles.primaryColor || '#0000ff'}
            onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
            className="h-8 w-8 rounded border-gray-300"
          />
          <input
             type="text"
             value={styles.primaryColor || '#0000ff'}
             onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
             className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
           />
        </div>
      </div>

      {/* Heading Font */}
      <div>
        <label htmlFor="headingFont" className="block text-sm font-medium text-gray-700">
          Heading Font
        </label>
        <select
          id="headingFont"
          value={styles.headingFont || 'sans-serif'}
          onChange={(e) => handleStyleChange('headingFont', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="system-ui, sans-serif">System Default</option>
          <option value="Georgia, serif">Georgia (Serif)</option>
          <option value="Times New Roman, serif">Times New Roman (Serif)</option>
          <option value="Arial, sans-serif">Arial (Sans-Serif)</option>
          <option value="Verdana, sans-serif">Verdana (Sans-Serif)</option>
          <option value="Courier New, monospace">Courier New (Monospace)</option>
        </select>
      </div>
    </div>
  );
}