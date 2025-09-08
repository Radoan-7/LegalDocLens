import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { HistoryItem } from '../types/document';

interface HistoryProps {
  items: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ items }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-[#ff6b6b]';
    if (score >= 4) return 'text-[#ffd166]';
    return 'text-[#007c7c]';
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 7) return 'bg-[#ff6b6b]/20 text-[#ff6b6b] border-[#ff6b6b]/30';
    if (score >= 4) return 'bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/30';
    return 'bg-[#007c7c]/20 text-[#007c7c] border-[#007c7c]/30';
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h2 className="text-2xl font-bold text-white mb-2">No Documents Scanned Yet</h2>
        <p className="text-gray-400 mb-6">
          Your document analysis history will appear here once you start scanning contracts.
        </p>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Get Started</h3>
          <ul className="text-sm text-gray-400 space-y-2 text-left">
            <li>• Upload your first contract document</li>
            <li>• Try the demo mode with sample contracts</li>
            <li>• View detailed risk analysis and explanations</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Scan History</h2>
          <p className="text-gray-400">Recent document risk analyses</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{items.length}</div>
          <div className="text-sm text-gray-400">Documents</div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Risk</p>
              <p className={`text-xl font-bold ${getRiskColor(items.reduce((sum, item) => sum + item.riskScore, 0) / items.length)}`}>
                {(items.reduce((sum, item) => sum + item.riskScore, 0) / items.length).toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">High Risk Found</p>
              <p className="text-xl font-bold text-[#ff6b6b]">
                {items.reduce((sum, item) => sum + item.highRiskCount, 0)}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Week</p>
              <p className="text-xl font-bold text-white">
                {items.filter(item => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return item.scanDate >= weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <FileText className="w-8 h-8 text-[#007c7c] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.documentName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(item.scanDate)}</span>
                    </span>
                    {item.highRiskCount > 0 && (
                      <span className="flex items-center space-x-1 text-[#ff6b6b]">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{item.highRiskCount} high risk</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeColor(item.riskScore)}`}>
                  Risk: {item.riskScore.toFixed(1)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;