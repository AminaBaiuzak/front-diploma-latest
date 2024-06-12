"use client";

import {useEffect, useState} from "react";
import About from "@/components/About";

export default function AboutPageStore() {

    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        const userToken = localStorage.getItem("duken");

        if (userToken) {
            setIsUser(true)
        }
    }, []);

    return (
        <About isUser={isUser}/>
    )
}