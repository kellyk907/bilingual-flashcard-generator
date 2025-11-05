import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

const SAMPLE = {
  es: [
    { en: "Hello", target: "Hola" },
    { en: "Water", target: "Agua" }
  ],
  zh: [
    { en: "Hello", target: "你好" },
    { en: "Water", target: "水" }
  ]
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [cards, setCards] = useState([]);
  const [en, setEn] = useState('');
  const [target, setTarget] = useState('');
  const [flip, setFlip] = useState({});
  const lang = i18n.language === 'zh' ? 'zh' : 'es';

  useEffect(() => {
    const saved = localStorage.getItem(`cards_${lang}`);
    setCards(saved ? JSON.parse(saved) : SAMPLE[lang]);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(`cards_${lang}`, JSON.stringify(cards));
  }, [cards, lang]);

  const add = () => {
    if (en.trim() && target.trim()) {
      setCards([...cards, { en, target }]);
      setEn(''); setTarget('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-2">
          {t('title')}
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            {i18n.language === 'zh' ? 'Español' : '中文'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              value={en}
              onChange={(e) => setEn(e.target.value)}
              placeholder="English"
              className="p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-indigo-500 outline-none"
            />
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={lang === 'es' ? 'Español' : '中文'}
              className="p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={add}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition"
          >
            Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              onClick={() => setFlip({ ...flip, [i]: !flip[i] })}
              className="relative h-48 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div className={`absolute inset-0 transition-transform duration-700 ${flip[i] ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center p-6 backface-hidden">
                  <p className="text-2xl font-bold text-center">{c.en}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 rotate-y-180 backface-hidden">
                  <p className="text-2xl font-bold text-center">{c.target}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCards(cards.filter((_, idx) => idx !== i)); }}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
