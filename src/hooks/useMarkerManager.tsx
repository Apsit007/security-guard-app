import { useState } from 'react';
import L, { Map as LeafletMap, Marker, divIcon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// Icons
import RedLocationPinIcon from "../assets/icons/red-location-pin.png";
import YellowLocationPinIcon from "../assets/icons/yellow-location-pin.png";
import GreenLocationPinIcon from "../assets/icons/green-location-pin.png";
import EventIcon from "../assets/icons/event-icon.png";
import LocationCopyIcon from "../assets/icons/location-copy.png";

export const useMarkerManager = (map: LeafletMap | null) => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.remove());
    setMarkers([]);
  };

  const clearMarkerByLocation = (location: { lat: number; lng: number }) => {
    setMarkers(prevMarkers => {
      const updatedMarkers = prevMarkers.filter((marker) => {
        const markerLatLng = marker.getLatLng();
        const isSame = 
          Math.abs(markerLatLng.lat - location.lat) < 0.000001 &&
          Math.abs(markerLatLng.lng - location.lng) < 0.000001;

        if (isSame) {
          marker.remove();
          return false;
        }
        return true;
      });
      return updatedMarkers;
    });
  };

  const createClickPinMarker = (location: LatLngExpression) => {
    if (!map) return;
    clearMarkers();

    const iconSVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0004 9.59844V17.5984M8.40039 13.8892C4.88219 14.4826 2.40039 15.9197 2.40039 17.5984C2.40039 19.8076 6.69846 21.5984 12.0004 21.5984C17.3023 21.5984 21.6004 19.8076 21.6004 17.5984C21.6004 15.9197 19.1186 14.4826 15.6004 13.8892M15.2004 5.59844C15.2004 7.36575 13.7677 8.79844 12.0004 8.79844C10.2331 8.79844 8.80039 7.36575 8.80039 5.59844C8.80039 3.83113 10.2331 2.39844 12.0004 2.39844C13.7677 2.39844 15.2004 3.83113 15.2004 5.59844Z" stroke="#9F0C0C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    let htmlContent = `<div style="position: relative; display: flex; align-items: center; justify-content: center;">${iconSVG}`;

    htmlContent += `</div>`;

    const marker = L.marker(location, {
      icon: divIcon({
        html: htmlContent,
        className: '',
        iconSize: [30, 40],
      }),
    }).addTo(map);

    setMarkers([marker]);
  };

  const createLocationIcon = async (location: LatLngExpression, type: number, markerTag: string = "", isShowPopup: boolean = false) => {
    if (!map) return;
  
    const { lat, lng } = Array.isArray(location)
      ? { lat: location[0], lng: location[1] }
      : location as { lat: number; lng: number };

    await clearMarkerByLocation({ lat, lng });

    let iconUrl = GreenLocationPinIcon;
    let width = "30px";
    let height = "30px";
    switch (type) {
      case 1:
        iconUrl = YellowLocationPinIcon;
        width = "35px";
        height = "35px";
        break;
      case 2:
        iconUrl = RedLocationPinIcon;
        width = "35px";
        height = "35px";
        break;
      default:
        break;
    }

    const html = `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <img src="${iconUrl}" style="width: ${width}; height: ${height};" alt="location pin" />
    </div>`;

    const marker = L.marker(location, {
      icon: divIcon({
        html,
        className: '',
      }),
    }).addTo(map);

    if (markerTag) {
      createPlaceToolTip(marker, location, markerTag);
    }

    if (isShowPopup) {
      createPlacePopup(marker, location, markerTag, isShowPopup);
    }

    setMarkers(prev => [...prev, marker]);
  };

  const createEventIcon = async (location: LatLngExpression) => {
    if (!map) return;

    const html = `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <img src="${EventIcon}" style="width: 35px; height: 35px;" alt="location pin" />
    </div>`;

    const marker = L.marker(location, {
      icon: divIcon({
        html,
        className: '',
      }),
    }).addTo(map);

    createEventPopup(marker, location);

    setMarkers(prev => [...prev, marker]);
  };

  const createPlaceToolTip = (marker: L.Marker<any>, latLng: LatLngExpression, name: string) => {
    const newLatLng = L.latLng(latLng);
    return marker.bindTooltip(
      `<div style="
        text-align: center;
        color: #FFFFFF;
        border-radius: 6px;
        padding: 4px 8px;
      ">
        <div style="font-size: 12px;font-weight:600">${name}</div>
        <div style="font-size: 10px">${newLatLng.lat.toFixed(5)}, ${newLatLng.lng.toFixed(5)}</div>
      </div>`,
      {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'custom-place-tooltip'
      }
    );
  };

  const createPlacePopup = (marker: L.Marker<any>, latLng: LatLngExpression, name: string, isShowPopup: boolean = false) => {
    const newLatLng = L.latLng(latLng);
    marker.bindPopup(
      `<div style="
        text-align: center;
        color: #FFFFFF;
        border-radius: 6px;
        background-color: #071C3B;
        padding: 0;
      ">
        <div style="font-size: 12px;font-weight:600">${name}</div>
        <div style="font-size: 10px">${newLatLng.lat.toFixed(5)}, ${newLatLng.lng.toFixed(5)}</div>
      </div>`,
      {
        closeButton: false,
        autoPan: true,
        className: 'custom-place-popup',
      }
    );

    if (isShowPopup) {
      marker.openPopup();
    }

    return marker;
  }

  const createEventPopup = (marker: L.Marker<any>, latLng: LatLngExpression) => {
    const newLatLng = L.latLng(latLng);
    const lat = newLatLng.lat.toFixed(5);
    const lng = newLatLng.lng.toFixed(5);
    const coords = `${lat}, ${lng}`;

    const id = `${lat}-${lng}`.replace(/\./g, "_");

    marker.bindPopup(
      `<div style="
        color: #FFFFFF;
        border-radius: 6px;
        background-color: #071C3B;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 41px;
      ">
        <div id="coords-text-${id}" style="font-size: 14px;width: 170px">${newLatLng.lat.toFixed(5)}, ${newLatLng.lng.toFixed(5)}</div>
        <button id="copy-btn-${id}" style="
          background: none;
          border: none;
          cursor: pointer;
        ">
          <img src="${LocationCopyIcon}" alt="copy" style="width: 22px; height: 22px; vertical-align: middle; margin-right: 4px;" />
        </button>
        </div>`,
      {
        closeButton: false,
        autoPan: true,
        className: 'custom-event-popup',
      }
    );

    marker.on("popupopen", () => {
      setTimeout(() => {
        const copyBtn = document.getElementById(`copy-btn-${id}`);
        const coordsText = document.getElementById(`coords-text-${id}`);
        if (copyBtn && coordsText) {
          copyBtn.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(coordsText.textContent || "");
              copyBtn.innerHTML = `<span style="color:#0D6EFD;font-size:12px;">Copied!</span>`;
              setTimeout(() => {
                copyBtn.innerHTML = `<img src="${LocationCopyIcon}" alt="copy" style="width: 25px; height: 25px;" />`;
              }, 1500);
            } catch (err) {
              console.error("Copy failed", err);
            }
          });
        }
      }, 0);
    });

    return marker;
  }

  return {
    clearMarkers,
    clearMarkerByLocation,
    createLocationIcon,
    createClickPinMarker,
    createEventIcon,
  };
};