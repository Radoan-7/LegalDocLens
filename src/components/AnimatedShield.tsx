import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface AnimatedShieldProps {
  riskScore: number;
  isActive: boolean;
}

const AnimatedShield: React.FC<AnimatedShieldProps> = ({ riskScore, isActive }) => {
  // Gamified Visual Enhancement: Shield animation based on risk level
  const getShieldVariant = () => {
    if (riskScore <= 3) return { icon: ShieldCheck, color: '#007c7c', glow: 'shadow-[#007c7c]/50' };
    if (riskScore <= 6) return { icon: Shield, color: '#ffd166', glow: 'shadow-[#ffd166]/50' };
    return { icon: ShieldAlert, color: '#ff6b6b', glow: 'shadow-[#ff6b6b]/50' };
  };

  const { icon: ShieldIcon, color, glow } = getShieldVariant();

  // Tentacle-like protective elements that grow based on safety
  const tentacleCount = Math.max(3, Math.floor((10 - riskScore) * 0.8));

  return (
    <div className="relative w-24 h-24 mx-auto">
      {/* Animated tentacles/protective elements */}
      {isActive && Array.from({ length: tentacleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 bg-gradient-to-t from-transparent via-current to-transparent rounded-full"
          style={{ 
            color,
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            transform: `rotate(${(360 / tentacleCount) * i}deg) translateX(-50%)`,
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: `${20 + Math.random() * 15}px`, 
            opacity: 0.6,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 1.5, 
            delay: i * 0.1,
            scale: {
              repeat: Infinity,
              duration: 2,
              delay: i * 0.2,
            }
          }}
        />
      ))}

      {/* Main shield with pulsing glow */}
      <motion.div
        className={`absolute inset-0 rounded-full ${isActive ? `shadow-lg ${glow}` : ''}`}
        animate={isActive ? {
          boxShadow: [
            `0 0 0px ${color}40`,
            `0 0 20px ${color}60`,
            `0 0 0px ${color}40`,
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isActive ? [1, 1.05, 1] : 1, 
            opacity: 1 
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { duration: 0.5 }
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <ShieldIcon 
            className="w-12 h-12" 
            style={{ color }}
          />
        </motion.div>
      </motion.div>

      {/* Risk score display */}
      <motion.div
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-2 py-1 text-xs font-bold border"
        style={{ borderColor: color, color }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {riskScore.toFixed(1)}
      </motion.div>
    </div>
  );
};

export default AnimatedShield;