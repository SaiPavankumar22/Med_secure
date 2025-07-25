import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileEncryption from './components/FileEncryption';
import FileDecryption from './components/FileDecryption';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'patient':
      case 'provider':
      case 'insights':
      case 'audit':
        return <Dashboard />;
      case 'encryption':
        return <FileEncryption />;
      case 'decryption':
        return <FileDecryption />;
      default:
        return <Dashboard />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Medical Dashboard';
      case 'patient':
        return 'Patient Data Management';
      case 'provider':
        return 'Provider Panel';
      case 'insights':
        return 'AI Health Insights';
      case 'encryption':
        return 'File Encryption';
      case 'decryption':
        return 'File Decryption';
      case 'audit':
        return 'Audit Logs';
      default:
        return 'Medical Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">{getSectionTitle()}</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button className="hover:text-blue-400 transition-colors">Home</button>
            <button className="hover:text-blue-400 transition-colors">Patient Dashboard</button>
            <button className="hover:text-blue-400 transition-colors">Provider Panel</button>
            <button className="hover:text-blue-400 transition-colors">AI Insights</button>
            <button className="hover:text-blue-400 transition-colors">Audit Logs</button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;