"use client";

import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import {useQuery} from "@tanstack/react-query";
import {getDistributorUser, getStoreUser} from "@/services/auth";

export default function ReviewInProfile({ review, role, onDelete }) {
    const { distributor_id, store_id, rating, text, id } = review;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: distributorName, isLoading: distributorNameLoading, isError: distributorNameError } = useQuery({
        queryKey: ["distributor_name", distributor_id],
        queryFn: () => {
            const token = localStorage.getItem("duken");
            if (!token) {
                throw new Error("No token found");
            }
            return getDistributorUser(distributor_id);
        },
    });

    const { data: storeName, isLoading: storeNameLoading, isError: storeNameError } = useQuery({
        queryKey: ["store_name", store_id],
        queryFn: () => {
            const token = localStorage.getItem("duken");
            if (!token) {
                throw new Error("No token found");
            }
            return getStoreUser(store_id);
        },
    });

    console.log(storeName, store_id)

    const confirmDelete = () => {
        onDelete(Number(id));
        setShowDeleteModal(false);
    };

    return (
        <div className="w-full rounded-[7px] border border-[#222831] border-opacity-20 pt-[5px] pb-[10px] px-[10px] relative">

            {role === "store" && (
                <button
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1"
                    onClick={() => setShowDeleteModal(true)}
                >
                    <MdDelete />
                </button>
            )}

            <p className="text-[#413B89] text-[14px] font-outfit font-medium">{role === 'store' ? `For ${distributorName}` : `${storeName}`}</p>

            <div className="flex gap-[4px] mt-1">
                {Array(5).fill(0).map((_, index) => (
                    <GoStarFill
                        key={index}
                        size={20}
                        color={index < rating ? "#FFB525" : "#49454FCC"}
                    />
                ))}
            </div>

            <p className="font-outfit text-[#222831] mt-1 text-[14px] border p-3 bg-[#FEFBF6] bg-opacity-50 rounded-lg">
                {text}
            </p>

            {showDeleteModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <p>Are you sure you want to delete this review?</p>
                        <div className="flex justify-center mt-2">
                            <button className="px-2 py-1 bg-red-500 text-white mr-2" onClick={confirmDelete}>
                                Yes
                            </button>
                            <button className="px-2 py-1 bg-gray-300" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

