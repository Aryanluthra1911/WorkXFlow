"use client";
import TaskCard from "@/components/TaskCard";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHourglassHalf } from "react-icons/fa";
import { FaBolt, FaCheck, FaPause, FaTimes } from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { RxCross2 } from "react-icons/rx";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import useUserStore from "@/store/user/useUserstore";
import usePageStore from "@/store/pages/usePageStore";

const AVATAR_COLORS = [
    "bg-emerald-700",
    "bg-indigo-700",
    "bg-orange-700",
    "bg-sky-700",
    "bg-rose-700",
    "bg-violet-700",
];

const avatarColor = (name) =>
    AVATAR_COLORS[(name?.length || 0) % AVATAR_COLORS.length];

const page = () => {
    const params = useParams();
    const { project_Id } = params;
    const user = useUserStore((state) => state.user);
    const [project, setproject] = useState([]);
    const [tasks, settasks] = useState([]);
    const [open, setopen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState([]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );
    const columnData = [
        {
            title: "PENDING",
            label: "Pending",
            accent: "#f59e0b",
            bg: "#fffbeb",
            bg2: "#fef3c7",
            txtClr: "#b5540b",
            icon: FaHourglassHalf,
        },
        {
            title: "ACTIVE",
            label: "Active",
            accent: "#3b82f6",
            bg: "#eff6ff",
            bg2: "#dbeafe",
            txtClr: "#1d4ed8",
            icon: FaBolt,
        },
        {
            title: "COMPLETED",
            label: "Completed",
            accent: "#10b981",
            bg: "#f0fdf6",
            bg2: "#d1fae5",
            txtClr: "#065f46",
            icon: FaCheck,
        },
        {
            title: "ON_HOLD",
            label: "On Hold",
            accent: "#8b5cf6",
            bg: "#faf5ff",
            bg2: "#ede9fe",
            txtClr: "#5b21b6",
            icon: FaPause,
        },
        {
            title: "CANCELLED",
            label: "Cancelled",
            accent: "#ef4444",
            bg: "#fff1f1",
            bg2: "#fee2e2",
            txtClr: "#991b1b",
            icon: FaTimes,
        },
    ];
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const columnTitles = columnData.map((c) => c.title);
        let newStatus;
        if (columnTitles.includes(over.id)) {
            newStatus = over.id;
        } else {
            const overTask = tasks.find((t) => t.id === over.id);
            newStatus = overTask?.status;
        }
        if (!newStatus) return;
        const taskToMove = tasks.find((t) => t.id === activeId);
        if (!taskToMove) return;
        if (taskToMove.status === newStatus) return;
        settasks((prev) =>
            prev.map((task) =>
                task.id === activeId ? { ...task, status: newStatus } : task,
            ),
        );
        try {
            await api.patch("/organisation/updateTaskStatus", {
                taskId: activeId,
                status: newStatus,
            });
        } catch (error) {
            console.log(error);
        }
    };
    const Column = ({ column, tasks, children }) => {
        const { setNodeRef } = useDroppable({ id: column.title });
        return (
            <div
                ref={setNodeRef}
                className="flex-1 w-full overflow-y-auto no-scrollbar space-y-3 p-3"
            >
                {children}
            </div>
        );
    };
    const [loading, setloading] = useState(false);
    const setTitle = usePageStore((state) => state.setTitle);
    const setActivePage = usePageStore((state) => state.setActivePage);
    useEffect(() => {
        setTitle("Tasks");
        setActivePage("Organisation");
    }, []);
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!user) return;
            try {
                setloading(true);
                console.log(user, project_Id);
                if (user?.role === "Member") {
                    const res = await api.get(`Member/Organisation/GetTasks`, {
                        params: { projectId: project_Id, memberId: user?.id },
                    });
                    setproject(res.data.data);
                    settasks(res.data.data.task);
                    console.log(res.data.data.task);
                } else {
                    const res = await api.get(
                        `/organisation/fetchProjectData?projectId=${project_Id}`,
                    );
                    setproject(res.data.data);
                    settasks(res.data.data.task);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setloading(false);
            }
        };
        fetchProjectData();
    }, [user]);
    if (loading) {
        return (
            <div className="w-full h-[90%] bg-[#f9fafb] overflow-x-auto p-4">
                <div className="grid grid-cols-5 gap-4 h-full min-w-[1100px]">
                    {columnData.map((idx, key) => (
                        <div
                            key={key}
                            className="bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col overflow-hidden"
                        >
                            <div
                                style={{ borderBottomColor: idx.accent }}
                                className="w-full px-4 py-3 border-b-2 bg-gray-50 flex items-center justify-between shrink-0"
                            >
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse [animation-duration:900ms]" />
                                <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse [animation-duration:900ms]" />
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 p-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-24 bg-gray-100 animate-pulse [animation-duration:900ms] rounded-xl border border-gray-200"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragStart={(event) => {
                const task = tasks.find((t) => t.id === event.active.id);
                setActiveTask(task);
            }}
            onDragEnd={(event) => {
                handleDragEnd(event);
                setActiveTask(null);
            }}
        >
            <div className="w-full h-[90%] bg-[#f9fafb] overflow-x-auto p-4">
                <div className="grid grid-cols-5 gap-4 h-full min-w-[1100px]">
                    {columnData.map((idx, key) => {
                        const Icon = idx.icon;
                        const filteredTasks = tasks.filter(
                            (task) => task.status === idx.title,
                        );
                        return (
                            <div
                                key={key}
                                className="bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col overflow-hidden"
                            >
                                <div
                                    style={{
                                        borderBottomColor: idx.accent,
                                        color: idx.txtClr,
                                    }}
                                    className="w-full px-4 py-3 border-b-2 bg-gray-50 flex items-center justify-between shrink-0"
                                >
                                    <div className="flex items-center gap-2 font-semibold text-sm">
                                        <Icon size={13} style={{ color: idx.accent }} />
                                        {idx.label}
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: idx.bg2,
                                            color: idx.txtClr,
                                        }}
                                        className="min-w-6 h-6 px-1.5 flex items-center justify-center text-xs rounded-full font-bold"
                                    >
                                        {filteredTasks.length}
                                    </div>
                                </div>
                                <SortableContext
                                    items={filteredTasks.map((task) => task.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Column column={idx}>
                                        {filteredTasks.length === 0 ? (
                                            <div className="text-xs text-gray-300 text-center pt-6 italic">
                                                No tasks
                                            </div>
                                        ) : (
                                            filteredTasks.map((task) => (
                                                <TaskCard
                                                    idx2={task}
                                                    idx={idx}
                                                    key={task.id}
                                                    onClick={() => (
                                                        setopen(true),
                                                        setSelectedTask(task)
                                                    )}
                                                />
                                            ))
                                        )}
                                    </Column>
                                </SortableContext>
                            </div>
                        );
                    })}
                </div>
                {open && (
                    <TaskDetails
                        task={selectedTask}
                        project={project}
                        onClose={() => setopen(false)}
                    />
                )}
            </div>
            <DragOverlay>
                {activeTask ? (
                    <div className="w-full bg-white rounded-xl border border-gray-200 p-3 shadow-2xl">
                        <div className="font-bold text-sm">
                            {activeTask.title}
                        </div>
                        <div className="text-xs text-gray-400">
                            {activeTask.description}
                        </div>
                        <div className="flex gap-2 text-xs items-center mt-2">
                            <div className={`w-7 h-7 ${avatarColor(activeTask.assignedTo)} rounded-2xl flex justify-center items-center text-white text-sm font-semibold`}>
                                {activeTask.assignedTo
                                    ?.split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            {activeTask.assignedTo?.toUpperCase()}
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

function TaskDetails({ onClose, project, task }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "N/A";
    const formatString = (str) =>
        str
            ? str.toLowerCase().charAt(0).toUpperCase() +
            str.toLowerCase().slice(1)
            : "";
    const data = [
        { category: " Task Title ", value: formatString(task.title )},
        { category: " Description ", value: task.description },
        { category: " Due Date ", value: formatDate(task.dueDate) },
        { category: " Status ", value: formatString(task.status) },
        { category: " Assigned Date ", value: formatDate(task.assignedDate) },
        { category: " Project ", value: formatString(project.title) },
        { category: " Project Manager ", value: formatString(project.projectManager) },
        { category: " Project Description ", value: project.description },
    ];
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <div className="relative z-10 w-[40%] h-[75%] mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 transform transition-all duration-200 flex flex-col items-center justify-evenly">
                <div className="w-[95%] h-[10%] flex items-center justify-between">
                    <div className="text-2xl font-bold h-full w-70 flex items-center ">
                        Task Information
                    </div>
                    <div
                        onClick={onClose}
                        className="h-9 w-9 flex justify-center items-center rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                        <RxCross2 className="h-5 w-5 shrink-0 text-gray-400 hover:text-black dark:text-neutral-200 transform transition-all duration-200" />
                    </div>
                </div>
                <div className="w-[95%] h-[60%] flex items-center justify-evenly flex-2 flex-wrap">
                    {data.map((idx, key) => (
                        <div key={key} className="w-[48%] h-15  gap-4">
                            <div className="w-full h-[35%] text-sm font-bold text-gray-500 flex items-center justify-start">
                                {idx.category.toUpperCase()}
                            </div>
                            <div className="w-full h-[60%] flex items-center justify-start text-sm font-semibold text-black">
                                {idx.value}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-1 border-[#ebebeb] w-[95%]" />
                <div className="w-[95%] h-[15%] flex flex-col justify-around items-center">
                    <div className="w-[98%] h-[35%] text-sm font-bold text-gray-500 flex items-start justify-start">
                        Related Documents :
                    </div>
                    <div className="w-[98%] h-[60%] text-sm font-medium text-gray-400 italic">
                        No Documents Attached
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;