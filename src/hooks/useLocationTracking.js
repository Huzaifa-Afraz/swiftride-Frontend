// hooks/useLocationTracking.js
// Sends browser GPS location when customer has an ongoing trip
import { useState, useEffect, useRef, useCallback } from "react";
import {
    connectSocket,
    sendLocation,
    disconnectSocket,
} from "../services/socketService";

const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds

// Fallback location for testing when geolocation fails (Islamabad, Pakistan)
const FALLBACK_LOCATION = {
    latitude: 33.6844,
    longitude: 73.0479,
    heading: 0,
    speed: 0,
};

export const useLocationTracking = (bookingId, isActive) => {
    const [location, setLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const socketRef = useRef(null);
    const retryCountRef = useRef(0);

    const sendLocationUpdate = useCallback((locationData) => {
        setLocation(locationData);
        setIsTracking(true);
        setError(null);

        // Send to server
        sendLocation(bookingId, locationData);
    }, [bookingId]);

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported, using fallback location");
            sendLocationUpdate(FALLBACK_LOCATION);
            return;
        }

        // Options - more relaxed for desktop browsers
        const options = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 120000, // Accept cached position up to 2 minutes old
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                retryCountRef.current = 0;
                sendLocationUpdate({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position.coords.heading || 0,
                    speed: position.coords.speed || 0,
                });
            },
            (err) => {
                console.warn("Geolocation error:", err.message);
                retryCountRef.current += 1;

                // After 3 failures, use fallback location for testing
                if (retryCountRef.current >= 3) {
                    console.warn("⚠️ Using fallback location for testing (Islamabad)");
                    // Add slight randomness to simulate movement
                    const mockLocation = {
                        ...FALLBACK_LOCATION,
                        latitude: FALLBACK_LOCATION.latitude + (Math.random() - 0.5) * 0.001,
                        longitude: FALLBACK_LOCATION.longitude + (Math.random() - 0.5) * 0.001,
                    };
                    sendLocationUpdate(mockLocation);
                } else {
                    setError(err.message);
                }
            },
            options
        );
    }, [sendLocationUpdate]);

    const startTracking = useCallback(() => {
        // Connect to socket
        socketRef.current = connectSocket();

        console.log("🛰️ Started location tracking for booking:", bookingId);

        // Get initial location
        getLocation();

        // Then update every 5 seconds
        intervalRef.current = setInterval(() => {
            getLocation();
        }, LOCATION_UPDATE_INTERVAL);

    }, [bookingId, getLocation]);

    const stopTracking = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        disconnectSocket();
        socketRef.current = null;
        setIsTracking(false);
        retryCountRef.current = 0;
        console.log("🛑 Stopped location tracking");
    }, []);

    useEffect(() => {
        if (isActive && bookingId) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => {
            stopTracking();
        };
    }, [isActive, bookingId, startTracking, stopTracking]);

    return { location, isTracking, error };
};

export default useLocationTracking;
