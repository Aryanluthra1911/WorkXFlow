"use client";
import React, { useEffect, useState } from "react";
import OrgansiationCard from "@/components/OrgansiationCard";
import api from "@/lib/axios";
import usePageStore from "@/store/pages/usePageStore";
import useUserStore from "@/store/user/useUserstore";
import { HiOutlineHome } from "react-icons/hi";
import EmptyState from "@/components/ui/EmptyState";
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
            <div className="w-full h-[90%] bg-[#f9fafb] overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                        >
                            <div className="w-14 h-14 shrink-0 bg-gray-200 rounded-2xl animate-pulse [animation-duration:1s]" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-5 w-3/5 bg-gray-200 rounded animate-pulse [animation-duration:1s]" />
                                <div className="h-3 w-2/5 bg-gray-100 rounded animate-pulse [animation-duration:1s]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    return (
        <div className="w-full h-[90%] bg-[#f9fafb] overflow-y-auto p-6">
            {organisations.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <EmptyState
                        icon={HiOutlineHome}
                        title="No organisation yet"
                        description="You're not part of any organisation. Create one to start managing projects and teams."
                        size="lg"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {organisations.map((idx, key) => {
                        return <OrgansiationCard key={key} idx={idx} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default page;