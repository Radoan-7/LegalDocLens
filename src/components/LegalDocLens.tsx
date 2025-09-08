import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Shield, AlertTriangle, CheckCircle, Eye, Clock, Download, Zap } from 'lucide-react';
import FileUpload from './FileUpload';
import ResultsPanel from './ResultsPanel';
import DemoMode from './DemoMode';
import History from './History';
import AnimatedShield from './AnimatedShield';
import { DocumentResult, HistoryItem } from '../types/document';

const LegalDocLens: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DocumentResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'demo' | 'history'>('upload');
  const [isShowingResults, setIsShowingResults] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setResults(null);
  }, []);

  const handleScanDocument = useCallback(async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setIsShowingResults(false);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: DocumentResult = {
        summary: [
          "Service agreement for digital marketing consulting",
          "12-month contract term with automatic renewal clause",
          "Payment due within 30 days of invoice",
          "$5,000 monthly retainer with additional project fees",
          "Either party can terminate with 60-day notice"
        ],
        risks: [
          {
            clause: "Automatic Renewal Clause",
            clauseText: "This Agreement shall automatically renew for successive one-year periods unless either party provides written notice of termination at least ninety (90) days prior to the end of the current term.",
            riskLevel: 'High' as const,
            explanation: "Contract automatically renews for another full year unless cancelled 90 days in advance. This could lock you into unwanted commitments.",
            suggestion: "Consider changing to: 'This Agreement shall renew for successive one-year periods only upon mutual written agreement of both parties, with a 30-day notice period for non-renewal.'"
          },
          {
            clause: "Late Payment Penalty",
            clauseText: "Client agrees to pay a service charge of three percent (3%) per month on any overdue amounts.",
            riskLevel: 'Medium' as const,
            explanation: "3% monthly fee on overdue payments compounds quickly. A $5,000 payment could become $5,150 after just one month.",
            suggestion: "Negotiate for: 'Late payments shall incur a one-time administrative fee of $25 or 1.5% per month, whichever is less, with a 10-day grace period.'"
          },
          {
            clause: "Intellectual Property Rights",
            clauseText: "All work product, deliverables, and intellectual property created under this Agreement shall become the exclusive property of Client upon full payment.",
            riskLevel: 'Low' as const,
            explanation: "Clear definition of work product ownership. Client retains rights to all deliverables upon full payment.",
            suggestion: "This clause is well-balanced. Consider adding: 'Provider retains rights to general methodologies and pre-existing intellectual property.'"
          },
          {
            clause: "Liability Limitation",
            clauseText: "Provider's total liability under this Agreement shall not exceed the total amount paid by Client under this Agreement.",
            riskLevel: 'Medium' as const,
            explanation: "Vendor liability is capped at contract value. Consider if this is adequate for your business needs.",
            suggestion: "Consider: 'Provider's liability is limited to the lesser of $50,000 or the total contract value, excluding cases of gross negligence or willful misconduct.'"
          }
        ],
        riskScore: 6.5,
        documentName: uploadedFile.name
      };

      setResults(mockResult);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        documentName: uploadedFile.name,
        scanDate: new Date(),
        riskScore: mockResult.riskScore,
        highRiskCount: mockResult.risks.filter(r => r.riskLevel === 'High').length
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
      setIsShowingResults(true);
    }, 3000);
  }, [uploadedFile]);

  const handleDemoSelect = useCallback((demoResult: DocumentResult, shouldAnimate = true) => {
    setResults(demoResult);
    setUploadedFile(null);
    setIsShowingResults(shouldAnimate);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0b1220] to-[#1a2332] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              LegalDoc Lens ⚖️
              <span className="block text-2xl md:text-3xl text-[#007c7c] font-normal mt-2">
                Contract Risk Scanner
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your contract and instantly see key points & risky clauses
            </p>
          </motion.div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 w-fit">
          {[
            { key: 'upload' as const, label: 'Upload', icon: Upload },
            { key: 'demo' as const, label: 'Demo', icon: Eye },
            { key: 'history' as const, label: 'History', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-[#007c7c] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                    onScan={handleScanDocument}
                    isAnalyzing={isAnalyzing}
                  />
                </motion.div>
              )}
              
              {activeTab === 'demo' && (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DemoMode onDemoSelect={handleDemoSelect} />
                </motion.div>
              )}
              
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <History items={history} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Panel */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <ResultsPanel 
                    results={results} 
                    shouldAnimate={isShowingResults}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Stats/Info */}
          <div className="space-y-6">
            {/* Animated Shield - Gamified Visual Enhancement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2 text-[#007c7c]" />
                Contract Guardian
              </h3>
              <AnimatedShield 
                riskScore={results?.riskScore || 0} 
                isActive={!!results && isShowingResults}
              />
              <p className="text-sm text-gray-400 mt-3">
                {results 
                  ? `Protection Level: ${results.riskScore <= 3 ? 'High' : results.riskScore <= 6 ? 'Medium' : 'Low'}`
                  : 'Awaiting contract analysis...'
                }
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#007c7c]" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Documents Scanned</span>
                  <span className="font-semibold">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Risk Score</span>
                  <span className="font-semibold">
                    {history.length > 0 
                      ? (history.reduce((sum, item) => sum + item.riskScore, 0) / history.length).toFixed(1)
                      : '—'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High Risk Alerts</span>
                  <span className="font-semibold text-[#ff6b6b]">
                    {history.reduce((sum, item) => sum + item.highRiskCount, 0)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Risk Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-[#ffd166]" />
                Risk Levels
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-[#ff6b6b]"></div>
                  <span className="text-sm">High Risk - Review immediately</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-[#ffd166]"></div>
                  <span className="text-sm">Medium Risk - Consider carefully</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-[#007c7c]"></div>
                  <span className="text-sm">Low Risk - Generally acceptable</span>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-[#007c7c]" />
                Pro Tips
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Always review automatic renewal clauses</li>
                <li>• Check liability limitations carefully</li>
                <li>• Understand termination conditions</li>
                <li>• Verify payment terms and penalties</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-gray-400"
          >
            <p>Demo mode ready • ⚖️ Making contracts readable for everyone</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LegalDocLens;