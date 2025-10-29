import React, { useCallback, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";

// Material UI
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// Components
import HeaderName from '../../components/header-name/HeaderName';
import { Icon } from '../../components/icons/Icon';
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import DatePickerBuddhist from "../../components/date-picker-buddhist/DatePickerBuddhist";
import Image from '../../components/image/Image';

// Icons
import centerIcon from "../../assets/icons/center.png";
import SaveIcon from "../../assets/icons/save.png";
import { Download } from "lucide-react";
import ClearIcon from '@mui/icons-material/Clear';

// Utils
import { calculateTotalYear, formatNumberToFixed } from "../../utils/commonFunctions";

interface FormData {
  prefixId: number
  firstName: string
  lastName: string
  sexId: number
  nationId: string
  dob: string
  raceId: number
  nationalityId: number
  mobile: string
  email: string
  image: string
  status: number
  address: string
  route: string
  provinceId: number
  subDistrictId: number
  districtId: number
  zipcode: string
  contactAddress: string
  contactRoute: string
  contactProvinceId: number
  contactSubDistrictId: number
  contactDistrictId: number
  contactZipCode: string
  educationLevelId: number
  educationDetail: string
  contactPerson: string
  contactRelationId: number
  contactMobile: string
  workerId: string
  positionId: number
  workerStatusId: number
  startWorkingDate: string
  endWorkingDate: string
  salaryType: number
  salary: number
  socialSecurityId: number
  associate: number
  providentFundId: number
  recorder: string
  recordDateTime: string
  editor: string
  editorDateTime: string
};

type ManageWorkerProps = {}

const ManageWorker: React.FC<ManageWorkerProps> = ({}) => {
  const navigate = useNavigate();

  // Data
  const [formData, setFormData] = React.useState<FormData>({
    prefixId: 0,
    firstName: "",
    lastName: "",
    sexId: 0,
    nationId: "",
    dob: "",
    raceId: 0,
    nationalityId: 0,
    mobile: "",
    email: "",
    image: "",
    status: 0,
    address: "",
    route: "",
    provinceId: 0,
    subDistrictId: 0,
    districtId: 0,
    zipcode: "",
    contactAddress: "",
    contactRoute: "",
    contactProvinceId: 0,
    contactSubDistrictId: 0,
    contactDistrictId: 0,
    contactZipCode: "",
    educationLevelId: 0,
    educationDetail: "",
    contactPerson: "",
    contactRelationId: 0,
    contactMobile: "",
    workerId: "",
    positionId: 0,
    workerStatusId: 0,
    startWorkingDate: "",
    endWorkingDate: "",
    salaryType: 0,
    salary: 0,
    socialSecurityId: 0,
    associate: 0,
    providentFundId: 0,
    recorder: "",
    recordDateTime: "",
    editor: "",
    editorDateTime: "",
  })

  // Options
  const [prefixOptions, setPrefixOptions] = useState<{ label: string ,value: number }[]>([]);
  const [sexOptions, setSexOptions] = useState<{ label: string ,value: number }[]>([]);
  const [raceOptions, setRaceOptions] = useState<{ label: string ,value: number }[]>([]);
  const [nationalityOptions, setNationalityOptions] = useState<{ label: string ,value: number }[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<{ label: string ,value: number }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string ,value: number }[]>([]);
  const [subDistrictOptions, setsubDistrictOptions] = useState<{ label: string ,value: number }[]>([]);
  const [educationLevelOptions, setEducationLevelOptions] = useState<{ label: string ,value: number }[]>([]);
  const [contactRelationOptions, setContactRelationOptions] = useState<{ label: string ,value: number }[]>([]);
  const [positionOptions, setPositionOptions] = useState<{ label: string ,value: number }[]>([]);
  const [workerStatusOptions, setWorkerStatusOptions] = useState<{ label: string ,value: number }[]>([]);
  const [salaryTypeOptions, setSalaryTypeOptions] = useState<{ label: string ,value: number }[]>([]);
  const [socialSecurityOptions, setSocialSecurityOptions] = useState<{ label: string ,value: number }[]>([]);
  const [providentFundOptions, setProvidentFundOptions] = useState<{ label: string ,value: number }[]>([]);

  const {
    control,
  } = useForm();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

  }

  const handleDeleteImage = useCallback(async (url: string) => {

  }, [])

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("prefixId", value.value);
    }
    else {
      handleDropdownChange("prefixId", '');
    }
  };

  const handleSexChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("sexId", value.value);
    }
    else {
      handleDropdownChange("sexId", '');
    }
  };

  const handleRaceChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("raceId", value.value);
    }
    else {
      handleDropdownChange("raceId", '');
    }
  };

  const handleNationalityChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("nationalityId", value.value);
    }
    else {
      handleDropdownChange("nationalityId", '');
    }
  };

  const handleStatusChange = (status: number) => {
    setFormData((prevState) => ({
      ...prevState,
      status: status,
    }));
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

  const handleEducationLevelChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("educationLevelId", value.value);
    }
    else {
      handleDropdownChange("educationLevelId", '');
    }
  };

  const handleContactRelationChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("contactRelationId", value.value);
    }
    else {
      handleDropdownChange("contactRelationId", '');
    }
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

  const handleWorkerStatusChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("workerStatusId", value.value);
    }
    else {
      handleDropdownChange("workerStatusId", '');
    }
  };

  const handleSalaryTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("salaryType", value.value);
    }
    else {
      handleDropdownChange("salaryType", '');
    }
  };

  const handleSocialSecurityChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("socialSecurityId", value.value);
    }
    else {
      handleDropdownChange("socialSecurityId", '');
    }
  };

  const handleProvidentFundChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("providentFundId", value.value);
    }
    else {
      handleDropdownChange("providentFundId", '');
    }
  };

  const goToWorkerInfo = () => {
    navigate(`/worker-info`, { state: { allowed: true } });
  }

  return (
    <section id='manage-worker' className='flex flex-col px-1 gap-2 h-full'>
      <div className='flex justify-between items-center'>
        <HeaderName 
          header={"ข้อมูลผู้ปฏิบัติงาน"}
          breadcrumbPaths={"จัดการข้อมูล"}
        />
        <div className="flex gap-2 items-center">
          <img src={centerIcon} alt="Center Icon" className="w-6 h-6" />
          <Typography variant='h5' color={"#133462"} sx={{ fontWeight: 500, fontSize: "18px" }}>{"Center"}</Typography>
        </div>
      </div>
      <div className='grid grid-cols-[60%_auto] h-full overflow-y-auto'>
        {/* Worker Detail */}
        <div className='flex-1 flex flex-col bg-[#0D3063] h-full px-4 py-4 gap-2'>
          <label className='font-semibold text-[18px] text-white'>รายละเอียดผู้ปฏิบัติงาน</label>

          <div className='grid grid-cols-7 gap-3'>
            {/* Image */}
            <div className='flex justify-center items-center col-span-2 row-span-4 p-2'>
              <div className='relative flex items-center justify-center w-[250px] h-[250px] bg-[#48494B] cursor-pointer overflow-hidden hover:bg-gray-800 rounded-full border-[5px] border-white'>
                {
                  formData.image ? (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Image src={`${formData.image}`} alt="User Image" className="object-fill w-[200px] h-full" textColor='#FFFFFF' />
                    </div>
                  ) :
                  (
                    /* No Images */
                    <div className="flex flex-col justify-center items-center">
                      <Icon icon={Download} size={80} color="white" />
                      <span className="text-[18px] text-white mt-[20px]">
                        {"อัพโหลดรูปภาพ"}
                      </span>
                    </div>
                  )
                }
                {/* Hidden File Input */}
                <input
                  id="image-upload"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Row 1 */}
            <div className='-ml-[10px]'>
              <AutoComplete 
                id="prefix-select"
                sx={{ marginTop: "10px"}}
                value={formData.prefixId}
                onChange={handlePrefixChange}
                options={prefixOptions}
                label="คำนำหน้า"
                placeholder="เลือกคำนำหน้า"
                labelFontSize="14px"
                required={true}
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="first-name"
                label={"ชื่อ"}
                placeholder={""}
                value={formData.firstName}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("firstName", event.target.value)
                }
                required={true}
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="last-name"
                label={"นามสกุล"}
                placeholder={""}
                value={formData.lastName}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("lastName", event.target.value)
                }
                required={true}
                labelColor='white'
              />
            </div>

            {/* Row 2 */}
            <div className='-ml-[10px]'>
              <AutoComplete 
                id="sex-select"
                sx={{ marginTop: "10px"}}
                value={formData.sexId}
                onChange={handleSexChange}
                options={sexOptions}
                label="เพศ"
                placeholder="เลือกเพศ"
                labelFontSize="14px"
                required={true}
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="nation-id"
                label={"เลขที่บัตรประชาชน"}
                placeholder={""}
                value={formData.nationId}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("nationId", event.target.value)
                }
                required={true}
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <div className='grid grid-cols-[60%_auto] gap-2'>
                <div className='flex flex-col'>
                  <p className='text-[14px] text-white mb-[13px]'>วันเกิด<span className="text-red-500"> *</span></p>
                  <DatePickerBuddhist 
                    value={formData.dob ? dayjs(formData.dob) : null} 
                    onChange={() => {}} 
                    fontSize={"14px"} 
                    maxDate={dayjs()}
                    height='40px'
                  />
                </div>

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="age"
                  label={"อายุ"}
                  placeholder={""}
                  value={"1"}
                  labelFontSize="14px"
                  required={true}
                  disabled={true}
                  labelColor='white'
                  textAlign='right'
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className='-ml-[10px]'>
              <AutoComplete 
                id="race-select"
                sx={{ marginTop: "10px"}}
                value={formData.raceId}
                onChange={handleRaceChange}
                options={raceOptions}
                label="เชื้อชาติ"
                placeholder="เลือกเชื้อชาติ"
                labelFontSize="14px"
                required={true}
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <div className='grid grid-cols-[40%_auto] gap-2'>
                <AutoComplete 
                  id="nationality-select"
                  sx={{ marginTop: "10px"}}
                  value={formData.nationalityId}
                  onChange={handleNationalityChange}
                  options={nationalityOptions}
                  label="สัญชาติ"
                  placeholder="เลือกสัญชาติ"
                  labelFontSize="14px"
                  required={true}
                  labelColor='white'
                />

                <TextBox
                  sx={{ marginTop: "10px" }}
                  id="mobile"
                  label={"เบอร์โทร"}
                  placeholder={""}
                  value={formData.mobile}
                  labelFontSize="14px"
                  required={true}
                  labelColor='white'
                />
              </div>
            </div>

            <div className='col-span-2'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="email"
                label={"Email"}
                placeholder={""}
                value={formData.email}
                labelFontSize="14px"
                required={true}
                labelColor='white'
              />
            </div>

            <div className='flex items-center justify-start'>
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

          {/* Address */}
          <div className='grid grid-cols-4 gap-3'>
            <label className='font-semibold text-[14px] text-white'>ที่อยู่ตามทะเบียนบ้าน</label>

            <div className='col-start-1 col-span-2'>
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
                labelColor='white'
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
                labelColor='white'
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
              required={true}
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
              required={true}
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
          </div>

          {/* Contact Address */}
          <div className='grid grid-cols-4 gap-3 mt-2'>
            <div className='col-span-2 flex items-center gap-10'>
              <label className='font-semibold text-[14px] text-white'>ที่อยู่ที่สามารถติดต่อได้</label>
          
              <div className='flex items-center justify-start'>
                <FormGroup>
                  <Controller
                    name="sameAddress"
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
                        label="ที่อยู่เดียวกับที่อยู่ตามทะเบียนบ้าน"
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

            <div className='col-start-1 col-span-2'>
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
                labelColor='white'
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
                labelColor='white'
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
              required={true}
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
              required={true}
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
          </div>

          {/* Other */}
          <div className='grid grid-cols-4 gap-3'>
            <AutoComplete 
              id="education-level-select"
              sx={{ marginTop: "10px"}}
              value={formData.educationLevelId}
              onChange={handleEducationLevelChange}
              options={educationLevelOptions}
              label="วุฒิการศึกษา"
              placeholder="เลือกวุฒิการศึกษา"
              labelFontSize="14px"
              labelColor='white'
            />

            <div className='col-span-3'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="education-detail"
                label={"รายละเอียดการศึกษา"}
                placeholder={""}
                value={formData.educationDetail}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("educationDetail", event.target.value)
                }
                labelColor='white'
              />
            </div>

            <div className='col-span-2'>
              <TextBox
                sx={{ marginTop: "10px" }}
                id="contact-person"
                label={"ชื่อผู้ที่ติดต่อได้"}
                placeholder={""}
                value={formData.contactPerson}
                labelFontSize="14px"
                onChange={(event) =>
                  handleTextChange("contactPerson", event.target.value)
                }
                required={true}
                labelColor='white'
              />
            </div>

            <AutoComplete 
              id="contact-relation-select"
              sx={{ marginTop: "10px"}}
              value={formData.contactRelationId}
              onChange={handleContactRelationChange}
              options={contactRelationOptions}
              label="ความสัมพันธ์"
              placeholder="เลือกความสัมพันธ์"
              required={true}
              labelFontSize="14px"
              labelColor='white'
            />

            <TextBox
              sx={{ marginTop: "10px" }}
              id="contact-mobile"
              label={"เบอร์โทรผู้ที่ติดต่อได้"}
              placeholder={""}
              value={formData.contactMobile}
              labelFontSize="14px"
              onChange={(event) =>
                handleTextChange("contactMobile", event.target.value)
              }
              required={true}
              labelColor='white'
            />
          </div>
        </div>

        {/* Working Detail */}
        <div className='flex-1 flex flex-col bg-[#FFFFFF] h-full px-4 py-4 gap-2'>
          <label className='font-semibold text-[18px] text-[#124692]'>รายละเอียดการทำงาน</label>

          <div className='grid grid-cols-3 gap-3'>
            <TextBox
              sx={{ marginTop: "10px" }}
              id="worker-id"
              label={"รหัสพนักงาน"}
              placeholder={""}
              value={formData.workerId}
              labelFontSize="14px"
              onChange={(event) =>
                handleTextChange("workerId", event.target.value)
              }
              disabled={true}
              labelColor='#010602'
            />

            <div className='col-span-2'>
              <AutoComplete 
                id="position-select"
                sx={{ marginTop: "10px"}}
                value={formData.positionId}
                onChange={handlePositionChange}
                options={positionOptions}
                label="ตำแหน่ง"
                placeholder="เลือกตำแหน่ง"
                labelFontSize="14px"
                required={true}
                labelColor='#010602'
              />
            </div>

            <AutoComplete 
              id="worker-status-select"
              sx={{ marginTop: "10px"}}
              value={formData.workerStatusId}
              onChange={handleWorkerStatusChange}
              options={workerStatusOptions}
              label="สถานะพนักงาน"
              placeholder="เลือกสถานะพนักงาน"
              labelFontSize="14px"
              required={true}
              labelColor='#010602'
            />

            <div className='flex flex-col col-start-1'>
              <p className='text-[14px] text-[#010602] mb-[13px]'>วันที่เริ่มต้นทำงาน<span className="text-red-500"> *</span></p>
              <DatePickerBuddhist 
                value={formData.startWorkingDate ? dayjs(formData.startWorkingDate) : null} 
                onChange={() => {}} 
                fontSize={"14px"} 
                maxDate={dayjs()}
                height='40px'
              />
            </div>

            <div className='flex flex-col'>
              <p className='text-[14px] text-[#010602] mb-[13px]'>วันที่พ้นสภาพ</p>
              <DatePickerBuddhist 
                value={formData.endWorkingDate ? dayjs(formData.endWorkingDate) : null} 
                onChange={() => {}} 
                fontSize={"14px"} 
                height='40px'
              />
            </div>

            <TextBox
              sx={{ marginTop: "10px" }}
              id="working-experience"
              label={"อายุงาน"}
              placeholder={""}
              value={calculateTotalYear(formData.startWorkingDate)}
              labelFontSize="14px"
              required={true}
              labelColor='#010602'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <AutoComplete 
              id="salary-type-select"
              sx={{ marginTop: "10px"}}
              value={formData.salaryType}
              onChange={handleSalaryTypeChange}
              options={salaryTypeOptions}
              label="ประเภทค่าจ้าง"
              placeholder="เลือกประเภทค่าจ้าง"
              labelFontSize="14px"
              required={true}
              labelColor='#010602'
            />

            <TextBox
              sx={{ marginTop: "10px" }}
              id="salary"
              label={"เงินค่าจ้าง"}
              placeholder={""}
              value={formatNumberToFixed(formData.salary, 2)}
              labelFontSize="14px"
              required={true}
              labelColor='#010602'
              textAlign='right'
            />

            <AutoComplete 
              id="salary-type-select"
              sx={{ marginTop: "10px"}}
              value={formData.socialSecurityId}
              onChange={handleSocialSecurityChange}
              options={socialSecurityOptions}
              label="ประกันสังคม"
              placeholder="เลือกประกันสังคม"
              labelFontSize="14px"
              labelColor='#010602'
            />

            <TextBox
              sx={{ marginTop: "10px" }}
              id="associate"
              label={"% หักสมทบ "}
              placeholder={""}
              value={formatNumberToFixed(formData.salary, 2)}
              labelFontSize="14px"
              labelColor='#010602'
              textAlign='right'
            />

            <AutoComplete 
              id="provident-fund-select"
              sx={{ marginTop: "10px"}}
              value={formData.providentFundId}
              onChange={handleProvidentFundChange}
              options={providentFundOptions}
              label="กองทุนสำรองเลี้ยงชีพ"
              placeholder="เลือกกองทุนสำรองเลี้ยงชีพ"
              labelFontSize="14px"
              required={true}
              labelColor='#010602'
            />
          </div>

          <Divider sx={{ borderColor: "#1A486C", my: "30px" }} />

          <label className='font-semibold text-[18px] text-[#124692]'>รายละเอียดการทำงาน</label>

          <div className='grid grid-cols-3 gap-3'>
            <div className='col-span-2'>
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
            </div>

            <div className='flex flex-col'>
              <p className='text-[14px] text-[#010602] mb-[13px]'>วันที่บันทึกข้อมูล</p>
              <DatePickerBuddhist 
                value={formData.recordDateTime ? dayjs(formData.recordDateTime) : null} 
                onChange={() => {}} 
                fontSize={"14px"} 
                height='40px'
                disabled={true}
                isWithTime={true}
              />
            </div>

            <div className='col-span-2'>
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
            </div>

            <div className='flex flex-col'>
              <p className='text-[14px] text-[#010602] mb-[13px]'>วันที่แก้ไขข้อมูล</p>
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
              onClick={goToWorkerInfo}
            >
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManageWorker;