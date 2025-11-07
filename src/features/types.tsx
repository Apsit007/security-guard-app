import { Map as LeafletMap } from 'leaflet';
import type { LatLngExpression } from 'leaflet';

export interface MapConfig {
  mapId: string
  center: {
    lat: number
    lng: number
  }
  zoom: number
  panControl?: boolean
  zoomControl?: boolean
  mapTypeControl?: boolean
  streetViewControl?: boolean
  fullscreenControl?: boolean
}

export interface MapProps {
  height?: string
  width?: string
  panControl?: boolean
  zoomControl?: boolean
  mapTypeControl?: boolean
  streetViewControl?: boolean
  fullscreenControl?: boolean
  currentLocation?: boolean
  onMapLoad?: (mapInstance: LeafletMap | null) => void
}

export interface SearchResult {
  name: string
  location: LatLngExpression
  placeId?: string
}

export interface OperationPlace {
  id: number
  name: string
  address: string
  lat: string
  lon: string
  worker: number
  leave:number
  eventType: number
}

export interface Event {
  id: number
  name: string
  address: string
  lat: string
  lon: string
  eventType: number
  eventDateTime: string
  eventDetail: string
}

export interface Worker {
  id: number
  workerId: string
  nationId: string
  prefix: string
  firstName: string
  lastName: string
  position: string
  mobile: string
  socialSecurity: string
  associate: string
  workerStatus: string
  workingExperience: string
  patrolId: number
  salaryType: string
  salary: number
  sex: string
  age: number
  remark: string
  imageUrl?: string
}

export interface Patrol {
  id: number
  name: string
  detail: string
}

export interface Workplace {
  id: number
  patrolId: number
  patrolName: string
  workplaceId: string
  name: string
  address: string
  detail: string
  latitude: number
  longitude: number
  contractStartDate: string
  contractEndDate: string
  status: number
  workSchedule: DayInfo[]
}

export interface WorkplaceStatus {
  id: number
  name: string
}

export interface DayInfo {
  date: string;
  morning?: number;
  night?: number;
  waitApprove?: boolean;
  rejected?: boolean;
  problem?: boolean;
  rejectedDetail?: string;
  approved?: boolean;
  morningWorker?: ScheduleWorker[];
  nightWorker?: ScheduleWorker[];
}

export interface ScheduleWorker {
  id: number;
  prefix: string;
  firstName: string;
  lastName: string;
  startTime: string;
  endTime: string;
  note: string;
  totalHours: number;
}

export interface Leave {
  id: number;
  name: string;
  name_th: string;
  number: number;
}

export interface LeaveDetail {
  id: number;
  name: string;
  name_th: string;
  totalDay: number;
  totalHour: number;
}

export interface SummaryWork {
  totalWork: number;
  totalLeftAndSuspended: number;
  totalAbsence: number;
  totalLateAndEarly: number;
  leaveList: Leave[];
}

export interface WorkSummaryReport {
  id: number;
  workerId: string;
  firstName: string;
  lastName: string;
  position: string;
  positionId: number;
  statusId: number;
  status: string;
  sexId: number;
  age: number;
  totalWorkDay: number;
  totalWorkHour: number;
  totalLeaveDay: number;
  totalLeaveHour: number;
  totalAbsenceDay: number;
  totalAbsenceHour: number;
  totalEarlyLateDay: number;
  totalEarlyLateHour: number;
}

export interface WorkSummaryDetail {
  id: number;
  workDate: string;
  workPlace: string;
  patrolId: number;
  patrolName: string;
  startTimePlan: string;
  endTimePlan: string;
  startTimeReal: string;
  endTimeReal: string;
  totalHours: number;
}

export interface WorkSummaryReportDetail {
  id: number;
  workerId: string;
  image: string;
  prefixId: number;
  prefix: string;
  firstName: string;
  lastName: string;
  position: string;
  positionId: number;
  statusId: number;
  status: string;
  sexId: number;
  age: number;
  totalWorkDay: number;
  totalWorkHour: number;
  totalAbsenceDay: number;
  totalAbsenceHour: number;
  totalLateDay: number;
  totalLateHour: number;
  startDateTime: string;
  endDateTime: string;
  leaveList: LeaveDetail[];
  workList: WorkSummaryDetail[];
}

export interface File {
  id?: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData: string;
}

export interface LeaveType {
  id: number;
  name: string;
  name_th: string;
  color: string;
}

export interface LeaveSummaryReport {
  id: number;
  workerId: string;
  image: string;
  prefixId: number;
  prefix: string;
  firstName: string;
  lastName: string;
  position: string;
  positionId: number;
  patrol: string;
  patrolId: number;
  leaveTypeId: number;
  sexId: number;
  age: number;
  leaveId: number;
  leaveDateTimeStart: string;
  leaveDateTimeEnd: string;
  leaveDateStart: string;
  leaveDateEnd: string;
  leaveHours: number;
  leaveDays: number;
  recorder: string;
  recordDateTime: string;
  approver: string;
  approveDateTime: string;
  totalWorkDay: number;
  totalWorkHour: number;
  totalAbsenceDay: number;
  totalAbsenceHour: number;
  totalLateDay: number;
  totalLateHour: number;
  startDateTime: string;
  endDateTime: string;
  leaveDetail: string;
  leaveList: LeaveDetail[];
  fileList: File[];
}

export interface AbsenceSummaryReport {
  id: number;
  workerId: string;
  prefixId: number;
  prefix: string;
  firstName: string;
  lastName: string;
  patrol: string;
  patrolId: number;
  sexId: number;
  age: number;
  placeId: string;
  place: string;
  absenceDate: string;
  stateWorkingDateTime: string;
  endWorkingDateTime: string;
}

export interface EarlyLateSummaryReport {
  id: number;
  workerId: string;
  prefixId: number;
  prefix: string;
  firstName: string;
  lastName: string;
  patrol: string;
  patrolId: number;
  sexId: number;
  age: number;
  placeId: string;
  place: string;
  earlyLateDate: string;
  earlyLateStartTime: string;
  earlyLateEndTime: string;
  totalEarlyLateTime: number;
  stateWorkingDateTime: string;
  endWorkingDateTime: string;
}

export interface TotalEvent {
  id: number
  name: string
  eventType: number
  number: number
}

export interface TotalPatrol {
  id: number
  patrolId: number
  patrolName: string
  number: number
}

export interface SummaryEvent {
  totalEvent: number;
  totalPatrol: number;
  eventList: TotalEvent[];
  patrolList: TotalPatrol[];
}

export interface EventDetailData {
  id: number;
  eventType: number;
  patrol: string;
  patrolId: number;
  placeId: string;
  place: string;
  eventDateTime: string;
  recorder: string;
  recordDateTime: string;
  recorderPosition: string;
  recorderPositionId: number;
  editor: string;
  editDateTime: string;
  latitude: number | null;
  longitude: number | null;
  eventDetail: string;
  eventName: string;
  eventAddress: string
  imageList: File[];
}