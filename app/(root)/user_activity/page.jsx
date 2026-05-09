"use client";
import { Input } from "@/components/ui/input";
import usePageStore from "@/store/pages/usePageStore";
import { getSocket } from "@/lib/socket";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];
const DAY_LABELS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_LABELS_FULL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SkeletonRow = () => (
    <div className="w-full h-16 flex items-center px-4 border-b border-gray-50">
        <div className="w-[25%] flex gap-3 items-center">
            <div className="w-11 h-11 rounded-lg bg-gray-200 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5">
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-14 h-2 bg-gray-100 rounded animate-pulse" />
            </div>
        </div>
        <div className="w-[15%]">
            <div className="w-16 h-6 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <div className="w-[15%]">
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-[30%] flex items-end gap-[3px] h-10 pr-4">
            {DAY_LABELS_SHORT.map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-[2px]" style={{ flex: 1 }}>
                    <div className="w-full flex items-end" style={{ height: "28px" }}>
                        <div className="w-full rounded-sm bg-gray-200 animate-pulse" style={{ height: "4px" }} />
                    </div>
                    <div className="w-2 h-2 bg-gray-100 rounded animate-pulse" />
                </div>
            ))}
        </div>
        <div className="w-[15%] flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-14 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
    </div>
);

const page = () => {
    const setActivePage = usePageStore((state) => state.setActivePage);
    const setTitle = usePageStore((state) => state.setTitle);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [active, setActive] = useState("All");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setActivePage("User Activity");
        setTitle("User Activity");
    }, []);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await api.get("/UserActivity/GetUsersActivity");
                setUsers(res.data?.data || []);
            } catch (error) {
                console.log(error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    useEffect(() => {
        const socket = getSocket();
        socket.on("online_users", (userIds) => {
            setOnlineUsers(userIds || []);
        });
        return () => socket.off("online_users");
    }, []);

    const getStatus = (userId) => onlineUsers.includes(userId) ? "Online" : "Offline";
    const getLastSeen = (userId) => onlineUsers.includes(userId) ? "Now" : "Recently";

    const statusStyle = {
        Online:  { color: "#22c55e", bg: "#dcfce7" },
        Offline: { color: "#d1d5db", bg: "#f3f4f6" },
    };

    const filterOptions = [
        { title: "All",     color: "" },
        { title: "Online",  color: "#22c55e" },
        { title: "Offline", color: "#d1d5db" },
    ];

    const columns = [
        { title: "USER",          space: "25%" },
        { title: "STATUS",        space: "15%" },
        { title: "ONLINE TIME",   space: "15%" },
        { title: "ACTIVITY (7D)", space: "30%" },
        { title: "LAST SEEN",     space: "15%" },
    ];

    const filteredUsers = users.filter((u) => {
        const status = getStatus(u.id);
        const matchFilter = active === "All" || status === active;
        const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const onlineCount  = users.filter((u) => getStatus(u.id) === "Online").length;
    const offlineCount = users.filter((u) => getStatus(u.id) === "Offline").length;
    const counts = { All: users.length, Online: onlineCount, Offline: offlineCount };

    return (
        <div className="w-full h-[90%] bg-[#e9ecef] flex flex-col items-center justify-evenly">
            <div className="w-[98%] h-[98%] bg-white rounded-2xl flex flex-col items-center">

                <div className="w-full h-[8%] rounded-t-2xl flex items-center justify-between px-4">
                    <div className="flex gap-3 items-center">
                        {filterOptions.map((f, key) => (
                            <div
                                key={key}
                                onClick={() => setActive(f.title)}
                                className={`px-3 py-1.5 border-2 h-9 flex justify-center items-center rounded-2xl gap-2 cursor-pointer transition-all duration-300 shadow-sm ${
                                    active === f.title
                                        ? "bg-[#1e293b] text-white border-white scale-105"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {f.color && (
                                    <div style={{ backgroundColor: f.color }} className="w-2 h-2 rounded-full" />
                                )}
                                <div className="text-sm font-bold">{f.title}</div>
                                <div className="text-xs text-[#9aa2ad] font-bold">{counts[f.title]}</div>
                            </div>
                        ))}
                    </div>
                    <Input
                        className="bg-gray-100 w-[35%] border-[#e5e5e5] border shadow-sm"
                        type="text"
                        placeholder="Search User..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full h-[7%] flex bg-[#f8fafc] items-center px-4">
                    {columns.map((col, key) => (
                        <div key={key} style={{ width: col.space }} className="text-[#94a3b8] font-bold text-sm">
                            {col.title}
                        </div>
                    ))}
                </div>

                <div className="w-full h-[85%] overflow-y-auto no-scrollbar">
                    {loading ? (
                        [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                    ) : filteredUsers.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold">
                            No users found
                        </div>
                    ) : (
                        filteredUsers.map((user, key) => {
                            const status = getStatus(user.id);
                            const style = statusStyle[status];
                            const lastSeen = getLastSeen(user.id);
                            const isSelected = selectedUser?.id === user.id;
                            const chart = user.weeklyChart || [];
                            const maxMin = Math.max(...chart.map((e) => e.minutes), 1);

                            return (
                                <React.Fragment key={key}>
                                    <div
                                        onClick={() => setSelectedUser(isSelected ? null : user)}
                                        className="w-full h-16 hover:bg-[#f8faff] transition-all duration-300 flex items-center px-4 cursor-pointer border-b border-gray-50"
                                    >
                                        <div className="w-[25%] flex gap-3 items-center">
                                            <div className="font-extrabold text-[#2563eb] w-11 h-11 border border-[#cbd9fa] rounded-lg flex items-center justify-center bg-[#e7edfd] shrink-0 text-sm">
                                                {user.name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-bold text-sm">
                                                    {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
                                                </div>
                                                <div className="text-xs text-gray-400 font-semibold">{user.role}</div>
                                            </div>
                                        </div>

                                        <div className="w-[15%]">
                                            <div
                                                style={{ backgroundColor: style.bg }}
                                                className="p-1.5 rounded-2xl text-xs flex items-center gap-1 font-semibold w-fit"
                                            >
                                                <div style={{ backgroundColor: style.color }} className="w-2 h-2 rounded-full" />
                                                {status}
                                            </div>
                                        </div>

                                        <div className="w-[15%] font-semibold text-sm text-gray-700">
                                            {user.onlineTime || "0m"}
                                        </div>

                                        <div className="w-[30%] flex items-end gap-[3px] pr-4" style={{ height: "40px" }}>
                                            {chart.map((entry, i) => {
                                                const heightPct = entry.minutes > 0
                                                    ? Math.max((entry.minutes / maxMin) * 100, 15)
                                                    : 0;
                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-[2px]" style={{ flex: 1 }}>
                                                        <div className="w-full flex items-end" style={{ height: "28px" }}>
                                                            {entry.minutes > 0 ? (
                                                                <div
                                                                    className="w-full rounded-sm transition-all duration-300"
                                                                    style={{
                                                                        height: `${heightPct}%`,
                                                                        backgroundColor: COLORS[i % COLORS.length],
                                                                        minHeight: "3px",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full rounded-sm" style={{ height: "3px", backgroundColor: "#e5e7eb" }} />
                                                            )}
                                                        </div>
                                                        <div className="text-[9px] text-gray-400 font-semibold">{DAY_LABELS_SHORT[i]}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div style={{ color: style.color }} className="w-[15%] flex items-center gap-1 font-bold text-sm">
                                            <div style={{ backgroundColor: style.color }} className="w-2 h-2 rounded-full" />
                                            {lastSeen}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="w-full px-8 py-3 bg-[#f8faff] border-b border-gray-100">
                                            <div className="text-sm font-bold text-gray-500 mb-2">
                                                Weekly Activity — {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
                                            </div>
                                            <div className="flex items-end gap-2" style={{ height: "80px" }}>
                                                {chart.map((entry, i) => {
                                                    const heightPct = entry.minutes > 0
                                                        ? Math.max((entry.minutes / maxMin) * 100, 8)
                                                        : 0;
                                                    return (
                                                        <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                                                            <div className="text-[10px] text-gray-400 font-semibold h-3">
                                                                {entry.minutes > 0 ? `${entry.minutes}m` : ""}
                                                            </div>
                                                            <div className="w-full flex items-end" style={{ height: "55px" }}>
                                                                {entry.minutes > 0 ? (
                                                                    <div
                                                                        className="w-full rounded-t-md transition-all duration-500"
                                                                        style={{
                                                                            height: `${heightPct}%`,
                                                                            backgroundColor: COLORS[i % COLORS.length],
                                                                            minHeight: "4px",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full rounded-t-md" style={{ height: "4px", backgroundColor: "#e5e7eb" }} />
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500 font-semibold">{DAY_LABELS_FULL[i]}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default page;