import { motion } from 'framer-motion';
import './FloatingElements.css';

const FloatingElements = ({ weatherType }) => {
  const generateElements = () => {
    const elements = [];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const randomDelay = Math.random() * 5;
      const randomDuration = 8 + Math.random() * 4;
      const randomSize = 20 + Math.random() * 30;
      const randomOpacity = 0.1 + Math.random() * 0.3;

      elements.push(
        <motion.div
          key={i}
          className={`floating-element ${weatherType}`}
          style={{
            left: `${Math.random() * 100}%`,
            width: `${randomSize}px`,
            height: `${randomSize}px`,
            opacity: randomOpacity,
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      );
    }

    return elements;
  };

  return (
    <div className="floating-elements-container">
      {generateElements()}
    </div>
  );
};

export default FloatingElements;
