"use client";
import api from "@/lib/axios";
import useUserStore from "@/store/user/useUserstore";
import React, { useEffect, useState } from "react";
import { LuClipboardCheck } from "react-icons/lu";
import TaskCard from "./TaskCard";
import SmallProjectCard from "./SmallProjectCard";
import EmptyState from "./ui/EmptyState";
const TaskDetailBlock = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const FetchTaskDetails = async () => {
            try {
                const res = await api.get("/Manager/Dashboard/GetTaskDetails", {
                    params: { managerId: user?.id },
                });
                setTasks(res.data.tasks);
            } catch (error) {
                console.log("route error");
            } finally {
                setLoading(false);
            }
        };
        FetchTaskDetails();
    }, [user]);
    if (loading) {
        return (
            <div className="h-[95%] w-[48%] bg-white rounded-2xl shadow-lg border-2 flex flex-col items-center justify-around border-t-[#0d9488] border-t-3">
                <div className="h-[15%] w-[90%] flex gap-4 items-center">
                    <div className="w-[10%] h-[90%] rounded-xl bg-[#ccfbf1] flex justify-center items-center">
                        <LuClipboardCheck className="h-7 w-7 shrink-0 text-[#0d9488] dark:text-neutral-200" />
                    </div>
                    <div className="text-2xl font-semibold text-[#0d9488]">
                        Task Details
                    </div>
                </div>
                <div className="h-[75%] w-[95%] overflow-y-auto no-scrollbar space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full h-20 bg-gray-300 animate-pulse [animation-duration:1s] rounded-lg p-4 shadow-sm hover:scale-97 hover:shadow-md transition-all duration-500"
                        />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="h-[95%] w-[48%] bg-white rounded-2xl shadow-lg border-2 flex flex-col items-center justify-around border-t-[#0d9488] border-t-3">
            <div className="h-[15%] w-[90%] flex gap-4 items-center">
                <div className="w-[10%] h-[90%] rounded-xl bg-[#ccfbf1] flex justify-center items-center">
                    <LuClipboardCheck className="h-7 w-7 shrink-0 text-[#0d9488] dark:text-neutral-200" />
                </div>
                <div className="text-2xl font-semibold text-[#0d9488]">
                    Task Details
                </div>
            </div>
            <div className="h-[75%] w-[95%] overflow-y-auto no-scrollbar space-y-2">
                {tasks?.length === 0 ? (
                    <EmptyState
                        icon={LuClipboardCheck}
                        title="No Task Found"
                        size="sm"
                    />
                ) : (
                    tasks.map((idx, key) => {
                        console.log(idx);
                        return <SmallProjectCard key={key} idx={idx} />;
                    })
                )}
            </div>
        </div>
    );
};

export default TaskDetailBlock;
