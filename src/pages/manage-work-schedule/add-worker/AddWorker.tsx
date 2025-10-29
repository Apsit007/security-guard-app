import React, { useEffect, useState } from 'react'

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
import type { 
  SelectChangeEvent,
} from '@mui/material';

// Icons
import { CircleX, Search } from "lucide-react";
import { Icon } from '../../../components/icons/Icon';
import { KeyboardArrowUp } from '@mui/icons-material';
import MuiSearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Components
import AutoComplete from '../../../components/auto-complete/AutoComplete';
import TextBox from '../../../components/text-box/TextBox';
import PaginationComponent from '../../../components/pagination/Pagination';

// Types
import type { Worker } from "../../../features/types";

// Mocks
import { mockWorker } from "../../../mocks/mockWorker";

// Utils
import { calculateTotalYear } from "../../../utils/commonFunctions";

// Constants
import {
  ADD_WORKER_ROW_PER_PAGES
} from "../../../constants/dropdown"

interface FormData {
  workerId: string
  firstName: string
  lastName: string
  positionId: number
}

type AddWorkerProps = {
  open: boolean
  onClose: () => void
}

const AddWorker: React.FC<AddWorkerProps> = ({ open, onClose }) => {
  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Data
  const [searchData, setSearchData] = useState<FormData>({
    workerId: "",
    firstName: "",
    lastName: "",
    positionId: 0,
  });
  const [workerData, setWorkerData] = useState<Worker[]>(mockWorker);

  // Options
  const [positionOptions, setPositionOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(3);
  const [rowsPerPage, setRowsPerPage] = useState(ADD_WORKER_ROW_PER_PAGES[1]);
  const [rowsPerPageOptions] = useState(ADD_WORKER_ROW_PER_PAGES);

  useEffect(() => {
    setPositionOptions([{label: "ทุกตำแหน่ง", value: 0}])
  }, [])

  const handleTextChange = (key: keyof typeof searchData, value: string) => {
    setSearchData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof searchData, value: string) => {
    setSearchData((prev) => ({ ...prev, [key]: value }));
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

  return (
    <Dialog 
      id='add-worker' 
      open={open} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "770px",
          },
        }
      }}
    >
      <DialogTitle className='bg-[#F3F3FA]'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#1A2136"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"ผู้ปฏิบัติงาน"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#F3F3FA] h-full'>
        <div className='flex flex-col gap-2'>
          {/* Search */}
          <div>
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
                  backgroundColor: "#F3F3FA",
                  gap: "10px",
                  border: "1px solid #C5C8CB",
                  ...(
                    isAccordionOpen ? 
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
                id="search"
              >
                <div className='flex justify-start items-center gap-2'>
                  <Search className='w-[20px] h-[20px]' color='#1A486C' />
                  <Typography component="span" style={{ color: "#1A486C", fontWeight: 500 }}>
                    Search
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails 
                sx={{ 
                  padding: 1, 
                  backgroundColor: "#F3F3FA",
                  border: "1px solid #C5C8CB",
                  borderTop: "none",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  boxShadow: "none",
                }}
              >
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2'>
                    <TextBox
                      sx={{ marginTop: "10px" }}
                      id="worker-id"
                      label={"รหัสพนักงาน"}
                      placeholder={"รหัสพนักงาน"}
                      value={searchData.workerId}
                      labelFontSize="14px"
                      onChange={(event) =>
                        handleTextChange("workerId", event.target.value)
                      }
                    />

                    <TextBox
                      sx={{ marginTop: "10px" }}
                      id="first-name"
                      label={"ชื่อ"}
                      placeholder={"ชื่อผู้ปฏิบัติงาน"}
                      value={searchData.firstName}
                      labelFontSize="14px"
                      onChange={(event) =>
                        handleTextChange("firstName", event.target.value)
                      }
                    />

                    <TextBox
                      sx={{ marginTop: "10px" }}
                      id="last-name"
                      label={"นามสกุล"}
                      placeholder={"นามสกุลผู้ปฏิบัติงาน"}
                      value={searchData.lastName}
                      labelFontSize="14px"
                      onChange={(event) =>
                        handleTextChange("lastName", event.target.value)
                      }
                    />

                    <AutoComplete 
                      id="position-select"
                      sx={{ marginTop: "10px"}}
                      value={searchData.positionId}
                      onChange={handlePositionChange}
                      options={positionOptions}
                      label="ตำแหน่ง"
                      labelFontSize="14px"
                    />
                  </div>
                  <div className='flex justify-end items-center py-1'>
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
                      startIcon={<MuiSearchIcon />}
                    >
                      ค้นหา
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <div className='flex justify-end items-end w-full'>
            <p className='text-[#133462] text-[16px]'>{`ผลการค้นหา : ${"10"} รายการ`}</p>
          </div>
          {/* Table */}
          <TableContainer component={Paper} className={ isAccordionOpen ? "h-[32vh]" : "h-[50vh]"}
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
                  <TableCell sx={{ textAlign: "center" }}>{"เลือก"}</TableCell>
                  <TableCell sx={{ width: "25%", textAlign: "center" }}>{"ชื่อ - นามสกุล"}</TableCell>
                  <TableCell sx={{ width: "6%", textAlign: "center" }}>{"เพศ"}</TableCell>
                  <TableCell sx={{ width: "6%", textAlign: "center" }}>{"อายุ"}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>{"อายุงาน"}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>{"ตำแหน่ง"}</TableCell>
                  <TableCell sx={{ width: "25%", textAlign: "center" }}>{"หมายเหตุ"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  workerData.map((data, index) => (
                    <TableRow 
                      key={data.id} 
                      sx={{ 
                        "&:last-child td, &:last-child th": { border: 0 }, 
                        backgroundColor: index % 2 === 0 ? "#F0F0F0": "#FFFFFF",
                        height: "30px !important",
                        p: 0,
                      }}
                    >
                      <TableCell sx={{ textAlign: "center" }}>
                        {
                          <Checkbox
                            sx={{
                              color: "#81898E",
                              padding: 0,
                              "&.Mui-checked": {
                                color: "#81898E",
                              },
                            }}
                          />
                        }
                      </TableCell>
                      <TableCell>{`${data.workerId} ${data.firstName} ${data.lastName}`}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.sex}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.age}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{calculateTotalYear(data.workingExperience)}</TableCell>
                      <TableCell>{data.position}</TableCell>
                      <TableCell sx={{ textAlign: data.remark ? "left" : "center" }}>{data.remark || "-"}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

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
              isShowRowPerPage={false}
              textColor='#1A486C'
              textPageSelectColor='#4A4A4A'
              textPageSelectBgColor='#FFFFFF'
              textPageSelectActiveColor='#FFFFFF'
              textPageSelectActiveBgColor='#1A486C'
            />
          </div>

          <Divider sx={{ borderColor: "#1A486C" }}  />
          <div className='flex justify-end h-full gap-2'>
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
      </DialogContent>
    </Dialog>
  )
}

export default AddWorker;