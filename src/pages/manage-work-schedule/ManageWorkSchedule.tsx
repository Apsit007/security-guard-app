import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';

// Material UI
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';

// Components
import { Icon } from '../../components/icons/Icon';
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import Calendar from '../../components/calendar/Calendar';
import DatePickerBuddhist from '../../components/date-picker-buddhist/DatePickerBuddhist';
import CopyIcon from "../../assets/icons/copy-right.png";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Icons
import centerIcon from "../../assets/icons/center.png";
import { KeyboardArrowUp } from '@mui/icons-material';
import MuiSearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from "../../assets/icons/save.png";
import ClearIcon from '@mui/icons-material/Clear';
import RejectedDetailIcon from "../../assets/icons/reject-detail.png";
import { Search, Trash2 } from "lucide-react";

// Types
import type {
  Workplace,
  ScheduleWorker,
  DayInfo,
} from "../../features/types";

// Mocks
import { mockWorkplaces } from '../../mocks/mockWorkplace';
import { mockMorningShift, mockNightShift } from '../../mocks/mockShiftWorker';

// Utils
import { formatNumberToFixed } from '../../utils/commonFunctions';

// Dialogs
import AddWorker from './add-worker/AddWorker';
import CopyWorker from './copy-worker/CopyWorker';

interface FormData {
  workplaceName: string
  patrolId: number
};

type ManageWorkScheduleProps = {}

const ManageWorkSchedule: React.FC<ManageWorkScheduleProps> = ({}) => {

  // Types
  type ValuePiece = Date | string | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isMorningShiftAccordionOpen, setIsMorningShiftAccordionOpen] = useState(false);
  const [isNightShiftAccordionOpen, setIsNightShiftAccordionOpen] = useState(false);
  const [isAddWorkerDialogOpen, setIsAddWorkerDialogOpen] = useState(false);
  const [isCopyWorkerDialogOpen, setIsCopyWorkerDialogOpen] = useState(false);
  const [isRejectDetailOpen, setIsRejectDetailOpen] = useState(false);

  // Data
  const [formData, setFormData] = useState<FormData>({
    workplaceName: "",
    patrolId: 0,
  });
  const [workplaceData, setWorkplace] = useState<Workplace[]>(mockWorkplaces);
  const [morningShiftValue, onMorningShiftChange] = useState<Value>(['10:00', '11:00']);
  const [nightShiftValue, onNightShiftChange] = useState<Value>(['17:00', '21:00']);
  const [workerMorningShift, setWorkerMorningShift] = useState<ScheduleWorker[]>(mockMorningShift);
  const [workerNightShift, setWorkerNightShift] = useState<ScheduleWorker[]>(mockNightShift);
  const [placeSelect, setPlaceSelect] = useState<Workplace | null>(null);
  const [daySelect, setDaySelect] = useState<Dayjs | null>(null);
  const [dayInfoSelect, setDayInfoSelect] = useState<DayInfo | undefined>(undefined);

  // Options
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);
  
  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePatrolChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("patrolId", value.value);
    }
    else {
      handleDropdownChange("patrolId", '');
    }
  };

  const handleDeleteClick = (id: number) => {
    alert(`Delete Click ${id}`)
  }

  const handleDeleteAllClick = (type: 'morning' | 'night') => {
    alert(`Delete All ${type} Click`)
  }

  const handleNoteMorningShiftChange = (id: number, value: string) => {
    setWorkerMorningShift((prev) =>
      prev.map(worker =>
        worker.id === id
          ? {
              ...worker,
              note: value,
            }
          : worker
      )
    );
  }

  const handleNoteNightShiftChange = (id: number, newNote: string) => {
    setWorkerMorningShift(prev =>
      prev.map(worker =>
        worker.id === id ? { ...worker, note: newNote } : worker
      )
    );
  }

  const handleWorkerMorningShiftTimeChange = (id: number, newValue: Value | null) => {
    if (!newValue || !Array.isArray(newValue)) return;

    const [start, end] = newValue;

    setWorkerMorningShift(prev =>
      prev.map(worker =>
        worker.id === id
          ? {
              ...worker,
              startTime: typeof start === "string" ? start : "",
              endTime: typeof end === "string" ? end : "",
            }
          : worker
      )
    );
  };

  const handleWorkerNightShiftTimeChange = (id: number, newValue: Value | null) => {
    if (!newValue || !Array.isArray(newValue)) return;

    const [start, end] = newValue;

    setWorkerNightShift(prev =>
      prev.map(worker =>
        worker.id === id
          ? {
              ...worker,
              startTime: typeof start === "string" ? start : "",
              endTime: typeof end === "string" ? end : "",
            }
          : worker
      )
    );
  };

  const handlePlaceSelect = (workplace: Workplace) => {
    setPlaceSelect((prev) => {
      if (prev?.id === workplace.id) {
        return null;
      }
      return workplace;
    });
  }

  const onDateSelect = (newValue: Dayjs | null, dayInfo: DayInfo | undefined) => {
    if (newValue) setDaySelect(dayjs(newValue));
    if (dayInfo) setDayInfoSelect(dayInfo);
  };

  const handleClearDaySelect = () => {
    setDaySelect(null);
  }

  const createStatusDiv = (dayInfo: DayInfo | undefined) => {
    let bgColor = "#4CB64C";
    let text = "อนุมัติ";

    if (dayInfo?.rejected) {
      bgColor = "#C23718";
      text = "ไม่อนุมัติ";
    }
    else if (dayInfo?.waitApprove) {
      bgColor = "#FFC300";
      text = "รออนุมัติ";
    }
    else {
      bgColor = "#4CB64C";
      text = "อนุมัติ";
    }

    return (
      <div 
        className='flex items-center justify-center text-[14px] rounded-[10px] w-[85px] h-[30px]'
        style={{
          backgroundColor: bgColor,
          color: "#FFFFFF",
        }}
      >
        {text}
      </div>
    )
  }

  return (
    <section id="manage-work-schedule" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"จัดตารางการทำงาน"}</Typography>
        <div className="flex gap-2 items-center">
          <img src={centerIcon} alt="Center Icon" className="w-6 h-6" />
          <Typography variant='h5' color={"#133462"} sx={{ fontWeight: 500, fontSize: "18px" }}>{"Center"}</Typography>
        </div>
      </div>

      <div
        className="flex-1 flex gap-3 h-full pb-4 relative overflow-x-hidden"
      >
        {/* Column 1 */}
        <div 
          className='flex-1 flex flex-col h-full bg-white p-4 gap-3 max-w-[20vw]'
          style={{
            boxShadow: "2px 2px 2px rgba(0,0,0,0.2)",
          }}
        >
          <label className='font-bold text-[20px] text-[#124692]'>สถานที่ปฏิบัติงาน</label>
        
          {/* Search */}
          <Accordion
            expanded={isAccordionOpen}
            onChange={() => setIsAccordionOpen(!isAccordionOpen)}
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
              expandIcon={<KeyboardArrowUp sx={{ fontSize: "28px", color: "#1A486C"}} />}
              sx={{
                backgroundColor: "#FFFFFF",
                gap: "10px",
                border: "1px solid #C5C8CB",
                ...(
                  isAccordionOpen ? 
                  { 
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    boxShadow: "-2px 0 2px rgba(0,0,0,0.2)",
                  } :
                  {
                    borderRadius: "10px",
                    boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
                  }
                ),
                "&.MuiAccordion-root": {
                  "&.Mui-expanded": {
                    margin: "1px 0px",
                  },
                },
              }}
              id="manage-worker-search"
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
                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="workplace-name"
                  label={"ชื่อสถานที่ปฏิบัติงาน"}
                  placeholder={"สถานทีปฏิบัติงาน"}
                  value={formData.workplaceName}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("workplaceName", event.target.value)
                  }
                />

                <AutoComplete 
                  id="patrol-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.patrolId}
                  onChange={handlePatrolChange}
                  options={patrolOptions}
                  label="สายตรวจ"
                  placeholder="กรุณาเลือกสายตรวจ"
                  labelFontSize="14px"
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

          <div className='flex justify-end items-end w-full'>
            <p className='text-[#133462] text-[16px] font-medium'>{`ผลการค้นหา : ${50} รายการ`}</p>
          </div>

          <div className={`flex flex-col ${isAccordionOpen ? "h-[50.6vh]" : "h-[80.3vh]"} overflow-y-auto`}>
            {
              workplaceData.map((data, index) => {
                return (
                  <div
                    className='flex flex-col p-2 gap-2 text-[#133462] border-[1px] border-b-[#4A4A4A] cursor-pointer'
                    key={index}
                    style={{
                      backgroundColor: placeSelect?.id === data.id ? "rgba(163, 203, 242, 0.39)" : index % 2 === 0 ? "#DBDCDE": "#F2F2F2",
                    }}
                    onClick={() => handlePlaceSelect(data)}
                  >
                    <label className='text-[16px] font-medium'>{data.name}</label>
                    <Divider sx={{ borderColor: index % 2 === 0 ? "#F2F2F2" : "#DBDCDE" }} />
                    <p className='text-[14px]'>{data.address}</p>
                    <p className='text-[14px]'>{`${data.latitude}, ${data.longitude}`}</p>
                    <p className='text-[14px]'>{`วันที่สัญญา : ${dayjs(data.contractStartDate).format("DD/MM/BBBB")} - ${dayjs(data.contractEndDate).format("DD/MM/BBBB")}`}</p>
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* Column 2 */}
        <div 
          className={`flex-1 flex flex-col h-full bg-white p-4 ${ daySelect && placeSelect ? "mr-[810px]" : ""} transition-all duration-500 ease-in-out`}
          style={{
            boxShadow: "-2px 2px 2px rgba(0,0,0,0.3)",
          }}
        >
          <div className='flex flex-col border-[1px] border-[#124692] rounded-[5px]'>
            <div className='py-[14px] px-5'>
              <label className='text-[24px] font-semibold text-[#124692]'>{ placeSelect?.name || "ชื่อสถานที่ปฏิบัติงาน"}</label>
            </div>
            <Divider sx={{ borderColor: "#124692" }} />
            <div className='grid grid-cols-[20%_1fr] py-[14px] px-5 gap-3 text-[#133462] text-[16px]'>
              <p>สาย :</p>
              <p>{ placeSelect?.patrolName || "-" }</p>
              <p>ที่ตั้ง :</p>
              <p>{ placeSelect?.address || "-" }</p>
              <p>ตำแหน่ง :</p>
              <p>{ (placeSelect?.latitude || placeSelect?.longitude) ? `${placeSelect?.latitude},${placeSelect?.longitude}` : "-" }</p>
              <p>รายละเอียด :</p>
              <p>{ placeSelect?.detail || "-" }</p>
            </div>
          </div>

          <div className='relative w-full h-full'>
            <Calendar 
              divHeight='71vh' 
              minHeight='550px'
              workSchedule={placeSelect?.workSchedule}
              onDateSelect={onDateSelect}
            />
            <p className='absolute text-[20px] font-semibold text-[#0D3063] top-2 left-0'>ปฏิทินทำงาน</p>
          </div>
        </div>

        {/* Column 3 */}
        <div 
          className={`flex flex-col absolute top-0 right-0 h-[98.3%] bg-white p-4 gap-3 shadow-lg overflow-y-auto transition-all duration-500 ease-in-out ${
            daySelect && placeSelect ? "translate-x-0 opacity-100 w-[800px]" : "translate-x-full opacity-0 w-0"
          }`}
          style={{
            boxShadow: "2px 2px 2px rgba(0,0,0,0.2)",
          }}
        >
          <label className='font-bold text-[20px] text-[#124692]'>จัดการตารางงาน</label>

          <div className='grid grid-cols-[45%_200px_auto] gap-2'>
            <div className='flex flex-col'>
              <p className='text-[14px] text-[#133462] mb-[13px]'>วันทำงาน</p>
              <DatePickerBuddhist 
                value={daySelect}
                onChange={(value) => setDaySelect(value ? dayjs(value) : null)}  
                fontSize={"14px"} 
                maxDate={dayjs()}
                height='40px'
              />
            </div>

            <div className='flex items-end'>
              <Button
                variant="outlined"
                className="copy-btn"
                sx={{ 
                  width: "170px", 
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  fontWeight: 700,
                }}
                size='large'
                startIcon={
                  <img src={CopyIcon} alt="Copy Icon" className='flex justify-center items-center w-[20px] h-[20px]' />
                }
                onClick={() => setIsCopyWorkerDialogOpen(true)}
              >
                คัดลอกรายชื่อ
              </Button>
            </div>

            <div className='flex justify-start items-end w-full h-full'>
              <div className='flex justify-start items-end gap-2 mb-2 h-[30px] relative'>
                <div className='flex justify-center items-center gap-2'>
                  <span className='text-[14px] text-[#133462] font-semibold'>สถานะพิจารณา : </span>
                  {
                    createStatusDiv(dayInfoSelect)
                  }
                </div>
                {
                  dayInfoSelect?.rejected && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        left: "-30px",
                        top: "-2px",
                      }}
                      onClick={() => setIsRejectDetailOpen(true)}
                    >
                      <img src={RejectedDetailIcon} alt="Reject Detail Icon" className='w-[20px] h-[20px]'/>
                    </IconButton>
                  )
                }
                {
                  isRejectDetailOpen && (
                    <div className='flex flex-col bg-[#FFFFFF] rounded-[5px] border-[1px] border-[#133462] absolute top-[-80px] left-[-160px] w-[300px] z-[25]'>
                      <div className='flex justify-between items-center px-3 py-1'>
                        <label className='text-[20px] text-[#133462] font-bold'>เหตุผลในการไม่อนุมัติ</label>
                        <IconButton
                          onClick={() => setIsRejectDetailOpen(false)}
                        >
                          <ClearIcon sx={{ color: "#636B70" }} />
                        </IconButton>
                      </div>
                      <Divider sx={{ borderColor: "#133462" }} />
                      <div className='flex flex-col px-3 py-2 h-[120px]'>
                        <p className='text-[16px] text-[#133462]'>{dayInfoSelect?.rejectedDetail || "-"}</p>
                        <div className='flex w-full h-full justify-center items-end'>
                          <Button
                            variant="contained"
                            className="search-btn"
                            sx={{ 
                              width: "90px", 
                              height: "35px",
                              fontSize: "16px",
                              borderRadius: "5px"
                            }}
                            onClick={() => setIsRejectDetailOpen(false)}
                          >
                            ปิด
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>

            <p className='text-[14px] text-[#133462] font-semibold'>{`ผู้บันทึก : `}<span className='font-medium'>{"นายปกป้อง เก่งกล้าหาญ"}</span></p>
            <p className='text-[14px] text-[#133462] font-semibold'>{`ตำแหน่ง : `}<span className='font-medium'>{"Admin"}</span></p>
            <p className='text-[14px] text-[#133462] font-semibold'>{`วันที่บันทึกล่าสุด : `}<span className='font-medium'>{"17/08/68"}</span></p>
            
            <p className='text-[14px] text-[#133462] font-semibold'>{`ผู้อนุมัติ : `}<span className='font-medium'>{"นายสมศักดิ์ เจริญกรุง"}</span></p>
            <p className='text-[14px] text-[#133462] font-semibold'>{`ตำแหน่ง : `}<span className='font-medium'>{"สายตรวจ"}</span></p>
            <p className='text-[14px] text-[#133462] font-semibold'>{`วันที่อนุมัติล่าสุด : `}<span className='font-medium'>{"13/08/68"}</span></p>
          </div>

          {/* Morning Shift */}
          <Accordion
            expanded={isMorningShiftAccordionOpen}
            onChange={() => setIsMorningShiftAccordionOpen(!isMorningShiftAccordionOpen)}
            sx={{
              "&.MuiAccordion-root" : {
                "&.Mui-expanded" : {
                  margin: "1px 0px",
                }
              },
              borderRadius: "50px",
            }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowUp sx={{ fontSize: "28px", color: "#81898E"}} />}
              sx={{
                backgroundColor: "#A3CBF2",
                gap: "10px",
                ...(
                  isMorningShiftAccordionOpen ? 
                  { 
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    boxShadow: "-2px 0 2px rgba(0,0,0,0.2)",
                  } :
                  {
                    borderRadius: "12px",
                    boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
                  }
                ),
                "&.MuiAccordion-root": {
                  "&.Mui-expanded": {
                    margin: "1px 0px",
                  },
                },
              }}
              id="morning-shift"
            >
              <Typography style={{ color: "#133462", fontWeight: 500 }}>
                ตารางงานกะเช้า
              </Typography>
            </AccordionSummary>
            <AccordionDetails 
              sx={{ 
                padding: 1, 
                backgroundColor: "#FFFFFF",
                borderTop: "none",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              }}
            >
              <div className='flex flex-col gap-3 px-2'>
                <div className='flex justify-between items-end'>
                  <Button
                    variant="contained"
                    className="main-btn"
                    sx={{ 
                      width: "150px", 
                      height: "40px",
                      fontSize: "16px",
                      borderRadius: "5px"
                    }}
                    size='large'
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddWorkerDialogOpen(true)}
                  >
                    ผู้ปฏิบัติงาน
                  </Button>
                  <div className='flex flex-col gap-2'>
                    <p className='text-[14px] text-[#133462]'>เวลางานกะเช้า</p>

                    <TimeRangePicker 
                      onChange={onMorningShiftChange} 
                      value={morningShiftValue}
                      format="HH:mm"
                      clockIcon={
                        <CalendarTodayIcon fontSize='small' sx={{ color: "#81898E" }} />
                      }
                      className="time-range-picker"
                    />
                  </div>
                </div>
                
                {/* Table */}
                <TableContainer component={Paper} className={ dayInfoSelect?.morningWorker && dayInfoSelect?.morningWorker?.length > 0 ? "h-[25vh]" : "h-[12vh]"}
                  sx={{
                    backgroundColor: "#F2F2F2",
                    borderRadius: 0,
                  }}
                >
                  <Table stickyHeader>
                    <TableHead 
                      sx={{
                        "& .MuiTableCell-head": {
                          color: "white",
                          backgroundColor: "#133462",
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}>{"ลำดับ"}</TableCell>
                        <TableCell sx={{ width: "30%", textAlign: "center" }}>{"ชื่อ - นามสกุล"}</TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>{"เวลางาน"}</TableCell>
                        <TableCell sx={{ width: "14%", textAlign: "center" }}>{"ชั่วโมง/วัน"}</TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>{"หมายเหตุ"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{
                          <IconButton
                            onClick={() => handleDeleteAllClick("morning")}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Trash2} size={20} color="#FFFFFF" />
                          </IconButton>  
                        }</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        dayInfoSelect?.morningWorker && dayInfoSelect?.morningWorker?.length > 0 ? (
                          dayInfoSelect?.morningWorker.map((data, index) => (
                            <TableRow 
                              key={data.id} 
                              sx={{
                                backgroundColor: dayInfoSelect?.rejected ? "#F7A8A8" : index % 2 === 0 ? "#DBDCDE": "#F2F2F2",
                                height: "30px !important",
                                p: 0,
                              }}
                            >
                              <TableCell sx={{ textAlign: "center", borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{index + 1}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{`${data.prefix}${data.firstName} ${data.lastName}`}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid #FFFFFF" }}>
                                {
                                  <div className='flex justify-center items-center'>
                                    <TimeRangePicker 
                                      onChange={(newValue: Value | null) => handleWorkerMorningShiftTimeChange(data.id, newValue)}
                                      value={[data.startTime, data.endTime]}
                                      format="HH:mm"
                                      className="time-range-row-picker"
                                      clearIcon={null}
                                      disableClock={true}
                                    />
                                  </div>
                                }
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{formatNumberToFixed(data.totalHours, 2)}</TableCell>
                              <TableCell sx={{ textAlign: "center", p:0, borderBottom: "1px solid #FFFFFF" }}>
                                {
                                  <TextBox
                                    id="note"
                                    label={""}
                                    placeholder={""}
                                    value={data.note}
                                    labelFontSize="14px"
                                    onChange={(event) => handleNoteMorningShiftChange(data.id, event.target.value)}
                                  />
                                }
                              </TableCell>
                              <TableCell sx={{ width: "6%", textAlign: "center", borderBottom: "1px solid #FFFFFF" }}>
                                <IconButton
                                  onClick={() => handleDeleteClick(data.id)}
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <Icon icon={Trash2} size={20} color="#72767B" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow
                            sx={{ 
                              "&:last-child td, &:last-child th": { border: 0 }, 
                              backgroundColor: "#F2F2F2",
                            }}
                          >
                            <TableCell colSpan={6} sx={{ color: "#133462", fontSize: "14px", fontWeight: 500 }} >{"No Data"}</TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Night Shift */}
          <Accordion
            expanded={isNightShiftAccordionOpen}
            onChange={() => setIsNightShiftAccordionOpen(!isNightShiftAccordionOpen)}
            sx={{
              "&.MuiAccordion-root" : {
                "&.Mui-expanded" : {
                  margin: "1px 0px",
                }
              },
              borderRadius: "50px",
            }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowUp sx={{ fontSize: "28px", color: "#81898E"}} />}
              sx={{
                backgroundColor: "#A3CBF2",
                gap: "10px",
                ...(
                  isNightShiftAccordionOpen ? 
                  { 
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    boxShadow: "-2px 0 2px rgba(0,0,0,0.2)",
                  } :
                  {
                    borderRadius: "12px",
                    boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
                  }
                ),
                "&.MuiAccordion-root": {
                  "&.Mui-expanded": {
                    margin: "1px 0px",
                  },
                },
              }}
              id="night-shift"
            >
              <Typography style={{ color: "#133462", fontWeight: 500 }}>
                ตารางงานกะดึก
              </Typography>
            </AccordionSummary>
            <AccordionDetails 
              sx={{ 
                padding: 1, 
                backgroundColor: "#FFFFFF",
                borderTop: "none",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              }}
            >
              <div className='flex flex-col gap-3 px-2'>
                <div className='flex justify-between items-end'>
                  <Button
                    variant="contained"
                    className="main-btn"
                    sx={{ 
                      width: "150px", 
                      height: "40px",
                      fontSize: "16px",
                      borderRadius: "5px"
                    }}
                    size='large'
                    startIcon={<AddIcon />}
                  >
                    ผู้ปฏิบัติงาน
                  </Button>
                  <div className='flex flex-col gap-2'>
                    <p className='text-[14px] text-[#133462]'>เวลางานกะดึก</p>

                    <TimeRangePicker 
                      onChange={onNightShiftChange} 
                      value={nightShiftValue}
                      format="HH:mm"
                      clockIcon={
                        <CalendarTodayIcon fontSize='small' sx={{ color: "#81898E" }} />
                      }
                      className="time-range-picker"
                    />
                  </div>
                </div>
                
                {/* Table */}
                <TableContainer component={Paper} className={ workerNightShift.length > 0 ? "h-[25vh]" : "h-[12vh]"}
                  sx={{
                    backgroundColor: "#F2F2F2",
                    borderRadius: 0,
                  }}
                >
                  <Table stickyHeader>
                    <TableHead 
                      sx={{
                        "& .MuiTableCell-head": {
                          color: "white",
                          backgroundColor: "#133462",
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}>{"ลำดับ"}</TableCell>
                        <TableCell sx={{ width: "30%", textAlign: "center" }}>{"ชื่อ - นามสกุล"}</TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>{"เวลางาน"}</TableCell>
                        <TableCell sx={{ width: "14%", textAlign: "center" }}>{"ชั่วโมง/วัน"}</TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>{"หมายเหตุ"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{
                          <IconButton
                            onClick={() => handleDeleteAllClick("night")}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Trash2} size={20} color="#FFFFFF" />
                          </IconButton>  
                        }</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        workerNightShift.length > 0 ? (
                          workerNightShift.map((data, index) => (
                            <TableRow 
                              key={data.id} 
                              sx={{ 
                                backgroundColor: dayInfoSelect?.rejected ? "#F7A8A8" : index % 2 === 0 ? "#DBDCDE": "#F2F2F2",
                                height: "30px !important",
                                p: 0,
                              }}
                            >
                              <TableCell sx={{ textAlign: "center", borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{index + 1}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{`${data.prefix}${data.firstName} ${data.lastName}`}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid #FFFFFF" }}>
                                {
                                  <div className='flex justify-center items-center'>
                                    <TimeRangePicker 
                                      onChange={(newValue: Value | null) => handleWorkerNightShiftTimeChange(data.id, newValue)}
                                      value={[data.startTime, data.endTime]}
                                      format="HH:mm"
                                      className="time-range-row-picker"
                                      clearIcon={null}
                                      disableClock={true}
                                    />
                                  </div>
                                }
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "1px solid #FFFFFF", color: "#133462" }}>{formatNumberToFixed(data.totalHours, 2)}</TableCell>
                              <TableCell sx={{ textAlign: "center", p:0, borderBottom: "1px solid #FFFFFF" }}>
                                {
                                  <TextBox
                                    id="note"
                                    label={""}
                                    placeholder={""}
                                    value={data.note}
                                    labelFontSize="14px"
                                    onChange={(event) => handleNoteNightShiftChange(data.id, event.target.value)}
                                  />
                                }
                              </TableCell>
                              <TableCell sx={{ width: "6%", textAlign: "center", borderBottom: "1px solid #FFFFFF" }}>
                                <IconButton
                                  onClick={() => handleDeleteClick(data.id)}
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <Icon icon={Trash2} size={20} color="#72767B" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow
                            sx={{ 
                              "&:last-child td, &:last-child th": { border: 0 }, 
                              backgroundColor: "#F2F2F2",
                            }}
                          >
                            <TableCell colSpan={6} sx={{ color: "#133462", fontSize: "14px", fontWeight: 500 }} >{"No Data"}</TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </AccordionDetails>
          </Accordion>

          <div className='flex justify-end h-full gap-3'>
            <Button
              variant="contained"
              className="save-btn"
              sx={{ 
                width: "110px", 
                height: "40px",
                fontSize: "16px",
                borderRadius: "5px"
              }}
              size='large'
              startIcon={
                <img src={SaveIcon} alt="Save Icon" className='flex justify-center items-center w-[20px] h-[20px]' />
              }
            >
              บันทึก
            </Button>

            <Button
              variant="outlined"
              className="cancel-btn"
              sx={{ 
                width: "90px", 
                height: "40px",
                fontSize: "16px",
                borderRadius: "5px"
              }}
              size='large'
              startIcon={<ClearIcon />}
              onClick={handleClearDaySelect}
            >
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddWorker open={isAddWorkerDialogOpen} onClose={() => setIsAddWorkerDialogOpen(false)} />
      <CopyWorker open={isCopyWorkerDialogOpen} onClose={() => setIsCopyWorkerDialogOpen(false)} workSchedule={placeSelect?.workSchedule} />
    </section>
  )
}

export default ManageWorkSchedule;