import React, { useEffect, useState } from 'react'

// Material UI
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
import type { 
  SelectChangeEvent,
} from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

// Components
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import PaginationComponent from '../../components/pagination/Pagination';

// Icons
import { Search, Check, X, Pencil } from "lucide-react";
import centerIcon from "../../assets/icons/center.png";
import MuiSearchIcon from '@mui/icons-material/Search';
import { Icon } from '../../components/icons/Icon';

// Constants
import {
  MANAGE_PATROL_ROW_PER_PAGES
} from "../../constants/dropdown"

// Types
import type {
  Worker,
  Patrol,
} from "../../features/types";

// Mocks
import { mockWorker } from '../../mocks/mockWorker';
import { mockPatrol } from '../../mocks/mockPatrol';

interface FormData {
  firstName: string
  lastName: string
  workerStatus: number
};

type ManagePatrolProps = {}

const ManagePatrol: React.FC<ManagePatrolProps> = ({}) => {

  // State
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Data
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    workerStatus: 0,
  });
  const [workerData, setWorkerData] = useState<Worker[]>(mockWorker);
  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [tempValues, setTempValues] = useState<Record<number, any>>({});

  // Options
  const [workerStatusOptions, setWorkerStatusOptions] = useState<{ label: string ,value: number }[]>([]);
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(MANAGE_PATROL_ROW_PER_PAGES[1]);
  const [rowsPerPageOptions] = useState(MANAGE_PATROL_ROW_PER_PAGES);

  useEffect(() => {
    const option = mockPatrol.map((row) => ({
      label: row.name,
      value: row.id,
    }))
    setPatrolOptions(option);
  }, []);

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

  const handlePatrolChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null,
    id: number
  ) => {
    event.preventDefault();

    setWorkerData(prev =>
      prev.map(worker =>
        worker.id === id
          ? {
              ...worker,
              patrolId: value ? value.value : 0,
            }
          : worker
      )
    );
    setTempValues((prev) => ({
      ...prev,
      [id]: value ? value.value : 0
    }));
  };

  const handleEditClick = (id: number) => {
    setEditingRows((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    const worker = workerData.find((w) => w.id === id);
    if (worker) setTempValues((prev) => ({ ...prev, [id]: worker.patrolId }));
  };

  const handleCancel = (id: number) => {
    setEditingRows((prev) => prev.filter((rowId) => rowId !== id));
    setTempValues((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleSave = (id: number) => {
    setWorkerData((prev) =>
      prev.map((worker) =>
        worker.id === id
          ? { ...worker, patrolId: tempValues[id] ?? worker.patrolId }
          : worker
      )
    );
    handleCancel(id);
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
    <section id="manage-patrol" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"จัดการสายตรวจ"}</Typography>
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
                  label={"ชื่อ"}
                  placeholder={"ชื่อสายตรวจ"}
                  value={formData.firstName}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("firstName", event.target.value)
                  }
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="nation-id"
                  label={"นามสกุล"}
                  placeholder={"นามสกุลสายตรวจ"}
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
          <div className='flex items-end w-full'>
            <p className='text-[#FFC300] text-[16px] font-medium'>{`จำนวน ${50} รายการ`}</p>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className={isAccordionOpen ? "h-[43vh]" : "h-[64vh]"}
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
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>{"ชื่อ - นามสกุล"}</TableCell>
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>{"ตำแหน่ง"}</TableCell>
                  <TableCell sx={{ width: "10%", textAlign: "center" }}>{"สายตรวจ"}</TableCell>
                  <TableCell sx={{ width: "4%", textAlign: "center" }}>{"แก้ไข"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workerData.map((worker, index) => (
                  <TableRow 
                    key={worker.id} 
                    sx={{ 
                      "&:last-child td, &:last-child th": { border: 0 }, 
                      backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2",
                      height: "60px",
                    }}
                  >
                    <TableCell sx={{ width: "6%", textAlign: "center" }}>{index + 1}</TableCell>
                    <TableCell sx={{ width: "8%", textAlign: "center" }}>{worker.workerId}</TableCell>
                    <TableCell sx={{ width: "20%" }}>{`${worker.prefix}${worker.firstName} ${worker.lastName}`}</TableCell>
                    <TableCell sx={{ width: "35%" }}>{worker.position}</TableCell>
                    {
                      (() => {
                        const isEditing = editingRows.includes(worker.id);
                        const patrolInfo = mockPatrol.find((patrol) => patrol.id === worker.patrolId);

                        return (
                          <>
                            <TableCell sx={{ width: "25%", textAlign: "center", padding: "0 0 5px 0" }}>
                              {
                                isEditing ? (
                                  <div className='flex justify-center items-center'>
                                    <AutoComplete 
                                      id="patrol-select"
                                      sx={{ marginTop: "10px"}}
                                      value={worker.patrolId}
                                      onChange={(event, value) => handlePatrolChange(event, value, worker.id)}
                                      options={patrolOptions}
                                      label=""
                                      placeholder="เลือกสายตรวจ"
                                      labelFontSize="14px"
                                    />
                                  </div>
                                ) : (
                                  patrolInfo ? patrolInfo.name : "-"
                                )
                              }
                            </TableCell>
                            <TableCell sx={{ width: "6%", textAlign: "center", p: 0 }}>
                              {
                                isEditing ? (
                                  <div className='flex justify-center items-center gap-1'>
                                    <IconButton
                                      onClick={() => handleSave(worker.id)}
                                      sx={{
                                        padding: 0,
                                      }}
                                    >
                                      <Icon icon={Check} size={25} color="#117E43" />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleCancel(worker.id)}
                                      sx={{
                                        padding: 0,
                                      }}
                                    >
                                      <Icon icon={X} size={25} color="#9F0C0C" />
                                    </IconButton>
                                  </div>
                                ) : (
                                  <IconButton
                                    onClick={() => handleEditClick(worker.id)}
                                    sx={{
                                      padding: 0,
                                    }}
                                  >
                                    <Icon icon={Pencil} size={20} color="#1A486C" />
                                  </IconButton>
                                )
                              }
                            </TableCell>
                          </>
                        )
                      })()
                    }
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

export default ManagePatrol;