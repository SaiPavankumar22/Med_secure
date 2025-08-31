import React, { useState, useRef } from 'react';
import { Upload, Activity, FileText, AlertCircle, CheckCircle, Loader, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AnalysisResult {
  status: string;
  analysis: string;
  recommendations?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  confidence?: number;
}

const MedicalAnalysis: React.FC = () => {
  const { userProfile, addAuditLog } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has permission
  const hasPermission = userProfile?.role === 'admin' || userProfile?.role === 'authorized';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage(null);
      setAnalysisResult(null);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);

      setMessage({
        type: 'success',
        text: 'Medical analysis completed successfully!'
      });

      // Add audit log
      await addAuditLog(`Medical analysis performed on file: ${selectedFile.name}`, {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        action: 'medical_analysis',
        riskLevel: result.riskLevel
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Analysis failed. Please check your backend connection.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!hasPermission) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">Medical Analysis</h2>
        </div>
        
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-6">
            Medical analysis is only available to authorized users and administrators.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-amber-700">
              Request authorization upgrade from the Dashboard to access this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Medical Analysis</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Upload medical files for AI-powered analysis and insights. Supported formats include medical images, 
          lab reports, and other diagnostic files.
        </p>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.dcm,.txt,.csv"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-500">
                Type: {selectedFile.type || 'Unknown'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-lg font-medium text-gray-700">Select a medical file for analysis</p>
              <p className="text-sm text-gray-500">
                Supported: PDF, Images (JPG, PNG), DICOM, Text files, CSV
              </p>
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Choose Medical File
          </button>
        </div>

        {/* Analysis Button */}
        {selectedFile && !analysisResult && (
          <button
            onClick={analyzeFile}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Analyze File
              </>
            )}
          </button>
        )}

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 mt-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Analysis Results</h3>
          </div>

          <div className="space-y-6">
            {/* Risk Level */}
            {analysisResult.riskLevel && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(analysisResult.riskLevel)}`}>
                  {analysisResult.riskLevel.toUpperCase()}
                </span>
                {analysisResult.confidence && (
                  <span className="text-sm text-gray-500">
                    Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            )}

            {/* Analysis Content */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Analysis Report</h4>
              <div className="prose prose-sm max-w-none text-gray-700">
                {analysisResult.analysis.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-700">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setAnalysisResult(null);
                  setMessage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Analyze Another File
              </button>
              <button
                onClick={() => {
                  const analysisText = `Medical Analysis Report\n\nFile: ${selectedFile?.name}\nRisk Level: ${analysisResult.riskLevel?.toUpperCase()}\nConfidence: ${analysisResult.confidence ? (analysisResult.confidence * 100).toFixed(1) + '%' : 'N/A'}\n\nAnalysis:\n${analysisResult.analysis}\n\nRecommendations:\n${analysisResult.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n') || 'None'}`;
                  const blob = new Blob([analysisText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `analysis-report-${selectedFile?.name || 'unknown'}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backend Connection Info */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Backend Requirements</h3>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 mb-2">
            <strong>FastAPI Backend Required:</strong> This feature requires a FastAPI backend running with an `/analysis` endpoint.
          </p>
          <div className="text-xs text-orange-600 space-y-1">
            <p>• Endpoint: <code className="bg-orange-100 px-1 rounded">POST /analysis</code></p>
            <p>• Accepts: Multipart form data with 'file' field</p>
            <p>• Returns: JSON with analysis, recommendations, riskLevel, confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAnalysis;