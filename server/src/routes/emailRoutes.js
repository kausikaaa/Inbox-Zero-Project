import express from "express";
import { getEmails, archiveEmail, markRead } from "../controllers/emailController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // protect all routes below

router.get("/", getEmails);
router.put("/:id/archive", archiveEmail);
router.put("/:id/read", markRead);

export default router;
