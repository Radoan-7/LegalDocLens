import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Risk } from '../types/document';

interface ClauseHighlightProps {
  children: React.ReactNode;
  isActive: boolean;
  delay: number;
  riskLevel: Risk['riskLevel'];
}

// Progressive Highlight Animation: Sequential clause highlighting with pulse
const ClauseHighlight: React.FC<ClauseHighlightProps> = ({ 
  children, 
  isActive, 
  delay, 
  riskLevel 
}) => {
  const [shouldHighlight, setShouldHighlight] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setShouldHighlight(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isActive, delay]);

  const getHighlightColor = () => {
    switch (riskLevel) {
      case 'High':
        return 'shadow-[#ff6b6b]/30 border-[#ff6b6b]/50';
      case 'Medium':
        return 'shadow-[#ffd166]/30 border-[#ffd166]/50';
      case 'Low':
        return 'shadow-[#007c7c]/30 border-[#007c7c]/50';
      default:
        return 'shadow-gray-500/30 border-gray-500/50';
    }
  };

  return (
    <motion.div
      className="relative"
      animate={shouldHighlight ? {
        boxShadow: [
          '0 0 0px rgba(0,0,0,0)',
          '0 0 20px rgba(255,255,255,0.1)',
          '0 0 0px rgba(0,0,0,0)',
        ],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: shouldHighlight ? 2 : 0,
        ease: "easeInOut"
      }}
    >
      {/* Subtle glow overlay */}
      {shouldHighlight && (
        <motion.div
          className={`absolute inset-0 rounded-xl ${getHighlightColor()}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: 2,
            ease: "easeInOut"
          }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default ClauseHighlight;