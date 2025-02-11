import type { Types } from "mongoose"

export interface User {
  _id: Types.ObjectId | string
  username: string
  role: "default" | "staff1" | "staff2" | "admin"
}

export interface Payment {
  _id?: Types.ObjectId | string
  amount: number
  date: string
  updatedBy: User | Types.ObjectId | string
}

export interface Loan {
  _id: Types.ObjectId | string
  customerName: string
  amount: number
  remainingAmount: number
  paymentAmount?: number
  status: "pending" | "approved" | "rejected" | "partially_paid" | "paid"
  createdBy: User | Types.ObjectId | string
  updatedBy: User | Types.ObjectId | string
  payments: Payment[]
  createdAt?: Date
  updatedAt?: Date
}

