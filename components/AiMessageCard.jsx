import React from 'react'
import { LuBot } from "react-icons/lu";
import { FaUser } from "react-icons/fa";

const AiMessageCard = ({idx}) => {
    return (
        <div className={`w-full flex items-center ${idx.role=== 'User'?"justify-end":"justify-start"} mb-5`}>
            <div className={`ml-5 mt-5  w-[80%] min-h-[10%] flex items-end ${idx.role=== 'User'?"justify-end mr-5":"justify-start"} gap-4 `}>
                <div className={`w-10 h-10 ${idx.role=== 'User'?"bg-gray-300":"bg-[#BFDBFE]"}  flex justify-center items-center rounded-full shadow-md`}>
                    {idx.role === 'User'?<FaUser size={24} className='text-gray-700' />:<LuBot className='text-[#2563eb]' size={32}  />}
                </div>
                <div className='max-w-[85%] px-5 bg-white rounded-2xl border shadow-xl py-2 font-semibold text-lg'>
                    {idx.content}
                </div>
            </div>
        </div>
        
    )
}

export default AiMessageCard