import React, { useState, useCallback, useEffect } from 'react'
import { Map as LeafletMap } from 'leaflet';

// Material UI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Components
import Image from '../image/Image';
import BaseMap from '../../components/base-map/BaseMap';

// Constants
import { EVENT_TYPES } from '../../constants/eventTypes';

// Icons
import { CircleX } from "lucide-react";
import { Icon } from '../icons/Icon';

// Types
import type { EventDetailData } from '../../features/types';
import dayjs from 'dayjs';

// Hooks
import { useMapSearch } from "../../hooks/useOpenStreetMapSearch";

type EventDetailPopupProps = {
  open: boolean
  onClose: () => void
  selectData?: EventDetailData | null
}

const EventDetailPopup: React.FC<EventDetailPopupProps> = ({ open, onClose, selectData }) => {
  // State
  const [showScrollbar, setShowScrollbar] = useState(false);

  // Data
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const {
    eventLocation,
  } = useMapSearch(map, false)

  useEffect(() => {
    if (map && selectData?.latitude && selectData?.longitude) {
      eventLocation(selectData?.latitude.toString(), selectData?.longitude.toString());
    }
  }, [map]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectData]);


  const handleMapLoad = useCallback((mapInstance: LeafletMap | null) => {
    setMap(mapInstance);
  }, []);

  return (
    <Dialog 
      id='event-detail-popup' 
      open={open} 
      maxWidth="xl" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "800px",
          },
        }
      }}
    >
      <DialogTitle className='bg-[#F3F3FA]'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#1A2136"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"รายละเอียดเหตุการณ์"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#F3F3FA]'>
        <div className='grid grid-cols-2 w-full h-full bg-white'>
          {/* Detail */}
          <div className='flex flex-col justify-between gap-2 p-4 h-full'>
            <div className='flex flex-col gap-3 h-full'>
              {
                (() => {
                  const eventType = EVENT_TYPES.find((e) => e.id === selectData?.eventType);
                  return (
                    <div className='flex gap-3 items-center border-b-[1px] border-[#F46320]'>
                      <div 
                        className='flex justify-center items-center w-[170px] px-2 rounded-[5px_5px_0px_0px] h-[40px]' 
                        style={{ backgroundColor: eventType?.color ?? "#FFFFFF" }}
                      >
                        <label className='text-[#FFFFFF] text-[16px] font-semibold'>{eventType?.name ?? "-"}</label>
                      </div>
                      <label className='text-[#133462] text-[16px] font-medium'>{selectData?.eventName}</label>
                    </div>
                  )
                })()
              }
              <div className='flex text-[#133462] text-[14px]'>
                <div className='grid grid-cols-[30%_auto] w-full'>
                  <p className='font-medium'>วันที่เหตุการณ์ : </p>
                  <p>{dayjs(selectData?.eventDateTime).format("DD/MM/BB HH:mm")}</p>
                </div>
                <div className='grid grid-cols-[40%_auto] w-full'>
                  <p className='font-medium'>พิกัดที่เกิดเหตุการณ์ : </p>
                  <p>{selectData?.latitude && selectData?.longitude ? `${selectData?.latitude},${selectData?.longitude}` : "-"}</p>
                </div>
              </div>
              <p className='text-[#133462] text-[14px]'>
                {selectData?.eventDetail || "-"}
              </p>
            </div>
            <div className='flex flex-col w-full gap-3 text-[#133462] text-[14px]'>
              <Divider sx={{ borderColor: "#1A486C" }} />
              <div className='flex gap-3'>
                <div className='grid grid-cols-[20%_auto] w-full'>
                  <p className='font-medium'>ผู้บันทึก : </p>
                  <p>{selectData?.recorder}</p>
                </div>
                <div className='grid grid-cols-[35%_auto] w-full'>
                  <p className='font-medium'>วันเวลาที่บันทึก : </p>
                  <p>{dayjs(selectData?.recordDateTime).format("DD/MM/BB HH:mm")}</p>
                </div>
              </div>
              <div className='flex gap-3'>
                <div className='grid grid-cols-[20%_auto] w-full'>
                  <p className='font-medium'>ผู้แก้ไข : </p>
                  <p>{selectData?.editor}</p>
                </div>
                <div className='grid grid-cols-[35%_auto] w-full'>
                  <p className='font-medium'>วันเวลาที่แก้ไข : </p>
                  <p>{dayjs(selectData?.editDateTime).format("DD/MM/BB HH:mm")}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Image & Map */}
          <div className='grid grid-rows-[64%_auto] gap-1 p-4 w-full h-full'>
            <div className='flex flex-col w-full h-full gap-[1px]'>
              <div className='flex relative w-full h-[350px]'>
                {
                  selectData?.imageList && selectData?.imageList.length > 0 ? (
                    <>
                      <Image 
                        src={
                          selectData?.imageList && selectData?.imageList.length > 0
                            ? selectData?.imageList[selectedImageIndex].fileData
                            : ""
                        }
                        alt="Main Image" 
                        className='w-full h-full object-cover'
                      />
                      <div className='flex justify-between absolute bottom-2 right-0 left-0 px-2 py-1 text-[#006FFD] text-[12px]'>
                        {
                          selectData?.latitude && selectData?.longitude ? (
                            <>
                              <p className='font-semibold'>{`${selectData?.latitude},${selectData?.longitude}`}</p>
                              <p className='font-semibold'>{dayjs(selectData?.eventDateTime).format("DD/MM/BB HH:mm")}</p>
                            </>
                          ) : null
                        }
                      </div>
                    </>
                  ) : (
                    <div className='flex justify-center items-center w-full h-full'>
                      <p className='text-[#133462] text-[14px]'>ไม่มีรูปภาพ</p>
                    </div>
                  )
                }
              </div>
              <div 
                className={`flex gap-[1px] max-w-[38vw] ${showScrollbar ? '' : 'hide-scrollbar'}`}
                onMouseEnter={() => setShowScrollbar(true)}
                onMouseLeave={() => setShowScrollbar(false)}
                style={{
                  overflowX: showScrollbar ? 'auto' : 'hidden',
                  overflowY: 'hidden',
                  scrollbarWidth: showScrollbar ? 'thin' : 'none',
                  msOverflowStyle: showScrollbar ? 'auto' : 'none',
                }}
              >
                {
                  selectData?.imageList && selectData?.imageList.length > 0 ? (
                    selectData?.imageList.map((img, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 max-w-full w-[150px] h-[80px] cursor-pointer border-[2px] transition-all duration-200 ${
                          index === selectedImageIndex
                            ? "border-[#006FFD] opacity-100"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={img.fileData}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    null
                  )
                }
              </div>
            </div>
            <div className='flex relative h-full w-full'>
              {/* Map */}
              {
                selectData?.latitude && selectData?.longitude ? (
                  <BaseMap 
                    onMapLoad={handleMapLoad}
                  />
                ) : (
                  <div className='flex justify-center items-center w-full h-full bg-[#F2F2F2]'>
                    <p className='text-[#72767B] text-[14px] font-medium'>ไม่สามารถระบุพิกัดได้</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EventDetailPopup;