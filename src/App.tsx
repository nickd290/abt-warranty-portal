import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Campaigns } from './pages/Campaigns';
import { Upload } from './pages/Upload';
import { Proofing } from './pages/Proofing';
import { Invoicing } from './pages/Invoicing';
import { Settings } from './pages/Settings';
import { SftpManagement } from './pages/SftpManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/campaigns" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="upload/:jobId" element={<Upload />} />
            <Route path="proofing/:jobId" element={<Proofing />} />
            <Route path="invoices/:jobId" element={<Invoicing />} />
            <Route path="invoices" element={<Invoicing />} />
            <Route path="sftp" element={<SftpManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/campaigns" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
