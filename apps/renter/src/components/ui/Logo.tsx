export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo ${inverse ? "inverse" : ""}`}>
      <span className="logo-mark"><span /></span>
      <span>KasaRide</span>
    </div>
  );
}
