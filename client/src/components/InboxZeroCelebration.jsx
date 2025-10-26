import PropTypes from 'prop-types';

function InboxZeroCelebration({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center transform animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Inbox Zero Achieved!
        </h2>
        <p className="text-gray-700 mb-6">
          Congratulations! You've successfully cleared your inbox. 
          You're now at the zen state of email management!
        </p>
        <div className="flex space-x-2 text-4xl mb-6 justify-center">
          <span>🚀</span>
          <span>✨</span>
          <span>💯</span>
          <span>🎯</span>
        </div>
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

InboxZeroCelebration.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InboxZeroCelebration;