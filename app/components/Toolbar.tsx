// app/components/Toolbar.tsx
'use client';

import { useProjectStore } from '../store/useProjectStore';
// Optional: install `lucide-react` for icons

export default function Toolbar() {
  const { searchTerm, setSearchTerm } = useProjectStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <input
        type="text"
        placeholder="Search translation keys..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="flex-grow p-2 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-sm text-stone-800 dark:text-stone-200"
      />
  </div>
  );
}
