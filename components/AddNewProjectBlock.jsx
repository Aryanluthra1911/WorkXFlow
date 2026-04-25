"use client"
import React, { useEffect, useState } from 'react'
import { FiFolder } from "react-icons/fi";
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


const AddNewProjectBlock = () => {
    const [open,setopen] = useState(false);
    const user = useUserStore((state)=>state.user);
    const latestProjects = useAdminStore((state) => state.latestProjects)
    const setlatestProjects = useAdminStore((state) => state.setlatestProjects)
    const [loading,setloading] = useState([])
    const getLatestProjects = async () => {
        setloading(true);
        try{
            const res = await api.get("/Dashboard/getLatestProjects");
            setlatestProjects(res.data.data);
        }catch(err){
            console.log(err)
            setlatestProjects([]);
        }
        finally{
            setloading(false)
        }
    };
    useEffect(()=>{
        getLatestProjects()
    },[open])
    return (
        <div className='h-[95%] w-[48%] bg-white rounded-2xl shadow-lg border-2 flex flex-col items-center justify-around border-t-[#16a34a] border-t-3'>
            <div className='h-[15%] w-[90%] flex gap-4 items-center'>
                <div className='w-[10%] h-[90%] rounded-xl bg-[#dcfce7] flex justify-center items-center'>
                    <FiFolder className="h-7 w-7 shrink-0 text-[#16a34a] dark:text-neutral-200"/>
                </div>
                <div className='text-2xl font-semibold text-[#16a34a]'>Add Project</div>
            </div>
            <div className='h-[8%] w-[90%]  text-[#747c86]'>
                Create new projects and manage workflows
            </div>
            <div className=' h-[15%] w-[90%]'>
                <button onClick={() => setopen(true)} className='w-full h-[90%] text-white bg-[#16a34a] rounded-2xl text-lg font-semibold'>
                    + Add New Project
                </button>
            </div>
            <div className='h-[8%] w-[90%] text-black font-semibold text-sm flex items-center'>
                Recent Projects:
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
                    latestProjects.length===0 ?(
                        <div className='font-semibold text-md h-full w-full text-gray-400 flex justify-center items-center'>
                            No Projects Found
                        </div>
                    ):(
                        latestProjects.map((idx,key)=>{
                            return(
                                <div key={idx.id} className=' bg-[#f9fafb] rounded-2xl h-[45%] w-full flex flex-col justify-center items-start'>
                                    <div className='pl-5 text-sm font-bold'>{idx.title}</div>
                                    <div className='pl-5 text-sm font-semibold text-[#747c86]'>Managed By: {idx.projectManager}</div>
                                </div>
                            )
                        })
                    )
                }
            </div>
            {open &&<ProjectModel onClose={() => setopen(false)} />}
        </div>
    )
}
function ProjectModel({onClose}){
    const user = useUserStore((state)=>state.user);
    const [title,settitle]= useState('')
    const [description ,setdescription] = useState("")
    const [projectManager,setprojectManger] = useState('')
    const [deadline,setdeadline] = useState('')
    const [organisation,setorganisation] = useState('')
    const [projectManagerId, setprojectMangerId] = useState(null)
    const { managers,setmanagers } = useAdminStore()
    const [loading,setloading] = useState(false)
    
    const getManagers = async () => {
        const res = await api.get("/Dashboard/getManagers");
        setmanagers(res.data);
    };
    const fetchOrgId = async()=>{
        const res = await api.post("/Dashboard/fetchOrgId",{org_name:organisation}) 
        return res.data.orgId;
    }
    const sendData = async(e)=>{
        e.preventDefault();
        setloading(true)
        try{
            const id = await fetchOrgId()
            const res = await api.post('/Dashboard/addProject',{title,
                description,
                deadline,
                projectManager,
                projectManagerId:parseInt(projectManagerId),
                orgId:id
            })
            if(res.data.success){
                toast.success(res.data.message);
                settitle('')
                setdescription('')
                setorganisation('')
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
    useEffect(()=>{
        if(user?.c_name){
            getManagers()
        }
    },[user?.c_name])
    useEffect(() => {
        if (!projectManager || managers.length === 0) return;
        const manager = managers.find(m => m.name === projectManager);
        if (manager) {
            setprojectMangerId(manager.id);
        }
    }, [projectManager, managers]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
            document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative z-10 w-[50%] h-[65%]  mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 transform transition-all duration-500 flex flex-col items-center justify-around">
                <div className='w-[95%] h-[10%] flex items-center justify-between'>
                    <div className='text-2xl font-bold h-full w-70 flex items-center '>Create New Project</div>
                    <div onClick={onClose} className='h-[90%] w-10 flex justify-center items-center rounded-xl'>
                        <RxCross2 className="h-6 w-6 shrink-0 text-gray-400 hover:text-black dark:text-neutral-200 transform transition-all duration-200"/>
                    </div>
                </div>
                <form onSubmit={sendData} className='w-[95%] h-[80%] flex flex-col items-center '>
                    <div className='w-full h-[88%] flex items-center justify-around'>
                        <div className='w-[50%] h-full flex flex-col justify-around items-center'>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Project Title</Label>
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
                                <Label>Deadline</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="date"
                                    onChange={(e) => setdeadline(e.target.value)}
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
                        <div className='w-[50%] h-full flex flex-col justify-around items-center'>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Organisation</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="text"
                                    onChange={(e) => setorganisation(e.target.value)}
                                    placeholder="Enter organisation name"
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[30%] bg-white grid gap-1'>
                                <Label>Project Manager</Label>
                                <Select value={projectManager}
                                    onValueChange={setprojectManger} className={'bg-white'} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Manager Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((idx,key)=>{
                                            return <SelectItem key={key} value={idx.name}>{idx.name}</SelectItem>
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
                        <button onClick={onClose} className='w-[40%] h-full rounded-2xl text-xl font-semibold border-black border hover:border-white hover:bg-red-600 hover:text-[#ffffff] transform transition-all duration-500'>
                            Cancel
                        </button>
                        <button type='submit' className={`${loading? "bg-[#268a4a]":""}transform transition-all duration-200 hover:border-black w-[40%] h-full bg-[#16a34a] text-white rounded-2xl text-xl font-semibold border `}>
                            {loading? "Creating Project...":"Create Project"}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default AddNewProjectBlock