'use client'
import React, { useEffect, useState } from 'react'
import { FaUserPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LuUsers } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import { toast } from "react-toastify";
import api from '@/lib/axios'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useUserStore from '@/store/user/useUserstore';
import usePageStore from '@/store/pages/usePageStore';
import EmptyState from '@/components/ui/EmptyState';


const page = () => {
    const [users,setusers] = useState([]);
    const [activeid, setactiveid] = useState(null)
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [name,setname]=useState('');
    const [role,setrole]=useState('');
    const [phoneno,setphoneno]= useState('')
    const [yop,setyop]=useState('')
    const [joiningdate,setjoiningdate]= useState('')
    const [loading,setloading] = useState(false)
    const [loading2,setloading2] = useState(true)
    const user = useUserStore((state)=>state.user);

    const [showNoData, setShowNoData] = useState(false);
    const setActivePage = usePageStore((state)=>state.setActivePage)
    const setTitle = usePageStore((state)=>state.setTitle)
    useEffect(()=>{
        setActivePage("User Controls")
        setTitle("User Controls")
    },[])
    useEffect(() => {
        if (users?.length === 0) {
            setTimeout(() => {
                setShowNoData(true);
            }, 2000);
        }
    }, [users]);
    var sno = 1;
    const sendData = async(e)=>{
        e.preventDefault();
        setloading(true)
        try{
            const res = await api.post('/UserControls/createUser',{
                name,email,role,password,years_of_experience:Number(yop),joining_date:joiningdate,phoneno
            })
            if(res.data.success){
                toast.success(res.data.message)
                setname('')
                setrole('')
                setemail('')
                setpassword('')
                setphoneno("")
                setyop('')
                setjoiningdate('')
                getusers();
            }
            else{
                toast.error(res.data.message)
            }
        }catch (err) {
            console.error('register error:', err);
            console.log(err?.response?.data)
            toast.error(err?.response?.data?.message)
        }finally {
            setloading(false);
        }
    }
    
    const getusers = async()=>{
        try {
            if(user?.role==="Admin"){
                const res = await api.get('/UserControls/viewUsers',)
                setusers(res.data); 
            }
            else if(user?.role === "Manager"){
                const res = await api.get('Manager/UserControl/ViewUsers')
                setusers(res.data); 
            }
            
        } catch (error) {
            throw error
        }
        finally{
            setloading2(false)
        }
    }
    useEffect(()=>{
        if(user?.c_name){
            getusers()
        }
    },[user?.c_name])
    return (
        <div className='w-full h-[90%] bg-[#f9fafb] flex justify-evenly items-center'>
            <div className='w-[49%] h-[97%] rounded-2xl bg-white shadow-md border-2 p-2 flex flex-col items-center justify-evenly'>
                <div className='w-[97%] h-[10%] text-2xl font-semibold flex items-center gap-4 border-b-2 border-[#2563eb] rounded-b-xl'>
                    <div className='w-12 h-12 bg-[#dbeafe] flex justify-center items-center rounded-2xl'>
                        <FaUserPlus className="h-7 w-7 shrink-0 text-[#2563eb] dark:text-neutral-200" />
                    </div>
                    <div className='text-[#2563eb] font-bold'>Create {user?.role ==="Admin"?" User":"Member"}</div>
                </div>
                <form onSubmit={sendData} className='w-[97%] h-[85%]'>
                    <div className='w-full h-[90%] flex items-center justify-around'>
                        <div className='w-[50%] h-full flex flex-col justify-start pt-5 gap-2 items-center'>
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Full Name</Label>
                                <Input
                                    className={'bg-white text-xl'}
                                    id="title"
                                    type="text"
                                    value={name}
                                    placeholder="Enter Name"
                                    onChange={(e) => setname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Email</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="email"
                                    value={email}
                                    placeholder="name@gmail.com"
                                    onChange={(e) => setemail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Phone No.</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="text"
                                    value={phoneno}
                                    placeholder="Enter number"
                                    onChange={(e) => setphoneno(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Joining Date</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="date"
                                    value={joiningdate}
                                    placeholder="Enter title"
                                    onChange={(e) => setjoiningdate(e.target.value)}
                                    required
                                />
                            </div>
                            
                        </div>
                        <div className='w-[50%] h-full flex flex-col justify-start items-center pt-5 gap-2'>
                            {
                                user?.role==="Admin"?
                                    <div className='w-[90%] h-[23%] bg-white grid '>
                                        <Label>Role</Label>
                                        <Select value={role} onValueChange={setrole} className={'w-full'}>
                                            <SelectTrigger className="w-[full]">
                                                <SelectValue placeholder="Enter Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Member">Member</SelectItem>
                                                <SelectItem value="Manager">Manager</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>:
                                    <></>
                            }
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Password</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="text"
                                    value={password}
                                    placeholder="Enter password"
                                    onChange={(e) => setpassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[23%] bg-white grid '>
                                <Label>Years of Experience</Label>
                                <Input
                                    className={'bg-white'}
                                    id="title"
                                    type="text"
                                    value={yop}
                                    placeholder="Enter experience in years"
                                    onChange={(e) => setyop(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-[90%] h-[23%] bg-white grid '></div>
                        </div>
                    </div>
                    <div className='w-[97%] h-[10%] flex items-center justify-center'>
                        <button type='submit' className={`text-white w-[50%] h-[90%] bg-[#2563eb] rounded-2xl ${loading ? 'bg-[#526691]':""} border-white border shadow-md font-semibold hover:scale-105 transform transition-all duration-500`}>
                            {loading  ? 'Adding User...':"Add User"}
                        </button>
                    </div>
                    
                </form>
            </div>
            <div className='w-[49%] h-[97%] rounded-2xl bg-white shadow-md border-2 p-2 flex flex-col items-center justify-evenly'>
                <div className='w-[97%] h-[10%] text-2xl font-semibold flex items-center gap-4 border-b-2 border-[#a855f7] rounded-b-xl'>
                    <div className='w-12 h-12 bg-[#f3e8ff] flex justify-center items-center rounded-2xl'>
                        <LuUsers className="h-7 w-7 shrink-0 text-[#a855f7] dark:text-neutral-200" />
                    </div>
                    <div className='text-[#a855f7] font-bold'>Users</div>
                </div>
                <div className='w-[97%] h-[10%] flex justify-center items-center'>
                    <div className='w-[95%] h-[70%] border-2 flex items-center justify-between pl-3 rounded-2xl'>
                        <LuSearch className="h-7 w-7 shrink-0 text-gray-300 dark:text-neutral-200" />
                        <input className='w-[90%] h-full outline-none rounded-2xl' placeholder='Search Users...'/>
                    </div>
                </div>
                <div className='w-[97%] h-[5%] border-b rounded-2xl flex justify-around items-center'>
                    <div className='h-full w-[10%] text-xs flex justify-center items-center font-light'>Sno</div>
                    <div className='h-full w-[30%] text-xs flex justify-center items-center font-light'>Name</div>
                    <div className='h-full w-[40%] text-xs flex justify-center items-center font-light'>Email</div>
                    <div className='h-full w-[20%] text-xs flex justify-center items-center font-light'>Role</div>
                </div>
                <div className='w-[97%] h-[60%] overflow-y-auto no-scrollbar space-y-3'>
                    {loading2?
                    Array.from({ length: 7}).map((_, index) => (
                        <div className='w-full min-h-10 bg-gray-200 rounded-2xl animate-pulse [animation-duration:1s]' key={index} />
                    ))
                    :
                    users?.length===0 && showNoData?
                        <EmptyState
                            icon={LuUsers}
                            title="No User Data"
                            size="sm"
                        />
                        
                    :
                    users.map((idx,key)=>{
                        return(
                            <div onClick={()=>{setactiveid(idx.sno)}} key={key} className={`${activeid===idx.email?'border-black shadow:md bg-gray-100':""} w-full h-10 hover:bg-gray-100 bg-[#f9fafb] border rounded-2xl flex justify-around items-center transform transition-all duration-200 `}>
                                <div className='h-full w-[10%] text-xs flex justify-center items-center font-light'>{sno++}</div>
                                <div className='h-full w-[30%] text-xs flex justify-center items-center font-light'>{idx.name}</div>
                                <div className='h-full w-[40%] text-xs flex justify-center items-center font-light'>{idx.email}</div>
                                <div className='h-full w-[20%] text-xs flex justify-center items-center font-light'>{idx.role}</div>
                            </div>
                        )
                    })
                    }
                    
                </div>
                <div className='w-[97%] h-[8%] flex justify-evenly items-center'>
                    {
                        user?.role==="Admin"?
                            <button className='font-bold w-[30%] h-[80%] border-2 bg-white border-[#2563eb] rounded-2xl text-[#2563eb]  hover:text-white hover:bg-[#2563eb] transform transition-all duration-500'>
                                Change Role
                            </button>
                            :
                            <></>
                    }
                    
                    <button className='font-bold w-[30%] h-[80%] border-2 bg-white border-red-600 rounded-2xl text-red-600  hover:text-white hover:bg-red-600 transform transition-all duration-500'>
                        Block User
                    </button>
                    <button className='font-bold w-[30%] h-[80%] border-2 bg-white border-red-600 rounded-2xl text-red-600  hover:text-white hover:bg-red-600 transform transition-all duration-500'>
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    )
}

export default page