'use client'
import React, { useEffect, useState } from 'react'
import { FaUserPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LuUsers } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
    const [users, setusers] = useState([]);
    const [activeid, setactiveid] = useState(null)
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setname] = useState('');
    const [role, setrole] = useState('');
    const [phoneno, setphoneno] = useState('')
    const [yop, setyop] = useState('')
    const [joiningdate, setjoiningdate] = useState('')
    const [loading, setloading] = useState(false)
    const [loading2, setloading2] = useState(true)
    const [search, setSearch] = useState('')
    const user = useUserStore((state) => state.user);

    const [showNoData, setShowNoData] = useState(false);
    const setActivePage = usePageStore((state) => state.setActivePage)
    const setTitle = usePageStore((state) => state.setTitle)

    useEffect(() => {
        setActivePage("User Controls")
        setTitle("User Controls")
    }, [])

    useEffect(() => {
        if (users?.length === 0) {
            setTimeout(() => {
                setShowNoData(true);
            }, 2000);
        }
    }, [users]);

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const sendData = async (e) => {
        e.preventDefault();
        setloading(true)
        try {
            const res = await api.post('/UserControls/createUser', {
                name, email, role, password, years_of_experience: Number(yop), joining_date: joiningdate, phoneno
            })
            if (res.data.success) {
                toast.success(res.data.message || "User created successfully.")
                setname('')
                setrole('')
                setemail('')
                setpassword('')
                setphoneno("")
                setyop('')
                setjoiningdate('')
                getusers();
            }
            else {
                toast.error(res.data.message || "Failed to create user. Please try again.")
            }
        } catch (err) {
            console.error('create user error:', err);
            console.log(err?.response?.data)
            toast.error(err?.response?.data?.message || "Something went wrong while creating the user. Please try again.")
        } finally {
            setloading(false);
        }
    }

    const getusers = async () => {
        try {
            if (user?.role === "Admin") {
                const res = await api.get('/UserControls/viewUsers',)
                setusers(res.data);
            }
            else if (user?.role === "Manager") {
                const res = await api.get('Manager/UserControl/ViewUsers')
                setusers(res.data);
            }

        } catch (error) {
            throw error
        }
        finally {
            setloading2(false)
        }
    }
    useEffect(() => {
        if (user?.c_name) {
            getusers()
        }
    }, [user?.c_name])

    return (
        <div className='w-full h-[90%] bg-[#f9fafb] flex gap-4 p-4 overflow-hidden'>

            {/* Create User Card */}
            <div className='w-1/2 h-full rounded-2xl bg-white shadow-sm border border-gray-200 flex flex-col overflow-hidden'>
                <div className='px-6 pt-6 pb-4 flex items-center gap-4 border-b border-gray-100'>
                    <div className='w-12 h-12 bg-[#dbeafe] flex justify-center items-center rounded-2xl shrink-0'>
                        <FaUserPlus className="h-6 w-6 text-[#2563eb]" />
                    </div>
                    <div>
                        <div className='text-xl font-bold text-gray-800'>
                            Create {user?.role === "Admin" ? "User" : "Member"}
                        </div>
                        <div className='text-xs text-gray-400 font-medium'>Fill in the details to add a new account</div>
                    </div>
                </div>

                <form onSubmit={sendData} className='flex-1 flex flex-col overflow-y-auto no-scrollbar px-6 py-5'>
                    <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                        <div className='grid gap-1.5'>
                            <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                            <Input
                                className='bg-white'
                                type="text"
                                value={name}
                                placeholder="Enter Name"
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                        </div>

                        {user?.role === "Admin" ? (
                            <div className='grid gap-1.5'>
                                <Label className="text-sm font-semibold text-gray-700">Role</Label>
                                <Select value={role} onValueChange={setrole}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Member">Member</SelectItem>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div />
                        )}

                        <div className='grid gap-1.5'>
                            <Label className="text-sm font-semibold text-gray-700">Email</Label>
                            <Input
                                className='bg-white'
                                type="email"
                                value={email}
                                placeholder="name@gmail.com"
                                onChange={(e) => setemail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='grid gap-1.5'>
                            <Label className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className='relative'>
                                <Input
                                    className='bg-white pr-10'
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    placeholder="Enter password"
                                    onChange={(e) => setpassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className='grid gap-1.5'>
                            <Label className="text-sm font-semibold text-gray-700">Phone No.</Label>
                            <Input
                                className='bg-white'
                                type="text"
                                value={phoneno}
                                placeholder="Enter number"
                                onChange={(e) => setphoneno(e.target.value)}
                                required
                            />
                        </div>

                        <div className='grid gap-1.5'>
                            <Label className="text-sm font-semibold text-gray-700">Years of Experience</Label>
                            <Input
                                className='bg-white'
                                type="text"
                                value={yop}
                                placeholder="Enter experience in years"
                                onChange={(e) => setyop(e.target.value)}
                                required
                            />
                        </div>

                        <div className='grid gap-1.5 col-span-2'>
                            <Label className="text-sm font-semibold text-gray-700">Joining Date</Label>
                            <Input
                                className='bg-white'
                                type="date"
                                value={joiningdate}
                                onChange={(e) => setjoiningdate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='flex-1' />

                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full h-12 mt-6 rounded-2xl font-semibold text-white shadow-md transition-all duration-300 ${
                            loading ? 'bg-[#526691]' : 'bg-[#2563eb] hover:scale-[1.02] hover:shadow-lg'
                        }`}
                    >
                        {loading ? 'Adding User...' : 'Add User'}
                    </button>
                </form>
            </div>

            {/* Users List Card */}
            <div className='w-1/2 h-full rounded-2xl bg-white shadow-sm border border-gray-200 flex flex-col overflow-hidden'>
                <div className='px-6 pt-6 pb-4 flex items-center gap-4 border-b border-gray-100'>
                    <div className='w-12 h-12 bg-[#f3e8ff] flex justify-center items-center rounded-2xl shrink-0'>
                        <LuUsers className="h-6 w-6 text-[#a855f7]" />
                    </div>
                    <div>
                        <div className='text-xl font-bold text-gray-800'>Users</div>
                        <div className='text-xs text-gray-400 font-medium'>
                            {users.length} total {users.length === 1 ? "account" : "accounts"}
                        </div>
                    </div>
                </div>

                <div className='px-6 pt-4'>
                    <div className='relative'>
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='w-full h-11 pl-10 pr-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all text-sm'
                            placeholder='Search users by name or email...'
                        />
                    </div>
                </div>

                <div className='px-6 pt-4 pb-2 grid grid-cols-[10%_28%_42%_20%] text-xs font-semibold text-gray-400 uppercase tracking-wide'>
                    <div>Sno</div>
                    <div>Name</div>
                    <div>Email</div>
                    <div className='text-right'>Role</div>
                </div>

                <div className='flex-1 overflow-y-auto no-scrollbar px-6 pb-2 space-y-2'>
                    {loading2 ? (
                        Array.from({ length: 7 }).map((_, index) => (
                            <div className='w-full h-11 bg-gray-100 rounded-2xl animate-pulse [animation-duration:1s]' key={index} />
                        ))
                    ) : filteredUsers?.length === 0 && showNoData ? (
                        <EmptyState
                            icon={LuUsers}
                            title="No User Data"
                            size="sm"
                        />
                    ) : (
                        filteredUsers.map((idx, key) => {
                            const active = activeid === idx.email;
                            return (
                                <div
                                    onClick={() => setactiveid(idx.email)}
                                    key={key}
                                    className={`grid grid-cols-[10%_28%_42%_20%] items-center h-11 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                        active
                                            ? 'border-[#a855f7] bg-purple-50 shadow-sm'
                                            : 'border-gray-100 bg-[#f9fafb] hover:bg-gray-100'
                                    }`}
                                >
                                    <div className='text-xs text-gray-500 text-center'>{key + 1}</div>
                                    <div className='text-xs font-medium text-gray-800 truncate pr-2 capitalize'>{idx.name}</div>
                                    <div className='text-xs text-gray-500 truncate pr-2'>{idx.email}</div>
                                    <div className='text-xs text-right pr-1'>
                                        <span className={`px-2 py-1 rounded-full font-semibold ${
                                            idx.role === "Manager"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {idx.role}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <div className='px-6 py-4 border-t border-gray-100 flex gap-3'>
                    {user?.role === "Admin" && (
                        <button
                            disabled={!activeid}
                            className='flex-1 h-11 border-2 bg-white border-[#2563eb] rounded-2xl text-[#2563eb] font-bold text-sm hover:text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#2563eb] transition-all duration-300'
                        >
                            Change Role
                        </button>
                    )}
                    <button
                        disabled={!activeid}
                        className='flex-1 h-11 border-2 bg-white border-amber-500 rounded-2xl text-amber-500 font-bold text-sm hover:text-white hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-amber-500 transition-all duration-300'
                    >
                        Block User
                    </button>
                    <button
                        disabled={!activeid}
                        className='flex-1 h-11 border-2 bg-white border-red-600 rounded-2xl text-red-600 font-bold text-sm hover:text-white hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-red-600 transition-all duration-300'
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    )
}

export default page