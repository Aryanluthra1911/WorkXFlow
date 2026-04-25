'use client'
import React, { useEffect, useState } from 'react'
import { CheckSquare } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import useAdminStore from '@/store/admin/useAdminstore';
import useUserStore from '@/store/user/useUserstore';

const AssignTaskBlock = () => {
    const [open,setopen] = useState(false);
    const { latestTasks,setlatestTasks } = useAdminStore()
    const [loading,setloading]=useState(false);
    const user = useUserStore((state)=>state.user);
    const getLatestTasks = async () => {
        setloading(true);
        try {
            if(user?.role === "Admin"){
                const res = await api.get("/Dashboard/getLatestTasks");
                setlatestTasks(res.data.data);
            }
            else if(user?.role === "Manager"){
                const res = await api.get("/Manager/Dashboard/GetLatestTasks", {params: { managedById:user?.id }});
                setlatestTasks(res.data.data);
            }
            
            
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setlatestTasks([]);
        } finally {
            setloading(false);
        }
    };
    useEffect(()=>{
        getLatestTasks()
    },[open])
    return (
        <div className='h-[95%] w-[48%] bg-white rounded-2xl shadow-lg border-2 flex flex-col items-center justify-around border-t-[#2563eb] border-t-3'>
            <div className='h-[15%] w-[90%] flex gap-4 items-center'>
                <div className='w-[10%] h-[90%] rounded-xl bg-[#dbeafe] flex justify-center items-center'>
                    <CheckSquare className="h-7 w-7 shrink-0 text-[#2563eb] dark:text-neutral-200"/>
                </div>
                <div className='text-2xl font-semibold text-[#2563eb]'>Assign Task</div>
            </div>
            <div className='h-[8%] w-[90%]  text-[#747c86]'>
                Create and assign new tasks to team members
            </div>
            <div className=' h-[15%] w-[90%]'>
                <button onClick={()=>(setopen(true))} className='w-full h-[90%] text-white bg-[#2563eb] rounded-2xl text-lg font-semibold'>
                    + Assign New Task
                </button>
            </div>
            <div className='h-[8%] w-[90%] text-black font-semibold text-sm flex items-center'>
                Recent Tasks:
            </div>
            <div className='w-[90%] h-[40%] flex flex-col items-center justify-start gap-2'>
                {loading ? 
                Array.from({ length: 2}).map((_, index) => (
                    <div key={index} className="bg-[#f9fafb] rounded-2xl h-[45%] w-full flex flex-col justify-evenly items-start">
                        <div className="ml-5 h-4 w-20 bg-gray-300 rounded animate-pulse [animation-duration:1s]"></div>
                        <div className="ml-5 h-4 w-40 bg-gray-300 rounded animate-pulse [animation-duration:1s]"></div>
                    </div>
                ))
                :
                latestTasks?.length===0 ?(
                    <div className='font-semibold text-md text-gray-400 h-full w-full flex justify-center items-center'>
                        No Tasks Found
                    </div>
                ):(
                    latestTasks.map((idx,key)=>(
                        <div key={idx.id} className=' bg-[#f9fafb] rounded-2xl h-[45%] w-full flex flex-col justify-center items-start'>
                            <div className='pl-5 text-sm font-bold'>{idx.title}</div>
                            <div className='pl-5 text-sm font-semibold text-[#747c86]'>Assigned To: {idx.assignedTo}</div>
                        </div>
                    ))
                )}
                
            </div>
            {open && <TaskModel onClose={() => setopen(false)}/>}
        </div>
        
    )
}
function TaskModel({onClose}){
    const user = useUserStore((state)=>state.user);
    const [title,settitle] = useState('')
    const [description,setdescription] = useState('')
    const [dueDate,setdueDate] = useState('')
    const [assignedToId,setassignedToId] = useState()
    const [assignedTo,setassignedTo] = useState('')
    const [selectedproject,setselectedproject] = useState('')
    const [projectId,setprojectId] = useState(null)

    const [loading,setloading] = useState(false)

    const { members,setmembers,projects} = useAdminStore()

    const getMembers = async () => {
        const res = await api.get("/Dashboard/getMembers");
        setmembers(res.data);
    };
    const sendData = async(e)=>{
        e.preventDefault();
        setloading(true)
        try{
            const res = await api.post('/Dashboard/createTask',{title,description,dueDate,assignedTo,assignedToId,projectId})
            if(res.data.success){
                toast.success(res.data.message);
                settitle('')
                setdescription('')
                setloading(false)
                onClose()
            }
        }catch (err) {
            console.error('register error:', err);
            console.log(err?.response?.data)
            toast.error(err?.response?.data?.message)
        }finally {
            setloading(false);
        }
    }
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
            document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    useEffect(()=>{
        if(user?.c_name){
            getMembers()
        }
    },[user?.c_name])
    useEffect(()=>{
        if(!selectedproject || projects.length === 0) return;
        const data = projects.find(p => p.title === selectedproject)
        if(data){
            setprojectId(data.id)
        }
    },[selectedproject,projects])
    return(
        <div className='fixed inset-0 z-50 flex justify-center items-center'>
            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'/>
            <div className='relative z-10 w-[50%] h-[65%]  mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 transform transition-all duration-200 flex flex-col items-center justify-around'>
                <div className='w-[95%] h-[10%] flex items-center justify-between'>
                    <div className='text-2xl font-bold h-full w-70 flex items-center '>Create New Task</div>
                    <div onClick={onClose} className='h-[90%] w-10 flex justify-center items-center rounded-xl'>
                        <RxCross2 className="h-6 w-6 shrink-0 text-gray-400 hover:text-black dark:text-neutral-200 transform transition-all duration-200"/>
                    </div>
                </div>
                <form onSubmit={sendData} className='w-[95%] h-[80%] flex flex-col items-center '>
                    <div className='w-full h-[88%] flex items-center justify-around'>
                        <div className='w-[50%] h-full flex flex-col justify-around items-center'>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Task Title</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="text"
                                    onChange={(e) => settitle(e.target.value)}
                                    placeholder="Enter title"
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Due date</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="date"
                                    onChange={(e) => setdueDate(e.target.value)}
                                    placeholder="date"
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Description</Label>
                                <Input
                                    className={'bg-white '}
                                    id="title"
                                    type="text"
                                    onChange={(e) => setdescription(e.target.value)}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>
                        </div>
                        <div className='w-[50%] h-full flex flex-col gap-4 items-center'>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Assign To</Label>
                                <Select value={assignedTo} onValueChange={(value) => {
                                    const member = members.find(m => m.name === value);
                                    setassignedTo(value);
                                    setassignedToId(member?.id);
                                }}className={'bg-white'} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Member Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((idx,key)=>{
                                            return <SelectItem onClick={()=>{
                                                setassignedToId(idx.id)
                                            }} key={key} value={idx.name}>{idx.name}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Project</Label>
                                <Select value={selectedproject} onValueChange={setselectedproject} className={'bg-white'} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Project Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((idx,key)=>{
                                            return <SelectItem key={key} value={idx.title}>{idx.title}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Documents</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="file"
                                    
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-[12%] flex justify-around items-center'>
                        <button onClick={onClose} className='w-[40%] h-full rounded-2xl text-xl font-semibold border-black border hover:border-white hover:bg-red-600 hover:text-[#ffffff] transform transition-all duration-200'>
                            Cancel
                        </button>
                        <button type='submit' className={`${loading? "bg-[#268a4a]":""}transform transition-all duration-200 hover:border-black w-[40%] h-full bg-[#2563eb] text-white rounded-2xl text-xl font-semibold border`}>
                            {loading? "Creating Task...":"Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AssignTaskBlock