"use client";
import api from "@/lib/axios";
import { getSocket } from "@/lib/socket";
import React, { useEffect, useState } from "react";

// Single fixed avatar color for everyone
const AVATAR_COLOR = "bg-slate-800";

const ChatProfileCard = ({
    idx,
    id,
    setid,
    userId,
    SetChatId,
    onlineUsers,
    activeChatId,
}) => {
    const active = id === idx.id;
    const [data, setData] = useState(null);
    const [MessageLoading, setMessageLoading] = useState(true);
    const [LatestMessage, SetLatestMessage] = useState();
    const [Time, SetTime] = useState();
    const [unreadCount, setUnreadCount] = useState(0);
    const isOnline = onlineUsers?.includes(idx.id);

    const getTimeAgo = () => {
        if (!LatestMessage?.createdAt) return "now";
        const diffMs = new Date() - new Date(LatestMessage.createdAt);
        if (diffMs < 0) return "now";
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    useEffect(() => {
        const GetLatestMessage = async () => {
            try {
                const res = await api.post("/chat/FetchLatestMessage", {
                    userA: userId,
                    userB: idx.id,
                });
                setData(res.data);
                SetLatestMessage(res.data.latestmessage);
            } catch (error) {
                console.log("message fetching error");
            } finally {
                setMessageLoading(false);
            }
        };
        GetLatestMessage();
    }, []);

    useEffect(() => {
        if (!data?.chatId) return;
        const socket = getSocket();
        const handleLatestMessage = ({ chatId, message }) => {
            if (chatId === data.chatId) {
                SetLatestMessage(message);
            }
        };
        socket.off("latest_message_update", handleLatestMessage);
        socket.on("latest_message_update", handleLatestMessage);
        return () => {
            socket.off("latest_message_update");
        };
    }, [data?.chatId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (LatestMessage?.createdAt) {
                SetTime(getTimeAgo());
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [LatestMessage]);

    useEffect(() => {
        const time = LatestMessage?.createdAt ? getTimeAgo() : "";
        SetTime(time);
    }, [LatestMessage]);

    useEffect(() => {
        if (!data?.chatId) return;
        const socket = getSocket();
        const handleUnread = ({ chatId }) => {
            if (chatId === data.chatId && activeChatId !== data.chatId) {
                setUnreadCount((prev) => prev + 1);
            }
        };
        socket.off("new_unread", handleUnread);
        socket.on("new_unread", handleUnread);
        return () => {
            socket.off("new_unread", handleUnread);
        };
    }, [data?.chatId, activeChatId]);

    useEffect(() => {
        if (active) setUnreadCount(0);
    }, [active]);

    return (
        <div
            onClick={() => {
                if (!data?.chatId) return;
                setid(idx.id);
                SetChatId(data.chatId);
            }}
            className={`w-full min-h-16 px-2 flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 ease-out ${
                active
                    ? "bg-white shadow-sm ring-1 ring-sky-100 border-l-4 border-sky-500"
                    : "border-l-4 border-transparent hover:bg-white/70 hover:shadow-sm"
            }`}
        >
            <div className="relative shrink-0">
                <div
                    className={`h-11 w-11 rounded-full ${AVATAR_COLOR} flex items-center justify-center font-bold text-white text-sm shadow-sm`}
                >
                    {idx.name
                        ?.trim()
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0].toUpperCase())
                        .join("")}
                </div>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center bg-sky-500 text-[10px] font-bold text-white shadow">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="truncate font-semibold text-[15px] text-gray-800">
                    {idx.name?.charAt(0).toUpperCase() + idx.name?.slice(1)}
                </span>
                {MessageLoading ? (
                    <div className="text-sm font-medium text-gray-400 h-3 w-28 mt-1 rounded-full bg-gray-200 animate-pulse [animation-duration:1s]" />
                ) : (
                    <div
                        className={`text-sm truncate ${
                            unreadCount > 0
                                ? "font-semibold text-gray-700"
                                : "font-normal text-gray-400"
                        }`}
                    >
                        {LatestMessage?.content || "Start a conversation..."}
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-400 shrink-0 self-start pt-1">
                {Time}
            </div>
        </div>
    );
};

export default ChatProfileCard;