'use client'
import React, { useState } from 'react'

const ChatProfileCard = ({idx,id,setid,setChatData,handleDm}) => {
    const active = id===idx.id;
    return (
        <div onClick={async()=>{
            setid(idx.id)
            setChatData(idx)
            const chatId =  await handleDm(idx.id)
            console.log(chatId)
        }} className={`w-full min-h-15 ${active?'border-[#2c84db] border-l-4 bg-[#ececec] ':' hover:scale-95 hover:bg-[#f2f2f2] '} rounded-xl  flex justify-around items-center transition-all duration-300 ease-in-out`}>
            <div className=' w-[20%] h-[80%] flex items-center justify-center'>
                <div className={`rounded-full h-10 w-10 border-2 ${active?"border-gray-300":""} flex items-center justify-center font-bold transition-all duration-300 ease-in-out`}>
                    {idx.name?.trim().split(" ").slice(0,2).map(w => w[0].toUpperCase()).join("")}
                </div>
            </div>
            <div className='w-[60%] h-full text-md font font-bold flex flex-col justify-center px-2'>
                {idx.name?.charAt(0).toUpperCase() + idx.name?.slice(1)}
                <div className='text-sm font-medium text-gray-400'>
                    {idx.message ? "hello i am aryan":"Start a conversation..."}
                </div>
            </div>
            <div className='w-[20%] h-full flex flex-col items-center justify-center gap-2'>
                <div className='text-xs px-2 text-gray-400'>
                    2h
                </div>
                <div className='text-sm h-5 w-5 rounded-full flex items-center justify-center bg-[#dcfce7] font-semibold text-gray-600'>
                    1
                </div>

            </div>
            
        </div>
    )
}

export default ChatProfileCard