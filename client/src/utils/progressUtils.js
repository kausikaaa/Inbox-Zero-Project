// Utility functions for inbox progress calculations

/**
 * Calculate Inbox Zero progress percentage
 * @param {Array} emails - All emails array
 * @returns {Object} Progress data including percentage, counts, and status
 */
export const calculateInboxProgress = (emails) => {
  if (!emails || emails.length === 0) {
    return {
      progress: 100, // If no emails, inbox zero is achieved
      totalEmails: 0,
      processedEmails: 0,
      archivedCount: 0,
      readCount: 0,
      unreadCount: 0,
      inboxCount: 0,
      isInboxZero: true
    };
  }

  const totalEmails = emails.length;
  const archivedEmails = emails.filter(email => email.isArchived);
  const inboxEmails = emails.filter(email => !email.isArchived);
  const readEmails = emails.filter(email => email.isRead);
  const unreadEmails = emails.filter(email => !email.isRead);
  
  // Processed emails = emails that are either read OR archived
  const processedEmails = readEmails.length + archivedEmails.length;
  
  // Remove duplicates (emails that are both read AND archived)
  const uniqueProcessedEmails = emails.filter(email => email.isRead || email.isArchived).length;
  
  const progress = totalEmails > 0 ? (uniqueProcessedEmails / totalEmails) * 100 : 100;
  const isInboxZero = inboxEmails.filter(email => !email.isRead).length === 0;

  return {
    progress: Math.min(progress, 100),
    totalEmails,
    processedEmails: uniqueProcessedEmails,
    archivedCount: archivedEmails.length,
    readCount: readEmails.length,
    unreadCount: unreadEmails.length,
    inboxCount: inboxEmails.length,
    isInboxZero
  };
};

/**
 * Get progress message based on percentage
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} Motivational message
 */
export const getProgressMessage = (progress) => {
  if (progress === 100) return "🎉 Inbox Zero Achieved!";
  if (progress >= 90) return "🔥 Almost there! Just a few more emails.";
  if (progress >= 75) return "💪 Great progress! Keep going.";
  if (progress >= 50) return "📈 You're halfway to Inbox Zero!";
  if (progress >= 25) return "🚀 Good start! Keep clearing emails.";
  return "📧 Time to start clearing your inbox!";
};

/**
 * Get progress color class based on percentage
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} Tailwind CSS color class
 */
export const getProgressColor = (progress) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 80) return "bg-blue-500";
  if (progress >= 60) return "bg-yellow-500";
  if (progress >= 40) return "bg-orange-500";
  return "bg-red-500";
};