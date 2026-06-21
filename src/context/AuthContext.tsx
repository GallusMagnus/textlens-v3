import React, { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithPasscode: (passcode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A standard local user representation that mimics a logged-in state without needing backend authorization
const activeLocalUser = {
  uid: 'workspace-auditor-local',
  displayName: 'Workspace Auditor',
  email: 'auditor@textlens.local',
  photoURL: '',
  emailVerified: true,
  isAnonymous: true,
  providerData: []
} as any;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(activeLocalUser);
  const [loading] = useState<boolean>(false);



  const loginWithPasscode = async (passcode: string) => {
    // Disabled passcode checking as we have bypassed authentication
  };

  const logout = async () => {
    localStorage.removeItem('textlens_passcode_unlocked');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithPasscode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
