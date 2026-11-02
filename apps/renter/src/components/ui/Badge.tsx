import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Badge({
  children,
  gold = false,
}: {
  children: ReactNode;
  gold?: boolean;
}) {
  return (
    <span className={`badge ${gold ? "gold" : ""}`}>
      <Icon name="shield" size={13} />
      {children}
    </span>
  );
}
