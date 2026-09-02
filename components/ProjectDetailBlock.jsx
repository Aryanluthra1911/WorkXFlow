'use client'
import React, { useEffect, useState } from 'react'
import { LuFileText } from "react-icons/lu";
import ProjectDetailCard from './ProjectDetailCard';

import api from '@/lib/axios';
import useAdminStore from '@/store/admin/useAdminstore';
import useUserStore from '@/store/user/useUserstore';
import EmptyState from '@/components/ui/EmptyState';

const ProjectDetailBlock = () => {
  const user = useUserStore((state)=>state.user);
  const { projects,setprojects,latestProjects,latestTasks } = useAdminStore();
  const [loading,setloading] = useState(false)

  const getprojects = async()=>{
    setloading(true);
    try{
      if(user.role === "Admin"){
        const res = await api.get("/Dashboard/getProjects")
        setprojects(res.data.data);
      }
      else if(user.role==="Manager"){
        const res = await api.get("/Manager/Dashboard/GetProjectsDetails",{params:{managedById:user?.id}})
        setprojects(res.data.data);
      }
    }catch(err){
      console.log(err)
      setprojects([]);
    }
    finally{
      setloading(false)
    }
  }
  useEffect(()=>{
    getprojects()
  },[latestProjects,latestTasks])


    return (
        <div className='h-[95%] w-[97.5%] bg-white rounded-2xl flex items-center justify-evenly flex-col shadow-lg shadow-gray-200/60 border border-gray-100 border-t-[#a855f7] border-t-4'>
            <div className='w-[95%] h-[15%] flex gap-4 items-center'>
                <div className='w-12 h-12 shrink-0 rounded-xl bg-[#f3e8ff] flex justify-center items-center'>
                    <LuFileText className="h-6 w-6 shrink-0 text-[#a855f7] dark:text-neutral-200"/>
                </div>
                <div className='text-2xl font-semibold text-[#a855f7] tracking-tight'>Project Details</div>
            </div>
            {(loading || projects?.length > 0) && (
              <div className='w-[95%] h-[5%] border-b-2 border-gray-100 pb-2 rounded-2xl flex '>
                <div className='w-[5%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>S no.</div>
                <div className='w-[30%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>Title</div>
                <div className='w-[10%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>Deadline</div>
                <div className='w-[25%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>Organisation</div>
                <div className='w-[10%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>Managed By</div>
                <div className='w-[20%] h-full text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center justify-center '>Status</div>
              </div>
            )}
            <div className='w-[95%] h-[70%] overflow-y-auto no-scrollbar space-y-2'>
              {loading ? Array.from({ length: 6 }).map((_, index) => (
                <div className='w-full min-h-10 bg-gray-200 rounded-2xl animate-pulse [animation-duration:1s]' key={index} />
              ))
              :
              projects?.length===0 ? <EmptyState
                icon={LuFileText}
                title="No Project details"
                size="sm"
              />:(
                projects.map((idx,key)=>{
                  return<ProjectDetailCard idx={idx} key={idx.id} sno={key+1} />
                })
              )
              }
            </div>
        </div>
    )
}

export default ProjectDetailBlock