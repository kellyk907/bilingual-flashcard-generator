import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

const SAMPLE_DATA = {
  es: [
    { en: "Hello", target: "Hola" },
    { en: "Thank you", target: "Gracias" },
    { en: "Water", target: "Agua" },
    { en: "School", target: "Escuela" },
    { en: "Friend", target: "Amigo" }
  ],
  zh: [
    { en: "Hello", target: "你好" },
    { en: "Thank you", target: "谢谢" },
    { en: "Water", target: "水" },
    { en: "School", target: "学校" },
    { en: "Friend", target: "朋友" }
  ]
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [flashcards, setFlashcards] = useState([]);
  const [inputEn, setInputEn] = useState('');
  const [inputTarget, setInputTarget] = useState('');
  const [flipped, setFlipped] = useState({});
  const [error, setError] = useState(null);
  const currentLang = i18n.language === 'zh' ? 'zh' : 'es';

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`flashcards_${currentLang}`);
      if (saved) {
        setFlashcards(JSON.parse(saved));
      } else {
        setFlashcards(SAMPLE_DATA[currentLang]);
      }
    } catch (err) {
      console.error('Load error:', err);
      setFlashcards(SAMPLE_DATA[currentLang]);
    }
  }, [currentLang]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`flashcards_${currentLang}`, JSON.stringify(flashcards));
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [flashcards, currentLang]);

  const addCard = () => {
    if (inputEn.trim() && inputTarget.trim()) {
      setFlashcards([...flashcards, { en: inputEn, target: inputTarget }]);
      setInputEn('');
      setInputTarget('');
    }
  };

  const deleteCard = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (window.confirm('Clear all cards?')) {
      setFlashcards([]);
    }
  };

  const toggleFlip = (index) => {
    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}. Refresh to retry.</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition"
          >
            {i18n.language === 'zh' ? '🇪🇸 Español' : '🇨🇳 中文'}
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={inputEn}
              onChange={(e) => setInputEn(e.target.value)}
              placeholder={t('front') + " (English)"}
              className="p-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addCard()}
            />
            <input
              type="text"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              placeholder={t('back') + ` (${currentLang === 'es' ? 'Español' : '中文'})`}
              className="p-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addCard()}
            />
          </div>
          <button
            onClick={addCard}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            {t('addCard')}
          </button>
        </div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 italic">{t('noCards')}</p>
          ) : (
            flashcards.map((card, i) => (
              <div
                key={i}
                className="relative h-48 cursor-pointer group"
                onClick={() => toggleFlip(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleFlip(i)}
              >
                <div 
                  className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${flipped[i] ? 'rotate-y-180' : ''}`} 
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 backface-hidden">
                    <p className="text-2xl font-bold text-center">{card.en}</p>
                    <p className="text-sm mt-2 opacity-75">Click to flip</p>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 rotate-y-180 backface-hidden">
                    <p className="text-2xl font-bold text-center" dir={currentLang === 'zh' ? 'ltr' : 'auto'}>{card.target}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCard(i); }}
                      className="mt-4 px-4 py-1 bg-red-600 rounded-full text-sm hover:bg-red-700 transition"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {flashcards.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
            >
              {t('clearAll')}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-12">
          Built by Kelly Kroeper, MPH | React + Tailwind | <a href="https://kellyk907.github.io/portfolio/" className="underline">Portfolio</a>
        </p>
      </div>
    </div>
  );
}
