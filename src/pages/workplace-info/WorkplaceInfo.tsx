import React, { useEffect, useState } from 'react'
import { KeyboardArrowUp } from '@mui/icons-material';
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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
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

// Constants
import {
  WORKER_INFO_ROW_PER_PAGES
} from "../../constants/dropdown"

// Types
import type {
  Workplace
} from "../../features/types";

// Mocks
import { mockWorkplaces } from '../../mocks/mockWorkplace';
import { mockWorkplaceStatus } from '../../mocks/mockWorkplaceStatus';

// Dialogs
import AddEditWorkplaceInfo from './add-edit-workplace-info/AddEditWorkplaceInfo';

interface FormData {
  patrolId: number
  workplaceName: string
  provinceId: number
  distinctId: number
  workplaceStatusId: number
};

type WorkplaceInfoProps = {

}

const WorkplaceInfo: React.FC<WorkplaceInfoProps> = ({}) => {
  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);

  // Data
  const [formData, setFormData] = useState<FormData>({
    patrolId: 0,
    workplaceName: "",
    provinceId: 0,
    distinctId: 0,
    workplaceStatusId: 0,
  });
  const [workplaceData, setWorkplace] = useState<Workplace[]>(mockWorkplaces)

  // Options
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<{ label: string ,value: number }[]>([]);
  const [distinctOptions, setDistinctOptions] = useState<{ label: string ,value: number }[]>([]);
  const [workplaceStatusOptions, setWorkplaceStatusOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(WORKER_INFO_ROW_PER_PAGES[1]);
  const [rowsPerPageOptions] = useState(WORKER_INFO_ROW_PER_PAGES);

  useEffect(() => {
    const option = mockWorkplaceStatus.map((row) => ({
      label: row.name,
      value: row.id,
    }))
    setWorkplaceStatusOptions(option);
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

  const handleProvinceChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("provinceId", value.value);
    }
    else {
      handleDropdownChange("provinceId", '');
    }
  };

  const handleDistinctChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("distinctId", value.value);
    }
    else {
      handleDropdownChange("distinctId", '');
    }
  };

  const handleWorkerStatusChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("workplaceStatusId", value.value);
    }
    else {
      handleDropdownChange("workplaceStatusId", '');
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

  const exportToCsv = () => {
    const columnLabels = {
      index: "ลำดับ",
      patrolName: "รหัสพนักงาน",
      workplaceId: "รหัสสถานที่",
      name: "ชื่อสถานที่",
      address: "ที่ตั้ง",
      detail: "รายละเอียด",
      location: "Location",
      contractStartDate: "วันที่เริ่มสัญญา",
      contractEndDate: "ประกันสังคม",
      status: "สถานะ",
    };

    const dataRows = workplaceData.map((data, index) => ({
      [columnLabels.index]: index + 1,
      [columnLabels.patrolName]: data.patrolName,
      [columnLabels.workplaceId]: data.workplaceId,
      [columnLabels.name]: data.name,
      [columnLabels.address]: data.address,
      [columnLabels.detail]: data.detail,
      [columnLabels.location]: `${data.latitude},${data.longitude}`,
      [columnLabels.contractStartDate]: dayjs(data.contractStartDate).format("DD/MM/BBBB"),
      [columnLabels.contractEndDate]: dayjs(data.contractEndDate).format("DD/MM/BBBB"),
      [columnLabels.status]: workplaceStatusOptions.find((wp) => wp.value === data.status)?.label || "-",
    }));

    const csvString = Papa.unparse(dataRows, { columns: Object.values(columnLabels) });

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvString;

    const blob = new Blob([csvWithBOM], {
      type: "text/csv;charset=utf-8;",
    });

    const date = dayjs().format("DDMMBBBB");
    const csvName = `ข้อมูลสถานที่ปฏิบัติงาน_${date}.csv`;

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

  const handleAddEditClose = async () => {
    setIsAddEditOpen(false);
  }

  return (
    <section id="workplace-info" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"ข้อมูลสถานที่ปฏิบัติงาน (Site)"}</Typography>
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
                <AutoComplete 
                  id="patrol-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.patrolId}
                  onChange={handlePatrolChange}
                  options={patrolOptions}
                  label="สาย"
                  placeholder="เลือกสาย"
                  labelFontSize="14px"
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="workplace-name"
                  label={"ชื่อสถานที่ปฏิบัติงาน"}
                  placeholder={"ชื่อสถานที่ปฏิบัติงาน"}
                  value={formData.workplaceName}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("workplaceName", event.target.value)
                  }
                />

                <AutoComplete 
                  id="province-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.provinceId}
                  onChange={handleProvinceChange}
                  options={provinceOptions}
                  label="จังหวัดที่ตั้ง"
                  placeholder="เลือกจังหวัดที่ตั้ง"
                  labelFontSize="14px"
                />

                <AutoComplete 
                  id="province-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.distinctId}
                  onChange={handleDistinctChange}
                  options={distinctOptions}
                  label="อำเภอที่ตั้ง"
                  placeholder="เลือกอำเภอที่ตั้ง"
                  labelFontSize="14px"
                />

                <AutoComplete 
                  id="workplace-status-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.workplaceStatusId}
                  onChange={handleWorkerStatusChange}
                  options={workplaceStatusOptions}
                  label="สถานะ"
                  placeholder="เลือกสถานะสถานที่ปฏิบัติงาน"
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
                  width: "120px", 
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
                  fontWeight: "medium",
                }}
                size='large'
                startIcon={<AddIcon />}
                onClick={() => setIsAddEditOpen(true)}
              >
                โครงการ
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
                disabled={workplaceData.length === 0}
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
                  <TableCell sx={{ textAlign: "center" }}>{"ลำดับ"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"สายตรวจ"}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>{"ชื่อสถานที่"}</TableCell>
                  <TableCell sx={{ width: "25%", textAlign: "center" }}>{"ที่ตั้ง"}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>{"รายละเอียด"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{"Location"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"วันที่เริ่มสัญญา"}</TableCell>
                  <TableCell sx={{ width: "8%", textAlign: "center" }}>{"วันที่สิ้นสุดสัญญา"}</TableCell>
                  <TableCell sx={{ width: "12%", textAlign: "center" }}>{"สถานะ"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{"แก้ไข"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workplaceData.map((workplace, index) => (
                  <TableRow 
                    key={workplace.id} 
                    sx={{ 
                      "&:last-child td, &:last-child th": { border: 0 }, 
                      backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{workplace.patrolName}</TableCell>
                    <TableCell sx={{ width: "20%" }}>{workplace.name}</TableCell>
                    <TableCell sx={{ width: "25%" }}>{workplace.address}</TableCell>
                    <TableCell sx={{ width: "20%" }}>{workplace.detail}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{`${workplace.latitude},${workplace.longitude}`}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{dayjs(workplace.contractStartDate).format("DD/MM/BBBB")}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{dayjs(workplace.contractEndDate).format("DD/MM/BBBB")}</TableCell>
                    {
                      (() => {
                        const statusName = workplaceStatusOptions.find((wp) => wp.value === workplace.status)
                        return (
                          <TableCell sx={{ width: "12%", textAlign: "center" }}>{statusName ? statusName.label : "-"}</TableCell>
                        )
                      })()
                    }
                    <TableCell sx={{ textAlign: "center" }}>
                      {
                        <div className='flex justify-center items-center gap-2'>
                          <IconButton
                            onClick={() => handleEditClick(workplace.id)}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Pencil} size={20} color="#1A486C" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(workplace.id)}
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
        <div className={`${workplaceData.length > 0 ? "flex" : "hidden"} items-center justify-between pt-3 pl-1`}>
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

      <AddEditWorkplaceInfo 
        open={isAddEditOpen}
        onClose={handleAddEditClose}
      />
    </section>
  )
}

export default WorkplaceInfo;