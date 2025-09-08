import React from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, AlertTriangle, Shield } from 'lucide-react';
import { DocumentResult } from '../types/document';

interface DemoModeProps {
  onDemoSelect: (result: DocumentResult) => void;
}

const demoContracts: { name: string; description: string; result: DocumentResult }[] = [
  {
    name: "High-Risk Marketing Contract",
    description: "Service agreement with concerning automatic renewal and penalty clauses",
    result: {
      documentName: "Marketing_Service_Agreement_DEMO.pdf",
      summary: [
        "Digital marketing consulting services for 12-month term",
        "Monthly retainer of $8,000 with additional project fees",
        "Automatic renewal clause with 120-day cancellation notice",
        "5% monthly penalty on late payments",
        "Client liable for all marketing spend regardless of results"
      ],
      risks: [
        {
          clause: "Automatic Renewal with Extended Notice",
          clauseText: "This Agreement shall automatically renew for successive one-year periods unless either party provides written notice of termination at least one hundred twenty (120) days prior to the end of the current term.",
          riskLevel: 'High',
          explanation: "Contract automatically renews for another full year unless cancelled 120 days in advance. This is unusually long and could trap you in an unwanted commitment.",
          suggestion: "Negotiate for: 'This Agreement may be renewed for successive one-year periods only upon mutual written agreement, with standard 30-day notice for non-renewal.'"
        },
        {
          clause: "Aggressive Late Payment Penalties",
          clauseText: "Client agrees to pay a service charge of five percent (5%) per month on any overdue amounts, compounded monthly.",
          riskLevel: 'High',
          explanation: "5% monthly penalty compounds quickly. An $8,000 payment could become $8,400 after just one month, $8,820 after two months.",
          suggestion: "Counter with: 'Late payments incur a one-time administrative fee of $50 or 1.5% per month (whichever is less), with a 15-day grace period before penalties apply.'"
        },
        {
          clause: "No Performance Guarantees",
          clauseText: "Client acknowledges that marketing results cannot be guaranteed and agrees to pay all fees regardless of campaign performance or return on investment.",
          riskLevel: 'Medium',
          explanation: "Client is liable for all marketing spend regardless of campaign results or ROI. This shifts all risk to you.",
          suggestion: "Add performance metrics: 'Provider commits to achieving mutually agreed KPIs, with fee adjustments if performance falls below 70% of targets for two consecutive months.'"
        },
        {
          clause: "Broad Liability Exclusion",
          clauseText: "Provider shall not be liable for any indirect, incidental, special, or consequential damages arising from this Agreement.",
          riskLevel: 'Medium',
          explanation: "Vendor excludes liability for indirect damages, which could include lost profits from poor campaign performance.",
          suggestion: "Modify to: 'Provider's liability is limited to direct damages only, capped at the total contract value, except in cases of gross negligence or breach of confidentiality.'"
        }
      ],
      riskScore: 8.2
    }
  },
  {
    name: "Balanced Software License",
    description: "Software licensing agreement with moderate risk factors",
    result: {
      documentName: "Software_License_Agreement_DEMO.pdf",
      summary: [
        "Software licensing for business productivity suite",
        "Annual subscription with monthly payment option",
        "Standard 30-day termination notice required",
        "Data export rights included upon termination",
        "Limited liability cap at 12 months of fees paid"
      ],
      risks: [
        {
          clause: "Data Retention Period",
          clauseText: "Upon termination, Provider will retain Client data for ninety (90) days to allow for data export, after which all data will be permanently deleted.",
          riskLevel: 'Medium',
          explanation: "Provider retains data for 90 days after termination. Ensure you have adequate time to export all critical data.",
          suggestion: "Request: 'Provider will retain data for 180 days and provide multiple export formats. Client will receive 30 and 60-day deletion reminders.'"
        },
        {
          clause: "Service Level Agreement",
          clauseText: "Provider guarantees 99.5% uptime with service credits equal to pro-rated fees for any downtime exceeding this threshold.",
          riskLevel: 'Low',
          explanation: "99.5% uptime guarantee with service credits for outages. This is reasonable for most business applications.",
          suggestion: "This SLA is fair and industry-standard. Consider requesting notification procedures for planned maintenance windows."
        },
        {
          clause: "Intellectual Property Indemnification",
          clauseText: "Provider will defend and indemnify Client against any third-party claims alleging that the licensed software infringes any patent, copyright, or trademark.",
          riskLevel: 'Low',
          explanation: "Vendor provides IP indemnification, protecting you from third-party claims. This is a positive feature.",
          suggestion: "This clause protects you well. Ensure it covers both direct and indirect infringement claims for complete protection."
        }
      ],
      riskScore: 4.8
    }
  },
  {
    name: "Low-Risk Consulting Agreement",
    description: "Well-balanced consulting contract with minimal risk factors",
    result: {
      documentName: "Consulting_Agreement_DEMO.pdf",
      summary: [
        "Management consulting services for operational efficiency",
        "Project-based engagement with defined milestones",
        "Either party may terminate with 14-day written notice",
        "Payment due within 15 days of invoice",
        "All work product owned by client upon payment"
      ],
      risks: [
        {
          clause: "Confidentiality Obligations",
          clauseText: "Both parties agree to maintain in confidence all proprietary information disclosed during the term of this Agreement and for three (3) years thereafter.",
          riskLevel: 'Low',
          explanation: "Standard mutual confidentiality terms. Both parties are protected equally, which is appropriate.",
          suggestion: "This is well-balanced. Consider adding exceptions for information that becomes publicly available through no fault of the receiving party."
        },
        {
          clause: "Limitation of Liability",
          clauseText: "Each party's total liability under this Agreement shall not exceed the total fees paid or payable under this Agreement.",
          riskLevel: 'Low',
          explanation: "Liability is capped at the total contract value, which is reasonable for consulting services.",
          suggestion: "This is a fair mutual limitation. Ensure it excludes liability for confidentiality breaches and gross negligence."
        },
        {
          clause: "Payment Terms",
          clauseText: "Client shall pay all invoices within fifteen (15) days of receipt. No interest or penalties apply to late payments under 30 days.",
          riskLevel: 'Low',
          explanation: "15-day payment terms are standard. No excessive penalties for late payment are mentioned.",
          suggestion: "These terms are reasonable and client-friendly. The 30-day grace period before any penalties is generous."
        }
      ],
      riskScore: 2.1
    }
  }
];

const DemoMode: React.FC<DemoModeProps> = ({ onDemoSelect }) => {
  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-[#ff6b6b]';
    if (score >= 4) return 'text-[#ffd166]';
    return 'text-[#007c7c]';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 7) return <AlertTriangle className="w-5 h-5" />;
    if (score >= 4) return <Shield className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Demo Mode</h2>
        <p className="text-gray-400">
          Try LegalDoc Lens with these sample contracts to see how risk analysis works
        </p>
      </motion.div>

      <div className="grid gap-6">
        {demoContracts.map((contract, index) => (
          <motion.div
            key={contract.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-[#007c7c] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{contract.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{contract.description}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getRiskColor(contract.result.riskScore)}`}>
                {getRiskIcon(contract.result.riskScore)}
                <span className="font-bold text-lg">{contract.result.riskScore.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {contract.result.risks.filter(r => r.riskLevel === 'High').length} high risk •{' '}
                {contract.result.risks.filter(r => r.riskLevel === 'Medium').length} medium risk •{' '}
                {contract.result.risks.filter(r => r.riskLevel === 'Low').length} low risk
              </div>
              
              <motion.button
                onClick={() => onDemoSelect(contract.result)}
                onClick={() => onDemoSelect(contract.result, true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#007c7c] to-[#005a5a] hover:from-[#008888] hover:to-[#006666] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>Analyze</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-6 border border-gray-600 text-center"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Ready for Real Analysis?</h3>
        <p className="text-gray-400 text-sm mb-4">
          Upload your own contract documents to get personalized risk assessments and recommendations
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>• Supports PDF, DOC, TXT</span>
          <span>• Instant AI analysis</span>
          <span>• Detailed explanations</span>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoMode;