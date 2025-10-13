import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Some mock data for generating random emails
const subjects = [
  "Welcome to Inbox Zero",
  "Project Update",
  "Meeting Reminder",
  "Weekly Newsletter",
  "Follow Up",
  "Action Required",
  "Invoice Received",
  "Event Invitation",
  "Team Sync",
  "Daily Digest",
];

const bodies = [
  "This is your first test email.",
  "Please review the latest updates.",
  "Don't forget about the team meeting at 3 PM.",
  "Here is your weekly newsletter with updates.",
  "Kindly respond to this email at your earliest convenience.",
  "Your invoice has been received and processed.",
  "You are invited to our upcoming event.",
  "Reminder: submit your report by EOD.",
  "Here are today's important updates.",
  "Don't miss out on these notifications.",
];

const senders = [
  "admin@inboxzero.com",
  "team@inboxzero.com",
  "manager@inboxzero.com",
  "newsletter@inboxzero.com",
  "support@inboxzero.com",
];

async function main() {
  const userId = 1; // Replace with your test user ID

  // Generate 15 mock emails
  for (let i = 0; i < 15; i++) {
    const email = {
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)],
      sender: senders[Math.floor(Math.random() * senders.length)],
      isRead: Math.random() < 0.5,       // Randomly read/unread
      isArchived: Math.random() < 0.3,   // Randomly archived
      userId,
    };

    await prisma.email.create({ data: email });
  }

  console.log("✅ Seeded 15 random mock emails successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
