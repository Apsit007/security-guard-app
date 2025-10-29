import React, { useState } from 'react'

// Material UI
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// Icons
import { CircleX } from "lucide-react";
import { Icon } from '../../../components/icons/Icon';
import { KeyboardArrowUp } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Components
import Calendar from '../../../components/calendar/Calendar';

// Types
import type {
  ScheduleWorker,
  DayInfo
} from "../../../features/types";

// Mocks
import { mockMorningShift, mockNightShift } from '../../../mocks/mockShiftWorker';


type CopyWorkerProps = {
  open: boolean
  onClose: () => void
  workSchedule?: DayInfo[];
}

const CopyWorker: React.FC<CopyWorkerProps> = ({ open, onClose, workSchedule }) => {

  // State
  const [isMorningShiftAccordionOpen, setIsMorningShiftAccordionOpen] = useState(false);
  const [isNightShiftAccordionOpen, setIsNightShiftAccordionOpen] = useState(false);

  // Data
  const [workerMorningShift, setWorkerMorningShift] = useState<ScheduleWorker[]>(mockMorningShift);
  const [workerNightShift, setWorkerNightShift] = useState<ScheduleWorker[]>(mockNightShift);
  const [dayInfoSelect, setDayInfoSelect] = useState<DayInfo | undefined>(undefined);
  const [selectedMorning, setSelectedMorning] = useState<Set<number>>(new Set())
  const [selectedNight, setSelectedNight] = useState<Set<number>>(new Set())

  const onInfoSelect = (dayInfo: DayInfo | undefined) => {
    if (dayInfo) setDayInfoSelect(dayInfo);
  };

  const handleSelectAll = (shift: 'morning' | 'night', checked: boolean) => {
    if (shift === 'morning') {
      if (checked) {
        const allIds = new Set((dayInfoSelect?.morningWorker ?? []).map((w) => w.id))
        setSelectedMorning(allIds)
      } else {
        setSelectedMorning(new Set())
      }
    } else {
      if (checked) {
        const allIds = new Set((dayInfoSelect?.nightWorker ?? []).map((w) => w.id))
        setSelectedNight(allIds)
      } else {
        setSelectedNight(new Set())
      }
    }
  }

  const handleSelectOne = (shift: 'morning' | 'night', id: number, checked: boolean) => {
    if (shift === 'morning') {
      setSelectedMorning((prev) => {
        const newSet = new Set(prev)
        checked ? newSet.add(id) : newSet.delete(id)
        return newSet
      })
    } else {
      setSelectedNight((prev) => {
        const newSet = new Set(prev)
        checked ? newSet.add(id) : newSet.delete(id)
        return newSet
      })
    }
  }

  const renderWorkerTable = (
    title: string,
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
    workers: ScheduleWorker[] | undefined,
    selectedSet: Set<number>,
    onSelectAll: (checked: boolean) => void,
    onSelectOne: (id: number, checked: boolean) => void
  ) => {
    const allSelected = workers && workers.length > 0 && selectedSet.size === workers.length

    return (
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          '&.MuiAccordion-root': {
            '&.Mui-expanded': { margin: '1px 0px' }
          },
          borderRadius: '50px'
        }}
      >
        <AccordionSummary
          expandIcon={<KeyboardArrowUp sx={{ fontSize: '28px', color: '#81898E' }} />}
          sx={{
            backgroundColor: '#A3CBF2',
            gap: '10px',
            ...(expanded
              ? {
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  boxShadow: '-2px 0 2px rgba(0,0,0,0.2)'
                }
              : {
                  borderRadius: '12px',
                  boxShadow: '-2px 2px 2px rgba(0,0,0,0.2)'
                })
          }}
        >
          <Typography style={{ color: '#133462', fontWeight: 500 }}>{title}</Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: 1,
            backgroundColor: '#FFFFFF',
            borderTop: 'none',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            boxShadow: '-2px 2px 2px rgba(0,0,0,0.2)'
          }}
        >
          <div className='flex flex-col gap-3 px-2'>
            <TableContainer
              component={Paper}
              className={workers && workers.length > 0 ? 'h-[25vh]' : 'h-[12vh]'}
              sx={{ backgroundColor: '#F2F2F2', borderRadius: 0 }}
            >
              <Table stickyHeader>
                <TableHead
                  sx={{
                    '& .MuiTableCell-head': {
                      color: 'white',
                      backgroundColor: '#133462'
                    }
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ width: '2%', textAlign: 'center' }}>
                      <Checkbox
                        checked={allSelected}
                        onChange={(e) => onSelectAll(e.target.checked)}
                        sx={{
                          color: '#FFFFFF',
                          padding: 0,
                          '&.Mui-checked': { color: '#FFFFFF' }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '3%', textAlign: 'center' }}>ลำดับ</TableCell>
                    <TableCell sx={{ width: '40%', textAlign: 'center' }}>ชื่อ - นามสกุล</TableCell>
                    <TableCell sx={{ width: '20%', textAlign: 'center' }}>เวลาทำงาน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workers && workers.length > 0 ? (
                    workers.map((data, index) => (
                      <TableRow
                        key={data.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#DBDCDE' : '#F2F2F2'
                        }}
                      >
                        <TableCell sx={{ textAlign: 'center', borderBottom: '1px solid #FFFFFF' }}>
                          <Checkbox
                            checked={selectedSet.has(data.id)}
                            onChange={(e) => onSelectOne(data.id, e.target.checked)}
                            sx={{
                              color: '#133462',
                              padding: 0,
                              '&.Mui-checked': { color: '#133462' }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderBottom: '1px solid #FFFFFF', color: '#133462' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #FFFFFF', color: '#133462' }}>
                          {`${data.prefix}${data.firstName} ${data.lastName}`}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderBottom: '1px solid #FFFFFF', color: '#133462' }}>
                          {`${data.startTime} - ${data.endTime}`}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: '#F2F2F2'
                      }}
                    >
                      <TableCell colSpan={6} sx={{ color: '#133462', fontSize: '14px', fontWeight: 500 }}>
                        No Data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Dialog 
      id='copy-worker' 
      open={open} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "900px",
          },
        }
      }}
    >
      <DialogTitle className='bg-[#F3F3FA]'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#1A2136"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"คัดลอกรายชื่อ"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#F3F3FA] h-full'>
        <div className='grid grid-cols-2'>
          {/* Calendar */}
          <div className='flex flex-col gap-2 p-3 bg-[#0D3063] rounded-tl-[5px] rounded-bl-[5px]'>
            <label className='text-[24px] text-white font-semibold'>{"โกดังเก็บสินค้า บ.ทวีการช่าง"}</label>
            <Divider sx={{ border: "2px solid #FFFFFF" }} />
            <div className='w-full h-full'>
              <Calendar 
                divHeight='70vh' 
                minHeight='550px' 
                isShowLegend={false} 
                bgColor="#0D3063"
                weekDayLabelColor="#0D3063"
                weekDayLabelBgColor="#A3CBF2"
                pickersDayBgColor='#FFFFFF'
                isNoDataDisable={true}
                workSchedule={workSchedule}
                onInfoSelect={onInfoSelect}
              />
            </div>
          </div>

          {/* Worker */}
          <div className='flex flex-col gap-3 p-3 bg-[#FFFFFF] rounded-tr-[5px] rounded-br-[5px]'>
            <label className='text-[24px] text-[#124692] font-semibold'>{"1 กรกฎาคม 2568"}</label>

            {/* Morning Shift */}
            {renderWorkerTable(
              'ตารางงานกะเช้า',
              isMorningShiftAccordionOpen,
              setIsMorningShiftAccordionOpen,
              dayInfoSelect?.morningWorker,
              selectedMorning,
              (checked) => handleSelectAll('morning', checked),
              (id, checked) => handleSelectOne('morning', id, checked)
            )}

            {/* Night Shift */}
            {renderWorkerTable(
              'ตารางงานกะดึก',
              isNightShiftAccordionOpen,
              setIsNightShiftAccordionOpen,
              dayInfoSelect?.nightWorker,
              selectedNight,
              (checked) => handleSelectAll('night', checked),
              (id, checked) => handleSelectOne('night', id, checked)
            )}

            <div className='flex justify-end h-full gap-2 mt-2'>
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
              >
                ยกเลิก
              </Button>
  
              <Button
                variant="contained"
                className="save-btn"
                sx={{ 
                  width: "90px", 
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "5px"
                }}
                size='large'
                startIcon={<CheckCircleOutlineIcon />}
              >
                เลือก
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CopyWorker;