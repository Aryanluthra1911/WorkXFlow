"use client";
import Notification_card from "@/components/Notification_card";
import usePageStore from "@/store/pages/usePageStore";
import React, { useEffect } from "react";

const page = () => {
    const notification = [
        {
            title: "New Client Message",
            description:
                "Dr. Mehra sent feedback for the clinic website homepage design and requested a WhatsApp appointment integration.",
            status: "not seen",
            time: "2 mins ago",
        },
        {
            title: "Project Deployment Successful",
            description:
                "WorkXFlow v2.1 has been successfully deployed on Vercel. All APIs and socket connections are running smoothly.",
            status: "not seen",
            time: "8 mins ago",
        },
        {
            title: "Payment Received",
            description:
                "₹25,000 payment received from Visibl.co for the dental clinic website project.",
            status: "not seen",
            time: "15 mins ago",
        },
        {
            title: "New Team Member Added",
            description:
                "Rohit Sharma has been added to the Gold Billing App project as a frontend collaborator.",
            status: "seen",
            time: "25 mins ago",
        },
        {
            title: "Database Backup Completed",
            description:
                "Your Neon PostgreSQL database backup completed successfully without any errors.",
            status: "seen",
            time: "40 mins ago",
        },
        {
            title: "Bug Report Submitted",
            description:
                "A user reported that the latest message preview is not updating instantly in the chat sidebar component.",
            status: "seen",
            time: "1 hour ago",
        },
        {
            title: "Server Maintenance Scheduled",
            description:
                "Socket server maintenance is scheduled tonight at 11:30 PM IST. Temporary reconnection issues may occur.",
            status: "seen",
            time: "2 hours ago",
        },
        {
            title: "New Login Detected",
            description:
                "Your account was accessed from a new Chrome browser on Windows in Delhi, India.",
            status: "seen",
            time: "Yesterday",
        },
        {
            title: "Weekly Analytics Ready",
            description:
                "Your project dashboard analytics report for this week is now available with updated traffic and API usage insights.",
            status: "seen",
            time: "Yesterday",
        },
        {
            title: "Task Completed",
            description:
                "The responsive notification panel UI has been completed and synced with the backend successfully.",
            status: "seen",
            time: "2 days ago",
        },
    ];
    const setActivePage = usePageStore((state) => state.setActivePage);
    const setTitle = usePageStore((state) => state.setTitle);
    useEffect(() => {
        setActivePage("Notification");
        setTitle("Notification");
    }, []);
    return (
        <div className="bg-[#e9ecef] w-full h-[90%] flex flex-col gap-5 items-center overflow-y-auto no-scrollbar pt-4">
            {notification.map((idx, key) => {
                return <Notification_card key={key} idx={idx} />;
            })}
        </div>
    );
};

export default page;
