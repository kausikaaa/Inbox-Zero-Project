import PropTypes from 'prop-types';

function EmailCard({ email, onMarkAsRead, onArchive, showArchiveButton = true }) {
  const handleMarkAsRead = () => {
    if (onMarkAsRead && !email.isRead) {
      onMarkAsRead(email.id);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(email.id);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        email.isArchived 
          ? 'bg-gray-50 border-gray-300'
          : email.isRead 
            ? 'bg-white border-gray-200' 
            : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`text-lg font-medium ${
              email.isArchived 
                ? 'text-gray-700'
                : email.isRead 
                  ? 'text-gray-900' 
                  : 'text-blue-900'
            }`}>
              {email.subject}
            </h3>
            
            {/* Status Badges */}
            <div className="flex space-x-1">
              {!email.isRead && !email.isArchived && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              )}
              
              {email.isArchived && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  Archived
                </span>
              )}
              
              {email.isRead && email.isArchived && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Read
                </span>
              )}
            </div>
          </div>
          
          <p className={`text-sm mb-2 ${
            email.isArchived ? 'text-gray-600' : 'text-gray-700'
          }`}>
            From: <span className="font-medium">{email.sender}</span>
          </p>
          
          <p className={`mb-3 line-clamp-2 ${
            email.isArchived ? 'text-gray-600' : 'text-gray-700'
          }`}>
            {email.body}
          </p>
          
          <p className="text-xs text-gray-500">
            {email.isArchived ? 'Received: ' : ''}
            {new Date(email.createdAt).toLocaleDateString()} at{" "}
            {new Date(email.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 ml-4">
          {!email.isArchived && !email.isRead && (
            <button
              onClick={handleMarkAsRead}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Mark Read
            </button>
          )}
          
          {!email.isArchived && showArchiveButton && (
            <button
              onClick={handleArchive}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Archive
            </button>
          )}

          {/* Archive indicator for archived emails */}
          {email.isArchived && (
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
          )}
        </div>
      </div>
    </div>
  );
}

EmailCard.propTypes = {
  email: PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    isArchived: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onMarkAsRead: PropTypes.func,
  onArchive: PropTypes.func,
  showArchiveButton: PropTypes.bool,
};

export default EmailCard;