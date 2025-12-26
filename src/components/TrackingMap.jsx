import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { connectSocket, joinTrackingRoom, subscribeToLocation, disconnectSocket } from "../services/socketService";
// import your car icon here
import carIcon from "../assets/car.png"; 

const containerStyle = { width: "100%", height: "500px" };

const TrackingMap = ({ bookingId, initialLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Start with initial location from DB (passed as prop) or default
  const [position, setPosition] = useState(initialLocation || { lat: 33.68, lng: 73.04 });

  useEffect(() => {
    connectSocket();
    joinTrackingRoom(bookingId);

    subscribeToLocation((data) => {
      console.log("Car Moved:", data);
      setPosition({ lat: data.lat, lng: data.lng });
    });

    return () => disconnectSocket();
  }, [bookingId]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
      <Marker 
        position={position}
        icon={{
             url: carIcon,
             scaledSize: new window.google.maps.Size(40, 40)
        }}
      />
    </GoogleMap>
  );
};

export default TrackingMap;