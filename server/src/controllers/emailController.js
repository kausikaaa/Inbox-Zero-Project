import prisma from "../prisma/client.js";

// Get all emails for the logged-in user
export const getEmails = async (req, res) => {
  try {
    const emails = await prisma.email.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Archive an email
export const archiveEmail = async (req, res) => {
  const emailId = parseInt(req.params.id);
  try {
    const email = await prisma.email.update({
      where: { id: emailId },
      data: { isArchived: true },
    });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark an email as read
export const markRead = async (req, res) => {
  const emailId = parseInt(req.params.id);
  try {
    const email = await prisma.email.update({
      where: { id: emailId },
      data: { isRead: true },
    });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
