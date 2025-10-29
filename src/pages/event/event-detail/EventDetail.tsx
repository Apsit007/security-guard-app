import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';

// Material UI
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Constants
import { EVENT_TYPES } from '../../../constants/eventTypes';

// Components
import { Icon } from '../../../components/icons/Icon';
import AutoComplete from '../../../components/auto-complete/AutoComplete';
import TextBox from '../../../components/text-box/TextBox';
import DatePickerBuddhist from '../../../components/date-picker-buddhist/DatePickerBuddhist';
import PaginationComponent from '../../../components/pagination/Pagination';
import EventDetailPopup from '../../../components/event-detail-popup/EventDetailPopup';

// Icons
import { KeyboardArrowUp } from '@mui/icons-material';
import { Search } from "lucide-react";
import MuiSearchIcon from '@mui/icons-material/Search';
import ExcelIcon from "../../../assets/icons/excel.png";

// Types
import type { EventDetailData } from '../../../features/types';

// Mocks
import { mockEventDetail } from '../../../mocks/mockEventDetail';

// Utils
import { formatNumberToFixed } from "../../../utils/commonFunctions";

interface FormData {
  startDate: string
  endDate: string
  patrolId: number
  firstName: string
  lastName: string
  placeId: string
  eventType: number
}

type EventDetailProps = {}

const EventDetail: React.FC<EventDetailProps> = ({}) => {
  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);

  // Data
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    patrolId: 0,
    firstName: "",
    lastName: "",
    placeId: "0",
    eventType: 0,
  });
  const [eventDetailData, setEventDetailData] = useState<EventDetailData[]>(mockEventDetail);
  const [eventDetailSelected, setEventDetailSelected] = useState<EventDetailData | null>(null);

  // Options
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);
  const [placeOptions, setPlaceOptions] = useState<{ label: string ,value: string }[]>([]);
  const [eventTypeOptions, setEventTypeOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    setPatrolOptions([{label: "ทุกสาย", value: 0}]);
    setPlaceOptions([{label: "ทั้งหมด", value: "0"}]);
    const option = EVENT_TYPES.map((type) => ({ label: type.name, value: type.id }));
    setEventTypeOptions([{label: "ทั้งหมด", value: 0}, ...option]);
    setFormData((prev) => ({
      ...prev,
      startDate: dayjs().toISOString(),
      endDate: dayjs().toISOString(),
    }));
  }, [])

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

  const handlePlaceChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("placeId", value.value);
    }
    else {
      handleDropdownChange("placeId", '');
    }
  };

  const handleEventTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("eventType", value.value);
    }
    else {
      handleDropdownChange("eventType", '');
    }
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setPage(value);
  };

  const handlePageInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
  
      setPage(pageInput);
    }
  };

  const handlePageInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');

    if (cleaned) {
      const numberInput = Number(cleaned);
      if (numberInput > 0 && numberInput <= totalPages) {
        setPageInput(numberInput);
      }
    }
    else if (cleaned === "") {
      setPageInput(1);
    }
    return cleaned;
  }

  const exportToCsv = () => {

  };

  const handleRowDoubleClick = (data: EventDetailData) => {
    setIsEventDetailPopupOpen(true);
    setEventDetailSelected(data);
  };

  return (
    <section id='event-detail' className='gap-2'>
      <div className='flex flex-col gap-3'>
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
            id="work-report-search"
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
            <div className='grid grid-cols-4 gap-2 p-3'>
              <AutoComplete 
                id="patrol-select"
                sx={{ marginTop: "10px"}}
                value={formData.patrolId}
                onChange={handlePatrolChange}
                options={patrolOptions}
                label="สายตรวจ"
                labelFontSize="14px"
              />

              <TextBox
                sx={{ marginTop: "10px" }}
                id="first-name"
                label={"ชื่อ"}
                placeholder={"ชื่อผู้ปฏิบัติงาน"}
                value={formData.firstName}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("firstName", event.target.value)
                }
                required={true}
              />

              <TextBox
                sx={{ marginTop: "10px" }}
                id="last-name"
                label={"นามสกุล"}
                placeholder={"นามสกุลผู้ปฏิบัติงาน"}
                value={formData.lastName}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("lastName", event.target.value)
                }
                required={true}
              />

              <AutoComplete 
                id="place-select"
                sx={{ marginTop: "10px"}}
                value={formData.placeId}
                onChange={handlePlaceChange}
                options={placeOptions}
                label="สถานที่ปฏิบัติงาน"
                labelFontSize="14px"
              />

              <AutoComplete 
                id="event-type-select"
                sx={{ marginTop: "10px"}}
                value={formData.eventType}
                onChange={handleEventTypeChange}
                options={eventTypeOptions}
                label="ประเภท"
                labelFontSize="14px"
              />

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
              
              <div className='row-start-3 col-start-4 flex justify-end items-end py-1'>
                <Button
                  variant="contained"
                  className="search-btn"
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

        <div className='flex justify-between items-end'>
          <Button
            variant="outlined"
            className="export-btn"
            sx={{ 
              width: "115px", 
              height: "40px",
              fontSize: "16px",
              borderRadius: "5px",
              textTransform: "capitalize",
              boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              fontWeight: "bold",
            }}
            startIcon={
              <img src={ExcelIcon} alt="Excel Icon" className='w-[25px] h-[25px]' />
            }
            onClick={exportToCsv}
            disabled={eventDetailData.length === 0}
          >
            Export
          </Button>

          <p className='text-[#1A2136] text-[16px]'>{`ผลการค้นหา : ${10} รายการ`}</p>
        </div>

        {/* Table */}
        <TableContainer component={Paper} className={`${isAccordionOpen ? "h-[35vh]" : "h-[64vh]"}`}
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
                <TableCell sx={{ minWidth: 180, textAlign: "center" }}>{"ประเภทเหตุการณ์"}</TableCell>
                <TableCell sx={{ minWidth: 250, textAlign: "center" }}>{"สถานที่ปฏิบัติงาน"}</TableCell>
                <TableCell sx={{ minWidth: 150, textAlign: "center" }}>{"สายตรวจ"}</TableCell>
                <TableCell sx={{ minWidth: 160, textAlign: "center" }}>{"วันที่เหตุการณ์"}</TableCell>
                <TableCell sx={{ minWidth: 150, textAlign: "center" }}>{"วันที่บันทึก"}</TableCell>
                <TableCell sx={{ minWidth: 190, textAlign: "center" }}>{"พิกัดบันทึก"}</TableCell>
                <TableCell sx={{ minWidth: 260, textAlign: "center" }}>{"ผู้บันทึก"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventDetailData.map((data, index) => (
                <TableRow 
                  key={data.id} 
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 }, 
                    backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                  }}
                  onDoubleClick={() => handleRowDoubleClick(data)}
                >
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{index + 1}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{
                    EVENT_TYPES.find((e) => e.id === data.eventType)?.name ?? "-"
                  }</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.place}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.patrol}</TableCell>
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{dayjs(data.eventDateTime).format("DD/MM/BB HH:mm")}</TableCell>
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{dayjs(data.recordDateTime).format("DD/MM/BB HH:mm")}</TableCell>
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.latitude && data.longitude ? `${formatNumberToFixed(data.latitude, 6)},${formatNumberToFixed(data.longitude, 6)}` : "-"}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{`${data.recorder} (${data.recorderPosition})`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <div className={`${eventDetailData.length > 0 ? "flex" : "hidden"} items-center justify-between pt-3 pl-1`}>
          <PaginationComponent 
            page={page} 
            onChange={handlePageChange}
            totalPages={totalPages}
            pageInput={pageInput.toString()}
            handlePageInputKeyDown={handlePageInputKeyDown}
            handlePageInputChange={handlePageInputChange}
            isShowRowPerPage={false}
          />
        </div>
      </div>

      {/* Dialog */}
      <EventDetailPopup 
        open={isEventDetailPopupOpen}
        onClose={() => setIsEventDetailPopupOpen(false)}
        selectData={eventDetailSelected}
      />
    </section>
  )
};

export default EventDetail;