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
  const lang = i18n.language === 'zh' ? 'zh' : 'es';

  useEffect(() => {
    const saved = localStorage.getItem(`cards_${lang}`);
    setCards(saved ? JSON.parse(saved) : SAMPLE[lang]);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(`cards_${lang}`, JSON.stringify(cards));
  }, [cards, lang]);

  const add = () => {
    if (en && target) {
      setCards([...cards, { en, target }]);
      setEn(''); setTarget('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#4f46e5' }}>
        {t('title') || 'Bilingual Flashcards'}
      </h1>

      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
          style={{ padding: '10px 20px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          {i18n.language === 'zh' ? 'Español' : '中文'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <input value={en} onChange={e => setEn(e.target.value)} placeholder="English" style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder={lang === 'es' ? 'Español' : '中文'} style={{ padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
        <button onClick={add} style={{ padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px' }}>
          {t('addCard') || 'Add Card'}
        </button>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ padding: '16px', background: '#f3e8ff', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>{c.en} → {c.target}</p>
            <button
              onClick={() => setCards(cards.filter((_, idx) => idx !== i))}
              style={{ marginTop: '8px', background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
            >
             
