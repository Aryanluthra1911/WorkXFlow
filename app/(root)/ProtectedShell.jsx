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
    return (
        <div className="h-screen w-screen flex">
            <div className="w-auto h-full shadow-md">
                <SidebarBlock />
            </div>
            <div className="w-full h-full overflow-hidden">
                <div className="w-full h-[10%] border-b-2 flex items-center justify-evenly pl-3 text-3xl font-bold shadow-md">
                    <div className="w-[80%] h-full flex items-center">
                        {title}
                    </div>
                    <div className="w-[12%] h-full flex items-center justify-evenly">
                        <button
                            onClick={goBackward}
                            disabled={!isMounted || !canGoBack}
                            className={`w-10 h-10 border rounded-full flex items-center justify-center
                            ${canGoBack ? "hover:scale-105 cursor-pointer" : "opacity-40"}`}
                        >
                            <FaArrowLeft size={20} />
                        </button>
                        <button
                            onClick={goForward}
                            disabled={!isMounted || !canGoForward}
                            className={`w-10 h-10 border rounded-full flex items-center justify-center
                            ${canGoForward ? "hover:scale-105 cursor-pointer" : "opacity-40"}`}
                        >
                            <FaArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}
