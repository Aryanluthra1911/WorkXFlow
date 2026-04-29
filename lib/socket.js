import { io } from "socket.io-client";

const URL = "http://localhost:5000";

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