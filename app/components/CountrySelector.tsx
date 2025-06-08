'use client';

import { useProjectStore } from '../store/useProjectStore';

const countries = ['helium-us', 'helium-ca', 'helium-mx', 'helium-jp'] as const;

export default function CountrySelector() {
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();

  return (
    <select
      value={selectedProjectId}
      onChange={(e) => setSelectedProjectId(e.target.value as typeof countries[number])}
      className="w-full p-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded text-stone-700 dark:text-stone-200"
    >
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
