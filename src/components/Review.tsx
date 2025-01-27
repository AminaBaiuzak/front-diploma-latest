import { useQuery } from "@tanstack/react-query";
import Loader from "react-spinners/PuffLoader";
import {GoStar, GoStarFill} from "react-icons/go";
import { getStoreUser } from "@/services/auth";
import { useEffect, useState } from "react";

const Review = ({ review }) => {
    const [storeName, setStoreName] = useState('Sample Store')

    const { data: storeData, isLoading: storeLoading, isError: storeError } = useQuery({
        queryKey: ["profile_store_name"],
        queryFn: () => {
            const token = localStorage.getItem("duken");
            if (!token) {
                throw new Error("No token found");
            }

            return getStoreUser(review.store_id);
        },
    });

    useEffect(() => {
        if (storeData !== undefined){
            setStoreName(String(storeData))
        }
    })

    if (storeLoading) return <Loader color={"#367193"} loading={true} size={50} className="m-auto mt-7" />;
    if (storeError) return <p>An error occurred while loading reviews.</p>;

    return (
        <div className="mt-[7px]">
            <div key={review.id} className="border border-[#bcbcbe] p-[10px] rounded-[10px]">

                <div className={'flex'}>
                    <p>By &nbsp; </p>
                    <p className="font-bold">{storeName}</p>
                </div>

                <div className="flex gap-[5px] mt-2">
                    {[...Array(review.rating)].map((_, index) => (
                        <GoStarFill key={index} size={18} color="#FFC350CC" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, index) => (
                        <GoStar key={index} size={18} color="#FFC350CC" />
                    ))}
                </div>

                <p className={'border-t border-l border-r mt-4 p-2 rounded-[10px]'}>{review.text}</p>

            </div>
        </div>
    );
};

export default Review;
