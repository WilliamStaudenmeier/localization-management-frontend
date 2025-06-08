import { create } from 'zustand';

export type ProjectId = 'helium-us' | 'helium-ca' | 'helium-mx' | 'helium-jp';
export type Language = 'en' | 'fr' | 'es' | 'ja';

export interface TranslationKey {
  id: string;
  key: string;
  category: string;
  description?: string;
  translations: {
    [languageCode: string]: {
      value: string;
      updatedAt: string;
      updatedBy: string;
    };
  };
}

interface ProjectState {
  selectedProjectId: ProjectId;
  setSelectedProjectId: (projectId: ProjectId) => void;

  user: { name: string; isAuthenticated: boolean };
  login: () => void;
  logout: () => void;

  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  translations: TranslationKey[];
  updateTranslation: (
    keyId: string,
    langCode: Language,
    newValue: string,
    updatedBy: string
  ) => void;

  fetchTranslations: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  selectedProjectId: 'helium-us',
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),

  selectedLanguage: 'en',
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  user: { name: 'Jane Doe', isAuthenticated: true },
  login: () =>
    set({
      user: { name: 'Jane Doe', isAuthenticated: true },
    }),
  logout: () =>
    set({
      user: { name: '', isAuthenticated: false },
    }),

  translations: [
    // initial dummy data for dev — you can remove or replace as needed
    {
      id: '1',
      key: 'welcome',
      category: 'general',
      description: 'Welcome message',
      translations: {
        en: {
          value: 'Welcome',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        fr: {
          value: 'Bienvenue',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        es: {
          value: 'Bienvenido',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        ja: {
          value: 'ようこそ',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
      },
    },
    {
      id: '2',
      key: 'goodbye',
      category: 'general',
      description: 'Goodbye message',
      translations: {
        en: {
          value: 'Goodbye',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        fr: {
          value: 'Au revoir',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        es: {
          value: 'Adiós',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
        ja: {
          value: 'さようなら',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
      },
    },
  ],

  updateTranslation: (keyId, langCode, newValue, updatedBy) =>
    set((state) => ({
      translations: state.translations.map((t) =>
        t.id === keyId
          ? {
              ...t,
              translations: {
                ...t.translations,
                [langCode]: {
                  value: newValue,
                  updatedAt: new Date().toISOString(),
                  updatedBy,
                },
              },
            }
          : t
      ),
    })),

    fetchTranslations: async () => {
      const { selectedProjectId, selectedLanguage, searchTerm } = get();
    
      try {
        const res = await fetch(`https://localization-api-0fci.onrender.com/localizations/${selectedProjectId}/${selectedLanguage}`);
        if (!res.ok) throw new Error('Failed to fetch translations');
    
        const json = await res.json();
        const rawData = json.localizations;
    
        type RawTranslationEntry = {
          id: string;
          key: string;
          value: string;
          updated_at: string;
          updated_by: string;
          category?: string;
        };
    
        let data = (rawData as RawTranslationEntry[]).map((entry) => ({
          id: entry.id,
          key: entry.key,
          category: entry.category || 'general',
          translations: {
            [selectedLanguage]: {
              value: entry.value,
              updatedAt: entry.updated_at,
              updatedBy: entry.updated_by,
            },
          },
        }));
    
        if (searchTerm) {
          data = data.filter((entry) =>
            entry.key.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
        set({ translations: data });
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    }
       
}));
