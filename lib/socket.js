import { io } from "socket.io-client";

const URL = "https://workxflow-socket.onrender.com";

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(URL, {
            autoConnect: false,
            transports: ["websocket"],
        });
    }
    return socket;
};