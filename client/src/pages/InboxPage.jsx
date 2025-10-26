import { useState, useEffect } from "react";
import { emailAPI } from "../api.js";
import FilterBar from "../components/FilterBar.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import InboxZeroCelebration from "../components/InboxZeroCelebration.jsx";
import { calculateInboxProgress } from "../utils/progressUtils.js";

function InboxPage() {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasAchievedInboxZero, setHasAchievedInboxZero] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch emails
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      const emailData = await emailAPI.getEmails();
      setEmails(emailData);
    } catch (err) {
      setError("Failed to load emails. Please try again.");
      console.error("Error fetching emails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (emailId) => {
    try {
      await emailAPI.markAsRead(emailId);
      // Update the email in the local state
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ));
    } catch (err) {
      console.error("Error marking email as read:", err);
    }
  };

  const handleArchive = async (emailId) => {
    try {
      await emailAPI.archiveEmail(emailId);
      // Remove the email from the local state (since it's now archived)
      setEmails(emails.filter(email => email.id !== emailId));
    } catch (err) {
      console.error("Error archiving email:", err);
    }
  };

  // Filter to show only non-archived emails
  const inboxEmails = emails.filter(email => !email.isArchived);
  
  // Apply filtering based on current filter
  const getFilteredEmails = () => {
    let filteredEmails = inboxEmails;
    
    // Apply read/unread filter
    switch (currentFilter) {
      case 'unread':
        filteredEmails = filteredEmails.filter(email => !email.isRead);
        break;
      case 'read':
        filteredEmails = filteredEmails.filter(email => email.isRead);
        break;
      case 'all':
      default:
        // Show all non-archived emails
        break;
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      filteredEmails = filteredEmails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredEmails;
  };

  const filteredEmails = getFilteredEmails();
  const unreadCount = inboxEmails.filter(email => !email.isRead).length;
  const readCount = inboxEmails.filter(email => email.isRead).length;
  
  // Email counts for FilterBar
  const emailCounts = {
    all: inboxEmails.length,
    unread: unreadCount,
    read: readCount
  };

  // Progress calculation for Inbox Zero using utility function
  const progressData = calculateInboxProgress(emails);

  // Check for Inbox Zero achievement
  useEffect(() => {
    if (progressData.isInboxZero && progressData.totalEmails > 0 && !hasAchievedInboxZero) {
      setShowCelebration(true);
      setHasAchievedInboxZero(true);
    } else if (!progressData.isInboxZero) {
      setHasAchievedInboxZero(false);
    }
  }, [progressData.isInboxZero, progressData.totalEmails, hasAchievedInboxZero]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading emails...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Inbox {user && `- ${user.name}`}
        </h1>
        <p className="text-gray-600 mt-2">
          {emailCounts.all} total emails, {emailCounts.unread} unread
          {searchQuery && ` • ${filteredEmails.length} matching search`}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <ProgressBar
          progress={progressData.progress}
          totalEmails={progressData.totalEmails}
          processedEmails={progressData.processedEmails}
          showDetails={true}
          size="medium"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        emailCounts={emailCounts}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Email List */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <div>
              <div className="text-gray-500 text-lg">
                🔍 No emails found
              </div>
              <p className="text-gray-400 mt-2">
                No emails match your search "{searchQuery}"
              </p>
            </div>
          ) : currentFilter === 'unread' ? (
            <div>
              <div className="text-gray-500 text-lg">
                ✅ All caught up!
              </div>
              <p className="text-gray-400 mt-2">
                No unread emails in your inbox.
              </p>
            </div>
          ) : currentFilter === 'read' ? (
            <div>
              <div className="text-gray-500 text-lg">
                📖 No read emails
              </div>
              <p className="text-gray-400 mt-2">
                You haven't read any emails yet.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-gray-500 text-lg">
                🎉 Inbox Zero! No emails here.
              </div>
              <p className="text-gray-400 mt-2">
                You've achieved inbox zero or no emails have been loaded yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`border rounded-lg p-4 transition-colors ${
                email.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`text-lg font-medium ${
                      email.isRead ? 'text-gray-900' : 'text-blue-900'
                    }`}>
                      {email.subject}
                    </h3>
                    {!email.isRead && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    From: <span className="font-medium">{email.sender}</span>
                  </p>
                  
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {email.body}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {new Date(email.createdAt).toLocaleDateString()} at{" "}
                    {new Date(email.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  {!email.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(email.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Mark Read
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleArchive(email.id)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inbox Zero Celebration Modal */}
      <InboxZeroCelebration
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}

export default InboxPage;