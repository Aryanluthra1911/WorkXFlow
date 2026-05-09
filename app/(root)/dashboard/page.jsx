'use client'
import Admin_dashboard from '@/components/Admin_dashboard'
import Manger_dashboard from '@/components/Manger_dashboard'
import Member_dashboard from '@/components/Member_dashboard'
import usePageStore from '@/store/pages/usePageStore'
import useUserStore from '@/store/user/useUserstore'
import React, { useEffect } from 'react'

const page = () => {
    const user = useUserStore((state)=>state.user);
    const setActivePage = usePageStore((state)=>state.setActivePage)
    useEffect(()=>{
        setActivePage("Dashboard")
    },[])
    if(user?.role === 'Admin'){
        return <Admin_dashboard/>
    }
    else if(user?.role === 'Manager'){
        return <Manger_dashboard/>
    }
    else if(user?.role === 'Member'){
        return <Member_dashboard/>
    }
}

export default page