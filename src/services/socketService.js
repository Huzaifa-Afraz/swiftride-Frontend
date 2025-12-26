import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; 
let socket = null;

export const connectSocket = () => {
  if (!socket) socket = io(SOCKET_URL);
  return socket;
};

export const joinTrackingRoom = (bookingId) => {
  if (socket) socket.emit("join_tracking", bookingId);
};

export const subscribeToLocation = (callback) => {
  if (!socket) return;
  socket.on("receive_location", (data) => {
    callback(data);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};