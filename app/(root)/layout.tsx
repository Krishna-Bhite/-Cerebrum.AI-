import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { use } from "react";
import NavBar from "../../components/NavBar";

const Rootlayout = async({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //Rout protect
  const session = await isAuthenticated();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="logo" width={40} height={40}/>
          <h2 className="text-primary-200">Cerebrum.AI</h2>
        </Link>
        <NavBar/>
      </nav>
      {children}
    </div>
  );
};

export default Rootlayout;
