import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Papa from "papaparse";

// Material UI
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
import type { 
  SelectChangeEvent,
} from '@mui/material';

// Icons
import { CircleX, Search } from "lucide-react";
import { KeyboardArrowUp } from '@mui/icons-material';
import MuiSearchIcon from '@mui/icons-material/Search';
import ExcelIcon from "../../../../assets/icons/excel.png";

// Components
import PaginationComponent from '../../../../components/pagination/Pagination';
import DatePickerBuddhist from '../../../../components/date-picker-buddhist/DatePickerBuddhist';
import { Icon } from '../../../../components/icons/Icon';
import Image from '../../../../components/image/Image';

// Types
import type { WorkSummaryReportDetail } from "../../../../features/types";

// Mocks
import { mockWorkSummaryReportDetail } from "../../../../mocks/mockWorkSummaryReportDetail";

// Utils
import { formatPointTenAsMinutes, formatNumberToFixed } from "../../../../utils/commonFunctions";

interface FormData {
  startDate: string
  endDate: string
};

type WorkReportDetailProps = {
  open: boolean
  onClose: () => void
  workId: number,
  startDate: string,
  endDate: string
}

const WorkReportDetail: React.FC<WorkReportDetailProps> = ({ 
  open, 
  onClose, 
  workId, 
  startDate, 
  endDate 
}) => {

  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Data
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
  });
  const [summaryWorkDetail, setSummaryWorkDetail] = useState<WorkSummaryReportDetail | null>(mockWorkSummaryReportDetail)

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    if (open) {
      setFormData({
        startDate,
        endDate,
      })
    }
  }, [open, workId])

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
    const cleaned = event.target.value.replace(/\D/g, '');

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
    if (!summaryWorkDetail) return;

    const columnLabels = {
      index: "ลำดับ",
      workDate: "วันปฏิบัติงาน",
      workPlace: "สถานที่ปฏิบัติงาน",
      patrolName: "สายตรวจ",
      workPlan: "ตารางงาน",
      startTimeReal: "เวลาเข้างาน",
      endTimeReal: "เวลาออกงาน",
      totalHours: "ชั่วโมง/วัน",
    };

    const dataRows = summaryWorkDetail?.workList.map((data, index) => ({
      [columnLabels.index]: index + 1,
      [columnLabels.workDate]: dayjs(data.workDate).format("DD/MM/BB"),
      [columnLabels.workPlace]: data.workPlace,
      [columnLabels.patrolName]: data.patrolName,
      [columnLabels.workPlan]: `${dayjs(data.startTimePlan, "HH:mm:ss").format("HH:mm")} - ${dayjs(data.endTimePlan, "HH:mm:ss").format("HH:mm")}`,
      [columnLabels.startTimeReal]: dayjs(data.startTimeReal, "HH:mm:ss").format("HH:mm"),
      [columnLabels.endTimeReal]: dayjs(data.endTimeReal, "HH:mm:ss").format("HH:mm"),
      [columnLabels.totalHours]: formatNumberToFixed(data.totalHours, 2),
    }));

    const headerInfo =
      "ชื่อผู้ปฏิบัติงาน," +
      `${summaryWorkDetail?.prefix}${summaryWorkDetail?.firstName} ${summaryWorkDetail?.lastName}` +
      "\n" +
      "ตำแหน่ง," +
      summaryWorkDetail?.position +
      "\n" +
      "ข้อมูลวันที่," +
      dayjs(summaryWorkDetail?.startDateTime).format("DD/MM/BBBB") +
      ",ถึง," +
      dayjs(summaryWorkDetail?.endDateTime).format("DD/MM/BBBB") +
      "\n\n";

    const csvBody = Papa.unparse(dataRows, { columns: Object.values(columnLabels) });
    const csvString = headerInfo + csvBody;

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvString;

    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });

    const date = dayjs().format("DDMMBBBB");
    const csvName = `ข้อมูลการปฏิบัติงานรายบุคคล_${date}.csv`;

    downloadCsv(csvName, URL.createObjectURL(blob));
  }

  const downloadCsv = (csvName: string, url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", csvName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Dialog 
      id='work-report-detail' 
      open={open} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "850px",
          },
        }
      }}
    >
      <DialogTitle className='bg-[#FFFFFF]'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#1A2136"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"ข้อมูลการปฏิบัติงานรายบุคคล"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#FFFFFF] h-full px-3'>
        <div className='flex flex-col gap-3 h-full'>
          <Divider sx={{ borderColor: "#FFC300" }} />

          <div className='grid grid-cols-[13vw_1fr] gap-2 h-full w-full'>
            {/* Column 1 */}
            <div className='flex min-w-[13vw] flex-col items-center gap-3 bg-[#071C3B] rounded-[5px] h-full py-3 px-4'>
              {
                summaryWorkDetail ? (
                  <>
                    <div className='relative flex items-center justify-center w-[150px] h-[150px] bg-[#48494B] overflow-hidden rounded-full border-[2px] border-white'>
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Image src={summaryWorkDetail.image} alt="Worker Image" className='object-fill w-[150px] h-full' textColor='#FFFFFF' />
                      </div>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                      <p className='text-[#FFC300] text-[18px] font-medium'>{`${summaryWorkDetail.prefix}${summaryWorkDetail.firstName} ${summaryWorkDetail.lastName}`}</p>
                      <p className='text-[#FFC300] text-[14px]'>{summaryWorkDetail.position}</p>
                    </div>
                    <Divider sx={{ borderColor: "#F2F2F2", width: "100%" }} />
                    <div className='flex flex-col gap-1 w-full'>
                      <div 
                        className='flex flex-col bg-[#F2F2F2] px-2 py-1 w-full'
                        style={{
                          boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        <label className='text-[16px] text-[#1A486C] font-semibold'>{"มาทำงาน"}</label>
                      
                        <div className='flex items-center justify-center gap-2 w-full'>
                          <div className='flex flex-col justify-center items-center w-full'>
                            <p className='text-[#1A486C] text-[34px] font-bold h-full'>{summaryWorkDetail.totalWorkDay}</p>
                            <p className='text-[#486D8A] text-[12px] font-medium'>{"วันทำงาน"}</p>
                          </div>
                          
                          <Divider orientation='vertical' sx={{ borderColor: "#FFC300" }} />
                
                          <div className='flex flex-col justify-end items-center w-full h-full'>
                            <div className='flex justify-center items-center h-full'>
                              <p className='text-[#1A486C] text-[24px] font-bold'>{formatPointTenAsMinutes(summaryWorkDetail.totalWorkHour)}</p>
                            </div>
                            <div className='flex justify-end items-center'>
                              <p className='text-[#486D8A] text-[12px] font-medium'>{"ชั่วโมงทำงาน"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div 
                        className='flex flex-col bg-[#F2F2F2] px-2 py-1 w-full'
                        style={{
                          boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        <label className='text-[16px] text-[#1A486C] font-semibold'>{"ขาดงาน"}</label>
                      
                        <div className='flex flex-col justify-center items-center w-full'>
                          <p className='text-[#1A486C] text-[34px] font-bold h-full'>{summaryWorkDetail.totalAbsenceDay}</p>
                          <p className='text-[#486D8A] text-[12px] font-medium'>{"จำนวนครั้งขาดงาน"}</p>
                        </div>
                      </div>
                      <div 
                        className='flex flex-col bg-[#F2F2F2] px-2 py-1 w-full'
                        style={{
                          boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        <label className='text-[16px] text-[#1A486C] font-semibold'>{"มาสาย"}</label>
                      
                        <div className='flex items-center justify-center gap-2 w-full'>
                          <div className='flex flex-col justify-center items-center w-full'>
                            <p className='text-[#1A486C] text-[34px] font-bold h-full'>{summaryWorkDetail.totalLateDay}</p>
                            <p className='text-[#486D8A] text-[12px] font-medium'>{"จำนวนครั้งมาสาย"}</p>
                          </div>
                          
                          <Divider orientation='vertical' sx={{ borderColor: "#FFC300" }} />
                
                          <div className='flex flex-col justify-end items-center w-full h-full'>
                            <div className='flex justify-center items-center h-full'>
                              <p className='text-[#1A486C] text-[24px] font-bold'>{formatPointTenAsMinutes(summaryWorkDetail.totalLateHour)}</p>
                            </div>
                            <div className='flex justify-end items-center'>
                              <p className='text-[#486D8A] text-[12px] font-medium'>{"เวลารวมที่สาย"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div 
                        className='flex flex-col bg-[#F2F2F2] px-2 py-1 w-full'
                        style={{
                          boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
                        }}
                      >
                        <label className='text-[16px] text-[#1A486C] font-semibold'>{"จำนวนลา (วัน)"}</label>
                      
                        <div className='flex flex-col h-[14vh] overflow-y-auto'>
                          {
                            summaryWorkDetail.leaveList.map((data) => {
                              if (data.totalDay === 0 && data.totalHour === 0) return null;
                              return (
                                <div 
                                  key={data.id}
                                  className='flex gap-2 bg-white border-b-[1px] border-[#C5C8CB] py-1 px-3 text-[12px] text-[#1A2136]'
                                >
                                  <p className='w-full'>{data.name_th}</p>
                                  <p className='w-[60px] text-center'>{data.totalDay > 0 ? data.totalDay : ""}</p>
                                  <p className='w-[70px] text-center'>{data.totalHour > 0 ? `(${formatPointTenAsMinutes(data.totalHour)})` : ""}</p>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex justify-center items-center h-full w-full'>
                    <p className='text-white'>ไม่มีข้อมูล</p>
                  </div>
                )
              }
            </div>

            {/* Column 2 */}
            <div className='flex flex-col items-center gap-3 h-full py-3 px-2 w-full'>
              {
                summaryWorkDetail ? (
                  <>
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
                        width: "100%",
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
                        <div className='grid grid-cols-[1fr_1fr_150px] gap-2 p-3'>
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

                    <div className='flex justify-between items-end w-full'>
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
                        disabled={summaryWorkDetail.workList.length === 0}
                      >
                        Export
                      </Button>

                      <p className='text-[#1A2136] text-[16px]'>{`ผลการค้นหา : ${50} รายการ`}</p>
                    </div>

                    {/* Table */}
                    <TableContainer component={Paper} className={`${isAccordionOpen ? "h-[45vh]" : "h-[59vh]"}`}
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
                            <TableCell sx={{ width: "15%", textAlign: "center" }}>{"วันปฏิบัติงาน"}</TableCell>
                            <TableCell sx={{ width: "20%", textAlign: "center" }}>{"สถานที่ปฏิบัติงาน"}</TableCell>
                            <TableCell sx={{ width: "12%", textAlign: "center" }}>{"สายตรวจ"}</TableCell>
                            <TableCell sx={{ width: "16%", textAlign: "center" }}>{"ตารางงาน"}</TableCell>
                            <TableCell sx={{ width: "16%", textAlign: "center" }}>{"เวลาเข้า-ออกงาน"}</TableCell>
                            <TableCell sx={{ width: "16%", textAlign: "center" }}>{"ชั่วโมง/วัน"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryWorkDetail.workList.map((data, index) => (
                            <TableRow 
                              key={data.id} 
                              sx={{ 
                                backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                              }}
                            >
                              <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{index + 1}</TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{dayjs(data.workDate).format("DD/MM/BB")}</TableCell>
                              <TableCell sx={{ borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.workPlace}</TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{data.patrolName}</TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px", color: "#133462" }}>{`${dayjs(data.startTimePlan, "HH:mm:ss").format("HH:mm")} - ${dayjs(data.endTimePlan, "HH:mm:ss").format("HH:mm")}`}</TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  borderBottom: "1px solid #FFFFFF",
                                  color: "#133462",
                                }}
                              >
                                {(() => {
                                  const startReal = dayjs(data.startTimeReal, "HH:mm:ss");
                                  const endReal = dayjs(data.endTimeReal, "HH:mm:ss");
                                  const startPlan = dayjs(data.startTimePlan, "HH:mm:ss");
                                  const endPlan = dayjs(data.endTimePlan, "HH:mm:ss");

                                  const isLate = startReal.isAfter(startPlan);
                                  const isLeftEarly = endReal.isBefore(endPlan);

                                  return (
                                    <>
                                      <span style={{ color: isLate ? "#FF0000" : "inherit" }}>
                                        {startReal.format("HH:mm")}
                                      </span>
                                      <span> - </span>
                                      <span style={{ color: isLeftEarly ? "#FF0000" : "inherit" }}>
                                        {endReal.format("HH:mm")}
                                      </span>
                                    </>
                                  );
                                })()}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", borderBottom: "#FFFFFF solid 1px" }}>{formatPointTenAsMinutes(data.totalHours)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* Footer */}
                    <div className={`${summaryWorkDetail.workList.length > 0 ? "flex" : "hidden"} items-end justify-center w-full`}>
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
                  </>
                ) :
                (
                  <div className='flex justify-center items-center h-full w-full'>
                    <p className='text-white'>ไม่มีข้อมูล</p>
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

export default WorkReportDetail;