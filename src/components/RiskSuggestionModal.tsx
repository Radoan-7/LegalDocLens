import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { Risk } from '../types/document';

interface RiskSuggestionModalProps {
  risk: Risk | null;
  isOpen: boolean;
  onClose: () => void;
}

// Clickable Clause Suggestions: Modal with AI-suggested alternatives
const RiskSuggestionModal: React.FC<RiskSuggestionModalProps> = ({ 
  risk, 
  isOpen, 
  onClose 
}) => {
  if (!risk) return null;

  const getRiskColor = (level: Risk['riskLevel']) => {
    switch (level) {
      case 'High':
        return 'text-[#ff6b6b] border-[#ff6b6b]/30 bg-[#ff6b6b]/10';
      case 'Medium':
        return 'text-[#ffd166] border-[#ffd166]/30 bg-[#ffd166]/10';
      case 'Low':
        return 'text-[#007c7c] border-[#007c7c]/30 bg-[#007c7c]/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-6 h-6 text-[#ffd166]" />
                  <h2 className="text-xl font-semibold text-white">Smart Suggestion</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Risk identification */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(risk.riskLevel)}`}>
                      {risk.riskLevel} Risk
                    </span>
                    <h3 className="text-lg font-semibold text-white">{risk.clause}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{risk.explanation}</p>
                </div>

                {/* Original clause */}
                {risk.clauseText && (
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                      Current Clause
                    </h4>
                    <p className="text-gray-300 italic leading-relaxed">"{risk.clauseText}"</p>
                  </div>
                )}

                {/* Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[#007c7c]"
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.div>
                </div>

                {/* Suggested improvement */}
                <div className="bg-gradient-to-r from-[#007c7c]/10 to-[#005a5a]/10 rounded-xl p-4 border border-[#007c7c]/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-5 h-5 text-[#007c7c]" />
                    <h4 className="text-sm font-semibold text-[#007c7c] uppercase tracking-wide">
                      Suggested Alternative
                    </h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{risk.suggestion}</p>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-[#007c7c] to-[#005a5a] hover:from-[#008888] hover:to-[#006666] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Got it, thanks!
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg font-medium transition-all duration-200"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RiskSuggestionModal;