"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import useUserStore from "@/store/user/useUserstore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import CountUp from "@/components/ui/CountUp";
import { FiCheckSquare } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
import FeatureCard from "@/components/FeatureCard";
import BlurText from "@/components/BlurText";
import { AiFillStar } from "react-icons/ai";
import { ThreeDot } from "react-loading-indicators";
import { MdOutlineAnalytics } from "react-icons/md";
import { RiRobot2Fill } from "react-icons/ri";
import { BsChatLeftTextFill } from "react-icons/bs";
import { TbLayoutKanban } from "react-icons/tb";
const page = () => {
    const router = useRouter();
    const { status } = useSession();
    const clearUser = useUserStore((state) => state.clearUserStore);
    const DotColor = ["#ff5f57", "#febc2e", "#28c840"];
    const getBgColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "#eff6ff";
            case "PENDING":
                return "#fffbeb";
            case "COMPLETED":
                return "#f0fdf6";
            case "CANCELLED":
                return "#fff1f1";
            case "ON_HOLD":
                return "#faf5ff";
            default:
                return "#9ca3af";
        }
    };
    const getColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "#1d4ed8";
            case "PENDING":
                return "#b5540b";
            case "COMPLETED":
                return "#065f46";
            case "CANCELLED":
                return "#991b1b";
            case "ON_HOLD":
                return "#5b21b6";
            default:
                return "#9ca3af";
        }
    };
    const getBorder = (status) => {
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
    const roleCardData = [
        {
            svg: MdAdminPanelSettings,
            title: "Admin ",
            bg: "#eff6ff",
            bg2: "#fafcff",
            text: "#2563eb",
            border: "#bfdbfe",
            size: 18,
            responsibility: "Full Control",
            description:
                "Super user with unrestricted access. Admins create projects, manage all users, assign any task, and oversee the entire organisation.",
            points: [
                "Create & manage organisations",
                "Add / remove all users",
                "Assign tasks to anyone",
                "View all projects & activity",
                "Access User Controls panel",
            ],
        },
        {
            svg: MdManageAccounts,
            title: "Manager",
            bg: "#ecfdf5",
            bg2: "#fafffe",
            text: "#059669",
            border: "#a7f3d0",
            size: 20,
            responsibility: "Team Lead",
            description:
                "Managers run the day-to-day. They assign tasks to their members, track project progress, and keep workflows moving efficiently.",
            points: [
                "Create & assign new tasks",
                "View team task details",
                "Monitor project progress",
                "Access team chat",
                "View user activity logs",
            ],
        },
        {
            svg: FaUser,
            title: "Member",
            bg: "#f5f3ff",
            bg2: "#fdfaff",
            text: "#8446ee",
            border: "#ddd6fe",
            size: 14,
            responsibility: "Contributor",
            description:
                "Managers run the day-to-day. They assign tasks to their members, track project progress, and keep workflows moving efficiently.",
            points: [
                "View assigned tasks & status",
                "Track ongoing projects",
                "Task status distribution chart",
                "Monthly activity bar chart",
                "Team chat & AI assistant",
            ],
        },
    ];
    const dashboardCardData = [
        {
            svg: FiCheckSquare,
            title: "Active Tasks",
            count: 12,
            description: "8 in progress - 4 on hold",
            clr: "#2563eb",
            bg: "#eff6ff",
        },
        {
            svg: FiFolder,
            title: "Projects",
            count: 7,
            description: "2 due this week",
            clr: "#059669",
            bg: "#ecfdf5",
        },
    ];
    const projectDetailsData = [
        {
            title: "Design landing page",
            status: "PENDING",
        },
        {
            title: "Fix authentication bugs",
            status: "ACTIVE",
        },
        {
            title: "Setup database schema",
            status: "ON_HOLD",
        },
        {
            title: "Implement real-time chat",
            status: "COMPLETED",
        },
    ];
    const FeaturesCardData = [
        {
            title: "Role-Based Access Control",
            bg: "#eff6ff",
            svg: MdAdminPanelSettings,
            border: "#2563eb",
            description:
                "Admin, Manager, and Member roles with clearly defined permissions ensure secure access, structured workflow, and better accountability across the organization.",
        },
        {
            title: "Smart Task Assignment",
            bg: "#ecfdf5",
            svg: FiCheckSquare,
            border: "#059669",
            description:
                "Admins and Managers can assign tasks with deadlines, priorities, and status updates, ensuring clarity, accountability, and smooth project execution.",
        },
        {
            title: "Progress & Activity Tracking",
            bg: "#f5f3ff",
            svg: MdOutlineAnalytics,
            border: "#7c3aed",
            description:
                "Tracks user activity and project progress with insights like monthly performance and task completion, helping teams monitor efficiency and improve productivity.",
        },
        {
            title: "AI Assistant (Gemini Powered)",
            bg: "#eff6ff",
            svg: RiRobot2Fill,
            border: "#2563eb",
            description:
                "An integrated AI assistant helps resolve work-related queries, guide users, and improve productivity by providing instant, intelligent support within the platform.",
        },
        {
            title: "Real-Time Team Chat",
            bg: "#ecfdf5",
            svg: BsChatLeftTextFill,
            border: "#059669",
            description:
                "Built-in real-time chat enables seamless communication between team members, reducing dependency on external tools and keeping discussions contextually linked.",
        },
        {
            title: "Kanban Task Management",
            bg: "#f5f3ff",
            svg: TbLayoutKanban,
            border: "#7c3aed",
            description:
                "Tasks are organized in a visual Kanban board with multiple statuses, helping teams track progress, identify bottlenecks, and manage workflow efficiently.",
        },
    ];
    const AiFeatures = [
        {
            title: "Instant doubt resolution",
            description:
                "Ask anything about your project and get accurate, contextual answers in seconds.",
        },
        {
            title: "Always in context",
            description:
                "The AI understands your workflow and provides relevant, actionable guidance every time.",
        },
        {
            title: "Available 24/7",
            description:
                "No waiting for teammates in different timezones — the AI is always ready to help.",
        },
    ];
    const Aichats = [
        {
            message: "How do I check my task status?",
            border: "#bfdbfe",
            bg: "#eff6ff",
            position: "right",
        },
        {
            message: `Head to your Member Dashboard — the "Ongoing Tasks" section shows all active tasks with their current status. The donut chart gives you a quick distribution overview! `,
            border: "#e8eaed",
            bg: "#f7f8fa",
            position: "left",
        },
        {
            message: "Can managers see all team activity?",
            border: "#bfdbfe",
            bg: "#eff6ff",
            position: "right",
        },
        {
            message:
                "Yes! Managers have the User Activity panel to track task progress. The Project Details table shows real-time completion % per project.",
            border: "#e8eaed",
            bg: "#f7f8fa",
            position: "left",
        },
    ];
    const HowItWorks = [
        {
            idx: "01",
            title: "Create Project",
            description:
                "Admin creates a project by adding details like title, description, due date, documents, and organization.",
        },
        {
            idx: "02",
            title: "Setup Organization",
            description:
                "If the organization exists, the project is added to it; otherwise, a new one is created.",
        },
        {
            idx: "03",
            title: "Assign Tasks",
            description:
                "Admins and managers divide the project into tasks and assign them to team members.",
        },
        {
            idx: "04",
            title: "Collaborate & Complete",
            description:
                "Members work on tasks, collaborate, and track progress until completion.",
        },
    ];
    useEffect(() => {
        if (status === "unauthenticated") {
            clearUser();
        }
    }, [status]);
    const GetStarted = () => {
        if (status === "authenticated") {
            router.push("/dashboard");
        } else {
            router.push("/register");
        }
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white overflow-y-auto no-scrollbar flex flex-col gap-25">
            <Navbar className={"w-full h-20 border fixed top-0 z-50"} />
            <div
                id="home"
                className="w-full flex flex-col items-center pt-24 pb-20 gap-10 px-6"
            >
                {/* Badge */}
                <div className="py-1.5 border border-[#bfdbfe] flex items-center justify-center text-sm font-semibold rounded-full px-4 text-[#2563eb] gap-2.5 shadow-sm bg-[#eff6ff]">
                    <div className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse [animation-duration:1.2s]" />
                    Powered by Gemini AI · Real-time Collaboration
                </div>

                {/* Heading */}
                <div className="font-extrabold font-sans text-5xl sm:text-6xl md:text-7xl max-w-4xl flex flex-col items-center justify-center text-center leading-tight gap-2">
                    <span className="text-gray-950">One Platform for</span>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                        <span className="text-[#2563eb]">Admins,</span>
                        <span className="text-[#059669]">Managers</span>
                        <span className="text-gray-950">&</span>
                        <span className="text-[#7c3aed]">Members</span>
                    </div>
                </div>

                {/* Subtext */}
                <div className="max-w-2xl text-base sm:text-lg text-center font-medium text-[#6b7280] leading-relaxed">
                    WorkXflow is an intelligent workflow platform that enables structured team collaboration through role-based access, Kanban task management, real-time communication, and AI-powered assistance, helping teams stay aligned, track progress efficiently, and deliver faster with clarity.
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                    <button
                        onClick={() => {
                            router.push("/signin");
                        }}
                        className="flex items-center gap-2.5 bg-gradient-to-r from-zinc-950 to-zinc-700 text-zinc-50 hover:text-white text-[15px] px-6 py-3 rounded-full border-0 font-semibold shadow-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => GetStarted()}
                        className="flex items-center gap-3 bg-gradient-to-r from-zinc-950 to-zinc-700 text-zinc-50 hover:text-white text-[15px] pl-6 pr-2 py-2 rounded-full border-0 font-semibold shadow-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                    >
                        Get started
                        <span className="size-9 shrink-0 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                            <FaArrowRight size={15} className="text-black" />
                        </span>
                    </button>
                </div>

                {/* Role badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    {roleCardData.map((idx, key) => {
                        const Icon = idx.svg;
                        return (
                            <div
                                key={key}
                                style={{
                                    border: `1px solid ${idx.border}`,
                                    backgroundColor: idx.bg,
                                    color: idx.text,
                                }}
                                className="px-4 py-1.5 rounded-full gap-2 flex items-center justify-center font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Icon size={idx.size} />
                                {idx.title} - {idx.responsibility}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col items-center gap-15 justify-center">
                <div className="w-[70%]  rounded-2xl min-h-100 shadow-xl border-2 space-y-10 bg-[#f7f8fa] pb-5">
                    <div className="h-15 w-full bg-[#f9fafb] flex items-center  rounded-t-2xl border-b-1">
                        <div className="w-[8%] h-full flex items-center justify-around pl-2">
                            {DotColor.map((clr, key) => (
                                <div
                                    key={key}
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: `${clr}` }}
                                />
                            ))}
                        </div>
                        <div className="w-[85%]  flex items-center justify-center">
                            <div className=" h-full flex items-center justify-center bg-[#e8eaed] rounded-xl">
                                <div className="px-15 py-1 text-[#9ca3af] font-semibold text-sm">
                                    workxflow.app/dashboard
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full  flex flex-col items-center gap-10">
                        <div className="text-3xl font-bold flex items-center justify-center">
                            Manager Dashboard
                        </div>
                        <div className="w-[90%] flex items-center justify-between">
                            {dashboardCardData.map((idx, key) => {
                                const Icon = idx.svg;
                                return (
                                    <div
                                        key={key}
                                        className="w-[48%] flex flex-col border-2 rounded-xl px-3 py-3 bg-[#ffffff] shadow-lg"
                                    >
                                        <div
                                            style={{ color: `${idx.clr}` }}
                                            className="w-full py-2 gap-4 flex items-center text-xl font-semibold"
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: `${idx.bg}`,
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg "
                                            >
                                                <Icon
                                                    size={20}
                                                    style={{
                                                        color: `${idx.clr}`,
                                                    }}
                                                />
                                            </div>

                                            {idx.title}
                                        </div>
                                        <div className="w-full py-2 flex justify-center items-center text-3xl font-extrabold ">
                                            <CountUp
                                                from={0}
                                                to={idx.count}
                                                separator=","
                                                direction="up"
                                                duration={1}
                                                className="count-up-text"
                                                startCounting={false}
                                            />
                                        </div>
                                        <div className="w-full py-2 text-sm flex items-center justify-center text-[#9ca3af]">
                                            {idx.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-[90%] flex flex-col items-center gap-2">
                            {projectDetailsData.map((idx, key) => {
                                const bg = getBgColor(idx.status);
                                const color = getColor(idx.status);
                                const border = getBorder(idx.status);
                                return (
                                    <div
                                        key={key}
                                        className="w-full flex items-center justify-between rounded-xl border bg-white py-2 px-4 shadow-lg"
                                    >
                                        <div className="font-semibold text-sm">
                                            {idx.title}
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    backgroundColor: bg,
                                                    color: color,
                                                    borderColor: border,
                                                }}
                                                className="border inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            >
                                                {idx.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="features"
                className="w-full flex justify-center items-center scroll-mt-24"
            >
                <div className="w-[90%] flex flex-col gap-6">
                    <div className="w-50 py-1 border-2 border-[#bfdbfe] flex items-center justify-center text-sm font-semibold rounded-2xl px-4 text-[#2563eb] adow-md bg-[#eff6ff]">
                        PLATFORM FEATURES
                    </div>

                    <BlurText
                        text="Everything your team needs to ship faster"
                        className="text-3xl w-[40%] font-extrabold text-center "
                        delay={100}
                        animateBy="words"
                        direction="top"
                    />

                    <div className="w-[35%] text-[#6b728f] font-light">
                        Built for real workflows — from task creation to
                        delivery, every step covered with role-aware tools.
                    </div>
                    <div className="w-full flex justify-between items-center flex-wrap flex-3 gap-8 ">
                        {FeaturesCardData.map((idx, key) => (
                            <FeatureCard key={key} idx={idx} />
                        ))}
                    </div>
                </div>
            </div>
            <div
                id="roles"
                className="w-full flex justify-center items-center scroll-mt-24"
            >
                <div className="w-[90%] flex flex-col gap-6">
                    <div className="w-40 py-1 border-2 border-[#a7f3d0] flex items-center justify-center text-sm font-semibold rounded-2xl px-4 text-[#059869] adow-md bg-[#ecfdf5]">
                        ACCESS ROLES
                    </div>
                    <BlurText
                        text="The right access for every team member"
                        className="text-3xl w-[40%] font-extrabold text-center "
                        delay={100}
                        animateBy="words"
                        direction="top"
                    />
                    <div className="w-[35%] text-[#6b728f] font-light">
                        No over-privileged accounts. Each role has a clear,
                        purposeful scope that keeps your org secure and
                        efficient.
                    </div>
                    <div className="w-full flex justify-between  flex-wrap flex-2 space-y-8 ">
                        {roleCardData.map((idx, key) => {
                            const Icon = idx.svg;

                            return (
                                <div
                                    key={key}
                                    style={{
                                        backgroundColor: `${idx.bg2}`,
                                        border: `1px solid ${idx.border}`,
                                    }}
                                    className="w-[48%] h-auto flex flex-col  space-y-5 rounded-2xl p-5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer border border-gray-200"
                                >
                                    <div
                                        key={key}
                                        style={{
                                            border: `1px solid ${idx.border}`,
                                            backgroundColor: idx.bg,
                                            color: idx.text,
                                        }}
                                        className=" w-40 min-h-10 px-5 py-1 rounded-full gap-4 flex items-center justify-center font-semibold"
                                    >
                                        <Icon size={idx.size} />
                                        {idx.title}
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {idx.responsibility}
                                    </div>
                                    <div className="text-[#6b7280]">
                                        {idx.description}
                                    </div>
                                    <div className=" space-y-3">
                                        {idx.points.map((p, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className=" flex gap-2 items-center text-sm font-semibold"
                                                >
                                                    <AiFillStar
                                                        size={12}
                                                        style={{
                                                            color: `${idx.text}`,
                                                        }}
                                                    />
                                                    {p}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div
                id="aiAssistant"
                className="w-full flex justify-center items-center scroll-mt-24"
            >
                <div className="w-[90%] flex flex-col gap-6">
                    <div className="w-40 py-1 border-2 border-[#a7f3d0] flex items-center justify-center text-sm font-semibold rounded-2xl px-4 text-[#059869] adow-md bg-[#ecfdf5]">
                        AI-POWERED
                    </div>
                    <BlurText
                        text="Your team's always-on AI assistant"
                        className="text-3xl w-[40%] font-extrabold text-center "
                        delay={100}
                        animateBy="words"
                        direction="top"
                    />
                    <div className="w-[35%] text-[#6b728f] font-light">
                        Powered by Google's Gemini API, the built-in chatbot
                        resolves blockers instantly — so your team stays in
                        flow.
                    </div>
                    <div className="w-full flex justify-between items-center">
                        {AiFeatures.map((idx, key) => (
                            <div
                                key={key}
                                className="flex flex-col w-[32%] space-y-2 bg-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer border border-gray-200 rounded-xl p-4"
                            >
                                <div className="font-bold text-lg">
                                    {idx.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {idx.description}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-[70%] flex flex-col bg-white rounded-2xl border shadow:lg">
                            <div className="w-full h-18 bg-[#f7f8fa] flex justify-between items-center rounded-t-2xl border-b-1">
                                <div className="w-[25%] flex justify-around items-center">
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-10 w-10 rounded-full text-white font-semibold text-xl flex items-center justify-center">
                                        AI
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-bold text-xl">
                                            WorkXflow AI
                                        </div>
                                        <div className="text-xs  font-light text-green-600">
                                            Powered by Gemini
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[10%] flex gap-3 items-center text-[#059669] font-semibold">
                                    <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse [animation-duration:1s]" />
                                    Live
                                </div>
                            </div>
                            <div className="w-full p-4 flex flex-col space-y-5">
                                {Aichats.map((idx, key) => (
                                    <div
                                        key={key}
                                        className={`w-full flex items-center   ${idx.position === "right" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: `${idx.bg}`,
                                                border: `2px solid ${idx.border}`,
                                            }}
                                            className="p-2 rounded-2xl max-w-150 shadow-lg"
                                        >
                                            {idx.message}
                                        </div>
                                    </div>
                                ))}
                                <div className="w-full flex items-center justify-start pt-4 pb-20">
                                    <div className="p-2 rounded-2xl max-w-150 bg-[#f7f8fa] shadow-lg border-2 border-[#e8eaed]">
                                        <ThreeDot
                                            variant="bounce"
                                            color="#d2d6dc"
                                            size="small"
                                            text=""
                                            textColor=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full border-t-1 px-3 py-4 flex justify-around">
                                <div className="w-[90%] h-10 rounded-xl bg-[#f7f8fa] pl-5 flex items-center text-gray-500 border-2">
                                    Ask the AI anything...
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                    <FaArrowRight
                                        size={15}
                                        className="text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="howItWorks"
                className="w-full flex justify-center items-center scroll-mt-24"
            >
                <div className="w-[90%] flex flex-col gap-6">
                    <div className="w-40 py-1 border-2 border-[#ddd6fe] flex items-center justify-center text-sm font-semibold rounded-2xl px-4 text-[#7c3aed] adow-md bg-[#f5f3ff]">
                        HOW IT WORK
                    </div>
                    <BlurText
                        text="From signup to shipping in minutes"
                        className="text-3xl w-[40%] font-extrabold text-center "
                        delay={100}
                        animateBy="words"
                        direction="top"
                    />
                    <div className="w-[35%] text-[#6b728f] font-light">
                        Four simple steps to get your whole team aligned and
                        productive from day one.
                    </div>
                    <div className="w-full flex flex-2 flex-wrap items-center justify-around space-y-4">
                        {HowItWorks.map((idx, key) => (
                            <div
                                key={key}
                                className="w-[48%] h-45 flex flex-col items-center justify-around"
                            >
                                <div className="w-15 h-15 rounded-full border-2 text-[#2563eb] shadow:lg hover:border-[#2563eb] hover:bg-[#eff6ff] transform transition-all duration-200 bg-white text-xl font-bold flex items-center justify-center">
                                    {idx.idx}
                                </div>
                                <div className="text-xl font-bold">
                                    {idx.title}
                                </div>
                                <div className=" w-[50%] text-sm text-gray-500 text-center">
                                    {idx.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full min-h-20 bg-[#1a1a1a] p-10 flex items-center justify-center">
                <div className="font-extrabold text-3xl text-white flex items-center w-full">
                    WorkXflow
                </div>
            </div>
        </div>
    );
};

export default page;
