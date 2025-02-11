import Loan from "../models/loan.js";

export const createLoan = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const loan = new Loan({
      ...req.body,
      remainingAmount: req.body.amount,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("createdBy updatedBy", "username");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("createdBy updatedBy", "username")
      .populate({
        path: "payments.updatedBy",
        select: "username", // Populate the updatedBy field in payments
      });

    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    Object.assign(loan, req.body);
    loan.updatedBy = req.user._id;

    if (req.body.paymentAmount) {
      const payment = {
        amount: req.body.paymentAmount,
        updatedBy: req.user._id,
      };
      loan.payments.push(payment);
      loan.remainingAmount -= req.body.paymentAmount;

      if (loan.remainingAmount <= 0) {
        loan.status = "paid";
      } else if (loan.remainingAmount < loan.amount) {
        loan.status = "partially_paid";
      }
    }

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
