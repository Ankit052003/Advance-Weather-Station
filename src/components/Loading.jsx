import { motion } from 'framer-motion';
import './Loading.css';

const Loading = ({ message = "Loading weather data..." }) => {
  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-spinner">
        <motion.div 
          className="spinner-circle"
          variants={circleVariants}
          animate="animate"
        >
          <motion.div 
            className="spinner-dot"
            variants={dotVariants}
            animate="animate"
          />
        </motion.div>
      </div>
      <motion.p 
        className="loading-message"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default Loading;
