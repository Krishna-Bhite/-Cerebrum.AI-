"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: "dashboard",
    link: "/home",
  },
  {
    name: "ATS Checker",
    icon: "settings",
    link: "/ats-checker",
  },
  {
    name: "Course Recommendation",
    icon: "profile",
    link: "/course-recommendation",
  },

  {
    name: "Cover Letter",
    icon: "interview",
    link: "/cover-letter",
  },
];

export function NavBar() {
  const pathName = usePathname();
  return (
    <Sheet>
      <SheetTrigger>
        <Image src={"/Ham.svg"} alt="menu" height={30} width={30} className="text-white"/>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="border-none bg-gradient-to-b from-[#1a1918] to-[#0a0a0a] w-[325px]"
      >
        <SheetTitle className="hidden">
          Added cause it was required but made it hidden
        </SheetTitle>

        <div className="h-full flex flex-col p-7">
          {/* Header */}
          <div className="flex gap-2 mb-[60px]">
            <Image src={"/logo.png"} alt="logo" height={20} width={40} />
            <h3>Cerebrum.AI</h3>
          </div>

          <SheetClose asChild>
            <div className="flex flex-col gap-5">
              {menuItems.map((item) => {
                const isActive = pathName === item.link;
                return (
                  <Link key={item.name} href={item.link}>
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-black",
                        { "bg-accent-100": isActive }
                      )}
                    >
                      <div>Img</div>
                      <h4 className="font-bold">{item.name}</h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NavBar;
