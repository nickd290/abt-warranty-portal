import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Eye, EyeOff, Copy, CheckCircle2, Server } from 'lucide-react';
import { api } from '../services/api';

interface SftpCredential {
  id: string;
  username: string;
  active: boolean;
  createdAt: string;
  lastUsed: string | null;
  user?: {
    name: string;
    email: string;
  };
}

export function SftpManagement() {
  const [credentials, setCredentials] = useState<SftpCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const sftpHost = import.meta.env.VITE_SFTP_HOST || 'localhost';
  const sftpPort = import.meta.env.VITE_SFTP_PORT || '2222';

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const data = await api.getSftpCredentials();
      setCredentials(data);
    } catch (error) {
      console.error('Failed to load credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSftpCredential({
        username: newUsername,
        password: newPassword,
      });
      setNewUsername('');
      setNewPassword('');
      setShowNewForm(false);
      await loadCredentials();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create credential');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SFTP credential?')) {
      return;
    }
    try {
      await api.deleteSftpCredential(id);
      await loadCredentials();
    } catch (error) {
      alert('Failed to delete credential');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await api.updateSftpCredential(id, { active: !active });
      await loadCredentials();
    } catch (error) {
      alert('Failed to update credential');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            SFTP File Upload Access
          </h1>
          <p className="text-gray-400 mt-1">
            Manage secure SFTP credentials for uploading warranty mailer assets
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Credential
        </button>
      </div>

      {/* Connection Info Card */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" />
          SFTP Connection Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400">Host</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-3 py-2 bg-dark-bg rounded border border-gray-700 text-cyan-400 font-mono text-sm">
                {sftpHost}
              </code>
              <button
                onClick={() => copyToClipboard(sftpHost, 'host')}
                className="p-2 hover:bg-dark-hover rounded"
              >
                {copiedField === 'host' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Port</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-3 py-2 bg-dark-bg rounded border border-gray-700 text-cyan-400 font-mono text-sm">
                {sftpPort}
              </code>
              <button
                onClick={() => copyToClipboard(sftpPort, 'port')}
                className="p-2 hover:bg-dark-hover rounded"
              >
                {copiedField === 'port' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Protocol</label>
            <div className="px-3 py-2 bg-dark-bg rounded border border-gray-700 text-white font-mono text-sm">
              SFTP (SSH File Transfer)
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-dark-bg/50 rounded border border-gray-700">
          <p className="text-sm text-gray-300 font-semibold mb-2">Compatible SFTP Clients:</p>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• FileZilla (Windows, Mac, Linux)</li>
            <li>• WinSCP (Windows)</li>
            <li>• Cyberduck (Mac, Windows)</li>
            <li>• Command line: <code className="text-cyan-400">sftp -P {sftpPort} username@{sftpHost}</code></li>
          </ul>
        </div>
      </div>

      {/* New Credential Form */}
      {showNewForm && (
        <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Create New SFTP Credential</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g., abt_uploads"
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Strong password"
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
              >
                Create Credential
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Credentials List */}
      <div className="bg-dark-card rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Active SFTP Credentials</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {credentials.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No SFTP credentials created yet. Click "New Credential" to get started.
            </div>
          ) : (
            credentials.map((cred) => (
              <div key={cred.id} className="p-4 hover:bg-dark-hover">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <code className="text-lg font-mono text-cyan-400">{cred.username}</code>
                      {cred.active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-400 space-y-1">
                      <div>Created: {new Date(cred.createdAt).toLocaleDateString()}</div>
                      {cred.lastUsed && (
                        <div>Last used: {new Date(cred.lastUsed).toLocaleString()}</div>
                      )}
                      {cred.user && (
                        <div>Owner: {cred.user.name} ({cred.user.email})</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(cred.id, cred.active)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        cred.active
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {cred.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(cred.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
