"use client";

import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";

export default function ReviewInProfile({ review, role, onDelete }) {
    const { reviewer_name, rating, text, _id } = review;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        onDelete(_id);
        setShowDeleteModal(false);
    };

    return (
        <div className="w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px] relative">
            {role === "store" && (
                <button
                    className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-tl-[7px] rounded-br-[7px]"
                    onClick={handleDelete}
                >
                    <MdDelete />
                </button>
            )}
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">{reviewer_name}</p>
            <div className="flex gap-[4px] mt-1">
                {Array(5).fill(0).map((_, index) => (
                    <GoStarFill
                        key={index}
                        size={20}
                        color={index < rating ? "#FFB525" : "#49454FCC"}
                    />
                ))}
            </div>
            <p className="font-outfit text-[#49454FCC] mt-1 text-[14px]">
                {text}
            </p>
            {showDeleteModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg">
                        <p>Are you sure you want to delete this review?</p>
                        <div className="flex justify-end mt-2">
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

