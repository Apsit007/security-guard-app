// Types
import type { SummaryEvent } from "../features/types";

export const mockSummaryEvent: SummaryEvent = {
  totalEvent: 5,
  totalPatrol: 3,
  eventList: [
    { id: 1, name: "ทะเลาะวิวาทภายในครอบครัว", eventType: 1, number: 2},
    { id: 2, name: "พายุฤดูร้อน", eventType: 2, number: 5},
    { id: 3, name: "ลักทรัพย์เวลากลางคืน", eventType: 3, number: 9},
    { id: 4, name: "พ่นสีกำแพงหมู่บ้าน", eventType: 9, number: 10},
    { id: 5, name: "ไฟไหม้กองขยะลามเป็นบริเวณกว้าง", eventType: 4, number: 2},
  ],
  patrolList: [
    { id: 1, patrolId: 1, patrolName: "2A", number: 4 },
    { id: 2, patrolId: 2, patrolName: "1A", number: 3 },
    { id: 3, patrolId: 3, patrolName: "1A_VIP", number: 2 },
    { id: 4, patrolId: 4, patrolName: "2B", number: 2 },
    { id: 5, patrolId: 5, patrolName: "1B_Private", number: 1 }
  ]
};