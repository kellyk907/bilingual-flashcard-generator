import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

const SAMPLE = {
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

  const remove = (i) => {
    setCards(cards.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#4f46e5', marginBottom: '10px' }}>
        {t('title') || 'Bilingual Flashcards'}
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        English → {lang === 'es' ? 'Español' : '中文'}
      </p>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
          style={{
            padding: '10px 20px',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          {i18n.language === 'zh' ? 'Español' : '中文'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '10px', marginBottom: '30px' }}>
        <input
          value={en}
          onChange={(e) => setEn(e.target.value)}
          placeholder="English word"
          style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          onKeyPress={(e) => e.key === 'Enter' && add()}
        />
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={lang === 'es' ? 'Español' : '中文'}
          style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
          onKeyPress={(e) => e.key === 'Enter' && add()}
        />
        <button
          onClick={add}
          style={{
            padding: '12px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          {t('addCard') || 'Add Card'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {cards.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
            {t('noCards') || 'No cards yet. Add one!'}
          </p>
        ) : (
          cards.map((c, i) => (
            <div
              key={i}
              onClick={() => setFlip({ ...flip, [i]: !flip[i] })}
              style={{
                height: '180px',
                perspective: '1000px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: flip[i] ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Front */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {c.en}
                  </p>
                </div>
                {/* Back */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  color: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  transform: 'rotateY(180deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {c.target}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cards.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => setCards([])}
            style={{
              padding: '10px 20px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            {t('clearAll') || 'Clear All'}
          </button>
        </div>
      )}
    </div>
  );
}
