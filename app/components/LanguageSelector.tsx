// app/components/LanguageSelector.tsx
'use client';

import { useProjectStore } from '../store/useProjectStore';

const languages = ['en', 'fr', 'sp', 'jp'] as const;

export default function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage } = useProjectStore();

  return (
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value as typeof languages[number])}
      className="w-full p-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded text-stone-700 dark:text-stone-200"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
}
