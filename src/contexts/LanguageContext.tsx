import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  availableLanguages: Language[];
  changeLanguage: (languageCode: string) => void;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    const detectedLanguage = availableLanguages.find(lang => lang.code === browserLang);
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('neighborly_language');
    const preferredLanguage = savedLang 
      ? availableLanguages.find(lang => lang.code === savedLang)
      : detectedLanguage;

    if (preferredLanguage) {
      setCurrentLanguage(preferredLanguage);
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('neighborly_language', languageCode);
    }
  };

  // Mock translation function - in a real app, this would call Google Translate API
  const translateText = async (text: string, targetLanguage?: string): Promise<string> => {
    const target = targetLanguage || currentLanguage.code;
    
    if (target === 'en') {
      return text; // No translation needed for English
    }

    setIsTranslating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock translations for demo purposes
      const mockTranslations: Record<string, Record<string, string>> = {
        'es': {
          'Need help with grocery shopping': 'Necesito ayuda con las compras',
          'Math tutoring for high school student': 'Tutoría de matemáticas para estudiante de secundaria',
          'Furniture donation pickup': 'Recogida de donación de muebles',
          'Computer repair assistance': 'Asistencia para reparación de computadoras',
          'Companion for elderly parent': 'Compañía para padre anciano',
          'Dog walking service needed': 'Se necesita servicio de paseo de perros',
          'Piano lessons for beginner': 'Clases de piano para principiantes',
          'Garden tools to donate': 'Herramientas de jardín para donar'
        },
        'fr': {
          'Need help with grocery shopping': 'Besoin d\'aide pour faire les courses',
          'Math tutoring for high school student': 'Tutorat en mathématiques pour lycéen',
          'Furniture donation pickup': 'Collecte de don de meubles',
          'Computer repair assistance': 'Assistance pour réparation d\'ordinateur',
          'Companion for elderly parent': 'Compagnon pour parent âgé',
          'Dog walking service needed': 'Service de promenade de chien nécessaire',
          'Piano lessons for beginner': 'Cours de piano pour débutant',
          'Garden tools to donate': 'Outils de jardinage à donner'
        },
        'de': {
          'Need help with grocery shopping': 'Hilfe beim Einkaufen benötigt',
          'Math tutoring for high school student': 'Mathe-Nachhilfe für Gymnasiasten',
          'Furniture donation pickup': 'Möbelspende abholen',
          'Computer repair assistance': 'Computer-Reparatur-Hilfe',
          'Companion for elderly parent': 'Begleitung für ältere Eltern',
          'Dog walking service needed': 'Hundeausführ-Service benötigt',
          'Piano lessons for beginner': 'Klavierunterricht für Anfänger',
          'Garden tools to donate': 'Gartenwerkzeuge zu spenden'
        }
      };

      const translated = mockTranslations[target]?.[text] || `[${target.toUpperCase()}] ${text}`;
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages,
      changeLanguage,
      translateText,
      isTranslating
    }}>
      {children}
    </LanguageContext.Provider>
  );
};