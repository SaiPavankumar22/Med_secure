import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileEncryption from './components/FileEncryption';
import FileDecryption from './components/FileDecryption';
import AdminPanel from './components/AdminPanel';

const MainApp: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!currentUser || !userProfile) {
    return <Navigate to="/login" replace />;
  }

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
      case 'analysis':
        return <MedicalAnalysis />;
      case 'admin':
        return userProfile.role === 'admin' ? <AdminPanel /> : <Dashboard />;
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
      case 'analysis':
        return 'Medical Analysis';
      case 'admin':
        return 'Admin Panel';
      case 'audit':
        return 'Audit Logs';
      default:
        return 'Medical Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <nav className="bg-blue-900/80 backdrop-blur-sm text-white px-6 py-4 flex items-center justify-between">
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
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<MainApp />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;