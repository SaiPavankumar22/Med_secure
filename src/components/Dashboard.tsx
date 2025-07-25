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
    <div className="space-y-6">
      {/* Patient Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Upload Medical Data</h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Manage Permissions</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City Hospital
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Green Valley Clinic
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Sunrise Labs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Health Insights</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Risk Score Prediction
              </h3>
              <div className="h-48">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Provider Panel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Request Access</h3>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                Request
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">View Patient Data</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 h-2 rounded"></div>
                <div className="bg-gray-100 h-2 rounded w-3/4"></div>
                <div className="bg-gray-100 h-2 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Provider Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Provider Panel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Request Access</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 h-8 rounded"></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">View Patient Data</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 h-2 rounded"></div>
                <div className="bg-gray-100 h-2 rounded w-3/4"></div>
                <div className="bg-gray-100 h-2 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Audit Logs
        </h2>
        
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{log.action}</span>
              </div>
              <div className="text-sm text-gray-500">
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