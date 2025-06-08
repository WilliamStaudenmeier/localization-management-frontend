'use client';

import { useProjectStore } from '../store/useProjectStore';

export default function UserProfile() {
  const { user, login, logout } = useProjectStore();

  return (
    <div className="flex items-center space-x-3 text-sm">
      {user.isAuthenticated ? (
        <>
          <span className="text-stone-700 dark:text-stone-300">
            Signed in as <strong>{user.name}</strong>
          </span>
          <button
            onClick={logout}
            className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <span className="text-stone-500 dark:text-stone-400">Not signed in</span>
          <button
            onClick={login}
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}

