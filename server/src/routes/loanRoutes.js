import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createLoan,
  getLoans,
  getLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loanController.js";

const router = express.Router();

router.post("/", authenticate, createLoan);
router.get("/", authenticate, getLoans);
router.get("/:id", authenticate, getLoan);
router.put("/:id", authenticate, updateLoan);
router.delete("/:id", authenticate, deleteLoan);

export default router;
