import React from 'react';
import { Upload, FileText, TrendingUp, Shield, Clock, MapPin, User, Send } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { userProfile, addAuditLog } = useAuth();
  const [requestForm, setRequestForm] = React.useState({
    description: '',
    reason: ''
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const logsQuery = query(
        collection(db, 'auditLogs'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const logsSnapshot = await getDocs(logsQuery);
      const logsData = logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAuditLogs(logsData);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleAuthorizationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || userProfile.role !== 'user') return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'authorizationRequests'), {
        userId: userProfile.uid,
        userEmail: userProfile.email,
        userName: userProfile.name,
        requestDescription: `${requestForm.description} - Reason: ${requestForm.reason}`,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      await addAuditLog(`Authorization request submitted by ${userProfile.name}`, {
        requestType: 'role_upgrade',
        targetRole: 'authorized'
      });

      setRequestForm({ description: '', reason: '' });
      alert('Authorization request submitted successfully!');
      fetchAuditLogs();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Risk Score',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Patient Dashboard Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            Patient Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Upload Medical Data
                </h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Manage Permissions
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>City Hospital</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>Green Valley Clinic</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>Sunrise Labs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Insights */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            AI Health Insights
          </h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Risk Score Prediction
              </h3>
              <div className="h-56">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            Authorization Request
          </h2>
          
          {userProfile?.role === 'user' ? (
            <form onSubmit={handleAuthorizationRequest} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Current Role:</strong> User - Request authorization to access file encryption/decryption features.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Details & Qualifications
                </label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your professional background, qualifications, and role..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Authorization Request
                </label>
                <textarea
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Explain why you need access to file encryption/decryption features..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting Request...' : 'Submit Authorization Request'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Authorization Status: {userProfile?.role}
              </h3>
              <p className="text-gray-600">
                You have access to all platform features.
              </p>
            </div>
          )}
        </div>

        {/* Second Provider Panel */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            Provider Panel
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Request Access</h3>
              <div className="space-y-3">
                <div className="bg-gray-100 h-10 rounded-lg animate-pulse"></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-700 mb-4">View Patient Data</h3>
              <div className="space-y-3">
                <div className="bg-gray-100 h-3 rounded-lg animate-pulse"></div>
                <div className="bg-gray-100 h-3 rounded-lg w-3/4 animate-pulse"></div>
                <div className="bg-gray-100 h-3 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-gray-600" />
          </div>
          Audit Logs
        </h2>
        
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{log.action}</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {log.timestamp?.toDate?.()?.toLocaleDateString() || 'Recent'}
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No audit logs available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;