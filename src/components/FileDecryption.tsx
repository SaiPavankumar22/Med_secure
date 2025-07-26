import React, { useState, useRef } from 'react';
import { Upload, Unlock, Download, AlertCircle, CheckCircle, FileX } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { useAuth } from '../context/AuthContext';

const FileDecryption: React.FC = () => {
  const { userProfile, addAuditLog } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState<{
    name: string;
    data: string;
    mimeType: string;
    size: number;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has permission
  const hasPermission = userProfile?.role === 'admin' || userProfile?.role === 'authorized';

  // Same signature and key as encryption
  const WEBSITE_SIGNATURE = 'MEDSECURE_2024_ENCRYPTED_FILE';
  const ENCRYPTION_KEY = 'MedSecure_Secret_Key_2024_Healthcare_Platform';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage(null);
      setDecryptedData(null);
    }
  };

  const decryptFile = async () => {
    if (!selectedFile) return;

    setIsDecrypting(true);
    setMessage(null);

    try {
      // Read the encrypted file
      const fileContent = await selectedFile.text();
      
      // Check if the file has our signature
      if (!fileContent.startsWith(WEBSITE_SIGNATURE + '::')) {
        throw new Error('This file was not encrypted by MedSecure or is corrupted.');
      }

      // Extract the encrypted data (remove signature)
      const encryptedData = fileContent.substring((WEBSITE_SIGNATURE + '::').length);
      
      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Failed to decrypt file. The file may be corrupted or tampered with.');
      }

      // Parse the decrypted JSON
      const parsedData = JSON.parse(decryptedString);
      
      // Verify the signature in metadata
      if (parsedData.metadata.signature !== WEBSITE_SIGNATURE) {
        throw new Error('Invalid file signature. This file was not encrypted by MedSecure.');
      }

      setDecryptedData({
        name: parsedData.metadata.originalName,
        data: parsedData.fileData,
        mimeType: parsedData.metadata.mimeType,
        size: parsedData.metadata.size
      });

      setMessage({
        type: 'success',
        text: 'File decrypted successfully!'
      });

      // Add audit log
      await addAuditLog(`File decrypted: ${parsedData.metadata.originalName}`, {
        originalFileName: parsedData.metadata.originalName,
        fileSize: parsedData.metadata.size,
        action: 'file_decryption'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Decryption failed. Please ensure the file was encrypted by MedSecure.'
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const downloadDecryptedFile = () => {
    if (!decryptedData) return;

    try {
      // Convert base64 back to binary
      const binaryString = atob(decryptedData.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: decryptedData.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = decryptedData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to download decrypted file.'
      });
    }
  };

  if (!hasPermission) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Unlock className="w-6 h-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">File Decryption</h2>
        </div>
        
        <div className="text-center py-12">
          <Unlock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h3>
          <p className="text-gray-600 mb-6">
            File decryption is only available to authorized users and administrators.
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
        <Unlock className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">File Decryption</h2>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".medsecure"
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
              <FileX className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-lg font-medium text-gray-700">Select an encrypted file</p>
              <p className="text-sm text-gray-500">
                Only .medsecure files encrypted by this platform
              </p>
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Choose Encrypted File
          </button>
        </div>

        {/* Decryption Button */}
        {selectedFile && !decryptedData && (
          <button
            onClick={decryptFile}
            disabled={isDecrypting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Unlock className="w-5 h-5" />
            {isDecrypting ? 'Decrypting...' : 'Decrypt File'}
          </button>
        )}

        {/* Decrypted File Info */}
        {decryptedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Decrypted File Details</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Original Name:</strong> {decryptedData.name}</p>
              <p><strong>File Type:</strong> {decryptedData.mimeType || 'Unknown'}</p>
              <p><strong>Size:</strong> {(decryptedData.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        {/* Download Decrypted File */}
        {decryptedData && (
          <button
            onClick={downloadDecryptedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Original File
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Important Security Notice</h3>
              <p className="text-sm text-amber-700 mt-1">
                Only files encrypted by MedSecure can be decrypted here. Attempting to decrypt 
                files from other sources will fail. This ensures the integrity and authenticity 
                of your medical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDecryption;