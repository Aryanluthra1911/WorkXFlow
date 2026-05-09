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
            borderClr: "#fcd34d",
            bg: "#fffbeb",
            bg2: "#fef3c7",
            txtClr: "#b5540b",
            icon: FaHourglassHalf,
        },
        {
            title: "ACTIVE",
            borderClr: "#93c5fd",
            bg: "#eff6ff",
            bg2: "#dbeafe",
            txtClr: "#1d4ed8",
            icon: FaBolt,
        },
        {
            title: "COMPLETED",
            borderClr: "#6ee7b7",
            bg: "#f0fdf6",
            bg2: "#d1fae5",
            txtClr: "#065f46",
            icon: FaCheck,
        },
        {
            title: "ON_HOLD",
            borderClr: "#c4b5fd",
            bg: "#faf5ff",
            bg2: "#ede9fe",
            txtClr: "#5b21b6",
            icon: FaPause,
        },
        {
            title: "CANCELLED",
            borderClr: "#fca5a5",
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
                className="w-[93%] h-[92%] overflow-y-auto no-scrollbar space-y-3 pt-2"
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
            <div className="w-full h-[90%] bg-[#f3f4f6] flex justify-evenly items-center">
                {columnData.map((idx, key) => {
                    const Icon = idx.icon;
                    const filteredTasks = tasks.filter(
                        (task) => task.status === idx.title,
                    );
                    return (
                        <div
                            idx={idx}
                            key={key}
                            className="w-[18%] h-[95%] bg-[#f3f4f6] border-2 border-[#e5e7eb] rounded-2xl flex flex-col items-center justify-evenly"
                        >
                            <div
                                style={{
                                    backgroundColor: idx.bg,
                                    color: idx.txtClr,
                                    borderColor: idx.borderClr,
                                    borderBottomColor: idx.txtClr,
                                }}
                                className={`w-full h-[7%] rounded-t-xl border-2 border-b-4 shadow-lg flex justify-evenly items-center`}
                            >
                                <div className="w-[80%] h-full flex items-center justify-center  font-bold gap-2">
                                    <Icon
                                        size={13}
                                        style={{ color: idx.txtClr }}
                                    />
                                    {idx.title}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: idx.bg2,
                                        color: idx.txtClr,
                                        borderColor: idx.borderClr,
                                    }}
                                    className="w-[10%] h-[60%] flex items-center justify-center text-xs border rounded-full shadow-lg font-bold"
                                >
                                    
                                    {filteredTasks.length}
                                </div>
                            </div>
                            <div className="w-[93%] h-[92%] overflow-y-auto no-scrollbar space-y-3 pt-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-25 bg-gray-300 animate-pulse [animation-duration:900ms] rounded-xl border-r-2
                            border-b-2 border-gray-400"
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
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
            <div className="w-full h-[90%] bg-[#f3f4f6] flex justify-evenly items-center">
                {columnData.map((idx, key) => {
                    const Icon = idx.icon;
                    const filteredTasks = tasks.filter(
                        (task) => task.status === idx.title,
                    );
                    return (
                        <div
                            idx={idx}
                            key={key}
                            className="w-[18%] h-[95%] bg-[#f3f4f6] border-2 border-[#e5e7eb] rounded-2xl flex flex-col items-center justify-evenly"
                        >
                            <div
                                style={{
                                    backgroundColor: idx.bg,
                                    color: idx.txtClr,
                                    borderColor: idx.borderClr,
                                    borderBottomColor: idx.txtClr,
                                }}
                                className={`w-full h-[7%] rounded-t-xl border-2 border-b-4 shadow-lg flex justify-evenly items-center`}
                            >
                                <div className="w-[80%] h-full flex items-center justify-center  font-bold gap-2">
                                    <Icon
                                        size={13}
                                        style={{ color: idx.txtClr }}
                                    />
                                    {idx.title}
                                </div>
                                <div
                                    style={{
                                        backgroundColor: idx.bg2,
                                        color: idx.txtClr,
                                        borderColor: idx.borderClr,
                                    }}
                                    className="w-[10%] h-[60%] flex items-center justify-center text-xs border rounded-full shadow-lg font-bold"
                                >
                                    {filteredTasks.length}
                                </div>
                            </div>
                            <SortableContext
                                items={filteredTasks.map((task) => task.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Column column={idx}>
                                    {filteredTasks.map((task) => (
                                        <TaskCard
                                            idx2={task}
                                            idx={idx}
                                            key={task.id}
                                            onClick={() => (
                                                setopen(true),
                                                setSelectedTask(task)
                                            )}
                                        />
                                    ))}
                                </Column>
                            </SortableContext>
                        </div>
                    );
                })}
                {console.log(open)}
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
                            <div className="w-7 h-7 bg-[#2563eb] rounded-2xl flex justify-center items-center text-white text-sm font-semibold">
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
                        className="h-[90%] w-10 flex justify-center items-center rounded-xl"
                    >
                        <RxCross2 className="h-6 w-6 shrink-0 text-gray-400 hover:text-black dark:text-neutral-200 transform transition-all duration-200" />
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
