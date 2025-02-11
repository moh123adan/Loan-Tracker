"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LoanForm from "@/app/dashboard/loan-form";
import { toaster } from "@/components/ui/toaster";
import {
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import type { User, Loan } from "../types/index";
import { LoanDetails } from "./LoanDetails";

export default function Dashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchLoans(token);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const filtered = loans.filter((loan) =>
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLoans(filtered);
  }, [searchTerm, loans]);

  const fetchLoans = async (token: string) => {
    try {
      const response = await axios.get<Loan[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched loans:", response.data);
      setLoans(response.data);
      setFilteredLoans(response.data);
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toaster.create({
        description: "Loan deleted successfully",
        type: "success",
      });
      fetchLoans(token!);
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      });
    }
  };

  const handleUpdate = async (updatedLoan: Partial<Loan>) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans/${updatedLoan._id}`,
        updatedLoan,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toaster.create({
        description: "Loan updated successfully",
        type: "success",
      });
      setEditingLoan(null);
      fetchLoans(token!);
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleShowDetails = async (loan: Loan) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Loan>(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans/${loan._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Selected Loan:", response.data);
      console.log("Payments:", response.data.payments);
      setSelectedLoan(response.data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching loan details:", error);
      toaster.create({
        description: "Error fetching loan details",
        type: "error",
      });
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Loan Management System
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <p className="text-sm sm:text-base text-gray-600">
              Welcome, {user.username} ({user.role})
            </p>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-150 ease-in-out text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <LoanForm
                onLoanAdded={() => fetchLoans(localStorage.getItem("token")!)}
                editingLoan={editingLoan}
                onUpdate={handleUpdate}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative bg-white p-3 sm:p-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 text-gray-900 px-8 sm:px-10 py-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <svg
                  className="absolute left-5 sm:left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Remaining Amount
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
                      {filteredLoans.map((loan) => (
                        <tr
                          key={loan._id.toString()}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {loan.customerName}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            ${loan.amount.toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            ${loan.remainingAmount.toFixed(2)}
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
                                  : loan.status === "partially_paid"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                              <button
                                className="flex-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2 py-1 text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center"
                                onClick={() => setEditingLoan(loan)}
                              >
                                <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span>Edit</span>
                              </button>
                              {user.role === "admin" && (
                                <button
                                  className="flex-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md px-2 py-1 text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center"
                                  onClick={() =>
                                    handleDelete(loan._id.toString())
                                  }
                                >
                                  <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span>Delete</span>
                                </button>
                              )}
                              {loan.status === "partially_paid" && (
                                <button
                                  className="flex-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md px-2 py-1 text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center"
                                  onClick={() => handleShowDetails(loan)}
                                >
                                  <InformationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span>Details</span>
                                </button>
                              )}
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
      {selectedLoan && (
        <LoanDetails
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          payments={selectedLoan.payments}
        />
      )}
    </div>
  );
}
