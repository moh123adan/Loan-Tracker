import express from "express"
import connectDB from "./config/db.js"
import loanRoutes from "./routes/loanRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())

connectDB()
app.use("/api/loans", loanRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Loan Management System API" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

