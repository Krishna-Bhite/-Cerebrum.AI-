import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React, { Children } from "react";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //Rout protect
  const session = await isAuthenticated();
  if (session) {
    redirect("/home");
  }
  return <div className="auth-layout">{children}</div>;
};

export default layout;
