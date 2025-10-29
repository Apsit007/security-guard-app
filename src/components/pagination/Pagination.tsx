import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'

// Component
import TextBox from '../../components/text-box/TextBox'

interface PaginationProps {
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  handleRowsPerPageChange?: (event: SelectChangeEvent) => void;
  totalPages: number;
  pageInput: string;
  handlePageInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePageInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isShowRowPerPage?: boolean;
  textColor?: string;
  textPageSelectColor?: string;
  textPageSelectBgColor?: string;
  textPageSelectActiveColor?: string;
  textPageSelectActiveBgColor?: string;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  onChange,
  rowsPerPage,
  rowsPerPageOptions,
  handleRowsPerPageChange,
  totalPages,
  pageInput,
  handlePageInputKeyDown,
  handlePageInputChange,
  isShowRowPerPage = true,
  textColor = "#FFC300",
  textPageSelectColor = "#4A4A4A",
  textPageSelectBgColor = "#FFFFFF",
  textPageSelectActiveColor = "#071C3B",
  textPageSelectActiveBgColor = "#FFC300",
}) => {
  return (
    <div className={`flex items-center ${ isShowRowPerPage ? "justify-between" : "justify-end" } w-full`}>
      {
        isShowRowPerPage && rowsPerPage && rowsPerPageOptions && (
          <div className="flex items-center space-x-4">
            <p className="font-medium text-[16px]"
              style={{
                color: textColor,
              }}
            >{"แสดง"}</p>
            <Select
              id="row-per-page-select"
              value={rowsPerPage.toString()}
              onChange={handleRowsPerPageChange}
              className="bg-white h-[35px] min-w-[100px] w-[100px]"
              size="medium"
              sx={{
                borderRadius: "5px",
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
        )
      }
      <div className='flex justify-center items-center'>
        <Stack spacing={2}>
          <Pagination
            sx={{
              display: 'flex',
              justifyContent: 'end',
              "& .MuiPaginationItem-page": {
                color: textPageSelectColor,
                backgroundColor: textPageSelectBgColor,
                border: "1px solid #D9D9D9",
                borderRadius: "5px",
              },
              "& .MuiPaginationItem-page:hover": {
                backgroundColor: "#F4F4F4",
              },
              "& .MuiPaginationItem-previousNext": {
                color: textPageSelectColor,
                backgroundColor: textPageSelectBgColor,
                border: "1px solid #D9D9D9",
                borderRadius: "5px",
              },
              "& .MuiPaginationItem-previousNext:hover": {
                backgroundColor: "#F4F4F4",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: textPageSelectActiveBgColor,
                color: textPageSelectActiveColor,
              },
            }}
            count={totalPages}
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={onChange}
          />
        </Stack>
        <div className="flex items-center space-x-2 ml-3">
          <p className="font-medium text-[16px]"
            style={{
              color: textColor,
            }}
          >
            {"หน้า"}
          </p>
          <TextBox
            id="input-page"
            label=""
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100px',
            }}
            value={pageInput}
            onKeyPress={handlePageInputKeyDown}
            onChange={handlePageInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;