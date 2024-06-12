"use client";
import Link from "next/link";
import Logout from "./Logout";
import { usePathname, useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {FaPhoneAlt, FaRegUserCircle} from "react-icons/fa";

export default function Header() {


    const pathname = usePathname();
    const router = useRouter();

    const role = pathname.startsWith("/distributor") ? "distributor" : "store";

    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        const userToken = localStorage.getItem("duken");

        if (userToken) {
            setIsUser(true)
        }
    }, []);

    return (
        <header className="h-[90px] flex flex-col md:flex-row font-montserrat items-center border-b border-[#6A7188] relative z-20">
            <Link href={"/login"} className="text-4xl font-bold text-[#438DB8] mt-4 md:mt-0 md:absolute md:ml-32">
                Duken
            </Link>

            <div className="flex-auto flex flex-col md:flex-row items-center md:justify-center gap-6 text-lg font-semibold text-[#666666] mt-4 md:mt-0"
                 style={pathname === '/lending' ? { display: "none" } : null}>
                <div className="flex flex-row justify-center gap-6">
                    <Link href={"/login"}>Home</Link>
                    <Link href={isUser ? `/${role}/about` : '/about'}>About us</Link>
                    <Link href={isUser ? `/${role}/contact` : '/contact'}>Contact us</Link>
                </div>
            </div>

            <div
                className={`${
                    pathname === "/login" 
                    || pathname === "/registration" 
                    || (pathname === "/about" && !isUser) 
                    || (pathname === "/contact" && !isUser) 
                    || pathname === '/lending'
                        ? "hidden"
                        : "mt-1 md:mt-0 md:mr-6"
                } md:static absolute top-4 right-4`}
            >
                <div
                    className="w-[47px] h-[38px] border border-[#B4B4B4] rounded items-center justify-center flex cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem("duken");
                        router.replace("/login");
                    }}
                >
                    <Logout width={24} height={24} />
                </div>
            </div>


            <div
                className={`${ pathname !== '/lending'
                        ? "hidden"
                        : "mt-1 md:mt-0 md:mr-6 ml-auto"
                } md:static absolute top-4 right-40`}
            >

                <div className={'flex gap-[10px]'}>
                    <div className={'flex gap-[10px] border border-gray-500 py-2 px-5 rounded-[5px] items-center justify-center text-gray-500'}
                         onClick={() => {
                             localStorage.removeItem("duken");
                             router.replace("/login");
                         }}>
                        <FaRegUserCircle size={20} />
                        <p className={'text-[16px]'}>Log in</p>
                    </div>


                    <div className={'flex gap-[10px] border border-gray-500 py-2 px-5 rounded-[5px] justify-center items-center text-gray-500'}>
                        <FaPhoneAlt  size={20}/>
                        <p className={'text-[16px]'}>+7-777-77-77</p>
                    </div>
                </div>

            </div>



        </header>
    );

}
