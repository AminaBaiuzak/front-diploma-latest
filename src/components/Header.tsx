"use client";
import Link from "next/link";
import Logout from "./Logout";
import { usePathname, useRouter } from "next/navigation";
import {useEffect, useState} from "react";
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        const userToken = localStorage.getItem("duken");

        if (userToken) {
            setIsUser(true)
        }
    }, []);

  return (
    <header className="h-[116px] flex font-montserrat items-center border-b border-[#6A7188]">

      <Link href={"/"} className="text-4xl font-bold text-[#438DB8] absolute ml-32">Duken</Link>

      <div className="flex-auto flex justify-center items-center gap-6 text-lg  font-semibold text-[#666666]">
        <Link href={"/"}>Home</Link>
        <Link href={"/about"}>About us</Link>
        <Link href={"/contact"}>Contact us</Link>
      </div>

      <div
        className={`${
          pathname === "/login" || pathname === "/registration" || (pathname === "/about" && !isUser) 
          || (pathname === "/contact" && !isUser)
              ? "hidden" : ""
        } mr-6 justify-end`}
      >
        <div
          className="w-[47px] h-[38px] border border-[#B4B4B4] rounded items-center justify-center flex cursor-pointer"
          onClick={() => {
            localStorage.removeItem("duken");
            router.replace("/login")
          }}
        >
          <Logout width={24} height={24} />
        </div>
      </div>
    </header>
  );
}
