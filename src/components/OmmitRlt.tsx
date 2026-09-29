import type { ReactNode } from "react";

export default function OmitRTL({
  children,
  omitRTL = true,
}: {
  children: ReactNode;
  omitRTL?: boolean;
}) {
  const dir = omitRTL ? "ltr" : "inherit";

  return (
    <div style={{ direction: dir, unicodeBidi: "isolate" }}>{children}</div>
  );
}
