"use client";
import ChatProfileCard from "@/components/ChatProfileCard";
import React, { useEffect, useState } from "react";
import { IoChatbubblesOutline, IoSearchOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import usePageStore from "@/store/pages/usePageStore";
import { getSocket } from "@/lib/socket";
import api from "@/lib/axios";
import useUserStore from "@/store/user/useUserstore";
import { useRef } from "react";
import EmptyState from "@/components/ui/EmptyState";

// Single fixed avatar color for everyone
const AVATAR_COLOR = "bg-slate-800";

const page = () => {
    const [id, setid] = useState(null);
    const [ChatId, SetChatId] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [DmLoading, setDmLoading] = useState(true);
    const [MessageLoading, setMessageLoading] = useState(true);
    const setActivePage = usePageStore((state) => state.setActivePage);
    const setTitle = usePageStore((state) => state.setTitle);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [search, setSearch] = useState("");
    const user = useUserStore((state) => state.user);
    const bottomRef = useRef(null);

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    const isSelectedOnline = onlineUsers?.includes(id);

    const sendMessage = () => {
        if (!text.trim()) return;
        const socket = getSocket();
        socket.emit("send_message", {
            chatId: ChatId,
            senderId: user.id,
            content: text,
        });
        setText("");
    };

    useEffect(() => {
        setActivePage("Chats");
        setTitle("Chats");
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!user || !id) return;
        const userInfo = users.find((item) => item.id === id);
        setSelectedUser(userInfo);
    }, [user, id]);

    useEffect(() => {
        if (!ChatId) return;
        try {
            const FetchChat = async () => {
                const res = await api.get("/chat/FetchChats", {
                    params: { chatId: ChatId },
                });
                setMessages(res.data.data);
            };
            FetchChat();
        } catch (error) {
            console.log("chats were unable to fetch");
        } finally {
            setMessageLoading(false);
        }
    }, [ChatId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/chat/getUsers");
                setUsers(res.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setDmLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!ChatId) return;
        const socket = getSocket();
        socket.connect();
        socket.emit("join_chat", ChatId);
        socket.off("receive_message");
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => {
            socket.off("receive_message");
        };
    }, [ChatId]);

    useEffect(() => {
        const socket = getSocket();
        socket.on("online_users", (userIds) => {
            setOnlineUsers(userIds);
        });
        return () => {
            socket.off("online_users");
        };
    }, []);

    return (
        <div
            style={{ overflow: "hidden" }}
            className="w-full h-[90%] bg-[#f5f6f8] flex"
        >
            {/* Sidebar */}
            <div className="w-[27%] min-w-[280px] h-full flex flex-col border-r border-gray-200 bg-[#f5f6f8]">
                <div className="w-full px-4 pt-4 pb-3 shrink-0">
                    <div className="relative">
                        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search conversation..."
                            className="w-full h-10 pl-9 pr-3 bg-white outline-none rounded-xl shadow-sm border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-sky-200 transition-all"
                        />
                    </div>
                </div>

                <div className="w-full flex-1 flex flex-col overflow-y-auto no-scrollbar px-2 pb-4">
                    <div className="w-full text-[#9f9f9f] font-bold text-xs tracking-wide flex items-center pl-3 py-2 sticky top-0 bg-[#f5f6f8] z-10">
                        DIRECT MESSAGES
                    </div>
                    <div className="w-full flex-1 flex flex-col gap-1">
                        {DmLoading ? (
                            [...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full min-h-16 rounded-xl bg-gray-200 animate-pulse [animation-duration:1s]"
                                />
                            ))
                        ) : !filteredUsers || filteredUsers.length === 0 ? (
                            <EmptyState
                                icon={IoChatbubblesOutline}
                                title="No Users Found"
                                size="sm"
                            />
                        ) : (
                            filteredUsers.map((idx, key) => (
                                <ChatProfileCard
                                    key={key}
                                    idx={idx}
                                    id={id}
                                    setid={setid}
                                    userId={user.id}
                                    SetChatId={SetChatId}
                                    onlineUsers={onlineUsers}
                                    activeChatId={ChatId}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main panel */}
            {id === null ? (
                <div className="flex-1 h-full bg-[#eef1f4] flex flex-col items-center justify-center gap-3 overflow-hidden">
                    <div className="h-28 w-28 rounded-full bg-white shadow-inner flex items-center justify-center">
                        <IoChatbubblesOutline className="h-14 w-14 text-sky-300" />
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                        Pick a conversation to begin
                    </div>
                    <div className="max-w-md text-center text-gray-500 font-medium">
                        Start chatting with your team or continue where you left off
                    </div>
                </div>
            ) : (
                <div className="flex-1 h-full overflow-hidden flex flex-col bg-[#eef1f4]">
                    {/* Header */}
                    <div className="w-full h-16 flex items-center px-5 gap-3 shrink-0 bg-white border-b border-gray-200 shadow-sm">
                        <div className="relative shrink-0">
                            <div
                                className={`w-10 h-10 ${AVATAR_COLOR} rounded-full flex justify-center items-center text-white text-lg font-bold`}
                            >
                                {selectedUser?.name
                                    ?.trim()
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((w) => w[0].toUpperCase())
                                    .join("")}
                            </div>
                            {isSelectedOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                            )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <div className="text-[15px] font-bold text-gray-800 truncate">
                                {selectedUser?.name
                                    ? selectedUser.name.charAt(0).toUpperCase() +
                                      selectedUser.name.slice(1)
                                    : ""}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">
                                {isSelectedOnline ? "Online" : "Offline"}
                            </div>
                        </div>
                        {selectedUser?.role && (
                            <div className="ml-auto px-3 h-7 rounded-full text-xs font-bold flex items-center justify-center bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                                {selectedUser.role}
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="w-full flex-1 overflow-y-auto overflow-x-hidden p-5 no-scrollbar space-y-3">
                        {MessageLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="mb-2 flex justify-end">
                                        <div className="rounded-2xl w-64 bg-gray-200 animate-pulse [animation-duration:1s] h-10" />
                                    </div>
                                    <div className="mb-2 flex justify-start">
                                        <div className="rounded-2xl w-72 bg-gray-200 animate-pulse [animation-duration:1s] h-10" />
                                    </div>
                                </div>
                            ))
                        ) : messages.length === 0 ? (
                            <EmptyState
                                icon={IoChatbubblesOutline}
                                title="No messages yet"
                                description="Start a conversation to get things moving...."
                                size="md"
                            />
                        ) : (
                            <>
                                {messages.map((msg) => {
                                    const mine = msg.senderId === user.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                style={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "anywhere",
                                                }}
                                                className={`px-4 py-2.5 rounded-2xl font-medium max-w-[60%] text-[15px] shadow-sm ${
                                                    mine
                                                        ? "bg-sky-500 text-white rounded-br-sm"
                                                        : "bg-white text-gray-800 rounded-bl-sm"
                                                }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </>
                        )}
                    </div>

                    {/* Composer */}
                    <div className="w-full px-5 py-3 bg-white border-t border-gray-200 flex items-center gap-3 shrink-0">
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type here..."
                            value={text}
                            className="flex-1 h-11 px-4 rounded-2xl bg-[#f0f2f5] outline-none focus:ring-2 focus:ring-sky-200 transition-all text-sm font-medium"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim()}
                            className="h-11 w-11 shrink-0 bg-sky-500 disabled:bg-gray-300 rounded-full shadow-md flex justify-center items-center transition-all duration-150 hover:scale-105 disabled:hover:scale-100 active:scale-95"
                        >
                            <FiSend size={18} className="text-white translate-x-[-1px]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default page;