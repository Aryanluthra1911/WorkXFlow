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
import EmptyState from '@/components/ui/EmptyState';


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
        <div className='h-[95%] w-[48%] bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 flex flex-col items-center justify-around border-t-[#16a34a] border-t-4'>
            <div className='h-[15%] w-[90%] flex gap-4 items-center'>
                <div className='w-12 h-12 shrink-0 rounded-xl bg-[#dcfce7] flex justify-center items-center'>
                    <FiFolder className="h-6 w-6 shrink-0 text-[#16a34a] dark:text-neutral-200"/>
                </div>
                <div className='text-2xl font-semibold text-[#16a34a] tracking-tight'>Add Project</div>
            </div>
            <div className='h-[8%] w-[90%]  text-[#747c86] text-sm'>
                Create new projects and manage workflows
            </div>
            <div className=' h-[15%] w-[90%]'>
                <button onClick={() => setopen(true)} className='w-full h-[90%] text-white bg-[#16a34a] hover:bg-[#128a3e] active:scale-[0.99] shadow-md shadow-green-200 rounded-2xl text-lg font-semibold transition-all duration-200'>
                    + Add New Project
                </button>
            </div>
            <div className='h-[8%] w-[90%] text-gray-400 font-semibold text-xs uppercase tracking-wide flex items-center'>
                Recent Projects
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
                        <EmptyState
                            icon={FiFolder}
                            title="No Projects Found"
                            size="sm"
                        />
                    ):(
                        latestProjects.map((idx,key)=>{
                            return(
                                <div key={idx.id} className='bg-[#f9fafb] border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm rounded-2xl h-[45%] w-full flex flex-col justify-center items-start transition-all duration-200'>
                                    <div className='pl-5 text-sm font-bold text-gray-800'>{idx.title}</div>
                                    <div className='pl-5 text-sm font-medium text-[#747c86]'>Managed By: <span className='text-gray-700'>{idx.projectManager}</span></div>
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
                toast.success(res.data.message || "Project added successfully.");
                settitle('')
                setdescription('')
                setorganisation('')
                setloading(false)
                onClose()
            } else {
                toast.error(res.data.message || "Failed to add project. Please try again.");
            }
        }catch (err) {
            console.error('add project error:', err);
            console.log(err?.response?.data)
            toast.error(err?.response?.data?.message || "Something went wrong while adding the project. Please try again.");
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
            <div className="relative z-10 w-[50%] h-[65%]  mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 transform transition-all duration-200 flex flex-col items-center justify-around">
                <div className='w-[95%] h-[10%] flex items-center justify-between'>
                    <div className='text-2xl font-bold h-full w-70 flex items-center text-gray-800'>Create New Project</div>
                    <div onClick={onClose} className='h-9 w-9 flex justify-center items-center rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer'>
                        <RxCross2 className="h-5 w-5 shrink-0 text-gray-400 hover:text-black dark:text-neutral-200 transform transition-all duration-200"/>
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
                        <button type="button" onClick={onClose} className='w-[40%] h-full rounded-2xl text-lg font-semibold border border-gray-300 text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transform transition-all duration-200'>
                            Cancel
                        </button>
                        <button type='submit' disabled={loading} className={`${loading? "bg-[#128a3e]":"bg-[#16a34a] hover:bg-[#128a3e]"} transform transition-all duration-200 shadow-md shadow-green-100 w-[40%] h-full text-white rounded-2xl text-lg font-semibold border-none disabled:opacity-80`}>
                            {loading? "Creating Project...":"Create Project"}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default AddNewProjectBlock