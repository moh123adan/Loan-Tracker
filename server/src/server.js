import express from "express";
import connectDB from "./config/db.js";
import loanRoutes from "./routes/loanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Update CORS configuration to handle multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://loan-tracker-five.vercel.app",
  // Add any other domains you need
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

connectDB();
app.use("/api/loans", loanRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Loan Management System API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
