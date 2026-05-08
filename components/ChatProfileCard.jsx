"use client";
import api from "@/lib/axios";

import React, { useEffect, useState } from "react";

const ChatProfileCard = ({ idx, id, setid, userId, SetChatId, messages }) => {
    const active = id === idx.id;
    const [data, setData] = useState();
    const [MessageLoading, setMessageLoading] = useState(true);
    const [LatestMessage, SetLatestMessage] = useState();
    const [Time, SetTime] = useState();

    const getTimeAgo = () => {
        if (!LatestMessage?.createdAt) return "now";
        const diffMs = new Date() - new Date(LatestMessage.createdAt);
        if (diffMs < 0) return "now";
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (seconds < 60) {
            return `${seconds}s`;
        }
        if (minutes < 60) {
            return `${minutes}m`;
        }
        if (hours < 24) {
            return `${hours}h`;
        }
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
        if (!messages || messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;
        if (active) {
            SetLatestMessage(lastMsg);
        }
    }, [messages]);

    useEffect(() => {
        const time = LatestMessage?.createdAt ? getTimeAgo() : "";
        SetTime(time);
    }, [LatestMessage]);
    return (
        <div
            onClick={async () => {
                setid(idx.id);
                SetChatId(data.chatId);
            }}
            className={`w-full min-h-15 ${active ? "border-[#2c84db] border-l-4 bg-[#ececec] " : " hover:scale-95 hover:bg-[#f2f2f2] "} rounded-xl  flex justify-around items-center transition-all duration-300 ease-in-out`}
        >
            <div className=" w-[20%] h-[80%] flex items-center justify-center">
                <div
                    className={`rounded-full h-10 w-10 border-2 ${active ? "border-gray-300" : ""} flex items-center justify-center font-bold transition-all duration-300 ease-in-out`}
                >
                    {idx.name
                        ?.trim()
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0].toUpperCase())
                        .join("")}
                </div>
            </div>
            <div className="w-[60%] h-full text-md font font-bold flex flex-col justify-center px-2">
                {idx.name?.charAt(0).toUpperCase() + idx.name?.slice(1)}
                {MessageLoading ? (
                    <div className="text-sm font-medium text-gray-400 h-3 w-30 rounded-2xl bg-gray-300  animate-pulse [animation-duration:1s]" />
                ) : (
                    <div className="text-sm font-medium text-gray-400">
                        {LatestMessage?.content || "Start a conversation..."}
                    </div>
                )}
            </div>
            <div className="w-[20%] h-full flex flex-col items-center justify-center gap-2">
                <div className="text-sm h-5 w-5 rounded-full flex items-center justify-center bg-[#dcfce7] font-semibold text-gray-600">
                    1
                </div>
                <div className="text-xs px-2 text-gray-400">{Time}</div>
            </div>
        </div>
    );
};

export default ChatProfileCard;
