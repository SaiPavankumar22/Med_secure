import React from 'react';
import { Upload, FileText, TrendingUp, Shield, Clock, MapPin } from 'lucide-react';
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

  const auditLogs = [
    {
      id: 1,
      action: 'Access granted to Green Valley Clinic',
      date: '04/15',
      time: '2024 11:43 AM',
    },
    {
      id: 2,
      action: 'Regulatory Authority accessed logs',
      date: '04/14',
      time: '2024 1:00 AM',
    },
    {
      id: 3,
      action: 'Access granted to Hospital Med',
      date: '04/14',
      time: '06:00 AM',
    },
    {
      id: 4,
      action: 'Access granted to Green Valley Clinic',
      date: '04/13',
      time: '2024 11:15 AM',
    },
  ];

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
              <FileText className="w-4 h-4 text-orange-600" />
            </div>
            Provider Panel
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Request Access</h3>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                Request
              </button>
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
                {log.date} {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;