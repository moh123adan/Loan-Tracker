import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Loan", loanSchema);
