import React from 'react'

const ProjectDetailCard = ({idx,sno}) => {
    const totalTasks = idx._count.task;
    const completedTasks = idx.task.length;
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const progressColor =
        percentage >= 75 ? "bg-green-400" :
        percentage >= 40 ? "bg-yellow-400" :
        "bg-red-400";

    return (
        <div className='w-full min-h-12 border border-gray-100 flex items-center bg-[#f9fafb] hover:bg-white hover:shadow-md hover:border-gray-200 rounded-2xl transition-all duration-300'>
            <div className='w-[5%] h-full text-xs font-medium text-gray-400 flex items-center justify-center '>{sno}</div>
            <div className='w-[30%] h-full text-xs font-semibold text-gray-700 flex items-center justify-center truncate px-1'>{idx.title}</div>
            <div className='w-[10%] h-full text-xs font-normal text-gray-500 flex items-center justify-center '>{idx.dueDate}</div>
            <div className='w-[25%] h-full text-xs font-normal text-gray-500 flex items-center justify-center truncate px-1'>{idx.organisation.companyName}</div>
            <div className='w-[10%] h-full text-xs font-normal text-gray-500 flex items-center justify-center truncate px-1'>{idx.projectManager}</div>
            <div className='w-[20%] h-full text-xs font-medium flex items-center justify-center gap-2 '>
                <div className='w-[70%] h-2 rounded-full bg-gray-200 overflow-hidden'>
                    <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                    ></div>
                </div>
                <span className='text-gray-600 w-8 text-right'>{percentage}%</span>
            </div>
        </div>
    )
}

export default ProjectDetailCard