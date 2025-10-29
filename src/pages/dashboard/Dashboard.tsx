"use client"

import React, { useState, useCallback, useEffect } from 'react'
import dayjs from "dayjs";
import { Map as LeafletMap } from 'leaflet';
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "motion/react";

// Material UI
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Icons
import centerIcon from "../../assets/icons/center.png";
import OperationPlaceIcon from "../../assets/icons/operation-place.png";
import ListItemsIcon from "../../assets/icons/list-items.png";
import CloseIcon from "../../assets/icons/close.png";
import SearchIcon from "../../assets/icons/search.png";
import WorkerLeaveIcon from "../../assets/icons/worker-leave.png";
import WorkerIcon from "../../assets/icons/worker.png";
import EventDate from "../../assets/icons/event-date.png";
import EventTime from "../../assets/icons/event-time.png";
import { KeyboardArrowUp } from '@mui/icons-material';
import MuiSearchIcon from '@mui/icons-material/Search';
import { Search } from "lucide-react";

// Components
import DatePickerBuddhist from "../../components/date-picker-buddhist/DatePickerBuddhist";
import BaseMap from '../../components/base-map/BaseMap';
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import Loading from '../../components/loading/Loading';
import EventDetailPopup from '../../components/event-detail-popup/EventDetailPopup';

// Charts
import ActiveChart from "./active-chart/ActiveChart";
import WorkerBarChart from "./bar-chart/WorkerBarChart";
import LineAreaChart from "./line-area-chart/LineAreaChart";

// Constants
import { EVENT_TYPES } from '../../constants/eventTypes';
import { PLACE_ICON_RED_TYPE, PLACE_ICON_GREEN_TYPE, PLACE_ICON_YELLOW_TYPE } from '../../constants/placeIconType';

// Hooks
import { useMapSearch } from "../../hooks/useOpenStreetMapSearch";

// Types
import type {
  OperationPlace,
  EventDetailData,
} from "../../features/types"

// Mocks
import { mockOperationPlaces } from '../../mocks/mockOperationPlaces';
import { mockEventDetail } from '../../mocks/mockEventDetail';

interface OperationPlaceData {
  patrolId: number
  name: string
};

interface EventData {
  eventTypeId: number
  patrolId: number
  name: string
};

export default function DashboardPage() {
  // State
  const [operationPlaceOpen, setOperationPlaceOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [isAccordionOperationPlaceOpen, setIsAccordionOperationPlaceOpen] = useState(false);
  const [isAccordionEventOpen, setIsAccordionEventOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveChartLoaded, setIsActiveChartLoaded] = useState(false);
  const [isBarChartLoaded, setIsBarChartLoaded] = useState(false);
  const [isLineAreaLoaded, setIsLineAreaLoaded] = useState(false);
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);

  // Data
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [searchOperationPlaceData, setSearchOperationPlaceData] = useState<OperationPlaceData>({
    patrolId: 0,
    name: ""
  });
  const [searchEventData, setSearchEventData] = useState<EventData>({
    eventTypeId: 0,
    patrolId: 0,
    name: "",
  })
  const [data01, setData01] = useState<{name: string, value: number}[]>([
    { name: 'Working', value: 90 },
    { name: 'Not Working', value: 10 },
  ]);
  const [data02, setData02] = useState<{name: string, value: number}[]>(([
    { name: 'Personal Leave', value: 90 },
    { name: 'Sick Leave', value: 10 },
    { name: 'Absent', value: 10 },
  ]));
  const [data03, setData03] = useState<{name: string, value: number}[]>(([
    { name: 'In Time', value: 90 },
    { name: 'Late', value: 10 },
  ]));
  const [operationPlacesData, setOperationPlacesData] = useState<OperationPlace[]>(mockOperationPlaces);
  const [eventData, setEventData] = useState<EventDetailData[]>(mockEventDetail);
  const [startYear, setStartYear] = useState(dayjs().subtract(1, "year"));
  const [endYear, setEndYear] = useState(dayjs());
  const [placeSelect, setPlaceSelect] = useState<OperationPlace | null>(null);
  const [prevPlaceSelect, setPrevPlaceSelect] = useState<OperationPlace | null>(null);
  const [eventDetailSelected, setEventDetailSelected] = useState<EventDetailData | null>(null);

  // Options
  const [placesOptions, setPlacesOptions] = useState<{ label: string ,value: number }[]>([]);
  const [eventTypeOptions, setEventTypeOptions] = useState<{ label: string ,value: number }[]>([]);
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);

  // Variants
  const buttonVariants: Variants = {
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400 },
    },
  }

  const {
    showLocationPinInMap,
    updateLocationPinInMap,
  } = useMapSearch(map, false)

  useEffect(() => {
    setIsLoading(true);
    setPlacesOptions([{label: "ทั้งหมด", value: 0}])
    setEventTypeOptions([{label: "ทั้งหมด", value: 0}])
    setPatrolOptions([{label: "ทั้งหมด", value: 0}])
  }, [])

  useEffect(() => {
    if (isActiveChartLoaded && isBarChartLoaded && isLineAreaLoaded && map) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500)
    }
  }, [isActiveChartLoaded, isBarChartLoaded, isLineAreaLoaded, map])

  useEffect(() => {
    if (map) {
      const placeList = operationPlacesData.map((op) => ({
        lat: op.lat,
        lon: op.lon,
        type: op.eventType,
        markerTag: op.name,
      }))
      showLocationPinInMap(placeList);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const matchedPlace = operationPlacesData.find((op) =>
        eventData.some(
          (e) =>
            e.latitude && e.longitude &&
            Math.abs(e.latitude - Number(op.lat)) < 0.000001 &&
            Math.abs(e.longitude - Number(op.lon)) < 0.000001
        )
      );

      if (matchedPlace) {
        updateLocationPinInMap(
          matchedPlace.lat, 
          matchedPlace.lon, 
          PLACE_ICON_RED_TYPE, 
          matchedPlace.name, 
          false, 
          false
        );
      }
    }
  }, [map, eventData]);

  useEffect(() => {
    const selectedPlace = placeSelect ?? prevPlaceSelect;

    if (!selectedPlace) return;

    if (placeSelect !== prevPlaceSelect && placeSelect && prevPlaceSelect) {
      updateLocationPinInMap(prevPlaceSelect.lat, prevPlaceSelect.lon, PLACE_ICON_GREEN_TYPE, prevPlaceSelect.name);
      // Note!!:: Change to web-socket or something to receive each event
      const matchedPlace = operationPlacesData.find((op) =>
        eventData.some(
          (e) =>
            e.latitude && e.longitude &&
            Math.abs(e.latitude - Number(op.lat)) < 0.000001 &&
            Math.abs(e.longitude - Number(op.lon)) < 0.000001
        )
      );
      if (matchedPlace) {
        updateLocationPinInMap(
          matchedPlace.lat, 
          matchedPlace.lon, 
          PLACE_ICON_RED_TYPE, 
          matchedPlace.name
        );
      }
    }

    const showPopUp = !placeSelect && prevPlaceSelect ? false : true;
    updateLocationPinInMap(selectedPlace.lat, selectedPlace.lon, placeSelect ? PLACE_ICON_YELLOW_TYPE : PLACE_ICON_GREEN_TYPE, selectedPlace.name, showPopUp, true);

    setPrevPlaceSelect(placeSelect);
  }, [placeSelect, prevPlaceSelect]);

  const handleMapLoad = useCallback((mapInstance: LeafletMap | null) => {
    setMap(mapInstance);
  }, []);

  const handleOperationPlaceClick = () => {
    setOperationPlaceOpen(!operationPlaceOpen);
  }

  const handleCloseOperationPlaceClick = () => {
    setOperationPlaceOpen(!operationPlaceOpen);
    setIsAccordionOperationPlaceOpen(false);
  }

  const handleEventClick = () => {
    setEventOpen(!eventOpen);
  }

  const handleCloseEventClick = () => {
    setEventOpen(!eventOpen);
    setIsAccordionEventOpen(false);
  }

  const handleOperationPlaceTextChange = (key: keyof typeof searchOperationPlaceData, value: string) => {
    setSearchOperationPlaceData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventTextChange = (key: keyof typeof searchEventData, value: string) => {
    setSearchEventData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventDropdownChange = (key: keyof typeof searchEventData, value: string) => {
    setSearchEventData((prev) => ({ ...prev, [key]: value }));
  };

  const handleOperationPlaceDropdownChange = (key: keyof typeof searchOperationPlaceData, value: string) => {
    setSearchOperationPlaceData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePatrolChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleOperationPlaceDropdownChange("patrolId", value.value);
    }
    else {
      handleOperationPlaceDropdownChange("patrolId", '');
    }
  };

  const handleEventTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleEventDropdownChange("eventTypeId", value.value);
    }
    else {
      handleEventDropdownChange("eventTypeId", '');
    }
  };

  const handlePatrolEventChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleEventDropdownChange("patrolId", value.value);
    }
    else {
      handleEventDropdownChange("patrolId", '');
    }
  };

  const handlePlaceSelect = (op: OperationPlace) => {
    setPlaceSelect((prev) => {
      if (prev?.id === op.id) {
        return null;
      }
      return op;
    });
  }

  const handleRowDoubleClick = (data: EventDetailData) => {
    setIsEventDetailPopupOpen(true);
    setEventDetailSelected(data);
  };

  return (
    <section id="dashboard" className="px-1">
      { isLoading && <Loading /> }
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "20px" }} >{"Dashboard"}</Typography>
        <div className="flex gap-2 items-center">
          <img src={centerIcon} alt="Center Icon" className="w-6 h-6" />
          <Typography variant='h5' color={"#133462"} sx={{ fontWeight: 500, fontSize: "18px" }}>{"Center"}</Typography>
        </div>
      </div>
      
      <div className='grid grid-cols-[1fr_1fr] grid-rows-6 gap-1 h-full'>
        {/* Real-Time Value */}
        <div className="flex-1 flex gap-1 h-[125px]">
          {/* Operation Places */}
          <div className="flex-1 flex flex-col bg-[#124692] border-[#A3CBF2] border-b-[2px] min-w-[200px] py-2 shadow-md">
            <div className="flex justify-between items-center w-full px-[9px] text-white">
              <p className="font-semibold text-[16px]">สถานที่ปฏิบัติงาน</p>
              <p className="font-semibold text-[12px]">01/07/68</p>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <span className="text-[#FFC300] font-semibold text-[55px] leading-none">85</span>
            </div>

            <div className="flex justify-center items-center w-full">
              <p className="text-white text-[12px]">จำนวนสถานที่ปฏิบัติงาน</p>
            </div>
          </div>

          {/* Workers */}
          <div className="flex-1 flex flex-col min-w-[740px] bg-[#A3CBF2] border-[#D8EDFD] border-b-[2px] w-[220px] py-2 shadow-md">
            <div className="flex justify-between items-center w-full px-[9px] text-[#0D3063]">
              <p className="font-semibold text-[16px]">จำนวนผู้ปฏิบัติงาน</p>
              <p className="font-semibold text-[12px]">01/07/68</p>
            </div>

            <div className='flex-1 flex gap-[1px]'>
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#FFC300] font-semibold text-[55px] leading-none">155</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">จำนวนสถานที่ปฏิบัติงาน</p>
                </div>
              </div>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "black"}} />

              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#124692] font-semibold text-[55px] leading-none">75</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">ผู้ปฏิบัติงานในปัจจุบัน</p>
                </div>
              </div>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "black"}} />

              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#E1652A] font-semibold text-[55px] leading-none">3</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">ขาดงาน</p>
                </div>
              </div>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "black"}} />

              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#E38C32] font-semibold text-[55px] leading-none">9</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">มาสาย</p>
                </div>
              </div>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "black"}} />

              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#E38C32] font-semibold text-[55px] leading-none">9</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">ลา</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workers Status */}
          <div className="flex-1 flex flex-col min-w-[250px] bg-[#A3CBF2] border-[#D8EDFD] border-b-[2px] w-[220px] py-2 shadow-md">
            <div className="flex justify-between items-center w-full px-[9px] text-[#0D3063]">
              <p className="font-semibold text-[16px]">สถานะผู้ปฏิบัติงาน</p>
              <p className="font-semibold text-[12px]">01/07/68</p>
            </div>

            <div className='flex-1 flex gap-1'>
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#124692] font-semibold text-[55px] leading-none">189</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">สถานะปกติ</p>
                </div>
              </div>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "black"}} />

              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-[#E1652A] font-semibold text-[55px] leading-none">5</span>
                </div>

                <div className="flex justify-center items-center w-full">
                  <p className="text-[#124692] text-[12px]">สถานะมีปัญหา</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="flex-1 flex flex-col bg-[#A3CBF2] border-[#D8EDFD] border-b-[2px] min-w-[200px] py-2 shadow-md">
            <div className="flex justify-between items-center w-full px-[9px] text-[#0D3063]">
              <p className="font-semibold text-[16px]">เหตุการณ์</p>
              <p className="font-semibold text-[12px]">01/07/68</p>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <span className="text-[#FFC300] font-semibold text-[55px] leading-none">85</span>
            </div>

            <div className="flex justify-center items-center w-full">
              <p className="text-[#124692] text-[12px]">เหตุการณ์</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className='flex-1 flex flex-col gap-1 col-start-2 row-span-6'>
          {/* Active Chart */}
          <div className='bg-white shadow-md flex-1 flex flex-col'>
            <div className='flex justify-between items-center p-2'>
              <p className="font-bold text-[16px] text-[#0D3063]">Active Chart</p>
              <div className='flex justify-center items-center rounded-[5px] bg-[#006FFD] px-3 py-1'>
                <p className='font-semibold text-[12px] text-white'>01/07/68</p>
              </div>
            </div>

            <div className="grid grid-cols-[240px_1fr] pb-2 pr-2">
              {/* Chart */}
              <ActiveChart 
                onPieLeave={() => {}}
                onPieEnter={() => {}}
                data01={data01}
                data02={data02}
                data03={data03}
                activePieIndex={-1}
                activeIndex={-1}
                pieClickIndex={-1}
                onChartRendered={() => setIsActiveChartLoaded(true)}
              />

              {/* Chart Detail */}
              <div className="rounded-[5px] bg-[#D9D9D9] h-[200px] min-h-[200px] w-full p-2 overflow-y-auto">
                {/* Worker Operation */}
                <ul className="relative flex flex-col gap-1">
                  {/* Main node */}
                  <li className="relative">
                    <div className="bg-[#F8C33C] text-[#0B2C64] font-semibold rounded-md pr-4 py-2 border border-white shadow-sm pl-[30px]">
                      <span className="text-[14px]">จำนวนผู้ปฏิบัติงาน : 80</span>
                    </div>

                    {/* Circle */}
                    <span className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Vertical line */}
                    <span className="absolute left-[12px] top-[calc(50%+5px)] w-[2px] h-[calc(100%+1.6vh)] bg-white"></span>
                  </li>

                  {/* Sub-node 1 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>

                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Label */}
                    <span className="text-[#0B2C64] font-bold text-[14px]">มาทำงาน : 74</span>
                  </li>

                  {/* Sub-node 2 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>
                    
                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>
                    
                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">ไม่มาทำงาน : 6</span>
                  </li>
                </ul>

                {/* Worker Leave */}
                <ul className="relative flex flex-col gap-1">
                  {/* Main node */}
                  <li className="relative">
                    <div className="bg-[#F8C33C] text-[#0B2C64] font-semibold rounded-md pr-4 py-2 border border-white shadow-sm pl-[30px]">
                      <span className="text-[14px]">ไม่มาทำงาน : 6</span>
                    </div>

                    {/* Circle */}
                    <span className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Vertical line */}
                    <span className="absolute left-[12px] top-[calc(50%+5px)] w-[2px] h-[calc(100%+4vh)] bg-white"></span>
                  </li>

                  {/* Sub-node 1 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>

                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">ลากิจ : 2</span>
                  </li>

                  {/* Sub-node 2 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>
                    
                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>
                    
                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">ลาป่วย : 3</span>
                  </li>

                  {/* Sub-node 3 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>
                    
                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>
                    
                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">ขาดงาน : 1</span>
                  </li>
                </ul>

                {/* Working Time */}
                <ul className="relative flex flex-col gap-1">
                  {/* Main node */}
                  <li className="relative">
                    <div className="bg-[#F8C33C] text-[#0B2C64] font-semibold rounded-md pr-4 py-2 border border-white shadow-sm pl-[30px]">
                      <span className="text-[14px]">เข้างาน : 74</span>
                    </div>

                    {/* Circle */}
                    <span className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Vertical line */}
                    <span className="absolute left-[12px] top-[calc(50%+5px)] w-[2px] h-[calc(100%+1.6vh)] bg-white"></span>
                  </li>

                  {/* Sub-node 1 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>

                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>

                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">มาทัน : 70</span>
                  </li>

                  {/* Sub-node 2 */}
                  <li className="relative pl-[38px] flex items-center gap-2">
                    {/* Horizontal line */}
                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[2px] bg-white"></span>
                    
                    {/* Circle */}
                    <span className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full z-10"></span>
                    
                    {/* Label */}
                    <span className="text-[#0B2C64] text-[14px]">มาสาย : 4</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Worker Leave Chart */}
          <div className='bg-white shadow-md flex-1 flex flex-col'>
            <div className='flex justify-between items-center p-2'>
              <p className="font-bold text-[16px] text-[#0D3063]">สถิติการลาและขาดงานของพนักงาน</p>
              <div className='flex justify-center items-center rounded-[5px] bg-[#F6C643] px-3 py-1'>
                <p className='font-semibold text-[12px] text-[#133462]'>2568</p>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 flex ml-[-25px]">
              <WorkerBarChart
                data={[
                  { month: "ม.ค.", sickLeave: 12, personalLeave: 10, annualLeave: 6, ordinationLeave: 2, leaveWithoutPay: 1 },
                  { month: "ก.พ.", sickLeave: 9, personalLeave: 7, annualLeave: 4, ordinationLeave: 3, leaveWithoutPay: 2 },
                  { month: "มี.ค.", sickLeave: 15, personalLeave: 8, annualLeave: 5, ordinationLeave: 1, leaveWithoutPay: 0 },
                ]}
                onChartRendered={() => setIsBarChartLoaded(true)}
              />
            </div>
          </div>

          {/* Event Chart */}
          <div className='bg-white shadow-md flex-1 flex flex-col p-2'>
            <div className='flex justify-start items-center'>
              <p className="font-bold text-[16px] text-[#0D3063]">สถิติการเกิดเหตุการณ์ไม่ปกติ</p>
            </div>

            {/* Chart */}
            <div className="flex ml-[-30px]">
              <LineAreaChart 
                data={[
                  { month: "ม.ค.", value1: 30, value2: 20 },
                  { month: "ก.พ.", value1: 20, value2: 25 },
                  { month: "มี.ค.", value1: 10, value2: 30 },
                  { month: "เม.ย.", value1: 15, value2: 25 },
                  { month: "พ.ค.", value1: 25, value2: 30 },
                  { month: "มิ.ย.", value1: 20, value2: 20 },
                  { month: "ก.ค.", value1: 30, value2: 15 },
                ]}
                onChartRendered={() => setIsLineAreaLoaded(true)}
              />
            </div>

            {/* Year Compare Select */}
            <div className="flex px-2 gap-1">
              <div className="flex justify-center items-center gap-2 bg-[#F6C643] px-2 py-1 rounded-[5px]">
                <p className="text-[12px] text-[#133462]">ปีเริ่มต้น-สิ้นสุด</p>
                <div className="w-[95px]">
                  <DatePickerBuddhist 
                    value={startYear} 
                    onChange={() => {}} 
                    yearOnly={true} 
                    views={["year"]} 
                    size="small" 
                    fontSize={"12px"} 
                    maxDate={dayjs()}
                    bgColor="#72767B"
                    color="#FFC300"
                    borderColor="#C5C8CB"
                    height="40px"
                  />
                </div>
                <span className="text-[12px] text-[#133462]">-</span>
                <div className="w-[95px]">
                  <DatePickerBuddhist 
                    value={endYear} 
                    onChange={() => {}} 
                    yearOnly={true} 
                    views={["year"]} 
                    size="small" 
                    fontSize={"12px"} 
                    maxDate={dayjs()}
                    bgColor="#72767B"
                    color="#FFC300"
                    borderColor="#C5C8CB"
                    height="40px"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex justify-center items-center gap-2">
                  <div className="h-[20px] w-[20px] bg-gradient-to-b from-[#B3CDCF] to-[#E9EBEC]" />
                  <p className="text-[12px] text-[#FFC300]">{dayjs(startYear).format("BBBB")}</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="h-[20px] w-[20px] bg-gradient-to-b from-[#5C719F] to-[#CFD3D9]" />
                  <p className="text-[12px] text-[#FFC300]">{dayjs(endYear).format("BBBB")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative row-start-2 row-span-5 bg-white shadow-md">
          {/* Operation Place Button */}
          <AnimatePresence>
            {!operationPlaceOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.3, rotate: 45 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                variants={buttonVariants}
                whileHover="hover"
                className="absolute top-[5px] left-[5px] z-20"
              >
                <IconButton
                  className="operation-place-btn"
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onClick={handleOperationPlaceClick}
                >
                  <img
                    src={OperationPlaceIcon}
                    alt="Operation Place"
                    className="w-[30px] h-[30px]"
                  />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Button */}
          <AnimatePresence>
            {!eventOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.3, rotate: 45 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                variants={buttonVariants}
                whileHover="hover"
                className="absolute top-[5px] right-[5px] z-20"
              >
                <IconButton
                  className="list-item-btn"
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onClick={handleEventClick}
                >
                  <img
                    src={ListItemsIcon}
                    alt="List Item"
                    className="w-[30px] h-[30px] mt-[5px]"
                  />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='flex relative h-full w-full'>
            {/* Map */}
            <BaseMap 
              onMapLoad={handleMapLoad}
              zoomControl={true}
              currentLocation={true}
            />
          </div>

          {/* Operation Place Menu */}
          <AnimatePresence>
            {operationPlaceOpen && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 left-0 w-[350px] h-[98%] flex flex-col gap-2 m-1 bg-gradient-to-b from-[#124692] to-[#4E6A94] rounded-md shadow-lg p-2 z-10"
              >
                {/* Header */}
                <div className='flex justify-between items-center'>
                  <h1 className='text-[#FFC300] font-bold text-[20px]'>สถานที่ปฏิบัติงาน</h1>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseOperationPlaceClick}
                  >
                    <img src={CloseIcon} alt="Close" className="w-[20px] h-[20px]" />
                  </motion.button>
                </div>

                {/* Search */}
                <div>
                  <Accordion
                    expanded={isAccordionOperationPlaceOpen}
                    onChange={() => setIsAccordionOperationPlaceOpen(!isAccordionOperationPlaceOpen)}
                    sx={{
                      "&.MuiAccordion-root" : {
                        "&.Mui-expanded" : {
                          margin: "1px 0px",
                        }
                      },
                      borderRadius: "10px",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowUp sx={{ fontSize: "28px", color: "#81898E"}} />}
                      sx={{
                        backgroundColor: "#124692",
                        gap: "10px",
                        border: "1px solid #FFFFFF",
                        ...(
                          isAccordionOperationPlaceOpen ? 
                          { 
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px"
                          } :
                          {
                            borderRadius: "10px"
                          }
                        ),
                        boxShadow: "none",
                        "&.MuiAccordion-root": {
                          "&.Mui-expanded": {
                            margin: "1px 0px",
                          },
                        },
                      }}
                      id="operation-place-search"
                    >
                      <div className='flex justify-start items-center gap-2'>
                        <img src={SearchIcon} alt="Search Icon" className='w-[20px] h-[20px]' />
                        <Typography component="span" style={{ color: "#A3CBF2", fontWeight: 500 }}>
                          Search
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails 
                      sx={{ 
                        padding: 1, 
                        backgroundColor: "#124692",
                        border: "1px solid #FFFFFF",
                        borderTop: "none",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        boxShadow: "none",
                      }}
                    >
                      <div className='flex flex-col gap-2'>
                        <AutoComplete 
                          id="patrol-select"
                          sx={{ marginTop: "5px"}}
                          value={searchOperationPlaceData.patrolId}
                          onChange={handlePatrolChange}
                          options={patrolOptions}
                          label="สายตรวจ"
                          placeholder="กรุณาเลือกสายตรวจ"
                          labelFontSize="14px"
                          labelColor='#FFFFFF'
                        />

                        <TextBox
                          sx={{ marginTop: "10px" }}
                          id="first-name"
                          label={"สถานที่ปฏิบัติงาน"}
                          placeholder={"ระบุสถานที่ปฏิบัติงาน"}
                          value={searchOperationPlaceData.name}
                          labelFontSize="14px"
                          onChange={(event) =>
                            handleOperationPlaceTextChange("name", event.target.value)
                          }
                          labelColor='#FFFFFF'
                        />

                        <div className='flex justify-end items-center py-1'>
                          <Button
                            variant="contained"
                            className="search-btn"
                            sx={{ 
                              width: "90px", 
                              height: "40px",
                              fontSize: "16px",
                              borderRadius: "5px"
                            }}
                            size='large'
                            startIcon={<MuiSearchIcon />}
                          >
                            ค้นหา
                          </Button>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
                
                {/* Operation Places List */}
                <div className='flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-new-color'>
                  {
                    operationPlacesData.map((data) => {
                      return (
                        <div 
                          className='flex flex-col gap-2 p-2 shadow-md cursor-pointer' 
                          style={{
                            backgroundColor: placeSelect?.id === data.id ? "#B1B1B1" : "#FFFFFF"
                          }}
                          key={data.id}
                          onClick={() => handlePlaceSelect(data)}
                        >
                          <p 
                            className='text-[16px] font-medium'
                            style={{
                              color: placeSelect?.id === data.id ? "#FFFFFF" : "#133462",
                            }}
                          >
                            {data.name}
                          </p>
                          <p 
                            className='text-[14px] font-normal'
                            style={{
                              color: placeSelect?.id === data.id ? "#FFFFFF" : "#133462",
                            }}
                          >
                            {data.address}
                          </p>
                          <div className='flex gap-2'>
                            {/* Worker */}
                            {
                              data.worker > 0 && (
                                <div className='flex bg-[#071C3B] px-1 rounded-[5px] gap-1 w-[85px] h-[25px]'>
                                  <div className='flex items-end'>
                                    <img src={WorkerIcon} alt="Worker Leave Icon" className='w-[40px] h-[30px]' />
                                  </div>
                                  <div className='flex justify-center items-center pl-2'>
                                    <p className='text-[14px] text-[#FFC300]'>{data.worker}</p>
                                  </div>
                                </div>
                              )
                            }
                            {/* Leave Worker */}
                            {
                              data.leave > 0 && (
                                <div className='flex bg-[#071C3B] px-1 rounded-[5px] gap-1 w-[85px] h-[25px]'>
                                  <div className='flex items-end'>
                                    <img src={WorkerLeaveIcon} alt="Worker Leave Icon" className='w-[40px] h-[30px]' />
                                  </div>
                                  <div className='flex justify-center items-center pl-2'>
                                    <p className='text-[14px] text-[#FF0000]'>{data.leave}</p>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Menu */}
          <AnimatePresence>
            {eventOpen && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 right-0 w-[350px] h-[98%] flex flex-col gap-2 m-1 bg-gradient-to-b from-[#124692] to-[#4E6A94] rounded-md shadow-lg p-2 z-10"
              >
                {/* Header */}
                <div className='flex justify-between items-center'>
                  <h1 className='text-[#FFC300] font-bold text-[20px]'>เหตุการณ์</h1>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseEventClick}
                  >
                    <img src={CloseIcon} alt="Close" className="w-[20px] h-[20px]" />
                  </motion.button>
                </div>

                {/* Search */}
                <div>
                  <Accordion
                    expanded={isAccordionEventOpen}
                    onChange={() => setIsAccordionEventOpen(!isAccordionEventOpen)}
                    sx={{
                      "&.MuiAccordion-root" : {
                        "&.Mui-expanded" : {
                          margin: "1px 0px",
                        }
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowUp sx={{ fontSize: "28px", color: "#81898E"}} />}
                      sx={{
                        backgroundColor: "#124692",
                        gap: "10px",
                        border: "1px solid #FFFFFF",
                        ...(
                          isAccordionEventOpen ? 
                          { 
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px"
                          } :
                          {
                            borderRadius: "10px"
                          }
                        ),
                        boxShadow: "none",
                        "&.MuiAccordion-root": {
                          "&.Mui-expanded": {
                            margin: "1px 0px",
                          },
                        },
                      }}
                      id="event-search"
                    >
                      <div className='flex justify-start items-center gap-2'>
                        <Search className='w-[20px] h-[20px]' color='#A3CBF2' />
                        <Typography component="span" style={{ color: "#A3CBF2", fontWeight: 500 }}>
                          Search
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails 
                      sx={{ 
                        padding: 1, 
                        backgroundColor: "#124692",
                        border: "1px solid #FFFFFF",
                        borderTop: "none",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        boxShadow: "none",
                      }}
                    >
                      <div className='flex flex-col gap-2'>
                        <AutoComplete 
                          id="event-type-select"
                          sx={{ marginTop: "5px"}}
                          value={searchEventData.eventTypeId}
                          onChange={handleEventTypeChange}
                          options={eventTypeOptions}
                          label="ประเภทเหตุการณ์"
                          placeholder="กรุณาเลือกประเภทเหตุการณ์"
                          labelFontSize="14px"
                          labelColor='#FFFFFF'
                        />

                        <AutoComplete 
                          id="patrol-select"
                          sx={{ marginTop: "5px"}}
                          value={searchEventData.patrolId}
                          onChange={handlePatrolEventChange}
                          options={patrolOptions}
                          label="สายตรวจ"
                          placeholder="กรุณาสายตรวจ"
                          labelFontSize="14px"
                          labelColor='#FFFFFF'
                        />

                        <TextBox
                          sx={{ marginTop: "10px" }}
                          id="first-name"
                          label={"สถานที่ปฏิบัติงาน"}
                          placeholder={"ระบุสถานที่ปฏิบัติงาน"}
                          value={searchEventData.name}
                          labelFontSize="14px"
                          onChange={(event) =>
                            handleEventTextChange("name", event.target.value)
                          }
                          labelColor='#FFFFFF'
                        />

                        <div className='flex justify-end items-center py-1'>
                          <Button
                            variant="contained"
                            className="search-btn"
                            sx={{ 
                              width: "90px", 
                              height: "40px",
                              fontSize: "16px",
                              borderRadius: "5px"
                            }}
                            size='large'
                            startIcon={<MuiSearchIcon />}
                          >
                            ค้นหา
                          </Button>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
                
                {/* Event List */}
                <div className='flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-new-color'>
                  {
                    eventData.map((data) => {
                      return (
                        <div 
                          className='flex flex-col bg-white shadow-md rounded-[10px]' 
                          key={data.id}
                          onDoubleClick={() => handleRowDoubleClick(data)}
                        >
                          <div className='p-2'>
                            <p className='text-[#133462] text-[16px] font-medium'>{data.eventName}</p>
                          </div>
                          <Divider sx={{ borderColor: "#F2F2F2"}} />
                          <div className='flex flex-col p-2'>
                            <p className='text-[#133462] text-[14px] font-normal'>{data.eventAddress || "ไม่ระบุสถานที่"}</p>
                            <div className='flex justify-between'>
                              <p className='text-[#133462] text-[10px] font-normal'>{data.latitude && data.longitude ? `[${data.latitude},${data.longitude}]` : "ไม่ระบุสถานที่"}</p>
                            </div>
                          </div>
                          <Divider sx={{ borderColor: "#F2F2F2"}} />
                          <div className='grid grid-cols-[auto_160px] pl-5'>
                            <div className='flex gap-3 py-1'>
                              <div className='flex justify-center items-center gap-2'>
                                <img src={EventDate} alt="Event Date Icon" className='w-[20px] h-[20px]' />
                                <p className='text-[#006FFD] text-[10px] font-normal'>{dayjs(data.eventDateTime).format("DD/MM/BB")}</p>
                              </div>
                              <div className='flex justify-center items-center gap-2'>
                                <img src={EventTime} alt="Event Time Icon" className='w-[20px] h-[20px]' />
                                <p className='text-[#006FFD] text-[10px] font-normal'>{dayjs(data.eventDateTime).format("HH:mm")}</p>
                              </div>
                            </div>
                            <div className='flex justify-end items-end w-full'>
                              {
                                (() => {
                                  const eventType = EVENT_TYPES.find((e) => data.eventType === e.id)
                                  return (
                                    eventType ? (
                                      <div className='px-3 py-2 rounded-tl-[10px] rounded-br-[10px] w-[130px] text-center' style={{ backgroundColor: eventType.color }}>
                                        <span className='text-[#FFFFFF] text-[14px] font-semibold'>{ eventType.name }</span>
                                      </div>
                                    ) : (
                                      null
                                    )
                                  )
                                })()
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dialog */}
      <EventDetailPopup 
        open={isEventDetailPopupOpen}
        onClose={() => setIsEventDetailPopupOpen(false)}
        selectData={eventDetailSelected}
      />
    </section>
  );
}
