export default function Stopka() {
  return (
    <a
      href="https://fakecrime.bio/czerwony"
      target="_blank"
      rel="noopener noreferrer"
      className="watermark"
    >
      zrobione z miłością przez czerwonego
      <img src={`${import.meta.env.BASE_URL}umbreon.png`} alt="umbreon" className="watermark-icon" />
    </a>
  );
}
