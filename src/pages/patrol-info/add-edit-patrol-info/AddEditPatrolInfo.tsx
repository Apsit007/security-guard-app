import React from 'react';

// Material UI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// Components
import TextBox from '../../../components/text-box/TextBox';

// Icons
import { CircleX } from "lucide-react";
import { Icon } from '../../../components/icons/Icon';
import SaveIcon from "../../../assets/icons/save.png";
import ClearIcon from '@mui/icons-material/Clear';

interface FormData {
  name: string
  detail: string
}

type AddEditPatrolInfoProps = {
  open: boolean
  onClose: () => void
}

const AddEditPatrolInfo: React.FC<AddEditPatrolInfoProps> = ({ open, onClose }) => {
  // Data
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    detail: "",
  })
  
  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  
  return (
    <Dialog id='add-edit-patrol-info' open={open} maxWidth="md" fullWidth>
      <DialogTitle className='bg-white'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#0D3063"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"ข้อมูลสายตรวจ"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-white'>
        <form>
          <Divider sx={{ borderColor: "#FFC300", borderWidth: "2px" }} />

          <div className='flex flex-col gap-2 py-4'>
            <div className='w-[80%]'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="patrol-name"
                label={"ชื่อสายตรวจ"}
                placeholder={""}
                value={formData.name}
                labelFontSize="16px"
                onChange={(event) =>
                  handleTextChange("name", event.target.value)
                }
                labelColor='#010602'
              />
            </div>

            <TextBox
              sx={{ marginTop: "10px" }}
              id="detail"
              label={"รายละเอียด"}
              placeholder={""}
              value={formData.detail}
              labelFontSize="16px"
              onChange={(event) =>
                handleTextChange("detail", event.target.value)
              }
              labelColor='#010602'
              isMultiline={true}
              rows={5}
            />
          </div>

          <div className='flex justify-end items-end h-full gap-3'>
            <Button
              variant="contained"
              className="save-btn"
              sx={{ 
                width: "110px", 
                height: "40px",
                fontSize: "16px",
                borderRadius: "5px"
              }}
              size='large'
              startIcon={
                <img src={SaveIcon} alt="Save Icon" className='flex justify-center items-center w-[20px] h-[20px]' />
              }
            >
              บันทึก
            </Button>

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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditPatrolInfo;