import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';

// Material UI
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// Constants
import { EVENT_TYPES } from '../../constants/eventTypes';

// Components
import AutoComplete from '../../components/auto-complete/AutoComplete';
import DatePickerBuddhist from '../../components/date-picker-buddhist/DatePickerBuddhist';
import { Icon } from '../../components/icons/Icon';

// Icons
import centerIcon from "../../assets/icons/center.png";
import { Search } from "lucide-react";
import MuiSearchIcon from '@mui/icons-material/Search';

// Types
import type { SummaryEvent } from "../../features/types";

// Mocks
import { mockSummaryEvent } from '../../mocks/mockSummaryEvent';

// Page
import EventDetail from './event-detail/EventDetail';

interface FormData {
  startDate: string
  endDate: string
  eventId: number
};

type EventProps = {}

const Event: React.FC<EventProps> = ({}) => {
  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Data
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    eventId: 0,
  });
  const [summaryEvent, setSummaryEvent] = useState<SummaryEvent>(mockSummaryEvent);
  const [value, setValue] = React.useState(0);

  // Options
  const [eventOptions, setEventOptions] = useState<{ label: string ,value: number }[]>([]);

  useEffect(() => {
    setEventOptions([{label: "ทุกเหตุการณ์", value: 0}])
  }, []);

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("eventId", value.value);
    }
    else {
      handleDropdownChange("eventId", '');
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <section id="event-report" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"รายงานเหตุการณ์"}</Typography>
        <div className="flex gap-2 items-center">
          <img src={centerIcon} alt="Center Icon" className="w-6 h-6" />
          <Typography variant='h5' color={"#133462"} sx={{ fontWeight: 500, fontSize: "18px" }}>{"Center"}</Typography>
        </div>
      </div>

      <div className='grid grid-cols-[20vw_1fr] gap-3 h-full'>
        {/* Column 1 */}
        <div 
          className='flex-1 flex flex-col bg-[#FFFFFF] p-4 gap-3'
          style={{
            boxShadow: "2px 2px 2px rgba(0,0,0,0.2)"
          }}
        >
          <label className='font-bold text-[20px] text-[#124692]'>สรุปเหตุการณ์</label>
        
          {/* Search */}
          <Accordion
            expanded={true}
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
              expandIcon={null}
              sx={{
                backgroundColor: "#FFFFFF",
                gap: "10px",
                border: "1px solid #C5C8CB",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                boxShadow: "-2px 0 2px rgba(0,0,0,0.2)",
                "&.MuiAccordion-root": {
                  "&.Mui-expanded": {
                    margin: "1px 0px",
                  },
                },
                pointerEvents: "none",
              }}
              id="manage-work-report-search"
            >
              <div className='flex justify-start items-center gap-2'>
                <Icon icon={Search} size={20} color="#1A486C" />
                <Typography component="span" style={{ color: "#1A486C", fontWeight: 500 }}>
                  Search
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails 
              sx={{ 
                padding: 1, 
                backgroundColor: "#FFFFFF",
                border: "1px solid #C5C8CB",
                borderTop: "none",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              }}
            >
              <div className='flex flex-col gap-3 p-3'>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col'>
                    <p className='text-[14px] text-[#133462] mb-[13px]'>วันที่เริ่มต้น</p>
                    <DatePickerBuddhist 
                      value={formData.startDate ? dayjs(formData.startDate) : null}
                      onChange={() => {}}  
                      fontSize={"14px"} 
                      height='40px'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <p className='text-[14px] text-[#133462] mb-[13px]'>วันที่สิ้นสุด</p>
                    <DatePickerBuddhist 
                      value={formData.endDate ? dayjs(formData.endDate) : null}
                      onChange={() => {}}  
                      fontSize={"14px"} 
                      height='40px'
                    />
                  </div>
                </div>

                <AutoComplete 
                  id="event-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.eventId}
                  onChange={handleEventChange}
                  options={eventOptions}
                  label="ประเภทเหตุการณ์"
                  placeholder="กรุณาเลือกประเภทเหตุการณ์"
                  labelFontSize="14px"
                />
                <div className='flex justify-end items-center py-1'>
                  <Button
                    variant="contained"
                    className="search-blue-btn"
                    sx={{ 
                      width: "100px", 
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

          {/* Summary */}
          <div className='flex flex-col gap-2'>
            <div 
              className='flex flex-col bg-[#F2F2F2] p-2'
              style={{
                boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
              }}
            >
              <label className='text-[18px] text-[#1A486C] font-bold'>{"เหตุการณ์ทั้งหมด"}</label>
            
              <div className='flex items-center justify-center gap-2 px-2'>
                <div className='flex flex-col justify-center items-center w-full'>
                  <p className='text-[#1A486C] text-[40px] font-bold'>{summaryEvent.totalEvent}</p>
                  <p className='text-[#486D8A] text-[12px] font-medium'>{"จำนวนเหตุการณ์"}</p>
                </div>

                <Divider orientation='vertical' sx={{ borderColor: "#FFC300" }} />

                <div className='flex flex-col justify-center items-center w-full'>
                  <p className='text-[#1A486C] text-[40px] font-bold'>{summaryEvent.totalPatrol}</p>
                  <p className='text-[#486D8A] text-[12px] font-medium'>{"จำนวนสายตรวจที่เกิดเหตุ"}</p>
                </div>
              </div>
            </div>

            <Box 
              sx={{ 
                width: '100%',
                backgroundColor: "#F2F2F2",
                boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              }}
            >
              <Box>
                <Tabs 
                  value={value} 
                  onChange={handleChange}
                  sx={{
                    "& .Mui-selected": {
                      backgroundColor: "#F2F2F2 !important",
                      color: "#1A486C !important",
                      fontWeight: "700 !important"
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "unset !important",
                    },
                  }}
                >
                  <Tab 
                    label="ประเภทเหตุการณ์" 
                    sx={{ 
                      backgroundColor: "#FFFFFF", 
                      color: "#DBDCDE", 
                      fontSize: "18px",
                      width: "50%",
                    }} 
                    id='tab-0' 
                  />
                  <Tab 
                    label="สายตรวจ" 
                    sx={{ 
                      backgroundColor: "#FFFFFF", 
                      color: "#DBDCDE", 
                      fontSize: "18px",
                      width: "50%",
                    }} 
                    id='tab-1' 
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div className='flex flex-col h-[20vh] overflow-y-auto'>
                  {
                    summaryEvent.eventList.sort((a, b) => b.number - a.number).map((data) => {
                      if (data.number === 0) return null;

                      const eventType = EVENT_TYPES.find((e) => data.eventType === e.id)
                      return (
                        <div 
                          key={data.id}
                          className='flex justify-between bg-white border-b-[1px] border-[#C5C8CB] py-1 px-3 text-[16px] text-[#1A2136]'
                        >
                          <p>{eventType?.name ?? "-"}</p>
                          <p>{data.number}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className='flex flex-col h-[20vh] overflow-y-auto'>
                  {
                    summaryEvent.patrolList.sort((a, b) => b.number - a.number).map((data) => {
                      if (data.number === 0) return null;

                      return (
                        <div 
                          key={data.id}
                          className='flex justify-between bg-white border-b-[1px] border-[#C5C8CB] py-1 px-3 text-[16px] text-[#1A2136]'
                        >
                          <p>{data.patrolName}</p>
                          <p>{data.number}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </CustomTabPanel>
            </Box>
          </div>
        </div>

        {/* Column 2 */}
        <div 
          className='flex-1 flex flex-col bg-[#FFFFFF] p-4 gap-3'
          style={{
            boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)"
          }}
        >
          <EventDetail />
        </div>
      </div>
    </section>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default Event;