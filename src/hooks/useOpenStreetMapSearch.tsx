import { useState, useCallback, useEffect } from 'react';
import L, { Map as LeafletMap, LatLngBounds, Polyline } from 'leaflet';

// Types
import type { SearchResult } from '../features/types';

// Utils
import { parseCoordinates, parseCoordinatesWith2Param } from '../utils/commonFunctions';

// Hooks
import { useMarkerManager } from './useMarkerManager';

export const useMapSearch = (
  map: LeafletMap | null, 
  ableToClick = false,
) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const markerManager = useMarkerManager(map);
  const [routes, setRoutes] = useState<Polyline[]>([]);

  const handleClick = useCallback(async (event: L.LeafletMouseEvent) => {
    const location = {
      lat: event.latlng.lat,
      lng: event.latlng.lng,
    };

    const result: SearchResult = {
      name: `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`,
      location: location,
    };

    setSearchResults([result]);
    await markerManager.createClickPinMarker(location);
  }, [markerManager])

  useEffect(() => {
    if (!map) return;

    if (ableToClick) {
      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map, ableToClick, handleClick]);

  const clearRoutes = () => {
    routes.forEach((route) => map?.removeLayer(route));
    setRoutes([]);
  };

  const clearSearchPlaces = async () => {
    setSearchResults([]);
    await markerManager.clearMarkers();
  }

  const clearPlaceMarkerWithLocation = async (location: { lat: number, lng: number }) => {
    markerManager.clearMarkerByLocation(location);
  }

  const searchPlace = useCallback(async (query: string) => {
    setSearchResults([])
    if (!map) return
    
    setIsSearching(true)
    setSearchError(null)
    
    try {
      const coordinates = parseCoordinates(query)
      if (coordinates) {
        const result: SearchResult = {
          name: `${coordinates.lat}, ${coordinates.lng}`,
          location: coordinates
        }
        setSearchResults([result])
        map.setZoom(18)
        map.panTo(coordinates)
        await markerManager.createClickPinMarker(coordinates)
        return
      }
    } 
    catch (error) {
      setSearchError('Error searching for place')
      setSearchResults([])
    } 
    finally {
      setIsSearching(false);
    }
  }, [map, markerManager]);

  const showLocationPinInMap = useCallback((list: { lat: string, lon: string, type: number, markerTag: string }[]) => {
    setSearchResults([])
    if (!map) return
    
    setIsSearching(true)
    setSearchError(null)
    
    try {

      markerManager.clearMarkers();

      const bounds = new LatLngBounds([]);

      for (const item of list) {
        const coordinate = parseCoordinatesWith2Param(item.lat, item.lon);

        if (!coordinate) continue;

        markerManager.createLocationIcon(coordinate, item.type, item.markerTag);
        bounds.extend(coordinate);
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    } 
    catch (error) {
      setSearchError('Error show count on map')
      setSearchResults([])
    } 
    finally {
      setIsSearching(false)
    }
  }, [map, markerManager]);

  const updateLocationPinInMap = useCallback(
    (lat: string, lon: string, type: number, markerTag: string = "", isShowPopup: boolean = false, panMap: boolean = false) => {
      if (!map) return;

      setIsSearching(true);
      setSearchError(null);

      try {
        const coordinate = parseCoordinatesWith2Param(lat, lon);
        if (!coordinate) return;

        markerManager.clearMarkerByLocation(coordinate);

        markerManager.createLocationIcon(coordinate, type, markerTag, isShowPopup);

        if (panMap) {
          map.flyTo(coordinate, 10, {
            animate: true,
            duration: 1.0,
          });
        }
      } 
      catch (error) {
        setSearchError('Error updating marker on map');
        setSearchResults([]);
      } 
      finally {
        setIsSearching(false);
      }
    },
    [map, markerManager]
  );

  const eventLocation = useCallback((lat: string, lon: string) => {
    setSearchResults([])
    if (!map) return
    
    setIsSearching(true)
    setSearchError(null)
    
    try {
        const coordinate = parseCoordinatesWith2Param(lat, lon);
        if (!coordinate) return;

        markerManager.clearMarkers();

        markerManager.createEventIcon(coordinate);

        map.flyTo(coordinate, 18, {
          animate: true,
          duration: 1.0,
        });
    } 
    catch (error) {
      setSearchError('Error show count on map')
      setSearchResults([])
    } 
    finally {
      setIsSearching(false)
    }
  }, [map, markerManager]);

  return {
    searchPlace,
    searchResults,
    isSearching,
    searchError,
    clearSearchPlaces,
    clearPlaceMarkerWithLocation,
    showLocationPinInMap,
    updateLocationPinInMap,
    eventLocation,
  }
}