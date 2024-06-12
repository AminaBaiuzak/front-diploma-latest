import Image from "next/image";

// export default function Footer() {
//   return (
//     <footer className="px-32 pt-16 pb-24 flex gap-8 border-t border-[#00000021]">
//       <div className=" flex-1 flex-col justify-between flex">
//         <p className=" text-main font-montserrat font-bold">Duken</p>
//         <p className=" text-main font-outfit text-[#21212180]">
//           © Copyright 2024 Duken Group,
//           <br />
//           Inc. All rights reserved. All registered  trademarks herein are the property of  their respective owners. 
//         </p>
//       </div>
//       <div className=" flex-1 border-t border-[#14172133]">
//         <p className=" text-main font-montserrat font-bold mt-4">Contact</p>
//         <p className=" text-main font-outfit mt-8">Phone: +7-777-77-77</p>
//         <p className=" text-main font-outfit mt-2">Email: info@duken.kz</p>
//       </div>
//       <div className=" flex-1 border-t border-[#14172133]">
//         <p className=" text-main font-montserrat font-bold mt-4">Address</p>
//         <p className=" text-main font-outfit mt-8">Mangilik El Avenue, 55/11</p>
//       </div>
//       <div className=" flex-1 border-t border-[#14172133]">
//         <p className=" text-main font-montserrat font-bold mt-4">Network</p>
//         <div className="mt-8 flex gap-3 h-[35px]">
//           <img src="/facebook.png" alt="" className="w-[35px] h-[35px]" />
//           <img src="/insta.png" alt="" className="w-[35px] h-[35px]" />
//         </div>
//       </div>
//     </footer>
//   );
// }

export default function Footer() {
    return (
        <footer className="px-8 md:px-32 pt-8 md:pt-16 pb-16 md:pb-24 flex flex-col md:flex-row gap-8 border-t border-[#00000021]">
            <div className="flex-1 flex-col justify-between flex mb-2 md:mb-0">
                <p className="text-main font-montserrat font-bold">Duken</p>
                <p className="text-main font-outfit text-[#21212180] leading-relaxed">
                    © Copyright 2024 Duken Group,
                    <br />
                    Inc. All rights reserved.
                     All registered
                     trademarks herein are the property of
                     their respective owners.
                </p>
            </div>
            <div className=" flex-1 border-t border-[#14172133]">
                <p className="text-main font-montserrat font-bold mt-4">Contact</p>
                <p className="text-main font-outfit mt-4 md:mt-8">Phone: +7-777-77-77</p>
                <p className="text-main font-outfit mt-2">Email: info@duken.kz</p>
            </div>
            <div className=" flex-1 border-t border-[#14172133]">
                <p className="text-main font-montserrat font-bold mt-4">Address</p>
                <p className="text-main font-outfit mt-4 md:mt-8">Mangilik El Avenue, 55/11</p>
            </div>
            <div className=" flex-1 border-t border-[#14172133]">
                <p className="text-main font-montserrat font-bold mt-4">Network</p>
                <div className="mt-4 md:mt-8 flex gap-3 h-[35px]">
                    <img src="/facebook.png" alt="Facebook" className="w-[35px] h-[35px]" />
                    <img src="/insta.png" alt="Instagram" className="w-[35px] h-[35px]" />
                </div>
            </div>
        </footer>
    );
}

