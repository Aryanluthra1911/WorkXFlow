'use client'
import React, { useEffect, useState } from 'react'
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import useUserStore from '@/store/user/useUserstore';
import usePageStore from '@/store/pages/usePageStore';
import { HiOutlineChevronRight } from 'react-icons/hi';
import EmptyState from '@/components/ui/EmptyState';
import { HiOutlineFolderOpen } from 'react-icons/hi2';


const page = () => {
    const router = useRouter()
    const params = useParams();
    const orgId = params.orgId;
    const user = useUserStore((state)=>state.user);
    const [loading, setLoading] = useState(true);
    const [totalProjects,settotalProjects] = useState([])
    const [statusSummary,setstatusSummary] = useState([])
    const projectStatus = [
        {title:"TOTAL PROJECTS",count:totalProjects,color:'#2563eb',bg:'#eff6ff'},
        {title:"ACTIVE",count:statusSummary.ACTIVE,color:'#0891b2',bg:'#ecfeff'},
        {title:"PENDING",count:statusSummary.PENDING,color:'#ca8a04',bg:'#fefce8'},
        {title:"COMPLETED",count:statusSummary.COMPLETED,color:'#16a34a',bg:'#f0fdf4'},
        {title:"ON HOLD",count:statusSummary.ON_HOLD,color:'#dc2626',bg:'#fef2f2'}
    ]
    const filter = ["All","Active","Pending","Completed","On Hold"]
    const colordata = [{title:"ACTIVE",textClr:"#075985",bg:"#bae6fd"},{title:"PENDING",textClr:"#854d0e",bg:"#fef08a"},{title:"COMPLETED",textClr:"#166534",bg:"#bbf7d0"},{title:"ON_HOLD",textClr:"#991b1b",bg:"#fecaca"}]
    const [active,setactive] = useState("All")
    const [projects,setprojects] = useState([])
    const setTitle = usePageStore((state) => state.setTitle);
    const setActivePage = usePageStore((state)=>state.setActivePage)
    useEffect(() => {
        setTitle("Projects")
        setActivePage("Organisation")
    }, [])
    useEffect(()=>{
        const fetch_data = async()=>{
            if(!user || !orgId) return;
            try{
                if(user?.role==="Admin"){
                    const res = await api.get(`/organisation/projectsByOrgId`, {params:{orgId:orgId}});
                    setprojects(res.data.data.projects)
                    settotalProjects(res.data.totalProjects)
                    setstatusSummary(res.data.statusSummary)
                }
                else if(user?.role==="Manager"){
                    const res = await api.get(`/Manager/Organisation/GetProjectByOrgId`, {params:{orgId:orgId,managerId:user?.id}});
                    setprojects(res.data.data.projects)
                    settotalProjects(res.data.totalProjects)
                    setstatusSummary(res.data.statusSummary)
                }
                else if(user?.role==="Member"){
                    const res = await api.get(`/Member/Organisation/GetProjects`, {params:{orgId:orgId,memberId:user?.id}});
                    console.log(res.data)
                    setprojects(res.data.data.projects)
                    settotalProjects(res.data.totalProjects)
                    setstatusSummary(res.data.statusSummary)
                }
                
            } catch (err) {
                console.error(err);
            
            }finally {
                setLoading(false)
            }
        }
        fetch_data()
    },[user,orgId])
    const filteredProjects = active ==="All"?projects:projects.filter(project => project.status === active.toUpperCase().replace(" ", "_"))
    if (loading) 
        return <div className='w-full h-[90%] bg-[#f9fafb] overflow-y-auto p-6'>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                {Array.from({ length: 5}).map((_,index) => (
                    <div key={index} className='h-24 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse [animation-duration:900ms] flex flex-col justify-center items-center gap-2'>
                        <div className='h-3 w-16 bg-gray-200 rounded' />
                        <div className='h-6 w-10 bg-gray-200 rounded' />
                    </div>
                ))}
            </div>
            <div className='flex flex-wrap gap-3 justify-between items-center mt-6 mb-4'>
                <div className='h-6 w-40 bg-gray-200 rounded animate-pulse [animation-duration:900ms]'/>
                <div className='flex gap-2'>
                    {filter.map((idx,key) => (
                        <div key={key} className='h-9 w-20 rounded-full bg-white border border-gray-100 shadow-sm animate-pulse [animation-duration:900ms]'/>
                    ))}
                </div>
            </div>
            <div className='space-y-3'>
                {Array.from({length:6}).map((_,index)=>(
                    <div key={index} className='w-full h-16 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse [animation-duration:900ms]'/>
                ))}
            </div>
        </div>
    return (
        <div className='w-full h-[90%] bg-[#f9fafb] overflow-y-auto p-6'>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                {projectStatus.map((idx,key)=>{
                    return <div key={key} className='rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-2'>
                        <div className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>
                            {idx.title}
                        </div>
                        <div style={{ color: idx.color }} className='font-bold text-3xl'>
                            {idx.count || 0}
                        </div>
                    </div>
                })}
            </div>
            <div className='flex flex-wrap gap-3 justify-between items-center mt-8 mb-4'>
                <div className='text-lg font-semibold text-gray-700'>
                    {active} Projects
                </div>
                <div className='flex gap-2 flex-wrap'>
                    {filter.map((idx,key) => (
                        <button onClick={()=>setactive(idx)} key={key} className={`${active === idx?"bg-[#1e293b] text-white":"bg-white text-gray-500 border border-gray-200 hover:border-gray-300"} transition-all duration-200 h-9 px-4 rounded-full flex items-center justify-center text-sm font-medium`}>{idx}</button>
                    ))}
                </div>
            </div>
            <div className='space-y-3 pb-6'>
                {filteredProjects.length === 0 ? (
                    <div className='w-full flex justify-center py-16'>
                        <EmptyState
                            icon={HiOutlineFolderOpen}
                            title="No projects found"
                            description="There are no projects matching this filter yet."
                            size="md"
                        />
                    </div>
                ) : filteredProjects.map((project)=>{
                    const clr = colordata.find(data => data.title === project.status)
                    const totalTasks = project.task.length;
                    const completedTasks = project.task.filter(
                        task => task.status === "COMPLETED"
                    ).length;
                    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                    return <div onClick={()=>{
                        router.push(`/organisation/${orgId}/${project.id}`)
                    }} key={project.id} className='group cursor-pointer w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 flex items-center gap-4 p-4'>
                        <div style={{backgroundColor: clr?.bg, color: clr?.textClr}} className='w-11 h-11 shrink-0 rounded-2xl flex justify-center items-center font-semibold'>
                            {project.title?.split(" ").slice(0, 2).map(word => word[0]).join("").toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0 text-base font-semibold text-gray-800 truncate'>
                            {project.title}
                        </div>
                        <div style={{backgroundColor: clr?.bg, color: clr?.textClr}} className='shrink-0 px-3 py-1 rounded-full text-xs font-semibold'>
                            {project.status}
                        </div>
                        <div className='hidden sm:flex items-center gap-3 w-40 shrink-0'>
                            <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                <div style={{ width: `${progress}%` }} className='h-full bg-green-500 rounded-full transition-all duration-300'/>
                            </div>
                            <div className='w-9 text-xs font-medium text-gray-500 text-right'>
                                {progress}%
                            </div>
                        </div>
                        <HiOutlineChevronRight className='h-5 w-5 shrink-0 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200' />
                    </div>
                })}
            </div>
        </div>
    )
}

export default page