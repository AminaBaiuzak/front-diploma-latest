"use client";

import {useEffect, useState} from "react";
import Contact from "@/components/Contact";

export default function ContactPage() {

    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        const userToken = localStorage.getItem("duken");

        if (userToken) {
            setIsUser(true)
        }
    }, []);

    return (
        <Contact isUser={isUser}/>
    )
}