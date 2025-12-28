import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { connectSocket, joinTrackingRoom, subscribeToLocation, disconnectSocket } from "../services/socketService";

const containerStyle = { width: "100%", height: "500px" };

const TrackingMap = ({ bookingId, initialLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [position, setPosition] = useState(initialLocation || { lat: 33.68, lng: 73.04 });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    console.log("🗺️ TrackingMap: Connecting for booking:", bookingId);
    connectSocket();
    joinTrackingRoom(bookingId);

    subscribeToLocation((data) => {
      console.log("📍 Car Moved:", data.lat, data.lng);
      const newPosition = { lat: data.lat, lng: data.lng };
      setPosition(newPosition);

      // Smoothly pan the map to the new position
      if (mapRef.current) {
        mapRef.current.panTo(newPosition);
      }
    });

    return () => {
      console.log("🗺️ TrackingMap: Disconnecting");
      disconnectSocket();
    };
  }, [bookingId]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
      onLoad={onMapLoad}
    >
      <Marker position={position} />
    </GoogleMap>
  );
};

export default TrackingMap;