import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth, UserRole } from '../context/AuthContext';

interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AuthRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { addAuditLog } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const requestsQuery = query(
        collection(db, 'authorizationRequests'),
        orderBy('createdAt', 'desc')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsData = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuthRequest[];
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole, userName: string) => {
    setUpdating(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });

      await addAuditLog(`Role updated for ${userName} to ${newRole}`, {
        userId,
        newRole,
        updatedBy: 'admin'
      });

      setUsers(users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRequest = async (requestId: string, action: 'approved' | 'rejected', request: AuthRequest) => {
    setUpdating(requestId);
    try {
      // Update request status
      await updateDoc(doc(db, 'authorizationRequests', requestId), {
        status: action
      });

      if (action === 'approved') {
        // Update user role to authorized
        await updateDoc(doc(db, 'users', request.userId), {
          role: 'authorized'
        });

        // Update local users state
        setUsers(users.map(user => 
          user.uid === request.userId ? { ...user, role: 'authorized' } : user
        ));

        await addAuditLog(`Access granted to ${request.userName} - upgraded to authorized`, {
          userId: request.userId,
          requestId,
          action: 'role_upgrade'
        });
      } else {
        await addAuditLog(`Authorization request rejected for ${request.userName}`, {
          userId: request.userId,
          requestId,
          action: 'request_rejected'
        });
      }

      // Update local requests state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      ));
    } catch (error) {
      console.error('Error handling request:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'authorized': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          User Management
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Current Role</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-800">{user.name}</td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {user.role !== 'user' && (
                        <button
                          onClick={() => updateUserRole(user.uid, 'user', user.name)}
                          disabled={updating === user.uid}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          → User
                        </button>
                      )}
                      {user.role !== 'authorized' && (
                        <button
                          onClick={() => updateUserRole(user.uid, 'authorized', user.name)}
                          disabled={updating === user.uid}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          → Authorized
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => updateUserRole(user.uid, 'admin', user.name)}
                          disabled={updating === user.uid}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          → Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authorization Requests */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-orange-600" />
          </div>
          Authorization Requests
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No authorization requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{request.userName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.userEmail}</p>
                    <p className="text-gray-700 mb-3">{request.requestDescription}</p>
                    <p className="text-xs text-gray-500">
                      Requested: {request.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                    </p>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleRequest(request.id, 'approved', request)}
                        disabled={updating === request.id}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequest(request.id, 'rejected', request)}
                        disabled={updating === request.id}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;