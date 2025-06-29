import React, { useState, useEffect } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TranslatedTextProps {
  text: string;
  originalLanguage?: string;
  className?: string;
  showTranslateButton?: boolean;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  originalLanguage = 'en',
  className = '',
  showTranslateButton = false
}) => {
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslated, setIsTranslated] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const needsTranslation = currentLanguage.code !== originalLanguage && currentLanguage.code !== 'en';

  useEffect(() => {
    if (needsTranslation && !isTranslated) {
      handleTranslate();
    } else if (!needsTranslation) {
      setTranslatedText(text);
      setIsTranslated(false);
    }
  }, [currentLanguage.code, text, needsTranslation]);

  const handleTranslate = async () => {
    if (needsTranslation) {
      try {
        const translated = await translateText(text, currentLanguage.code);
        setTranslatedText(translated);
        setIsTranslated(true);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text);
      }
    }
  };

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  if (isTranslating) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-gray-500 text-sm">Translating...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <span>{showOriginal ? text : translatedText}</span>
      
      {isTranslated && showTranslateButton && (
        <div className="mt-2 flex items-center space-x-2">
          <button
            onClick={toggleOriginal}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <Languages className="w-3 h-3" />
            <span>{showOriginal ? 'Show translation' : 'Show original'}</span>
          </button>
          <span className="text-xs text-gray-500">
            • Translated from {originalLanguage.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default TranslatedText;