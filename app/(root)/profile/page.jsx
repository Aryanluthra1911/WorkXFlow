"use client";
import Profile_infocard from "@/components/Profile_infocard";
import useUserStore from "@/store/user/useUserstore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import api from "@/lib/axios";
import usePageStore from "@/store/pages/usePageStore";

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
        { info_topic: "Email", info: user?.email },
        { info_topic: "Phone No.", info: user?.phone },
        { info_topic: "Years of Experience", info: user?.yearsOfExperience },
        { info_topic: "Role", info: user?.role },
        { info_topic: "Joining Date", info: user?.joiningDate },
        { info_topic: "Task Assigned", info: user?.taskAssigned },
        { info_topic: "Performance Rating", info: user?.performanceRating },
        { info_topic: "Project Completed", info: user?.projectCompleted },
    ];
    return (
        <div className="w-full h-[90%] bg-[#f9fafb] flex flex-col justify-around items-center">
            <div className="w-[95%] h-[25%] flex items-center justify-around rounded-2xl bg-white border-2">
                <div className="w-[15%] h-full flex items-center justify-center ">
                    <div className="w-20 h-20 rounded-full text-3xl font-bold bg-gray-200 flex items-center justify-center shadow-lg">
                        {user?.name ? user.name.charAt(0).toUpperCase() : ""}
                    </div>
                </div>
                <div className="w-[50%] h-full ">
                    <div className="text-5xl w-full h-[40%] flex justify-start items-center font-semibold">
                        {user?.name
                            ? user.name.charAt(0).toUpperCase() +
                            user.name.slice(1)
                            : ""}
                    </div>
                    <div className="text-xl w-full h-[40%] flex justify-start items-center font-semibold text-[#9a9a9a]">
                        {user?.role}
                    </div>
                </div>
                <div className="w-[20%] h-[60%]  flex flex-col justify-around items-center">
                    <button className=" border w-50 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                        {" "}
                        change password
                    </button>
                    <button className=" border w-50 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                        {" "}
                        edit profile
                    </button>
                </div>
            </div>
            <div className="w-[95%] h-[70%]  rounded-2xl bg-white border-2 flex  justify-around items-start flex-wrap">
                {profileData.map((idx, key) => {
                    return <Profile_infocard key={key} idx={idx} />;
                })}
            </div>
        </div>
    );
};

export default page;
