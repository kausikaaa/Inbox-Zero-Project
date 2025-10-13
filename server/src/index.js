import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//  Connect to database
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

//  Basic test route
app.get("/", (req, res) => {
  res.send("Inbox Zero backend is running ✅");
});

//  API routes
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
