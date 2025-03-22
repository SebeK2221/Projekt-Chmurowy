import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { gsap } from 'gsap';

export default function LocationFunction({ onLocationChange }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        mapIds: [process.env.REACT_APP_MAP_ID]
    });

    const [markerPosition, setMarkerPosition] = useState({ lat: 50.041187, lng: 21.999121 });
    const locationInputRef = useRef(null);

    useEffect(() => {
        if (locationInputRef.current) {
            gsap.to(locationInputRef.current, {
                duration: 1,
                color: "black",
                ease: "bounce.out",
                onComplete: () => {
                    gsap.to(locationInputRef.current, {
                        duration: 1,
                        color: "#3333337a",
                        ease: "bounce.out"
                    });
                }
            });
        }
    }, [markerPosition]);

    const onMapClick = (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });
        onLocationChange(newLat, newLng);
    };

    if (!isLoaded) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Ładowanie...</div>;
    }

    return (
        <div style={{
            maxWidth: '800px',
            margin: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ 
                height: '30vh',
                width: '100%',
                maxWidth: '600px',
                border: '1px solid #3333337a',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    zoom={8}
                    center={markerPosition}
                    onClick={onMapClick}
                    options={{
                        mapId: process.env.REACT_APP_MAP_ID,
                        disableDefaultUI: true,
                        gestureHandling: 'greedy'
                    }}
                >
                </GoogleMap>
            </div>
            <input 
                type="text" 
                value={`φ: ${markerPosition.lat.toFixed(6)}     λ: ${markerPosition.lng.toFixed(6)}`}
                readOnly 
                className="location-input"
                ref={locationInputRef}
                style={{
                    margin: '10px auto',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #3333337a',
                    textAlign: 'center',
                    width: '80%',
                    maxWidth: '400px',
                    fontSize: '14px',
                    backgroundColor: '#f8f8f8'
                }}
            />
            <p style={{
                textAlign: 'center',
                margin: '5px 0 15px',
                fontSize: '14px',
                color: '#666'
            }}>
                Kliknij na mapie, aby wybrać lokalizację
            </p>
        </div>
    );
}