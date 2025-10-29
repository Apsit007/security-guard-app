// Types
import type { SummaryWork } from "../features/types";

export const mockSummaryWork: SummaryWork = {
  totalWork: 120,
  totalLeftAndSuspended: 5,
  totalAbsence: 3,
  totalLateAndEarly: 5,
  leaveList: [
    {
      id: 1,
      name: "sick-leave",
      name_th: "ลาป่วย",
      number: 10,
    },
    {
      id: 2,
      name: "personal-leave",
      name_th: "ลากิจ",
      number: 1,
    },
    {
      id: 3,
      name: "vacation-leave",
      name_th: "ลาพักร้อน",
      number: 2,
    },
    {
      id: 4,
      name: "ordination-leave",
      name_th: "ลาบวช",
      number: 3,
    },
    {
      id: 5,
      name: "maternity-leave",
      name_th: "ลาคลอด",
      number: 4,
    },
    {
      id: 6,
      name: "military-leave",
      name_th: "ลาเกณฑ์ทหาร",
      number: 4,
    },
  ]
}