import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

const SAMPLE_PAIRS = [
  { en: "Hello", es: "Hola" },
  { en: "Thank you", es: "Gracias" },
  { en: "Water", es: "Agua" },
  { en: "School", es: "Escuela" },
  { en: "Friend", es: "Amigo" }
];

export default function App() {
  const { t, i18n } = useTranslation();
  const isSpanishFirst = i18n.language === 'es';
  
  const [flashcards, setFlashcards] = useState([]);
  const [inputEn, setInputEn] = useState('');
  const [inputEs, setInputEs] = useState('');
  const [flipped, setFlipped] = useState({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      setFlashcards(JSON.parse(saved));
    } else {
      setFlashcards(SAMPLE_PAIRS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
