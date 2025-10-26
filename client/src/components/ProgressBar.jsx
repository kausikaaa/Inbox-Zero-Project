import PropTypes from 'prop-types';

function ProgressBar({ 
  progress, 
  totalEmails, 
  processedEmails, 
  showDetails = true,
  size = "medium" 
}) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: "h-2",
      textSize: "text-sm",
      padding: "p-3"
    },
    medium: {
      height: "h-3",
      textSize: "text-base",
      padding: "p-4"
    },
    large: {
      height: "h-4",
      textSize: "text-lg",
      padding: "p-5"
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Progress color based on percentage
  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Background color for the bar
  const getBackgroundColor = (progress) => {
    if (progress === 100) return "bg-green-50 border-green-200";
    if (progress >= 80) return "bg-blue-50 border-blue-200";
    if (progress >= 60) return "bg-yellow-50 border-yellow-200";
    if (progress >= 40) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  // Progress message
  const getProgressMessage = (progress) => {
    if (progress === 100) return "🎉 Inbox Zero Achieved!";
    if (progress >= 90) return "🔥 Almost there! Just a few more emails.";
    if (progress >= 75) return "💪 Great progress! Keep going.";
    if (progress >= 50) return "📈 You're halfway to Inbox Zero!";
    if (progress >= 25) return "🚀 Good start! Keep clearing emails.";
    return "📧 Time to start clearing your inbox!";
  };

  return (
    <div className={`border rounded-lg ${config.padding} ${getBackgroundColor(normalizedProgress)}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`font-semibold text-gray-900 ${config.textSize}`}>
            Inbox Zero Progress
          </h3>
          {showDetails && (
            <p className="text-sm text-gray-600 mt-1">
              {processedEmails} of {totalEmails} emails processed
            </p>
          )}
        </div>
        <div className={`font-bold ${config.textSize} ${
          normalizedProgress === 100 ? 'text-green-700' : 'text-gray-700'
        }`}>
          {normalizedProgress.toFixed(0)}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 rounded-full ${config.height} overflow-hidden`}>
        <div
          className={`${config.height} ${getProgressColor(normalizedProgress)} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${normalizedProgress}%` }}
        >
          {/* Shine effect for completed progress */}
          {normalizedProgress > 0 && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
          )}
        </div>
      </div>

      {/* Progress Message */}
      {showDetails && (
        <p className="text-sm text-gray-600 mt-3 text-center">
          {getProgressMessage(normalizedProgress)}
        </p>
      )}
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  totalEmails: PropTypes.number.isRequired,
  processedEmails: PropTypes.number.isRequired,
  showDetails: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default ProgressBar;