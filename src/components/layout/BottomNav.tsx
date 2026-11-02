import type { Screen } from "../../types";
import { Icon } from "../ui/Icon";

export function BottomNav({
  active,
  go,
}: {
  active: string;
  go: (s: Screen) => void;
}) {
  const items: [string, string, Screen][] = [
    ["home", "Home", "home"],
    ["search", "Search", "results"],
    ["trips", "Trips", "trips"],
    ["user", "Profile", "profile"],
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(([icon, label, screen]) => (
        <button
          key={label}
          className={active === screen ? "active" : ""}
          onClick={() => go(screen)}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
