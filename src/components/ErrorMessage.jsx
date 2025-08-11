import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div 
      className="error-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="error-content">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AlertCircle size={48} className="error-icon" />
        </motion.div>
        
        <h3 className="error-title">Oops! Something went wrong</h3>
        <p className="error-message">{message}</p>
        
        {onRetry && (
          <motion.button 
            onClick={onRetry}
            className="retry-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
