import { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';


export type MapViewProps = {
    center?: [number, number]; // [lng, lat]
    zoom?: number;
};


export default function MapView({ center = [100.5018, 13.7563], zoom = 10 }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapObj = useRef<tt.Map | null>(null);


    useEffect(() => {
        if (!mapRef.current) return;
        if (mapObj.current) return; // init once


        const key = import.meta.env.VITE_TOMTOM_KEY as string;


        const map = tt.map({
            key,
            container: mapRef.current,
            center,
            zoom,
            style: 'tomtom://vector/1/basic-main',
        });
        mapObj.current = map;


        // demo marker at center
        const marker = new tt.Marker().setLngLat(center).addTo(map);


        map.on('click', (e) => {
            // drop a marker where clicked (simple demo)
            new tt.Marker().setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
        });


        return () => {
            map.remove();
            mapObj.current = null;
        };
    }, [center, zoom]);


    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}