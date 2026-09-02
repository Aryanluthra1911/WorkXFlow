'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { HiOutlineChevronRight } from 'react-icons/hi'

const COLORS = [
    "bg-emerald-700",
    "bg-indigo-700",
    "bg-orange-700",
    "bg-sky-700",
    "bg-rose-700",
    "bg-violet-700",
]

const OrgansiationCard = ({ idx }) => {
    const router = useRouter()

    const initials = idx.organisationName
        ?.split(" ")
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase()

    const color = COLORS[(idx.organisationName?.length || 0) % COLORS.length]

    return (
        <div
            onClick={() => {
                router.push(`/organisation/${idx.id}`)
            }}
            className='group cursor-pointer rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200 p-5 flex items-center gap-4'
        >
            <div className={`w-14 h-14 shrink-0 ${color} rounded-2xl text-lg flex justify-center items-center font-semibold text-white shadow-sm`}>
                {initials}
            </div>
            <div className='flex-1 min-w-0 flex flex-col gap-0.5'>
                <div className='text-lg font-semibold text-gray-800 truncate'>
                    {idx.organisationName}
                </div>
                <div className='text-sm text-gray-400 font-medium'>
                    View organisation
                </div>
            </div>
            <HiOutlineChevronRight className='h-5 w-5 shrink-0 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200' />
        </div>
    )
}

export default OrgansiationCard