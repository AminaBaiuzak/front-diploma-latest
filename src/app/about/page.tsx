"use client";

export default function About() {
    return (
        <div className={"pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex font-outfit  items-center"}>
            <div className="bg-white w-full h-full rounded-lg px-[50px] border border-[#EBEBEE] shadow-md flex flex-col gap-[16px] py-[50px] relative">
                <div className="flex pt-[25px] px-[30px] pb-[30px] border-b border-[#21212180]">
                    <div className="flex flex-col flex-1 pr-[20px]">
                            <span className=" font-montserrat font-semibold text-[26px]">About Us</span>
                            <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                                <p className=" font-outfit text-[16px]">Welcome to
                                    <span className="text-[#438DB8] font-semibold"> Duken</span>,
                                    the premier digital solution for distributors and shops in Kazakhstan. Our mission is to revolutionize the way businesses manage their supply chains, making distribution processes more efficient, transparent, and profitable.</p>
                            </div>

                            <span className=" font-montserrat font-semibold text-[26px]">Our Vision</span>
                            <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                                <p className=" font-outfit text-[16px]">We envision a future where distribution is seamless, data-driven, and highly efficient. By leveraging cutting-edge technology and industry expertise, we aim to create a marketplace that connects distributors and shops in a way that maximizes value for all parties involved.</p>
                            </div>

                            <span className=" font-montserrat font-semibold text-[26px]">Our Mission</span>
                            <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                                <p className=" font-outfit text-[16px]">Our mission is to empower businesses by providing a robust platform that offers comprehensive tools for order management, inventory tracking, and data analytics. We are committed to delivering exceptional service and continuous innovation to help our clients thrive in a competitive market.</p>
                            </div>

                            <span className=" font-montserrat font-semibold text-[26px]">Join Us</span>
                            <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[5px] mt-[10px]">
                                <p className=" font-outfit text-[16px]">Join the growing community of distributors and shops who have transformed their businesses with
                                    <span className="text-[#438DB8] font-semibold"> Duken</span>.
                                    Together, we can achieve greater efficiency, profitability, and success.</p>
                            </div>


                        </div>
                </div>
            </div>
        </div>
    )
}