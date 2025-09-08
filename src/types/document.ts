export interface Risk {
  clause: string;
  clauseText?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  suggestion: string;
}

export interface DocumentResult {
  summary: string[];
  risks: Risk[];
  riskScore: number;
  documentName: string;
}

export interface HistoryItem {
  id: string;
  documentName: string;
  scanDate: Date;
  riskScore: number;
  highRiskCount: number;
}