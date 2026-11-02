import type { ReactNode } from "react";
import type { Screen } from "../../types";
import { BottomNav } from "./BottomNav";

export function Page({
  children,
  nav,
  go,
  className = "",
}: {
  children: ReactNode;
  nav?: string;
  go?: (s: Screen) => void;
  className?: string;
}) {
  return (
    <div className={`app-shell ${nav ? "with-nav" : ""} ${className}`}>
      <main>{children}</main>
      {nav && go && <BottomNav active={nav} go={go} />}
    </div>
  );
}
