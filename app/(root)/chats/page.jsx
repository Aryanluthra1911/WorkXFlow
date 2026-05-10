"use client";
import ChatProfileCard from "@/components/ChatProfileCard";
import React, { useEffect, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import usePageStore from "@/store/pages/usePageStore";
import { getSocket } from "@/lib/socket";
import api from "@/lib/axios";
import useUserStore from "@/store/user/useUserstore";
import { useRef } from "react";

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
    const user = useUserStore((state) => state.user);
    const bottomRef = useRef(null);

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
        <div style={{ overflow: "hidden" }} className="w-full h-[90%] bg-[#f9fafb] flex justify-around items-center">
            <div className="w-[25%] h-full flex flex-col items-center justify-around">
                <div className="w-full h-[8%] flex justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search conversation..."
                        className="w-[90%] h-[70%] border pl-3 outline-none rounded-xl shadow-md font-semibold"
                    />
                </div>
                <div className="w-full h-[90%] flex items-center flex-col overflow-y-auto no-scrollbar">
                    <div className="w-full bg-[#f8f9fa] text-[#9f9f9f] font-bold text-sm flex items-center pl-5 h-[5%] sticky top-0">
                        DIRECT MESSAGES
                    </div>
                    <div className="w-[90%] flex-1 flex flex-col gap-3 items-center overflow-y-auto no-scrollbar">
                        {DmLoading ? (
                            [...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full min-h-12 rounded-xl bg-gray-300 animate-pulse [animation-duration:1s]"
                                />
                            ))
                        ) : !users || users.length === 0 ? (
                            <p className="w-full h-full items-center justify-center font-semibold">
                                No Users Found
                            </p>
                        ) : (
                            users.map((idx, key) => {
                                return (
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
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            {id === null ? (
                <div className="w-[75%] h-full border-1 bg-[#e9ecef] flex flex-col items-center overflow-hidden">
                    <div className="w-full h-[50%] flex justify-center items-end">
                        <IoChatbubblesOutline className="h-40 w-40 shrink-0 text-[#f8f9fa] dark:text-neutral-200" />
                    </div>
                    <div className="w-full h-[20%] text-2xl font-semibold flex justify-center items-center">
                        Pick a conversation to begin
                    </div>
                    <div className="w-[50%] text-center h-[20%] text-gray-500 text-lg font-semibold flex justify-center items-start">
                        Start chatting with your team or continue where you left off
                    </div>
                </div>
            ) : (
                <div className="w-[75%] h-full overflow-hidden flex flex-col">
                    <div className="w-full h-[10%] flex items-center pl-5 gap-4 shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-900 rounded-4xl flex justify-center items-center text-white text-xl font-semibold shrink-0">
                            {selectedUser?.name
                                ?.trim()
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0].toUpperCase())
                                .join("")}
                        </div>
                        <div className="text-xl h-full flex justify-start items-center w-[75%] font-bold">
                            {selectedUser?.name
                                ? selectedUser.name.charAt(0).toUpperCase() +
                                selectedUser.name.slice(1)
                                : ""}
                        </div>
                        <div className="w-20 h-8 rounded-2xl text-sm font-bold flex items-center justify-center bg-gray-200 border-white border-1 shadow-lg shrink-0">
                            {selectedUser?.role}
                        </div>
                    </div>
                    <div className="w-full flex-1 bg-[#e9ecef] overflow-y-auto overflow-x-hidden p-4 no-scrollbar space-y-6">
                        {MessageLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="mb-2 flex justify-end">
                                        <div className="px-5 py-2 rounded-xl font-semibold w-100 bg-gray-300 animate-pulse [animation-duration:1s] h-10" />
                                    </div>
                                    <div className="mb-2 flex justify-start">
                                        <div className="px-5 py-2 rounded-xl font-semibold w-110 bg-gray-300 animate-pulse [animation-duration:1s] h-10" />
                                    </div>
                                </div>
                            ))
                        ) : messages.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-30 h-30 border bg-white rounded-2xl flex items-center justify-center shadow-xl">
                                        <IoChatbubblesOutline className="w-20 h-20 text-gray-500" />
                                    </div>
                                    <div className="text-2xl font-bold">No messages yet</div>
                                    <div className="text-sm font-semibold text-gray-400">
                                        Start a conversation to get things moving....
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`mb-2 flex ${
                                            msg.senderId === user.id
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            style={{ wordBreak: "break-word", overflowWrap: "pre-wrap" }}
                                            className={`px-5 py-2 rounded-xl font-semibold max-w-[60%] ${
                                                msg.senderId === user.id
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300"
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </>
                        )}
                    </div>
                    <div className="w-full h-[10%] bg-[#e9ecef] flex justify-evenly items-start shrink-0">
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type here..."
                            value={text}
                            className="w-[80%] h-[70%] flex justify-center hover:outline-2 outline-[#3498db] shadow-xl bg-white rounded-2xl pl-4"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="h-[70%] w-19 bg-sky-500 rounded-2xl shadow-xl flex justify-center hover:border-1 hover:border-black hover:scale-105 items-end pb-1.5"
                        >
                            <FiSend size={30} className="font-bold" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default page;