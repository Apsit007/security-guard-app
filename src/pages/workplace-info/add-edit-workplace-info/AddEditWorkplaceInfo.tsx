import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import dayjs from 'dayjs';

// Material UI
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Components
import AutoComplete from '../../../components/auto-complete/AutoComplete';
import TextBox from '../../../components/text-box/TextBox';
import BaseMap from '../../../components/base-map/BaseMap';
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist";

// Icons
import { CircleX } from "lucide-react";
import { Icon } from '../../../components/icons/Icon';
import SaveIcon from "../../../assets/icons/save.png";
import ClearIcon from '@mui/icons-material/Clear';

// Hooks
import { useMapSearch } from "../../../hooks/useOpenStreetMapSearch";

interface FormData {
  workplaceId: string
  name: string
  address: string
  route: string
  provinceId: number
  districtId: number
  subDistrictId: number
  zipcode: string
  detail: string
  active: boolean
  location: string
  patrolId: number
  workplaceStatus: number
  contractStartDate: string
  contractEndDate: string
  recorder: string
  recordDateTime: string
  editor: string
  editorDateTime: string
}

type AddEditWorkplaceInfoProps = {
  open: boolean
  onClose: () => void
}

const AddEditWorkplaceInfo: React.FC<AddEditWorkplaceInfoProps> = ({ open, onClose }) => {
  // Data
  const [formData, setFormData] = React.useState<FormData>({
    workplaceId: "",
    name: "",
    address: "",
    route: "",
    provinceId: 0,
    districtId: 0,
    subDistrictId: 0,
    zipcode: "",
    detail: "",
    active: true,
    location: "",
    patrolId: 0,
    workplaceStatus: 0,
    contractStartDate: "",
    contractEndDate: "",
    recorder: "",
    recordDateTime: "",
    editor: "",
    editorDateTime: "",
  })
  const [map, setMap] = useState<LeafletMap | null>(null);

  // Options
  const [provinceOptions, setProvinceOptions] = useState<{ label: string ,value: number }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string ,value: number }[]>([]);
  const [subDistrictOptions, setsubDistrictOptions] = useState<{ label: string ,value: number }[]>([]);
  const [patrolOptions, setPatrolOptions] = useState<{ label: string ,value: number }[]>([]);
  const [workplaceStatusOptions, setWorkplaceStatusOptions] = useState<{ label: string ,value: number }[]>([]);
  
  const {
    control,
  } = useForm();

  const {
    searchPlace,
    searchResults,
    isSearching,
  } = useMapSearch(map, true);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const latLng = L.latLng(searchResults[0].location);
      const lat = latLng.lat.toFixed(5);
      const lng = latLng.lng.toFixed(5);

      setFormData(prev => ({
        ...prev,
        location: searchResults ? `${lat}, ${lng}` : ""
      }))
    }
    
  }, [searchResults])

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        searchPlace(formData.location)
      }
    },
    [formData.location, searchPlace]
  )

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    if (key === "location") {
      setFormData((prev) => ({
        ...prev,
        location: value,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMapLoad = useCallback((mapInstance: LeafletMap | null) => {
    setMap(mapInstance);
  }, []);

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

  const handleWorkplaceStatusChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("workplaceStatus", value.value);
    }
    else {
      handleDropdownChange("workplaceStatus", '');
    }
  };

  const handleDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("districtId", value.value);
    }
    else {
      handleDropdownChange("districtId", '');
    }
  };

  const handleSubDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("subDistrictId", value.value);
    }
    else {
      handleDropdownChange("subDistrictId", '');
    }
  };

  const handleStatusChange = (status: number) => {
    setFormData((prevState) => ({
      ...prevState,
      active: status === 1 ? true : false,
    }));
  };

  console.log("isSearching", isSearching)
  
  return (
    <Dialog id='add-edit-workplace-info' open={open} maxWidth="xl" fullWidth>
      <DialogTitle className='bg-[#F3F3FA]'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <Typography variant="h5" color={"#0D3063"} sx={{ fontWeight: 600, fontSize: "28px" }}>{"ข้อมูลสถานที่ปฏิบัติงาน"}</Typography>
          <div className='flex justify-center items-start'>
            <button type='button' onClick={onClose}>
              <Icon icon={CircleX} size={25} color="#1A486C" />
            </button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className='bg-[#F3F3FA]'>
        <form>
          <div className='grid grid-cols-[75%_auto] rounded-[10px]' style={{
                boxShadow: "-2px 2px 2px rgba(0,0,0,0.2)",
              }}>
            {/* Workplace Info */}
            <div className='flex-1 flex flex-col bg-[#0D3063] h-full px-4 py-4 gap-2 rounded-s-[10px]'>
              <label className='font-semibold text-[18px] text-white'>สถานที่ปฏิบัติงาน</label>

              <div className='grid grid-cols-5 grid-rows-[repeat(5,1fr)_40px_1fr] gap-3'>
                <div className='flex col-span-2 row-span-6 relative h-full w-full'>
                  {/* Map */}
                  {
                    isSearching && (
                      <div>
                        <div className='flex absolute justify-center items-center w-full h-full z-[50]'
                          style={{
                            backgroundColor: "rgba(18, 70, 146, 0.5)"
                          }}
                        >
                          <p className='text-[#FFFFFF]'>กำลังค้นหา...</p>
                        </div>
                      </div>
                    )
                  }
                  <BaseMap 
                    onMapLoad={handleMapLoad}
                    zoomControl={true}
                    currentLocation={true}
                  />
                </div>

                <div className='col-span-3 flex gap-3'>
                  <div className='w-[25%]'>
                    <TextBox
                      sx={{ marginTop: "10px" }}
                      id="workplace-id"
                      label={"รหัสสถานที่"}
                      placeholder={""}
                      value={formData.workplaceId}
                      labelFontSize="14px"
                      onChange={(event) =>
                        handleTextChange("workplaceId", event.target.value)
                      }
                      disabled={true}
                      labelColor='#FFFFFF'
                    />
                  </div>
                  <TextBox
                    sx={{ marginTop: "10px" }}
                    id="workplace-name"
                    label={"ชื่อสถานที่ปฏิบัติงาน"}
                    placeholder={""}
                    value={formData.name}
                    labelFontSize="14px"
                    onChange={(event) =>
                      handleTextChange("name", event.target.value)
                    }
                    required={true}
                    labelColor='#FFFFFF'
                  />
                </div>

                <div className='col-span-3'>
                  <TextBox
                    sx={{ marginTop: "10px" }}
                    id="address"
                    label={"ที่อยู่"}
                    placeholder={""}
                    value={formData.address}
                    labelFontSize="14px"
                    onChange={(event) =>
                      handleTextChange("address", event.target.value)
                    }
                    labelColor='#FFFFFF'
                  />
                </div>

                <div className='col-span-2'>
                  <TextBox
                    sx={{ marginTop: "10px" }}
                    id="route"
                    label={"ถนน"}
                    placeholder={""}
                    value={formData.route}
                    labelFontSize="14px"
                    onChange={(event) =>
                      handleTextChange("route", event.target.value)
                    }
                    labelColor='#FFFFFF'
                  />
                </div>

                <AutoComplete 
                  id="province-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.provinceId}
                  onChange={handleProvinceChange}
                  options={provinceOptions}
                  label="จังหวัด"
                  placeholder="เลือกจังหวัด"
                  labelFontSize="14px"
                  required={true}
                  labelColor='white'
                />

                <AutoComplete 
                  id="district-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.districtId}
                  onChange={handleDistrictChange}
                  options={districtOptions}
                  label="อำเภอ"
                  placeholder="เลือกอำเภอ"
                  labelFontSize="14px"
                  labelColor='white'
                />

                <AutoComplete 
                  id="district-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.subDistrictId}
                  onChange={handleSubDistrictChange}
                  options={subDistrictOptions}
                  label="ตำบล"
                  placeholder="เลือกตำบล"
                  labelFontSize="14px"
                  labelColor='white'
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="zipcode"
                  label={"รหัสไปรษณีย์"}
                  placeholder={""}
                  value={formData.zipcode}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("zipcode", event.target.value)
                  }
                  labelColor='white'
                />

                <div className='col-span-3 row-span-2'>
                  <TextBox
                    sx={{ marginTop: "10px" }}
                    id="detail"
                    label={"รายละเอียดสถานที่ปฏิบัติงาน"}
                    placeholder={""}
                    value={formData.detail}
                    labelFontSize="14px"
                    onChange={(event) =>
                      handleTextChange("detail", event.target.value)
                    }
                    isMultiline={true}
                    rows={4}
                    labelColor='white'
                  />
                </div>

                <div className='col-span-2'>
                  <TextBox
                    sx={{ marginTop: "10px" }}
                    id="location"
                    label={"Location"}
                    placeholder={""}
                    value={ formData.location }
                    labelFontSize="14px"
                    onChange={(event) =>
                      handleTextChange("location", event.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    labelColor='white'
                  />
                </div>

                <div className='flex items-center justify-start ml-[10px] mt-[25px]'>
                  <FormGroup>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={rest.name}
                              onBlur={rest.onBlur}
                              slotProps={{
                                input: {
                                  ref: rest.ref
                                }
                              }}
                              checked={value === 1}
                              onChange={(e) => {
                                const newVal = e.target.checked ? 1 : 0;
                                onChange(newVal);
                                handleStatusChange(newVal);
                              }}
                              sx={{
                                color: "#FFFFFF",
                                padding: "0 5px 0 0",
                                "&.Mui-checked": {
                                  color: "#FFFFFF",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 25
                                },
                              }}
                            />
                          }
                          label="Inactive"
                          sx={{
                            color: "#FFFFFF",
                            "& .MuiTypography-root": {
                              fontSize: "14px",
                            }
                          }}
                        />
                      )}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>

            {/* Workplace Detail */}
            <div className='flex-1 flex flex-col bg-[#FFFFFF] h-full px-4 py-4 gap-2 rounded-e-[10px]'>
              <label className='font-semibold text-[18px] text-[#124692]'>รายละเอียดสถานที่ปฏิบัติงาน</label>
            
              <div className='grid grid-cols-2 grid-rows-2 gap-3'>
                <AutoComplete 
                  id="patrol-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.patrolId}
                  onChange={handlePatrolChange}
                  options={patrolOptions}
                  label="สายตรวจ"
                  placeholder="เลือกสายตรวจ"
                  labelFontSize="14px"
                  required={true}
                  labelColor='#010813'
                />

                <AutoComplete 
                  id="workplace-status-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.workplaceStatus}
                  onChange={handleWorkplaceStatusChange}
                  options={workplaceStatusOptions}
                  label="สถานะสถานที่ปฏิบัติงาน"
                  placeholder="เลือกสถานะ"
                  labelFontSize="14px"
                  labelColor='#010813'
                />

                <div className='flex flex-col col-start-1'>
                  <p className='text-[14px] text-[#010813] mb-[15px]'>วันที่สัญญาเริ่มต้น</p>
                  <DatePickerBuddhist 
                    value={formData.contractStartDate ? dayjs(formData.contractStartDate) : null} 
                    onChange={() => {}} 
                    fontSize={"14px"} 
                    height='40px'
                  />
                </div>

                <div className='flex flex-col'>
                  <p className='text-[14px] text-[#010813] mb-[15px]'>วันที่สัญญาสิ้นสุด</p>
                  <DatePickerBuddhist 
                    value={formData.contractEndDate ? dayjs(formData.contractEndDate) : null} 
                    onChange={() => {}} 
                    fontSize={"14px"} 
                    height='40px'
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#1A486C", borderWidth: "1px", my: "20px" }} />

              {/* Record Detail */}
              <label className='font-semibold text-[18px] text-[#124692]'>รายละเอียดการบันทึก</label>
            
              <div className='grid grid-cols-2 grid-rows-2 gap-3'>
                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="recorder"
                  label={"ผู้บันทึกข้อมูล"}
                  placeholder={""}
                  value={formData.recorder}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("recorder", event.target.value)
                  }
                  disabled={true}
                  labelColor='#010602'
                />

                <div className='flex flex-col'>
                  <p className='text-[14px] text-[#010602] mb-[15px]'>วันที่บันทึกข้อมูล</p>
                  <DatePickerBuddhist 
                    value={formData.recordDateTime ? dayjs(formData.recordDateTime) : null} 
                    onChange={() => {}} 
                    fontSize={"14px"} 
                    height='40px'
                    disabled={true}
                    isWithTime={true}
                  />
                </div>

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="editor"
                  label={"ผู้แก้ไขข้อมูล"}
                  placeholder={""}
                  value={formData.editor}
                  labelFontSize="14px"
                  onChange={(event) =>
                    handleTextChange("editor", event.target.value)
                  }
                  disabled={true}
                  labelColor='#010602'
                />

                <div className='flex flex-col'>
                  <p className='text-[14px] text-[#010602] mb-[15px]'>วันที่แก้ไขข้อมูล</p>
                  <DatePickerBuddhist 
                    value={formData.editorDateTime ? dayjs(formData.editorDateTime) : null} 
                    onChange={() => {}} 
                    fontSize={"14px"} 
                    height='40px'
                    disabled={true}
                    isWithTime={true}
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#1A486C", borderWidth: "1px", my: "20px" }} />

              <div className='flex justify-end items-end h-full gap-3'>
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
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditWorkplaceInfo;