import { useState } from 'react';

const KOD = [2, 3, 0, 4];

export default function SekretnaSiatka({ onOdblokowanie }) {
  const [postep, setPostep] = useState(0);
  const [aktywny, setAktywny] = useState(null);
  const [blad, setBlad] = useState(false);

  const klik = (i) => {
    setAktywny(i);
    setTimeout(() => setAktywny(null), 180);

    if (i === KOD[postep]) {
      const nowyPostep = postep + 1;
      if (nowyPostep === KOD.length) {
        setPostep(0);
        onOdblokowanie?.();
      } else {
        setPostep(nowyPostep);
      }
    } else {
      setBlad(true);
      setTimeout(() => setBlad(false), 300);
      setPostep(0);
    }
  };

  return (
    <div className={`sekretna-siatka ${blad ? 'blad' : ''}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`sekretny-kafelek ${aktywny === i ? 'aktywny' : ''}`}
          onClick={() => klik(i)}
        />
      ))}
    </div>
  );
}
