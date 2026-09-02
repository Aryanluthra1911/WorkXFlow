"use client";
import Profile_infocard from "@/components/Profile_infocard";
import useUserStore from "@/store/user/useUserstore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import api from "@/lib/axios";
import usePageStore from "@/store/pages/usePageStore";
import {
    MdEmail,
    MdPhone,
    MdWorkOutline,
    MdOutlineBadge,
    MdOutlineCalendarToday,
    MdOutlineAssignment,
    MdOutlineStarRate,
    MdOutlineCheckCircle,
} from "react-icons/md";

const AVATAR_COLOR = "bg-slate-800";

const page = () => {
    const { data: session } = useSession();
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const setActivePage = usePageStore((state) => state.setActivePage);
    const setTitle = usePageStore((state) => state.setTitle);

    useEffect(() => {
        setActivePage("Profile");
        setTitle("Profile");
    }, []);

    useEffect(() => {
        if (!session?.user?.email) return;
        const fetchdata = async () => {
            try {
                const res = await api.get("/Dashboard/fetchUserData", {
                    params: { email: session.user.email },
                });
                setUser(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchdata();
    }, [session]);

    const profileData = [
        { info_topic: "Email", info: user?.email, icon: MdEmail },
        { info_topic: "Phone No.", info: user?.phone, icon: MdPhone },
        { info_topic: "Years of Experience", info: user?.yearsOfExperience, icon: MdWorkOutline },
        { info_topic: "Role", info: user?.role, icon: MdOutlineBadge },
        { info_topic: "Joining Date", info: user?.joiningDate, icon: MdOutlineCalendarToday },
        { info_topic: "Task Assigned", info: user?.taskAssigned, icon: MdOutlineAssignment },
        { info_topic: "Performance Rating", info: user?.performanceRating, icon: MdOutlineStarRate },
        { info_topic: "Project Completed", info: user?.projectCompleted, icon: MdOutlineCheckCircle },
    ];

    return (
        <div className="w-full h-[90%] bg-[#f9fafb] flex flex-col gap-4 p-4 overflow-hidden">

            {/* Profile Header Card */}
            <div className="w-full shrink-0 rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5 min-w-0">
                    <div
                        className={`w-20 h-20 shrink-0 rounded-full ${AVATAR_COLOR} text-white text-3xl font-bold flex items-center justify-center shadow-md`}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : ""}
                    </div>
                    <div className="min-w-0">
                        <div className="text-3xl font-bold text-gray-900 truncate">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                                : ""}
                        </div>
                        <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
                            {user?.role}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <button className="w-44 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors duration-200 shadow-sm">
                        Change Password
                    </button>
                    <button className="w-44 h-10 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-colors duration-200">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Profile Details Card */}
            <div className="w-full flex-1 rounded-2xl bg-white border border-gray-200 shadow-sm p-6 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.map((idx, key) => (
                        <Profile_infocard key={key} idx={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default page;