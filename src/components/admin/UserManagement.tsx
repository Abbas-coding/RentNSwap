import { useEffect, useState } from "react";
import { adminApi, type AuthUser } from "@/lib/api";

export default function UserManagement() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAllUsers()
      .then((res) => setUsers(res.users))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load users.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <p className="text-center text-sm text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-center text-sm text-slate-500">Loading users…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Joined
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{user.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{user.role}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button className="text-emerald-600 hover:text-emerald-900">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
