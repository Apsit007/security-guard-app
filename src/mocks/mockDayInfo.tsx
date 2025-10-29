// Types
import type { DayInfo } from "../features/types";

export const mockDayInfo: DayInfo[] = [
  { date: "2025-10-17", morning: 4, night: 2 },
  { date: "2025-10-12", morning: 6, night: 4 },
  { date: "2025-10-10", morning: 7, night: 5 },
  { date: "2025-10-15", morning: 5, night: 6 },
  { date: "2025-10-04", waitApprove: true },
  { date: "2025-10-02", rejected: true },
]