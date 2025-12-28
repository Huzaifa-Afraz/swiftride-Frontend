import { io } from "socket.io-client";

// Use the same server as API (port 5000)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace("/api", "");

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  return socket;
};

export const joinTrackingRoom = (bookingId) => {
  if (socket) {
    socket.emit("join_tracking", bookingId);
    console.log("Joined tracking room:", bookingId);
  }
};

export const sendLocation = (bookingId, locationData) => {
  if (socket) {
    socket.emit("send_location", {
      bookingId,
      lat: locationData.latitude,
      lng: locationData.longitude,
      heading: locationData.heading || 0,
      speed: locationData.speed || 0,
      timestamp: new Date().toISOString(),
    });
    console.log("📍 Sent location:", locationData.latitude, locationData.longitude);
  }
};

export const subscribeToLocation = (callback) => {
  if (!socket) return;
  socket.on("receive_location", (data) => {
    callback(data);
  });
};

export const unsubscribeFromLocation = () => {
  if (socket) {
    socket.off("receive_location");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  connectSocket,
  joinTrackingRoom,
  sendLocation,
  subscribeToLocation,
  unsubscribeFromLocation,
  disconnectSocket,
};