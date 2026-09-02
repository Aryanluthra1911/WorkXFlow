'use client'
import AiMessageCard from '@/components/AiMessageCard';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import React, { useEffect, useState } from 'react'
import { LuBot } from "react-icons/lu";
import { RiSendPlaneFill } from "react-icons/ri";
import { ThreeDot } from 'react-loading-indicators';
import { toast } from 'react-toastify';
import { useRef } from "react";
import { FaUser } from 'react-icons/fa';
import usePageStore from '@/store/pages/usePageStore';
import useUserStore from '@/store/user/useUserstore';



const page = () => {
    const [conversationId,setconversationId] = useState(null)
    const [message,setmessage] = useState('');
    const [Searching,setSearching] = useState(false)
    const user = useUserStore((state)=>state.user);
    const [chats,setchats] = useState([])
    const [active,setactive] = useState(false);
    const [loading,setloading] = useState(true);
    const chatContainerRef = useRef(null);
    const setActivePage = usePageStore((state)=>state.setActivePage)
    const setTitle = usePageStore((state)=>state.setTitle)
    useEffect(()=>{
        setActivePage("Get Help")
        setTitle("Ask AI")
    },[])
    const getChats = async(convoId)=>{
        try {
            const res = await api.get(`/Aichats/fetchChats?convoId=${convoId}`)
            if (!res.data.success || !res.data.data) {
                setchats([]);
                return;
            }
            setchats(res.data.data.messages || [])
        }catch (error) {
            console.error("Failed to fetch chats", error);
        }finally{
            setloading(false)
        }
    }
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats,Searching]);

    useEffect(()=>{
        if (!user) return;
        const run = async()=>{
            try {
                await api.delete('/Aichats/deleteExpiredConvo')
                const res = await api.get(`/Aichats/getConvoId`)
                if(res.data.success){
                    const id = res.data.data?.id;
                    setconversationId(id)
                    getChats(id)
                }
                else{
                    const res = await api.post('/Aichats/createNewConvo');
                    let convoId = res.data.conversationId;
                    setconversationId(convoId); 
                    await getChats(convoId);
                }
            } catch (error) {
                console.log(error)
                setloading(false)
            }
        }
        run()
    },[user])
    const onclick = async (e)=>{
        e.preventDefault();
        if (active) return
        setactive(true)
        try{
            const messageRes = await api.post('/Aichats/addMessages',{
                conversationId,
                content: message,
                role:'User'
            });
            if(!messageRes.data.success){
                toast.error(messageRes.data.message || "Failed to send message. Please try again.");
                return;
            }

            setmessage('');
            await getChats(conversationId);
            setSearching(true);
            const AiRes = await api.get(`/Aichats/askAi`,{
                params:{
                    previous_chats: chats,
                    current_message: message
                }
            });
            console.log(AiRes.data)
            if(AiRes.data.success){
                const AiReply = JSON.parse(AiRes.data.reply.candidates[0].content.parts[0].text);
                
                await api.post('/Aichats/addMessages',{
                    conversationId,
                    content: AiReply.reply,
                    role:'AI'
                });
            await getChats(conversationId);
        }
        }catch(err){
            console.log(err)
            toast.error("Something went wrong while contacting the assistant. Please try again.");
            setactive(false)
        }finally{
            setSearching(false)
            setactive(false)
        }
    }

    return (
        <div className='w-full h-[90%] bg-[#f9fafb] flex justify-evenly items-center'>
            <div className='w-[98%] h-[97%] rounded-2xl bg-white shadow-md  flex flex-col items-center justify-between'>
                <div className='w-full h-[12%] bg-[#2563eb] rounded-t-xl flex items-center justify-start gap-2 border-2 border-[#2563eb]'>
                    <div className='w-[10%] h-[70%] flex items-center justify-center '>
                        <div className='w-12 h-12 bg-[#5081ee] flex justify-center items-center rounded-full'>
                            <LuBot size={32} color="white" />
                        </div>
                    </div>
                    <div className='w-[70%] h-[80%] flex flex-col justify-between items-center'>
                        <div className='w-full h-[60%] text-2xl font-semibold text-white flex items-center'>
                            WorkXflow Assistant
                        </div>
                        <div className='w-full h-[35%] text-xs font-semibold text-[#CBD5E1] flex items-center gap-2'>
                            <div className='w-2 h-2 bg-green-500 rounded-full'/>
                            Online - Ready to help
                        </div>
                    </div>
                </div>
                <div ref={chatContainerRef} className='w-full h-[73%] bg-[#E8EDF3] overflow-y-auto no-scrollbar space-y-2'>
                    <AiMessageCard idx={{content:"Hello! Welcome to WorkXflow Help Center. I'm here to assist you with any questions about the platform. How can I help you today?"}}/>
                    {loading ? 
                        Array.from({ length: 2}).map((_, index) => (
                            <div key={index} className=" h-40 w-full flex flex-col justify-around">
                                <div className="h-15 w-full flex gap-5 items-end justify-end pr-5">
                                    <div className={`w-10 h-10 bg-gray-300 flex justify-center items-center rounded-full shadow-md`}>
                                        <FaUser size={24} className='text-gray-700' />
                                    </div>
                                    <div className='w-100 h-full bg-gray-300 rounded-2xl animate-pulse [animation-duration:1s] '/>
                                </div>
                                <div className="pl-5 h-15 w-full gap-5 flex items-end justify-start">
                                    <div className={`w-10 h-10 bg-[#BFDBFE] flex justify-center items-center rounded-full shadow-md`}>
                                        <LuBot className='text-[#2563eb]' size={32}  />
                                    </div>
                                    <div className='w-100 h-full bg-gray-300 rounded-2xl animate-pulse [animation-duration:1s] '/>
                                </div>
                            </div>
                        )):
                        chats.length>0?
                            chats.map((idx,key)=>(
                                <AiMessageCard idx={idx} key={key}/>
                            )) : 
                            <></>
                    }
                    
                    {Searching?
                    <div className='w-full flex items-center justify-start mb-5'>
                        <div className='ml-5 mt-5 w-[80%] min-h-[10%] flex items-end justify-start gap-4'>
                            <div className={`w-10 h-10 bg-[#BFDBFE]  flex justify-center items-center rounded-full shadow-md`}>
                                <LuBot className='text-[#2563eb]' size={32}  />
                            </div>
                            <div className='max-w-[85%] p-3 font-semibold '>
                                <ThreeDot variant="bounce" color="#2563eb" size="small" text="" textColor="" />
                            </div>
                        </div>
                    </div> :<></>}
                </div>
                <form onSubmit={onclick} className='w-full h-[15%] flex items-center justify-center gap-4'>
                    <div className='w-[80%] flex items-center justify-around'>
                        <Input
                            value = {message}
                            className={'bg-white h-15'}
                            id="title"
                            type="text"
                            placeholder="Type your question here..."
                            onChange={(e) => setmessage(e.target.value)}
                        />
                    </div>
                    <button type='submit' className='w-[15%] h-[50%] bg-[#2563eb] flex items-center justify-center gap-2 text-xl text-white font-semibold rounded-2xl'>
                        <RiSendPlaneFill size={20} color="white" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default page