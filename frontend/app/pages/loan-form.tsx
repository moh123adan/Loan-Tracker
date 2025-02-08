"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

interface Loan {
  _id: string;
  customerName: string;
  amount: number;
  status: string;
}

interface LoanFormProps {
  onLoanAdded: () => void;
  editingLoan: Loan | null;
  onUpdate: (loan: Loan) => Promise<void>;
}

interface FormData {
  customerName: string;
  amount: string;
  status: string;
}

export default function LoanForm({
  onLoanAdded,
  editingLoan,
  onUpdate,
}: LoanFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    amount: "",
    status: "pending",
  });

  useEffect(() => {
    if (editingLoan) {
      setFormData({
        customerName: editingLoan.customerName,
        amount: editingLoan.amount.toString(),
        status: editingLoan.status,
      });
    } else {
      setFormData({
        customerName: "",
        amount: "",
        status: "pending",
      });
    }
  }, [editingLoan]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingLoan) {
        await onUpdate({
          ...editingLoan,
          ...formData,
          amount: Number.parseFloat(formData.amount),
        });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/loans`,
          formData
        );
        toaster.create({
          description: "Loan created successfully",
          type: "success",
        });
      }
      setFormData({
        customerName: "",
        amount: "",
        status: "pending",
      });
      onLoanAdded();
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editingLoan ? "Edit Loan" : "Create New Loan"}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Please fill in the loan details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            required
            className="w-full px-3 py-2 border bg-gray-100 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter loan amount"
            required
            className="w-full px-3 py-2 border bg-gray-100 text-gray-800 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-gray-100 text-gray-800 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          {editingLoan ? "Update Loan" : "Create Loan"}
        </button>
      </form>
    </div>
  );
}
