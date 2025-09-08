import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, AlertTriangle, Info, ChevronDown, ChevronRight, Lightbulb, Target } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { DocumentResult, Risk } from '../types/document';
import TypewriterText from './TypewriterText';
import ClauseHighlight from './ClauseHighlight';
import RiskSuggestionModal from './RiskSuggestionModal';

interface ResultsPanelProps {
  results: DocumentResult;
  shouldAnimate?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, shouldAnimate = false }) => {
  const [expandedRisks, setExpandedRisks] = useState<Set<number>>(new Set([0]));
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const toggleRiskExpansion = (index: number) => {
    const newExpanded = new Set(expandedRisks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRisks(newExpanded);
  };

  // Clickable Clause Suggestions: Handle clause click for suggestions
  const handleClauseClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setShowSuggestion(true);
  };

  const getRiskColor = (level: Risk['riskLevel']) => {
    switch (level) {
      case 'High':
        return 'bg-[#ff6b6b] text-white';
      case 'Medium':
        return 'bg-[#ffd166] text-gray-900';
      case 'Low':
        return 'bg-[#007c7c] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRiskIcon = (level: Risk['riskLevel']) => {
    switch (level) {
      case 'High':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Medium':
        return <Info className="w-4 h-4" />;
      case 'Low':
        return <FileCheck className="w-4 h-4" />;
    }
  };

  // Dynamic Risk Score Meter: Get color for progress bar
  const getProgressColor = (score: number) => {
    if (score <= 3) return '#007c7c';
    if (score <= 6) return '#ffd166';
    return '#ff6b6b';
  };

  return (
    <>
      <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
        <p className="text-gray-400">Document: {results.documentName}</p>
      </motion.div>

      {/* Dynamic Risk Score Meter: Enhanced circular progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-white">Overall Risk Score</h3>
            <div className="w-32 h-32 mx-auto mb-4">
              <CircularProgressbar
                value={shouldAnimate ? results.riskScore * 10 : 0}
                text={`${results.riskScore.toFixed(1)}`}
                styles={buildStyles({
                  pathColor: getProgressColor(results.riskScore),
                  textColor: '#ffffff',
                  trailColor: '#374151',
                  backgroundColor: 'transparent',
                  pathTransitionDuration: shouldAnimate ? 2 : 0,
                  textSize: '24px',
                })}
              />
            </div>
            <p className="text-gray-400">
              Risk Level:{" "}
              <span
                className={
                  results.riskScore >= 7
                    ? "text-[#ff6b6b] font-semibold"
                    : results.riskScore >= 4
                    ? "text-[#ffd166] font-semibold"
                    : "text-[#007c7c] font-semibold"
                }
              >
                {results.riskScore >= 7 ? "High" : results.riskScore >= 4 ? "Medium" : "Low"}
              </span>
            </p>
          </div>
          
          {/* Risk breakdown */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4">Risk Breakdown</h4>
            {['High', 'Medium', 'Low'].map((level) => {
              const count = results.risks.filter(r => r.riskLevel === level).length;
              const color = level === 'High' ? '#ff6b6b' : level === 'Medium' ? '#ffd166' : '#007c7c';
              return (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-gray-300">{level} Risk</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: shouldAnimate ? `${(count / results.risks.length) * 100}%` : 0 }}
                        transition={{ duration: 1, delay: 0.5 + (['High', 'Medium', 'Low'].indexOf(level) * 0.2) }}
                      />
                    </div>
                    <span className="text-white font-semibold w-4">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white flex items-center">
          <FileCheck className="w-6 h-6 mr-3 text-[#007c7c]" />
          Key Contract Points
        </h3>
        <ul className="space-y-3">
          {results.summary.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: shouldAnimate ? 0.6 + index * 0.1 : 0 }}
              className="flex items-start space-x-3 text-gray-300"
            >
              <div className="w-2 h-2 bg-[#007c7c] rounded-full mt-2 flex-shrink-0" />
              {/* AI Typing / Reveal Effect: Typewriter for summary points */}
              {shouldAnimate ? (
                <TypewriterText 
                  text={point} 
                  delay={0.6 + index * 0.1}
                  speed={25}
                />
              ) : (
                <span>{point}</span>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Risk Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-[#ffd166]" />
          Risk Analysis
        </h3>
        <div className="space-y-4">
          {results.risks.map((risk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldAnimate ? 0.8 + index * 0.2 : 0 }}
              className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/30"
            >
              {/* Progressive Highlight Animation: Clause highlighting with pulse */}
              <ClauseHighlight 
                isActive={shouldAnimate} 
                delay={0.8 + index * 0.2}
                riskLevel={risk.riskLevel}
              >
              <button
                onClick={() => toggleRiskExpansion(index)}
                className="w-full p-4 text-left hover:bg-gray-700/30 transition-colors duration-200 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getRiskColor(risk.riskLevel)}`}>
                      {getRiskIcon(risk.riskLevel)}
                      <span>{risk.riskLevel} Risk</span>
                    </span>
                    <span className="text-white font-medium">{risk.clause}</span>
                  </div>
                  {expandedRisks.has(index) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              </ClauseHighlight>
              
              {expandedRisks.has(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-gray-600 space-y-4">
                    {/* AI Typing / Reveal Effect: Typewriter for explanations */}
                    <div className="text-gray-300 leading-relaxed">
                      {shouldAnimate ? (
                        <TypewriterText 
                          text={risk.explanation} 
                          delay={1.2 + index * 0.2}
                          speed={30}
                        />
                      ) : (
                        <p>{risk.explanation}</p>
                      )}
                    </div>
                    
                    {/* Clickable Clause Suggestions: Suggestion button */}
                    <motion.button
                      onClick={() => handleClauseClick(risk)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-[#007c7c] to-[#005a5a] hover:from-[#008888] hover:to-[#006666] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: shouldAnimate ? 1.5 + index * 0.2 : 0 }}
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>See Suggestion</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

      {/* Clickable Clause Suggestions: Modal for suggestions */}
      <RiskSuggestionModal
        risk={selectedRisk}
        isOpen={showSuggestion}
        onClose={() => setShowSuggestion(false)}
      />
    </>
  );
};

export default ResultsPanel;