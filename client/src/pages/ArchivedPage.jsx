import { useState, useEffect } from "react";
import { emailAPI } from "../api.js";
import FilterBar from "../components/FilterBar.jsx";

function ArchivedPage() {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter to show only archived emails
  const archivedEmails = emails.filter(email => email.isArchived);
  
  // Apply filtering based on current filter
  const getFilteredEmails = () => {
    let filteredEmails = archivedEmails;
    
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
        // Show all archived emails
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
  const unreadCount = archivedEmails.filter(email => !email.isRead).length;
  const readCount = archivedEmails.filter(email => email.isRead).length;
  
  // Email counts for FilterBar
  const emailCounts = {
    all: archivedEmails.length,
    unread: unreadCount,
    read: readCount
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading archived emails...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Archived Emails {user && `- ${user.name}`}
        </h1>
        <p className="text-gray-600 mt-2">
          {emailCounts.all} archived emails
          {searchQuery && ` • ${filteredEmails.length} matching search`}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        emailCounts={emailCounts}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Archived Email List */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <div>
              <div className="text-gray-500 text-lg">
                🔍 No archived emails found
              </div>
              <p className="text-gray-400 mt-2">
                No archived emails match your search "{searchQuery}"
              </p>
            </div>
          ) : currentFilter === 'unread' ? (
            <div>
              <div className="text-gray-500 text-lg">
                📖 No unread archived emails
              </div>
              <p className="text-gray-400 mt-2">
                All your archived emails have been read.
              </p>
            </div>
          ) : currentFilter === 'read' ? (
            <div>
              <div className="text-gray-500 text-lg">
                📖 No read archived emails
              </div>
              <p className="text-gray-400 mt-2">
                No read emails in your archive.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-gray-500 text-lg">
                📦 No archived emails
              </div>
              <p className="text-gray-400 mt-2">
                Emails you archive will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className="border rounded-lg p-4 bg-gray-50 border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-700">
                      {email.subject}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      Archived
                    </span>
                    {email.isRead && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Read
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    From: <span className="font-medium">{email.sender}</span>
                  </p>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {email.body}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Received: {new Date(email.createdAt).toLocaleDateString()} at{" "}
                    {new Date(email.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Archive indicator */}
                <div className="ml-4">
                  <div className="flex items-center text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M3 8.5h14l-1 7.5H4L3 8.5zM8.5 10a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivedPage;