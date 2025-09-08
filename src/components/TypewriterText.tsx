import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number; // characters per second
  className?: string;
}

// AI Typing / Reveal Effect: Smooth typewriter animation component
const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 25,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, hasStarted]);

  return (
    <span className={className}>
      {displayedText}
      {hasStarted && currentIndex < text.length && (
        <span className="animate-pulse text-[#007c7c]">|</span>
      )}
    </span>
  );
};

export default TypewriterText;