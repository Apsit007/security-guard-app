// Types
import type { LeaveType } from '../features/types';

export const LEAVE_TYPE: LeaveType[] = [
  { id: 1, name: "sick-leave", name_th: "ลาป่วย", color: "#7280B9" },
  { id: 2, name: "personal-leave", name_th: "ลากิจ", color: "#62999D" },
  { id: 3, name: "vacation-leave", name_th: "ลาพักร้อน", color: "#C16794" },
  { id: 4, name: "ordination-leave", name_th: "ลาบวช", color: "#F2A63A" },
  { id: 5, name: "maternity-leave", name_th: "ลาคลอดบุตร", color: "#F39090" },
  { id: 6, name: "military-leave", name_th: "ลาเกณฑ์ทหาร", color: "#5D6532" },
  { id: 7, name: "off-side-leave", name_th: "ลาปฏิบัติงานนอกสถานที่", color: "#56B1DB" },
  { id: 8, name: "annual-leave", name_th: "ลาพักผ่อน", color: "#E38773" },
  { id: 9, name: "training-leave", name_th: "ลาศึกษาอบรม", color: "#9F8E7F" },
  { id: 10, name: "other-leave", name_th: "ลาอื่นๆ", color: "#E7AE6C" },
]