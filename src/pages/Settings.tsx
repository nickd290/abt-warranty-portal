import { Card } from '../components/ui/Card';
import { User, Bell, Palette, Shield } from 'lucide-react';

export function Settings() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      <div className="pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-white/60">Manage your portal preferences</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">
              Account Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Abt Electronics"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="admin@abtelectronics.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-2 focus:ring-sky-400/20"
              />
              <span className="text-sm text-white/80">
                Email notifications for new jobs
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-2 focus:ring-sky-400/20"
              />
              <span className="text-sm text-white/80">
                Proof approval reminders
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-2 focus:ring-sky-400/20"
              />
              <span className="text-sm text-white/80">
                Print completion alerts
              </span>
            </label>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Theme
            </label>
            <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20">
              <option value="dark" className="bg-slate-900">
                Dark (Current)
              </option>
              <option value="light" className="bg-slate-900">
                Light
              </option>
              <option value="auto" className="bg-slate-900">
                Auto
              </option>
            </select>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition">
              Change Password
            </button>
            <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition">
              Enable Two-Factor Authentication
            </button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-2xl bg-sky-500/20 px-6 py-2.5 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
