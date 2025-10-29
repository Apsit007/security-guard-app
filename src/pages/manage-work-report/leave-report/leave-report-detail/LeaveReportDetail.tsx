import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Papa from "papaparse";

// Material UI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Icons
import { CircleX, Search } from "lucide-react";
import ImageIcon from "../../../../assets/icons/image.png";
import FileIcon from "../../../../assets/icons/file.png";

// Components
import { Icon } from '../../../../components/icons/Icon';
import Image from '../../../../components/image/Image';
import PdfViewer from '../../../../components/pdf-viewer/PdfViewer';

// Types
import type { LeaveSummaryReport, File } from "../../../../features/types";

// Utils
import { formatPointTenAsMinutes, formatNumberToFixed } from "../../../../utils/commonFunctions";

// Constants
import { LEAVE_TYPE } from '../../../../constants/leaveType';

type LeaveReportDetailProps = {
  open: boolean
  onClose: () => void
  leaveDetail: LeaveSummaryReport | null
}

const LeaveReportDetail: React.FC<LeaveReportDetailProps> = ({ 
  open, 
  onClose, 
  leaveDetail,
}) => {
  // Data
  const [fileData, setFileData] = useState<File | null>(null);

  const handleFileClick = (fileData: File) => {
    setFileData(fileData);
  }

  const handleClose = () => {
    setFileData(null);
    onClose();
  }

  return (
    <Dialog 
      id='leave-report-detail' 
      open={open} 
      maxWidth="xl" 
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
            <button type='button' onClick={handleClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#FFFFFF] h-full px-3'>
        <div className='flex flex-col gap-3 h-full'>
          <Divider sx={{ borderColor: "#FFC300" }} />

          <div className='grid grid-cols-[13vw_1fr] gap-5 h-full w-full'>
            {/* Column 1 */}
            <div className='flex min-w-[13vw] flex-col items-center gap-3 bg-[#071C3B] rounded-[5px] h-full py-3 px-4'>
              {
                leaveDetail ? (
                  <>
                    <div className='relative flex items-center justify-center w-[150px] h-[150px] bg-[#48494B] overflow-hidden rounded-full border-[2px] border-white'>
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Image src={leaveDetail.image} alt="Worker Image" className='object-fill w-[150px] h-full' textColor='#FFFFFF' />
                      </div>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                      <p className='text-[#FFC300] text-[18px] font-medium'>{`${leaveDetail.prefix}${leaveDetail.firstName} ${leaveDetail.lastName}`}</p>
                      <p className='text-[#FFC300] text-[14px]'>{leaveDetail.position}</p>
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
                            <p className='text-[#1A486C] text-[34px] font-bold h-full'>{leaveDetail.totalWorkDay}</p>
                            <p className='text-[#486D8A] text-[12px] font-medium'>{"วันทำงาน"}</p>
                          </div>
                          
                          <Divider orientation='vertical' sx={{ borderColor: "#FFC300" }} />
                
                          <div className='flex flex-col justify-end items-center w-full h-full'>
                            <div className='flex justify-center items-center h-full'>
                              <p className='text-[#1A486C] text-[24px] font-bold'>{formatPointTenAsMinutes(leaveDetail.totalWorkHour)}</p>
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
                          <p className='text-[#1A486C] text-[34px] font-bold h-full'>{leaveDetail.totalAbsenceDay}</p>
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
                            <p className='text-[#1A486C] text-[34px] font-bold h-full'>{leaveDetail.totalLateDay}</p>
                            <p className='text-[#486D8A] text-[12px] font-medium'>{"จำนวนครั้งมาสาย"}</p>
                          </div>
                          
                          <Divider orientation='vertical' sx={{ borderColor: "#FFC300" }} />
                
                          <div className='flex flex-col justify-end items-center w-full h-full'>
                            <div className='flex justify-center items-center h-full'>
                              <p className='text-[#1A486C] text-[24px] font-bold'>{formatPointTenAsMinutes(leaveDetail.totalLateHour)}</p>
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
                            leaveDetail.leaveList.map((data) => {
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
            <div className='flex h-full py-3 px-5 w-full border-[1px] border-[#C5C8CB]'>
              {
                leaveDetail ? (
                  <div className='grid grid-cols-2 gap-3 w-full h-full'>
                    {/* Leave Detail */}
                    {/* Header */}
                    <div className='flex flex-col justify-between text-[15px] text-[#133462]'>
                      <div className='flex flex-col gap-2 h-full'>
                        <p><span className='font-semibold pr-5'>ประเภทการลา : </span>{ LEAVE_TYPE.find((type) => type.id === leaveDetail.leaveTypeId)?.name_th ?? "-" }</p>
                        {
                          (() => {
                            let leaveDateTime = "";
                            let leaveHours = "";
                            let leaveDays = "";
      
                            if (leaveDetail.leaveId !== 0) {
                              leaveDateTime = `${dayjs(leaveDetail.leaveDateTimeStart).format("DD/MM/BB HH:mm")} - ${dayjs(leaveDetail.leaveDateTimeEnd).format("DD/MM/BB HH:mm")}`;
                              leaveHours = formatNumberToFixed(leaveDetail.leaveHours, 2);
                              leaveDays = "-";
                            }
                            else {
                              leaveDateTime = `${dayjs(leaveDetail.leaveDateStart).format("DD/MM/BB")} - ${dayjs(leaveDetail.leaveDateEnd).format("DD/MM/BB")}`;
                              leaveHours = "-";
                              leaveDays = leaveDetail.leaveDays.toString();
                            }
      
                            return (
                              <>
                                <p><span className='font-semibold pr-5'>วันที่ลา : </span>{ leaveDateTime }</p>
                                <div className='grid grid-cols-2 gap-4'>
                                  <p><span className='font-semibold pr-5'>เวลารวม (ชั่วโมง) : </span>{ leaveHours }</p>
                                  <p><span className='font-semibold pr-5'>จำนวนวัน : </span>{ leaveDays }</p>
                                </div>
                              </>
                            )
                          })()
                        }
                        <p className='font-semibold pr-5'>รายละเอียดการลา : </p>
                        <p>{leaveDetail.leaveDetail}</p>
                      </div>
                      {/* Footer */}
                      <div className='flex flex-col gap-2'>
                        <p className='font-semibold pr-5'>เอกสารแนบ : </p>
                        <div className='h-[10vh] overflow-y-auto'>
                          {
                            leaveDetail.fileList && leaveDetail.fileList.length > 0 ? (
                              <div className='flex flex-col gap-1'>
                                {
                                  leaveDetail.fileList.map((file) => {
                                    const isImage = file.fileType.startsWith("image/");
                                    return (
                                      <div 
                                        key={file.id}
                                        className={`flex items-center justify-start gap-1 rounded-[5px] p-2 cursor-pointer 
                                          hover:shadow-[0px_1px_2px_rgba(0,0,0,0.2)] 
                                          ${file.id === fileData?.id ? "bg-[#DBDCDE] hover:bg-[#AFB0B2]" : "bg-[#F2F2F2] hover:bg-[#F5F5F5]"}`
                                        }
                                        onClick={() => handleFileClick(file)}
                                      >
                                        <img src={ isImage ? ImageIcon : FileIcon } alt={ isImage ? "Image Icon" : "File Icon" } className='w-[25px] h-[25px]' />
                                        <p>{`${file.fileName} (${file.fileSize / 1000} KB)`}</p>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            ) : (
                              <p>ไม่มีเอกสารแนบ</p>
                            )
                          }
                        </div>
                        <Divider sx={{ borderColor: "#C5C8CB" }} />
                        <div className='grid grid-cols-[75px_35%_auto] gap-5'>
                          <p className='font-semibold pr-3'>ผู้บันทึก : </p>
                          <p>{leaveDetail.recorder}</p>
                          <p>{dayjs(leaveDetail.recordDateTime).format("DD/MM/BB HH:mm")}</p>
                          <p className='font-semibold pr-3'>ผู้แก้ไข : </p>
                          <p>{leaveDetail.approver}</p>
                          <p>{dayjs(leaveDetail.approveDateTime).format("DD/MM/BB HH:mm")}</p>
                        </div>
                      </div>
                    </div>
                    {/* Leave Document */}
                    <div className='bg-[#F2F2F2] w-full h-full p-4'>
                      {
                        fileData ? 
                        (() => {
                          const isImage = fileData && fileData.fileType.includes("image");
                          return (
                            isImage ? (
                              <Image src={fileData.fileData} alt={fileData.fileName} className='max-w-full h-full object-contain' />
                            ) : (
                              <div className="w-full h-full">
                                <PdfViewer fileUrl={fileData.fileData} />
                              </div>
                            )
                          )
                        })()
                        : null
                      }
                    </div>
                  </div>
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

export default LeaveReportDetail;