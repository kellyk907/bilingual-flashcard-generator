import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#4f46e5' }}>
        Bilingual Flashcard Generator
      </h1>
      <p style={{ color: '#666', margin: '20px 0' }}>
        App is working! Count: {count}
      </p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '12px 24px',
          background: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem'
        }}
      >
        Click Me
      </button>
    </div>
  );
}
