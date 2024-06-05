"use client";

import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const UserModal = ({ showModal, setShowModal, user, blockUserAccount, activateUserAccount }) => {
    if (!showModal || !user) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-[#438DB8]">User Information</h3>
                    <button className="p-2" onClick={() => setShowModal(false)}>
                        <IoCloseSharp size={24} color="#7E7E7E" />
                    </button>
                </div>
                <div className="mt-2 p-3">
                    <img src={user.img_url ? user.img_url : "/profile_avatar.png"} alt="avatar" className="w-[100px] h-[100px] rounded-full mx-auto mb-7 object-contain" />
                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>Role:</strong> {user.role}</p>
                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>Company Name:</strong> {user.company_name}</p>

                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>BIN:</strong> {user.bin ? user.bin : 123456789123}</p>

                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>Email:</strong> {user.email}</p>
                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>Name:</strong> {user.name}</p>

                    <p className="text-[17px] text-gray-700 mb-[4px]"><strong>Status:</strong> {user.is_active ? "Active" : "Not Active"}</p>

                </div>
                <div className="mt-4">

                    <button
                        className={`${user.status === 'blocked' || user.status === 'active' ? 'hidden' : ''} px-4 py-2 bg-[#77DD77] text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-[#5ACE5A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        onClick={() => activateUserAccount(user.id)}>
                        Activate
                    </button>

                    <button
                        className={`${user.status === 'pending' || user.status === 'blocked' ? 'hidden' : ''} px-4 py-2 bg-[#DD5152] text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-[#AB2E2B] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        onClick={() => blockUserAccount(user.id)}>
                        Block
                    </button>

                    <button
                        className={`${user.status === 'pending' || user.status === 'active'  ? 'hidden' : ''} px-4 py-2 bg-[#FFA500] text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-[#E27C00] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        onClick={() => activateUserAccount(user.id)}>
                        Unblock
                    </button>

                </div>
        </div>
        </div>
    );
}

export default UserModal;