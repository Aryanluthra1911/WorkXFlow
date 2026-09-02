import React from 'react'

const Profile_infocard = ({ idx }) => {
    const Icon = idx.icon;
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f9fafb] border border-gray-100 hover:border-gray-200 transition-colors duration-200">
            {Icon && (
                <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-600" />
                </div>
            )}
            <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {idx.info_topic}
                </div>
                <div className="text-[15px] font-semibold text-gray-800 truncate">
                    {!idx.info ? "N/A" : idx.info}
                </div>
            </div>
        </div>
    )
}

export default Profile_infocard