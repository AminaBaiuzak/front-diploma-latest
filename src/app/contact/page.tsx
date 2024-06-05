"use client";

import Link from "next/link";

export default function Contact() {
    return (
        <div className={"pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex font-outfit  items-center"}>
            <div className="bg-white w-full h-full rounded-lg px-[50px] border border-[#EBEBEE] shadow-md flex flex-col gap-[16px] py-[50px] relative">
                <div className="flex pt-[25px] px-[30px] pb-[30px] border-b border-[#21212180]">
                    <div className="flex flex-col flex-1 pr-[20px]">
                        <span className=" font-montserrat font-semibold text-[26px]">Contact Us </span>
                        <div className="pt-[21px] px-[15px] pb-[32px] mb-[25px] border rounded-[5px] mt-[10px]">
                            <p className=" font-outfit text-[16px]">Have a question or need assistance? We're here to help! Get in touch with our support team for prompt and friendly assistance. </p>
                        </div>

                        <span className=" font-montserrat text-[20px]">Customer Support</span>
                        <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                            <div className=" font-outfit text-[16px]">For general inquiries, feedback, or support, please contact our customer support team at:
                                <ul className="list-disc pl-4 mt-[10px]">
                                    <li className="mb-2">Email: duken@support.com</li>
                                    <li className="mb-2">Phone: +7-999-99-99</li>
                                    <li className="mb-2">Working Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT+5)</li>
                                </ul>
                            </div>
                        </div>

                        <span className=" font-montserrat font-semibold text-[26px]">Headquarters</span>
                        <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                            <p className=" font-outfit text-[20px] mb-[6px]">Visit us at our headquarters:</p>
                                <ul className="list-none ">
                                    <li> Duken </li>
                                    <li>Mangilik El Avenue, 55/11</li>
                                    <li>Astana, Kazakhstan</li>
                                </ul>

                        </div>

                        <span className=" font-montserrat text-[20px]">Feedback Form</span>
                        <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                            <p className=" font-outfit text-[16px]">Have feedback or suggestions? Fill out our feedback form and let us know how we're doing:
                                    <Link href={"/https://docs.google.com/forms/d/1HQeJdGdDO7Obn6m06niO0ZqKtRyEPnE2QiTnCrYrorU/viewform?ts=6659f104&edit_requested=true&hl=ru&pli=1"} className="text-[#438DB8] italic"> Feedback form</Link>
                                </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}