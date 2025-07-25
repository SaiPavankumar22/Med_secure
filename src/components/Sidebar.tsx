import React from 'react';
import { FileCheck, FileX, Upload, Download, Home, Users, Activity, Shield, FileText } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patient', label: 'Patient Data', icon: Users },
    { id: 'provider', label: 'Provider Panel', icon: Activity },
    { id: 'insights', label: 'AI Insights', icon: FileText },
    { id: 'encryption', label: 'File Encryption', icon: Shield },
    { id: 'decryption', label: 'File Decryption', icon: FileCheck },
    { id: 'audit', label: 'Audit Logs', icon: FileX }
  ];

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto w-64`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              MedSecure
            </h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-slate-800 transition-colors ${
                    activeSection === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Logout Button */}
          <div className="p-6 border-t border-slate-700 flex-shrink-0">
            <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;