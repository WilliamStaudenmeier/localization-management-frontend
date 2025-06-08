'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';

export default function TranslationEditor() {
  const {
    translations,
    selectedLanguage,
    selectedProjectId,
    searchTerm,
    updateTranslation,
    fetchTranslations,
    user,
  } = useProjectStore();

  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTranslations();
  }, [selectedLanguage, selectedProjectId, searchTerm, fetchTranslations]);

  const langCode = selectedLanguage;

  const filteredTranslations = translations.filter((entry) =>
    entry.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (keyId: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [keyId]: value,
    }));

    updateTranslation(keyId, selectedLanguage, value, user.name);
  };

  const handleUpdateClick = async () => {
    const updates = Object.entries(editedValues).map(([keyId, value]) => {
      const original = translations.find(t => t.id === keyId);
      return {
        project_id: selectedProjectId,
        locale: selectedLanguage,
        key: original?.key ?? '',
        value,
        updated_by: user.name,
      };
    });
  
    try {
      for (const item of updates) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/localizations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
  
        if (!res.ok) {
          const errMsg = await res.text();
          console.error(`Failed to update key "${item.key}": ${errMsg}`);
        }
      }
  
      console.log("All updates sent.");
      await fetchTranslations();
      setEditedValues({});
    } catch (error) {
      console.error('Batch update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Update Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-stone-100 dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-600">
        <div className="text-lg font-semibold text-stone-700 dark:text-stone-300">
          Editing Translations for:
        </div>
        <div className="flex items-center gap-6 text-stone-600 dark:text-stone-400 mt-2 md:mt-0">
          <div>
            <span className="font-medium">Country:</span> {selectedProjectId}
          </div>
          <div>
            <span className="font-medium">Language:</span> {selectedLanguage}
          </div>
          <button
            onClick={handleUpdateClick}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>

      {/* Translation Editor */}
      {filteredTranslations.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-4 p-3 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700"
        >
          <div className="w-1/3 font-medium text-stone-700 dark:text-stone-200">
            {entry.key}
          </div>
          <input
            type="text"
            value={editedValues[entry.id] ?? entry.translations[langCode]?.value ?? ''}
            onChange={(e) => handleInputChange(entry.id, e.target.value)}
            className="flex-grow p-2 border border-stone-300 dark:border-stone-600 rounded bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
          />
        </div>
      ))}

      {filteredTranslations.length === 0 && (
        <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
          No translation keys match your search.
        </div>
      )}
    </div>
  );
}
