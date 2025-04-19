import Image from "next/image";
import Link from "next/link";
import React from "react";

const Rootlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="root-layout">
      <nav>
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="logo" width={40} height={40}/>
          <h2 className="text-primary-200">Cerebrum.AI</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Rootlayout;
