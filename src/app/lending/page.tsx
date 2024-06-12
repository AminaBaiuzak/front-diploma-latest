'use client';

import {useSearchParams} from "next/navigation";
import { useRouter } from "next/navigation";

export default function Lending(){
    const router = useRouter();

    const handleButtonClick = (role) => {
        router.push(`/registration/?role=${role}`);
    };

    return (
        <>
            <div className={"bg-[url('/lending.png')] w-full bg-cover bg-center pt-20 pl-20"}>
                <div className="font-outfit font-semibold text-[76px] text-white leading-tight ml-20">
                    <div>Connecting</div>
                    <div>distributors &</div>
                    <div>shops</div>
                </div>
                <div className="font-outfit font-light text-[22px] text-white ml-20 mt-5 mb-10">
                    <div className="leading-tight">
                    <div>Duken is a business marketplace aimed at connecting distributors</div>
                    <div>and shops to make it easier to establish efficient and beneficial partnerships.</div>
                    </div>
                </div>


                <div className="flex gap-[20px] ml-20 mb-20">

                    <div className="border p-2 border-[4px] justify-center items-center px-10 py-5 rounded-[3px]"
                         style={{'backgroundColor': "#367193", 'color': "white", 'borderColor': "white"}}
                         onClick={() => {handleButtonClick('distributor')} }
                         >
                        <p className={'text-center font-semibold'}>I AM DISTRIBUTOR</p>
                    </div>

                    <div className="border border-[4px] justify-center items-center px-10 py-3 rounded-[3px]"
                         style={{'backgroundColor': "white", 'color': "#367193", 'borderColor': "#367193"}}
                         onClick={() => {handleButtonClick('store')} }
                         >
                            <div className="text-center font-bold">
                                <div>I AM SHOP</div>
                                <div>REPRESENTATIVE</div>
                            </div>
                    </div>

                </div>

            </div>

        </>
    )
}