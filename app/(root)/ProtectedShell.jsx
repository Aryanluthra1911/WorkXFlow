"use client";
import { SidebarBlock } from "@/components/SidebarBlock";
import usePageStore from "@/store/pages/usePageStore";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import useUserStore from "@/store/user/useUserstore";
import { getSocket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Short description shown under the page title, keyed by pathname.
// Add an entry here whenever a new page is added.
const PAGE_DESCRIPTIONS = {
    "/organisation": "View and manage your organisation's structure",
    "/chats": "Message your team and pick up where you left off",
    "/notification": "Stay updated with recent alerts and activity",
    "/user-activity": "Track what your team has been working on",
    "/user-controls": "Add, manage, and remove user accounts",
    "/get-help": "Find answers or reach out for support",
};

// Dashboard title/description changes based on the logged-in user's role
const DASHBOARD_CONTENT = {
    Admin: {
        title: "Admin Dashboard",
        description: "Full overview of your organisation, teams, and activity",
    },
    Manager: {
        title: "Manager Dashboard",
        description: "Track your team's progress and manage their work",
    },
    Member: {
        title: "Dashboard",
        description: "Your personal overview of tasks and activity",
    },
};

const getHeaderContent = (pathname, title, role) => {
    if (pathname === "/dashboard") {
        return DASHBOARD_CONTENT[role] || DASHBOARD_CONTENT.Member;
    }
    return {
        title,
        description:
            PAGE_DESCRIPTIONS[pathname] ||
            (title ? `Manage and view everything related to ${title.toLowerCase()}` : ""),
    };
};

export default function ProtectedShell({ children }) {
    const user = useUserStore((state) => state.user);
    const title = usePageStore((state) => state.title);
    const router = useRouter();
    const pathname = usePathname();
    const [nav, setNav] = useState({
        history: [pathname],
        index: 0,
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!user) return;
        const socket = getSocket();
        socket.connect();
        socket.emit("user_online", user.id);
    }, [user]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isNavigating = useRef(false);
    useEffect(() => {
        if (isNavigating.current) {
            isNavigating.current = false;
            return;
        }
        setNav((prev) => {
            const { history, index } = prev;
            if (history[history.length - 1] === pathname) return prev;
            const newHistory = history.slice(0, index + 1);
            newHistory.push(pathname);
            return {
                history: newHistory,
                index: newHistory.length - 1,
            };
        });
    }, [pathname]);

    const goBackward = () => {
        if (nav.index <= 0) return;
        const newIndex = nav.index - 1;
        const target = nav.history[newIndex];
        setNav((prev) => ({
            ...prev,
            index: newIndex,
        }));
        isNavigating.current = true;
        router.replace(target);
    };

    const goForward = () => {
        if (nav.index >= nav.history.length - 1) return;
        const newIndex = nav.index + 1;
        const target = nav.history[newIndex];
        setNav((prev) => ({
            ...prev,
            index: newIndex,
        }));
        isNavigating.current = true;
        router.replace(target);
    };

    const canGoBack = nav.index > 0;
    const canGoForward = nav.index < nav.history.length - 1;
    const { title: headerTitle, description } = getHeaderContent(
        pathname,
        title,
        user?.role
    );

    return (
        <div className="h-screen w-screen flex">
            <div className="w-auto h-full shadow-md">
                <SidebarBlock />
            </div>
            <div className="w-full h-full overflow-hidden flex flex-col">
                <div className="w-full h-[10%] min-h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0 bg-white">
                    <div className="flex flex-col justify-center min-w-0">
                        <div className="text-2xl font-bold text-gray-900 leading-tight truncate">
                            {headerTitle}
                        </div>
                        {description && (
                            <div className="text-sm text-gray-400 font-medium truncate mt-0.5">
                                {description}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={goBackward}
                            disabled={!isMounted || !canGoBack}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canGoBack
                                    ? "border-gray-200 text-gray-600 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 cursor-pointer"
                                    : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                            }`}
                        >
                            <FaArrowLeft size={15} />
                        </button>
                        <button
                            onClick={goForward}
                            disabled={!isMounted || !canGoForward}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canGoForward
                                    ? "border-gray-200 text-gray-600 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 cursor-pointer"
                                    : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                            }`}
                        >
                            <FaArrowRight size={15} />
                        </button>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}