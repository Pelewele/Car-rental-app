import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";

export function Header({
  title,
  back,
  action,
}: {
  title?: string;
  back?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="topbar-side">
        {back ? (
          <button className="icon-btn" onClick={back} aria-label="Go back">
            <Icon name="back" />
          </button>
        ) : (
          <Logo />
        )}
      </div>
      {title && <strong>{title}</strong>}
      <div className="topbar-side end">{action}</div>
    </header>
  );
}
