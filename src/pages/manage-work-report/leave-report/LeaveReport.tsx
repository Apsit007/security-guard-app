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
import { LEAVE_TYPE } from '../../../constants/leaveType';

// Components
import { Icon } from '../../../components/icons/Icon';
import AutoComplete from '../../../components/auto-complete/AutoComplete';
import TextBox from '../../../components/text-box/TextBox';
import DatePickerBuddhist from '../../../components/date-picker-buddhist/DatePickerBuddhist';
import PaginationComponent from '../../../components/pagination/Pagination';

// Icons
import { KeyboardArrowUp } from '@mui/icons-material';
import { Search } from "lucide-react";
import MuiSearchIcon from '@mui/icons-material/Search';
import ExcelIcon from "../../../assets/icons/excel.png";

// Types
import type { LeaveSummaryReport } from '../../../features/types';

// Mocks
import { mockLeaveSummaryReport } from '../../../mocks/mockLeaveSummaryReport';

// Utils
import { formatNumberToFixed } from "../../../utils/commonFunctions";

// Dialogs
import LeaveReportDetail from './leave-report-detail/LeaveReportDetail';

interface FormData {
  startDate: string
  endDate: string
  patrolId: number
  firstName: string
  lastName: string
  positionId: number
  statusId: number
};

type LeaveReportProps = {}

const LeaveReport: React.FC<LeaveReportProps> = ({}) => {

  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isLeaveReportDetailOpen, setIsLeaveReportDetailOpen] = useState(false);

  // Data
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    patrolId: 0,
    firstName: "",
    lastName: "",
    positionId: 0,
    statusId: 0,
  });
  const [leaveSummaryReportData, setLeaveSummaryReport] = useState<LeaveSummaryReport[]>(mockLeaveSummaryReport);
  const [leaveDetailSelect, setLeaveDetailSelect] = useState<LeaveSummaryReport | null>(null);

  // Options
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);
  const [positionOptions, setPositionOptions] = useState<{ label: string ,value: number }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    setPatrolOptions([{label: "ทุกสาย", value: 0}]);
    setPositionOptions([{label: "ทุกตำแหน่ง", value: 0}]);
    setStatusOptions([{label: "ทุกสถานะ", value: 0}]);
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

  const handlePositionChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("positionId", value.value);
    }
    else {
      handleDropdownChange("positionId", '');
    }
  };

  const handleStatusChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("statusId", value.value);
    }
    else {
      handleDropdownChange("statusId", '');
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

  const handleRowDoubleClick = (leaveDetail: LeaveSummaryReport) => {
    setIsLeaveReportDetailOpen(true);
    setLeaveDetailSelect(leaveDetail);
  }

  const exportToCsv = () => {

  }

  const createLeaveTag = (leaveTypeId: number) => {
    const leaveType = LEAVE_TYPE.find((type) => type.id === leaveTypeId);
    if (leaveType) {
      return (
        <div className='flex justify-center items-center px-5'>
          <div 
            className='px-2 py-2 w-full text-center rounded-md text-white text-[12px] font-semibold'
            style={{ 
              backgroundColor: leaveType.color,
              borderRadius: "0 5px 0 5px",
            }}
          >
            {leaveType.name_th}
          </div>
        </div>
      );
    }
  }

  return (
    <section id='leave-report' className='gap-2'>
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
                id="position-select"
                sx={{ marginTop: "10px"}}
                value={formData.positionId}
                onChange={handlePositionChange}
                options={positionOptions}
                label="ตำแหน่ง"
                labelFontSize="14px"
              />

              <AutoComplete 
                id="position-select"
                sx={{ marginTop: "10px"}}
                value={formData.statusId}
                onChange={handleStatusChange}
                options={statusOptions}
                label="สถานะพนักงาน"
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
              
              <div className='flex justify-end items-end py-1'>
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
            disabled={leaveSummaryReportData.length === 0}
          >
            Export
          </Button>

          <p className='text-[#1A2136] text-[16px]'>{`ผลการค้นหา : ${50} รายการ`}</p>
        </div>

        {/* Table */}
        <TableContainer component={Paper} className={`${isAccordionOpen ? "h-[41vh]" : "h-[62vh]"}`}
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
                <TableCell sx={{ minWidth: 260, textAlign: "center" }}>{"ชื่อ-นามสกุล"}</TableCell>
                <TableCell sx={{ minWidth: 120, textAlign: "center" }}>{"สายตรวจ"}</TableCell>
                <TableCell sx={{ minWidth: 140, textAlign: "center" }}>{"ประเภทการลา"}</TableCell>
                <TableCell sx={{ minWidth: 200, textAlign: "center" }}>{"วันเวลาที่ลา"}</TableCell>
                <TableCell sx={{ minWidth: 110, textAlign: "center" }}>{"ชั่วโมงลา"}</TableCell>
                <TableCell sx={{ minWidth: 90, textAlign: "center" }}>{"จำนวนวัน"}</TableCell>
                <TableCell sx={{ minWidth: 90, textAlign: "center" }}>{"ผู้บันทึกข้อมูล"}</TableCell>
                <TableCell sx={{ minWidth: 100, textAlign: "center" }}>{"ผู้อนุมัติ"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveSummaryReportData.map((data, index) => (
                <TableRow 
                  key={data.id} 
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 }, 
                    backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                  }}
                  onDoubleClick={() => handleRowDoubleClick(data)}
                >
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{index + 1}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{`${data.workerId} ${data.firstName} ${data.lastName} (${data.sexId === 1 ? "ช" : "ญ"},${data.age})`}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.patrol}</TableCell>
                  <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462", padding: 0 }}>{
                    createLeaveTag(data.leaveTypeId)
                  }</TableCell>
                  {
                    (() => {
                      let leaveDateTime = "";
                      let leaveHours = "";
                      let leaveDays = "";

                      if (data.leaveId !== 0) {
                        leaveDateTime = `${dayjs(data.leaveDateTimeStart).format("DD/MM/BB HH:mm")} - ${dayjs(data.leaveDateTimeEnd).format("DD/MM/BB HH:mm")}`;
                        leaveHours = formatNumberToFixed(data.leaveHours, 2);
                        leaveDays = "-";
                      }
                      else {
                        leaveDateTime = `${dayjs(data.leaveDateStart).format("DD/MM/BB")} - ${dayjs(data.leaveDateEnd).format("DD/MM/BB")}`;
                        leaveHours = "-";
                        leaveDays = data.leaveDays.toString();
                      }

                      return (
                        <>
                          <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{leaveDateTime}</TableCell>
                          <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{leaveHours}</TableCell>
                          <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{leaveDays}</TableCell>
                        </>
                      )
                    })()
                  }
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.recorder}</TableCell>
                  <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.approver}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <div className={`${leaveSummaryReportData.length > 0 ? "flex" : "hidden"} items-center justify-between pt-3 pl-1`}>
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

      <LeaveReportDetail 
        open={isLeaveReportDetailOpen} 
        onClose={() => setIsLeaveReportDetailOpen(false)}
        leaveDetail={leaveDetailSelect}
      />
    </section>
  )
}

export default LeaveReport;