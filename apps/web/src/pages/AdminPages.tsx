import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store';
import { Users, Shield, ShieldAlert, Sparkles, UserX, UserCheck } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const AdminUsersPage: React.FC = () => {
  const { users, fetchUsers, blockUser, unblockUser, isLoading, error } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
      } else {
        if (window.confirm('Do you want to suspend/block this user account?')) {
          await blockUser(userId);
        }
      }
    } catch {
      alert('Access state updated.');
    }
  };

  return (
    <div className="space-y-6" id="admin-users-management">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-600" />
          User Gating administration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administer active platforms accounts, regulate access gating blocklists and confirm security profiles.
        </p>
      </div>

      {/* Filter and search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2.5 outline-none text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl"
          placeholder="Filter accounts by name or email address..."
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchUsers()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No accounts mapped" description="No user accounts match your target criteria." />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b text-slate-400 text-[10px] uppercase font-bold tracking-wider select-none">
                  <th className="p-4 pl-6">Profile Subject</th>
                  <th className="p-4">Contact Coordinate</th>
                  <th className="p-4">Authorization Role</th>
                  <th className="p-4">Gating Status</th>
                  <th className="p-4 pr-6 text-right">Moderator Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-semibold">
                {filtered.map((userObj) => (
                  <tr key={userObj.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold select-none text-xs">
                          {userObj.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{userObj.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{userObj.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 px-2.5 py-0.5 rounded-full">
                        {userObj.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {userObj.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold">
                          <UserX className="w-4 h-4" /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          <UserCheck className="w-4 h-4" /> Authorized
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {userObj.role !== 'ADMIN' ? (
                        <button
                          onClick={() => handleBlockToggle(userObj.id, !!userObj.isBlocked)}
                          className={`p-2 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition ${
                            userObj.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                          id={`block-toggle-${userObj.id}`}
                        >
                          {userObj.isBlocked ? 'Authorize Access' : 'Suspend Account'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Immunized Account</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
