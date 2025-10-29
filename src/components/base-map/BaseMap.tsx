"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "motion/react";

// Material UI
import IconButton from '@mui/material/IconButton';

// Types
import type { MapProps } from "../../features/types.tsx";
import { DEFAULT_DIMENSIONS, DEFAULT_MAP_CONFIG } from "../../constants/map"
import { useMap } from "../../hooks/useOpenStreetMap.tsx"

// Components
import Loading from "../../components/loading/Loading"

// Icons
import CurrentLocation from "../../assets/icons/current-location.png";

const BaseMap: React.FC<MapProps> = ({
  height = DEFAULT_DIMENSIONS.height,
  width = DEFAULT_DIMENSIONS.width,
  panControl = DEFAULT_MAP_CONFIG.panControl,
  zoomControl = DEFAULT_MAP_CONFIG.zoomControl,
  mapTypeControl = DEFAULT_MAP_CONFIG.mapTypeControl,
  streetViewControl = DEFAULT_MAP_CONFIG.streetViewControl,
  fullscreenControl = DEFAULT_MAP_CONFIG.fullscreenControl,
  currentLocation = DEFAULT_MAP_CONFIG.currentLocation,
  onMapLoad,
}) => {

  // State
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Ref
  const mapRef = useRef<HTMLDivElement>(null)

  const { initMap, isLoading, error, mapInstance, goToCurrentLocation } = useMap({
    panControl: panControl,
    zoomControl: zoomControl, 
    mapTypeControl: mapTypeControl,
    streetViewControl: streetViewControl,
    fullscreenControl: fullscreenControl, 
  })

  // Variants
  const buttonVariants: Variants = {
    hover: {
      scale: 1.1,
      rotate: 15,
      transition: { type: "spring", stiffness: 400 },
    },
  }

  const iconVariants: Variants = {
    hover: {
      scale: 1.2,
      transition: { type: "spring", stiffness: 400 },
    },
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      initMap(mapRef.current)
    }
  }, [])

  useEffect(() => {
    if (onMapLoad) {
      onMapLoad(mapInstance?.current)
    }
  }, [mapInstance, onMapLoad])

  if (error) {
    return <div className="text-red-500">{`Failed to load map: ${error.message}`}</div>
  }

  return (
    <div className="relative w-full h-full">
      { isLoading && (
        <div className="absolute h-full w-full">
          <Loading />
        </div>
      ) }
      <div
        ref={mapRef}
        id="map"
        className="relative"
        style={{
          width,
          height,
          position: "absolute",
          top: isFullScreen ? 0 : 0,
          left: isFullScreen ? 0 : 0,
          zIndex: 1,
        }}
      />

      {
        currentLocation && (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            className="absolute bottom-[15px] right-[5px] z-10"
          >
            <IconButton 
              className="current-location-btn"
              sx={{
                borderRadius: "50px !important",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              onClick={goToCurrentLocation}
            >
              <motion.img 
                variants={iconVariants}
                whileHover="hover"
                src={CurrentLocation} 
                alt='Current Location' 
                className='w-[22px] h-[22px]' 
              />
            </IconButton>
          </motion.div>
        )
      }
    </div>
  )
}

export default BaseMap