"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toaster } from "@/components/ui/toaster"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoanForm from "./loan";


interface Loan {
  _id: string
  customerName: string
  amount: number
  status: string
}

export default function Dashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const response = await axios.get<Loan[]>(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans`)
      setLoans(response.data)
    } catch (error) {
      toaster.create({
        description: error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans/${id}`)
      toaster.create({
        description: "Loan deleted successfully",
        type: "success",
      })
      fetchLoans()
    } catch (error) {
      toaster.create({
        description: error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      })
    }
  }

  const handleUpdate = async (loan: Loan) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans/${loan._id}`, loan)
      toaster.create({
        description: "Loan updated successfully",
        type: "success",
      })
      setEditingLoan(null)
      fetchLoans()
    } catch (error) {
      toaster.create({
        description: error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Loan Management System
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <LoanForm
                onLoanAdded={fetchLoans}
                editingLoan={editingLoan}
                onUpdate={handleUpdate}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr
                        key={loan._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {loan.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${loan.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              loan.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : loan.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : loan.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="flex-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2 py-1 transition-colors duration-200 flex items-center justify-center"
                              onClick={() => setEditingLoan(loan)}
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              <span>Edit</span>
                            </button>
                            <button
                              className="flex-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md px-2 py-1 transition-colors duration-200 flex items-center justify-center"
                              onClick={() => handleDelete(loan._id)}
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
