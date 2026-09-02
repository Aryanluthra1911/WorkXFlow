"use client";
import React, { useEffect, useState } from "react";
import { Piechart_Block } from "@/components/Piechart_Block";
import SmallProjectCard from "@/components/SmallProjectCard";
import useUserStore from "@/store/user/useUserstore";
import api from "@/lib/axios";
import { ChartBarMultiple } from "./ChartBarMultiple";
import usePageStore from "@/store/pages/usePageStore";
import { LuClipboardList } from "react-icons/lu";
import EmptyState from "@/components/ui/EmptyState";


const Member_dashboard = () => {
    const user = useUserStore((state) => state.user);
    const setTitle = usePageStore((state) => state.setTitle);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [statusData, setStatusData] = useState([]);

    const OngoingTaskAndProjects = [
        {
            title: "Task",
            content: tasks,
        },
        {
            title: "Project",
            content: projects,
        },
    ];
    const getColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "#93c5fd";
            case "PENDING":
                return "#fcd34d";
            case "COMPLETED":
                return "#6ee7b7";
            case "CANCELLED":
                return "#fca5a5";
            case "ON_HOLD":
                return "#c4b5fd";
            default:
                return "#9ca3af";
        }
    };
    const StatuschartData = statusData.map((item) => ({
        status: item.status.toLowerCase(),
        count: item._count.status,
        fill: getColor(item.status),
    }));
    const statusChartConfig = {
        count: {
            label: "Tasks",
        },
        active: {
            label: "Active",
            color: "#93c5fd",
        },
        pending: {
            label: "Pending",
            color: "#fcd34d",
        },
        completed: {
            label: "Completed",
            color: "#6ee7b7",
        },
        cancelled: {
            label: "Cancelled",
            color: "#fca5a5",
        },
        on_hold: {
            label: "On Hold",
            color: "#c4b5fd",
        },
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const statusRes = await api.get(
                    "/Member/Dashboard/GetTaskStatus",
                    { params: { memberId: user?.id } },
                );
                const taskRes = await api.get(
                    "/Member/Dashboard/GetTasksByUserId",
                    { params: { memberId: user?.id } },
                );
                const projectRes = await api.get(
                    "/Member/Dashboard/GetProjectsByUserId",
                    { params: { memberId: user?.id } },
                );
                setTasks(taskRes.data.tasks);
                setProjects(projectRes.data.projects);
                setStatusData(statusRes.data.statusCount);
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    useEffect(() => {
        setTitle("Member Dashboard");
    }, []);
    return (
        <div className="w-full h-[90%] bg-[#f9fafb] flex flex-col justify-evenly items-center">
            <div className="w-full h-[50%] flex justify-evenly items-center">
                <Piechart_Block
                    title={"Task Status Distribution"}
                    className={"w-[25%] h-[90%]"}
                    data={StatuschartData}
                    chartConfig={statusChartConfig}
                    dataKey="count"
                    nameKey="status"
                    loading={loading}
                />
                {OngoingTaskAndProjects.map((idx, key) => {
                    const content = idx.content;
                    return (
                        <div
                            idx={idx}
                            key={key}
                            className="w-[35.5%] h-[90%] border-2 rounded-2xl bg-white flex flex-col items-center justify-around shadow-md"
                        >
                            <div className="w-[90%] h-[15%] text-xl font-bold flex items-center justify-center">
                                Ongoing {idx.title}s
                            </div>
                            <div className="w-[90%] h-[70%]  overflow-y-auto no-scrollbar space-y-2">
                                {loading ? (
                                    Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="w-full h-20 bg-gray-300 animate-pulse [animation-duration:1s] rounded-lg p-4 shadow-sm hover:scale-97 hover:shadow-md transition-all duration-500"
                                            />
                                        ),
                                    )
                                ) : content.length === 0 ? (
                                    <EmptyState
                                        icon={LuClipboardList}
                                        title={`No ${idx.title} Data`}
                                        size="sm"
                                    />
                                ) : (
                                    (idx.content || []).map((idx2, key) => (
                                        <SmallProjectCard
                                            key={key}
                                            idx={idx2}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full h-[50%] flex justify-center items-center">
                <ChartBarMultiple
                    className={"w-[98%] h-[95%] flex justify-evenly "}
                />
            </div>
        </div>
    );
};

export default Member_dashboard;
