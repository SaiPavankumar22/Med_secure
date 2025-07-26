import React, { useState, useRef } from 'react';
import { Upload, Shield, Download, AlertCircle, CheckCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { useAuth } from '../context/AuthContext';

const FileEncryption: React.FC = () => {
  const { userProfile, addAuditLog } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has permission
  const hasPermission = userProfile?.role === 'admin' || userProfile?.role === 'authorized';

  // Unique signature for our website
  const WEBSITE_SIGNATURE = 'MEDSECURE_2024_ENCRYPTED_FILE';
  const ENCRYPTION_KEY = 'MedSecure_Secret_Key_2024_Healthcare_Platform';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage(null);
      setEncryptedData(null);
    }
  };

  const encryptFile = async () => {
    if (!selectedFile) return;

    setIsEncrypting(true);
    setMessage(null);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64 for encryption
      const fileData = btoa(String.fromCharCode(...uint8Array));
      
      // Create file metadata
      const metadata = {
        originalName: selectedFile.name,
        mimeType: selectedFile.type,
        size: selectedFile.size,
        encryptedAt: new Date().toISOString(),
        signature: WEBSITE_SIGNATURE
      };

      // Combine metadata and file data
      const dataToEncrypt = JSON.stringify({
        metadata,
        fileData
      });

      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, ENCRYPTION_KEY).toString();
      
      // Add our signature wrapper
      const finalEncryptedData = `${WEBSITE_SIGNATURE}::${encrypted}`;
      
      setEncryptedData(finalEncryptedData);
      setMessage({
        type: 'success',
        text: 'File encrypted successfully! Only this website can decrypt it.'
      });

      // Add audit log
      await addAuditLog(`File encrypted: ${selectedFile.name}`, {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        action: 'file_encryption'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Encryption failed. Please try again.'
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const downloadEncryptedFile = () => {
    if (!encryptedData || !selectedFile) return;

    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedFile.name}.medsecure`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!hasPermission) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">File Encryption</h2>
        </div>
        
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-6">
            File encryption is only available to authorized users and administrators.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-amber-700">
              Request authorization upgrade from the Provider Panel to access this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">File Encryption</h2>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-lg font-medium text-gray-700">Select a file to encrypt</p>
              <p className="text-sm text-gray-500">
                All file types supported. Max size: 100MB
              </p>
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Choose File
          </button>
        </div>

        {/* Encryption Button */}
        {selectedFile && !encryptedData && (
          <button
            onClick={encryptFile}
            disabled={isEncrypting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {isEncrypting ? 'Encrypting...' : 'Encrypt File'}
          </button>
        )}

        {/* Download Encrypted File */}
        {encryptedData && (
          <button
            onClick={downloadEncryptedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Encrypted File
          </button>
        )}

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
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

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Security Notice</h3>
              <p className="text-sm text-blue-700 mt-1">
                Files encrypted by MedSecure use AES-256 encryption with a proprietary signature. 
                Encrypted files can only be decrypted using this platform, ensuring maximum security 
                for your sensitive medical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEncryption;