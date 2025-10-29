import React, { useState } from 'react'
// Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { 
  SelectChangeEvent,
} from '@mui/material';

// Icons
import { Trash2, Pencil } from "lucide-react";
import centerIcon from "../../assets/icons/center.png";
import AddIcon from '@mui/icons-material/Add';
import { Icon } from '../../components/icons/Icon';

// Components
import PaginationComponent from '../../components/pagination/Pagination';

// Types
import type {
  Patrol
} from "../../features/types";

// Constants
import {
  PATROL_INFO_ROW_PER_PAGES
} from "../../constants/dropdown"

// Dialog
import AddEditPatrolInfo from './add-edit-patrol-info/AddEditPatrolInfo';

// Mocks
import { mockPatrol } from '../../mocks/mockPatrol';

type PatrolInfoProps = {

}

const PatrolInfo: React.FC<PatrolInfoProps> = ({}) => {
  // State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);

  // Data
  const [patrolData, setPatrolData] = useState<Patrol[]>(mockPatrol);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [totalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PATROL_INFO_ROW_PER_PAGES[1]);
  const [rowsPerPageOptions] = useState(PATROL_INFO_ROW_PER_PAGES);

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

  const handleAddEditClose = async () => {
    setIsAddEditOpen(false);
  }

  return (
    <section id="patrol-info" className="px-1 gap-2 h-full">
      <div className="flex justify-between items-center w-full pb-3">
        <Typography variant='h5' color="#0D3063" sx={{ fontWeight: 600, fontSize: "24px" }} >{"ข้อมูลสายตรวจ"}</Typography>
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
        <div className='flex flex-col gap-2'>
          {/* Button */}
          <div className='flex justify-between items-end w-full'>
            <Button
              variant="contained"
              className="main-btn"
              sx={{ 
                width: "140px", 
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
              สายตรวจ
            </Button>

            <p className='text-[#FFC300] text-[16px] font-medium'>{`จำนวน ${50} รายการ`}</p>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className="h-[68vh]"
            sx={{
              backgroundColor: "#F2F2F2",
              borderRadius: 0,
            }}
          >
            <Table stickyHeader sx={{ width: "100%" }}>
              <TableHead 
                sx={{
                  "& .MuiTableCell-head": {
                    color: "white",
                    backgroundColor: "#133462",
                  },
                }}
              >
                <TableRow>
                  <TableCell sx={{ width: "5%", textAlign: "center" }}>{"ลำดับ"}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>{"ชื่อสายตรวจ"}</TableCell>
                  <TableCell sx={{ width: "50%", textAlign: "center" }}>{"รายละเอียด"}</TableCell>
                  <TableCell sx={{ width: "6%", textAlign: "center" }}>{"แก้ไข/ลบ"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patrolData.map((patrol, index) => (
                  <TableRow 
                    key={patrol.id} 
                    sx={{ 
                      "&:last-child td, &:last-child th": { border: 0 }, 
                      backgroundColor: index % 2 === 0 ? "#DBDCDE": "#F2F2F2" 
                    }}
                  >
                    <TableCell sx={{ width: "5%", textAlign: "center" }}>{index + 1}</TableCell>
                    <TableCell sx={{ width: "20%" }}>{patrol.name}</TableCell>
                    <TableCell sx={{ width: "50%" }}>{patrol.detail}</TableCell>
                    <TableCell sx={{ width: "6%", textAlign: "center" }}>
                      {
                        <div className='flex justify-center items-center gap-2'>
                          <IconButton
                            onClick={() => handleEditClick(patrol.id)}
                            sx={{
                              padding: 0,
                            }}
                          >
                            <Icon icon={Pencil} size={20} color="#1A486C" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(patrol.id)}
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
        <div className={`${patrolData.length > 0 ? "flex" : "hidden"} items-center justify-between pt-3 pl-1`}>
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

      <AddEditPatrolInfo 
        open={isAddEditOpen}
        onClose={handleAddEditClose}
      />
    </section>
  )
}

export default PatrolInfo;