import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

const SAMPLE_DATA = {
  es: [
    { en: "Hello", target: "Hola" },
    { en: "Thank you", target: "Gracias" },
    { en: "Water", target: "Agua" }
  ],
  zh: [
    { en: "Hello", target: "你好" },
    { en: "Thank you", target: "谢谢" },
    { en: "Water", target: "水" }
  ]
};

function App() {
  const { t, i18n } = useTranslation();
  const [flashcards, setFlashcards] = useState([]);
  const [inputEn, setInputEn] = useState('');
  const [inputTarget, setInputTarget] = useState('');
  const [flipped, setFlipped] = useState({});
  const currentLang = i18n.language === 'zh' ? 'zh' : 'es';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`flashcards_${currentLang}`);
      setFlashcards(saved ? JSON.parse(saved) : SAMPLE_DATA[currentLang]);
    } catch {
      setFlashcards(SAMPLE_DATA[currentLang]);
    }
  }, [currentLang]);

  useEffect(() => {
    try {
      localStorage.setItem(`flashcards_${currentLang}`, JSON.stringify(flashcards));
    } catch {}
  }, [flashcards, currentLang]);

  const addCard = () => {
    if (inputEn.trim() && inputTarget.trim()) {
      setFlashcards([...flashcards, { en: inputEn, target: inputTarget }]);
      setInputEn('');
      setInputTarget('');
    }
  };

  const deleteCard = (i) => setFlashcards(flashcards.filter((_, idx) => idx !== i));
  const clearAll = () => setFlashcards([]);
  const toggleFlip = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium"
          >
            {i18n.language === 'zh' ? 'Español' : '中文'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              value={inputEn}
              onChange={(e) => setInputEn(e.target.value)}
              placeholder="English"
              className="p-3 border-2 rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && addCard()}
            />
            <input
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              placeholder={currentLang === 'es' ? 'Español' : '中文'}
              className="p-3 border-2 rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && addCard()}
            />
          </div>
          <button onClick={addCard} className="w-full py-3 bg-indigo-600 text-white rounded-xl">
            {t('addCard')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">{t('noCards')}</p>
          ) : (
            flashcards.map((card, i) => (
              <div
                key={i}
                className="relative h-48 cursor-pointer"
                onClick={() => toggleFlip(i)}
              >
                <div className={`absolute inset-0 transition-transform duration-500 ${flipped[i] ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 backface-hidden">
                    <p className="text-xl font-bold">{card.en}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 rotate-y-180 backface-hidden">
                    <p className="text-xl font-bold">{card.target}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCard(i); }}
                      className="mt-2 px-3 py-1 bg-red-600 rounded text-sm"
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
            <button onClick={clearAll} className="px-6 py-2 bg-gray-600 text-white rounded-xl">
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
