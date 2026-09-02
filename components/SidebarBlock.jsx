"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconArrowLeft, IconHelpCircle } from "@tabler/icons-react";
import { LuActivity } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import { MdSpaceDashboard, MdOutlineNotificationsActive } from "react-icons/md";
import { PiChatsCircleFill } from "react-icons/pi";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaUserPlus } from "react-icons/fa";
import useUserStore from "@/store/user/useUserstore";
import { toast } from "react-toastify";

export function SidebarBlock() {
    const { data: session } = useSession();
    const user = useUserStore((state) => state.user);
    const [role, setrole] = useState();
    const [Name, setName] = useState("");
    const router = useRouter();
    const clearUserStore = useUserStore((state) => state.clearUserStore);
    const admin_manager_links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <MdSpaceDashboard className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Organisation",
            href: "/organisation",
            icon: (
                <LuUsers className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Chats",
            href: "/chats",
            icon: (
                <PiChatsCircleFill className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Notification",
            href: "/notification",
            icon: (
                <MdOutlineNotificationsActive className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "User Activity",
            href: "/user_activity",
            icon: (
                <LuActivity className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "User Controls",
            href: "/user_controls",
            icon: (
                <FaUserPlus className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },

        {
            label: "Get Help",
            href: "/gethelp",
            icon: (
                <IconHelpCircle className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },

        {
            label: "Logout",
            href: "/",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
    ];
    const member_links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <MdSpaceDashboard className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Organisation",
            href: "/organisation",
            icon: (
                <LuUsers className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Chats",
            href: "/chats",
            icon: (
                <PiChatsCircleFill className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Notification",
            href: "/notification",
            icon: (
                <MdOutlineNotificationsActive className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Get Help",
            href: "/gethelp",
            icon: (
                <IconHelpCircle className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: "/",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
    ];
    useEffect(() => {
        if (session) {
            setrole(session.user.role);
            setName(session.user.name);
        }
    }, [session]);
    const links = role === "Member" ? member_links : admin_manager_links;
    const [open, setOpen] = useState(false);
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <div
            className={cn(
                " flex  max-w-7xl flex-1 flex-col overflow-hidden  md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-full w-full",
            )}
        >
            <Sidebar open={open} setOpen={setOpen} animate={false}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Logo />
                        <div className="mt-8 flex flex-col gap-3">
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={async () => {
                                        if (link.label === "Logout") {
                                            sessionStorage.setItem(
                                                "isLoggingOut",
                                                "true",
                                            );

                                            try {
                                                await signOut({ redirect: false });
                                                clearUserStore();
                                                toast.success("Logged out successfully.");
                                                router.push("/signin");
                                            } catch (error) {
                                                console.log(error);
                                                toast.error("Failed to log out. Please try again.");
                                            } finally {
                                                sessionStorage.removeItem(
                                                    "isLoggingOut",
                                                );
                                            }
                                        } else {
                                            router.push(link.href);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            onClick={() => {
                                router.push("/profile");
                            }}
                            link={{
                                label: capitalize(Name),
                                icon: (
                                    <div className="h-7 w-7 rounded-full text-white font-semibold flex items-center justify-center bg-gray-600">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : ""}
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
        </div>
    );
}
export const Logo = () => {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push("/dashboard");
            }}
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black justify-center"
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-white dark:text-[#052079] text-2xl"
            >
                WorkXflow
            </motion.span>
        </div>
    );
};
