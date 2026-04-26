"use client";
import React, { useEffect, useState } from "react";
import OrgansiationCard from "@/components/OrgansiationCard";
import api from "@/lib/axios";
import usePageStore from "@/store/pages/usePageStore";
import useUserStore from "@/store/user/useUserstore";
import { HiOutlineHome } from "react-icons/hi";
const page = () => {
    const [organisations, setorganisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.user);
    const setTitle = usePageStore((state) => state.setTitle);
    const setActivePage = usePageStore((state) => state.setActivePage);
    useEffect(() => {
        setTitle("Organisations");
        setActivePage("Organisation");
    }, []);
    useEffect(() => {
        const fetchOrganisation = async () => {
            if (!user) return;
            try {
                if (user?.role === "Admin") {
                    const response = await api.get(
                        "/organisation/fetchOrganisations",
                    );
                    setorganisations(response.data.organisations);
                } else if (user?.role === "Manager") {
                    const response = await api.get(
                        "/Manager/Organisation/GetOrganisation",
                        { params: { managerId: user?.id } },
                    );
                    setorganisations(response.data.organisations);
                } else if (user?.role === "Member") {
                    const response = await api.get(
                        "/Member/Organisation/GetOrganisation",
                        { params: { memberId: user?.id } },
                    );
                    console.log(response.data);
                    setorganisations(response.data.organisations);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrganisation();
    }, [user]);
    if (loading)
        return (
            <div className="w-full h-[90%] bg-[#f9fafb] flex justify-evenly items-start overflow-y-auto flex-wrap">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-[45%] h-[15%] animate-pulse [animation-duration:1s] rounded-2xl bg-[#ffffff] transition-all duration-300 hover:scale-103 hover:shadow-lg shadow-xl mt-4 flex flex-col justify-center items-center border-b-4 border-r-4 border-[#2c84db]"
                    >
                        <div className="w-[90%] h-[40%] flex justify-around items-center ">
                            <div className="w-13 h-13 bg-gray-300 rounded-2xl animate-pulse [animation-duration:1s]" />
                            <div className="w-[80%] h-full flex justify-start items-center">
                                <div className="w-[70%] h-6 flex justify-start items-center text-xl font-semibold bg-gray-300 rounded animate-pulse [animation-duration:1s]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    return (
        <div className="w-full h-[90%] bg-[#f9fafb] flex justify-evenly items-start overflow-y-auto flex-wrap">
            {organisations.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="p-6 border-2 rounded-lg bg-gray-200 shadow-lg">
                        <HiOutlineHome size={40}/>
                    </div>
                    <div className="text-2xl font-bold flex items-center justify-center">
                        No organisation yet
                    </div>
                    <div className="w-[45%] text-center flex items-center justify-center text-gray-500">
                        You're not part of any organisation. Create one to start managing projects and teams.
                    </div>
                </div>
            ) : (
                organisations.map((idx, key) => {
                    return <OrgansiationCard key={key} idx={idx} />;
                })
            )}
            {}
        </div>
    );
};

export default page;
