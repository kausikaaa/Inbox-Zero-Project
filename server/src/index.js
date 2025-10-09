import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// basic route
app.get("/", (req, res) => {
  res.send("Inbox Zero backend is running ✅");
});

// port from .env or fallback
const PORT = process.env.PORT || 5000;

import prisma from "./prisma/client.js";

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
