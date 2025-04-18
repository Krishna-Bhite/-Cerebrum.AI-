import React, { Children } from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="auth-layout">{children}</div>;
};

export default layout;
