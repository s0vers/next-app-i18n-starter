import React from "react";

interface OmitRTLProps {
  children: React.ReactNode;
  omitRTL?: boolean;
}

const OmitRTL: React.FC<OmitRTLProps> = ({ children, omitRTL = true }) => {
  const dir = omitRTL ? "ltr" : "inherit";

  return (
    <div style={{ direction: dir, unicodeBidi: "isolate" }}>{children}</div>
  );
};

export default OmitRTL;
