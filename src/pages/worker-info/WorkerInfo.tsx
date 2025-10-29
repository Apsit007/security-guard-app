import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import dayjs from "dayjs";

// Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type { 
  SelectChangeEvent,
} from '@mui/material';

// Components
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import PaginationComponent from '../../components/pagination/Pagination';
import { Icon } from '../../components/icons/Icon';

// Icons
import { Search, Trash2, Pencil } from "lucide-react";
import centerIcon from "../../assets/icons/center.png";
import ExcelIcon from "../../assets/icons/excel.png";
import MuiSearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { KeyboardArrowUp } from '@mui/icons-material';

// Utils
import { 
  calculateTotalYear, 
  formatNumberToFixed, 
  formatPhone 
} from "../../utils/commonFunctions";

// Constants
import {
  WORKER_INFO_ROW_PER_PAGES
} from "../../constants/dropdown"

// Types
import type {
  Worker
} from "../../features/types";

// Mocks
import { mockWorker } from '../../mocks/mockWorker';

interface FormData {
  workerId: string
  nationId: string
  firstName: string
  lastName: string
  workerStatus: number
};

type WorkerInfoProps = {

}

const WorkerInfo: React.FC<WorkerInfoProps> = ({}) => {
  const navigate = useNavigate();

  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Data
  const [formData, setFormData] = useState<FormData>({
    workerId: "",
    nationId: "",
    firstName: "",
    lastName: "",
    workerStatus: 0,
  });
  const [workerData, setWorkerData] = useState<Worker[]>(mockWorker)

  // Options
  const [workerStatusOptions, setWorkerStatusOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(WORKER_INFO_ROW_PER_PAGES[1]);
  const [rowsPerPageOptions] = useState(WORKER_INFO_ROW_PER_PAGES);

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleWorkerStatusChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("workerStatus", value.value);
    }
    else {
      handleDropdownChange("workerStatus", '');
    }
  };

  const handleEditClick = (id: number) => {
    alert(`Edit Click ${id}`)
  }

  const handleDeleteClick = (id: number) => {
    alert(`Delete Click ${id}`)
  }

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setPage(value);
  };

  const handleRowsPerPageChange = async (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value));
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

  const goToManageWorker = () => {
    navigate(`/worker-info/manage-worker`, { state: { allowed: true } });
  }

  const exportToCsv = () => {
    const columnLabels = {
      index: "ลำดับ",
      workerId: "รหัสพนักงาน",
      nationId: "เลขบัตรประชาชน",
      prefix: "คำนำหน้า",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      position: "ตำแหน่ง",
      mobile: "เบอร์ติดต่อ",
      socialSecurity: "ประกันสังคม",
      associate: "% สมทบ",
      workerStatus: "สถานะพนักงาน",
      workingExperience: "อายุงาน",
      salaryType: "ประเภทค่าจ้าง",
      salary: "เงินค่าจ้าง",
    };

    const dataRows = workerData.map((data, index) => ({
      [columnLabels.index]: index + 1,
      [columnLabels.workerId]: data.workerId,
      [columnLabels.nationId]: data.nationId,
      [columnLabels.prefix]: data.prefix,
      [columnLabels.firstName]: data.firstName,
      [columnLabels.lastName]: data.lastName,
      [columnLabels.position]: data.position,
      [columnLabels.mobile]: data.mobile,
      [columnLabels.socialSecurity]: data.socialSecurity,
      [columnLabels.associate]: data.associate,
      [columnLabels.workerStatus]: data.workerStatus,
      [columnLabels.workingExperience]: data.workingExperience,
      [columnLabels.salaryType]: data.salaryType,
      [columnLabels.salary]: data.salary,
    }));

    const csvString = Papa.unparse(dataRows, { columns: Object.values(columnLabels) });

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvString;

    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });

    const date = dayjs().format("DDMMBBBB");
    const csvName = `ข้อมูลผู้ปฏิบัติงาน_${date}.csv`;

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
    <section id="worker-info" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"ข้อมูลผู้ปฏิบัติงาน"}</Typography>
        <div className="flex gap-2 items-center">
          <img src={centerIcon} alt="Center Icon" className="w-6 h-6" />
          <Typography variant='h5' color={"#133462"} sx={{ fontWeight: 500, fontSize: "18px" }}>{"Center"}</Typography>
        </div>
      </div>

      <div 
        className='flex-1 flex flex-col gap-4 py-4 px-3 bg-[#FFFFFF] h-full'
        style={{
          boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
        }}
      >
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
              <div className='flex gap-6'>
                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="worker-id"
                  label={"รหัสพนักงาน"}
                  placeholder={"รหัสพนักงาน"}
                  value={formData.workerId}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("workerId", event.target.value)
                  }
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="nation-id"
                  label={"เลขบัตรประชาชน"}
                  placeholder={"เลขบัตรประชาชน"}
                  value={formData.nationId}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("nationId", event.target.value)
                  }
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
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="last-name"
                  label={"นามสกุล"}
                  placeholder={"นามสกุลผู้ปฏิบัตงาน"}
                  value={formData.lastName}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("lastName", event.target.value)
                  }
                />

                <AutoComplete 
                  id="worker-status-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.workerStatus}
                  onChange={handleWorkerStatusChange}
                  options={workerStatusOptions}
                  label="สถานะพนักงาน"
                  placeholder="เลือกสถานะพนักงาน"
                  labelFontSize="14px"
                />
              </div>
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

        {/* Middle */}
        <div className='flex flex-col gap-2'>
          {/* Button */}
          <div className='flex justify-between items-end w-full'>
            <div className='flex gap-2'>
              <Button
                variant="contained"
                className="main-btn"
                sx={{ 
                  width: "160px", 
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
                  fontWeight: "medium",
                }}
                size='large'
                startIcon={<AddIcon />}
                onClick={goToManageWorker}
              >
                ผู้ปฏิบัติงาน
              </Button>

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
                  fontWeight: "medium",
                }}
                startIcon={
                  <img src={ExcelIcon} alt="Excel Icon" className='w-[25px] h-[25px]' />
                }
                onClick={exportToCsv}
                disabled={workerData.length === 0}
              >
                Export
              </Button>
            </div>

            <p className='text-[#FFC300] text-[16px] font-medium'>{`จำนวน ${50} รายการ`}</p>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className={isAccordionOpen ? "h-[41vh]" : "h-[62vh]"}
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
                  <TableCell sx={{ width: "3%", textAlign: "center" }}>{"ลำดับ"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"รหัสพนักงาน"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"เลขบัตรประชาชน"}</TableCell>
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>{"ชื่อ - นามสกุล"}</TableCell>
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>{"ตำแหน่ง"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"เบอร์ติดต่อ"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"ประกันสังคม"}</TableCell>
                  <TableCell sx={{ width: "5%", textAlign: "center" }}>{"% สมทบ"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"สถานะพนักงาน"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"อายุงาน"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"ประเภทค่าจ้าง"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"เงินค่าจ้าง"}</TableCell>
                  <TableCell sx={{ width: "4%", textAlign: "center" }}>{"แก้ไข/ลบ"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workerData.map((worker, index) => (
                  <TableRow 
                    key={worker.id} 
                    sx={{ 
                      "&:last-child td, &:last-child th": { border: 0 }, 
                      backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                    }}
                  >
                    <TableCell sx={{ width: "3%", textAlign: "center" }}>{index + 1}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{worker.workerId}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{worker.nationId}</TableCell>
                    <TableCell sx={{ width: "10%" }}>{`${worker.prefix}${worker.firstName} ${worker.lastName}`}</TableCell>
                    <TableCell sx={{ width: "10%" }}>{worker.position}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{formatPhone(worker.mobile)}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{worker.socialSecurity}</TableCell>
                    <TableCell sx={{ width: "5%", textAlign: "center" }}>{worker.associate}</TableCell>
                    <TableCell sx={{ width: "8%" }}>{worker.workerStatus}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{calculateTotalYear(worker.workingExperience)}</TableCell>
                    <TableCell sx={{ width: "8%" }}>{worker.salaryType}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "right" }}>{formatNumberToFixed(worker.salary, 2)}</TableCell>
                    <TableCell sx={{ width: "4%", textAlign: "center" }}>
                      {
                        <div className='flex gap-2'>
                          <IconButton
                            onClick={() => handleEditClick(worker.id)}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Pencil} size={20} color="#1A486C" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(worker.id)}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Trash2} size={20} color="#1A486C" />
                          </IconButton>
                        </div>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Footer */}
        <div className={`${workerData.length > 0 ? "flex" : "hidden"} items-center justify-between pt-3 pl-1`}>
          <PaginationComponent 
            page={page} 
            onChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            handleRowsPerPageChange={handleRowsPerPageChange}
            totalPages={totalPages}
            pageInput={pageInput.toString()}
            handlePageInputKeyDown={handlePageInputKeyDown}
            handlePageInputChange={handlePageInputChange}
          />
        </div>
      </div>
    </section>
  )
}

export default WorkerInfo;